import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import {
  X,
  Plus,
  Video,
  Upload,
  Loader,
  FileText,
  FileType,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { AddFilesModalProps, UploadProgress } from '@/types/interfaces/modal';

const AddFilesModal = ({ isOpen, resource, token, onClose, onFilesAdded }: AddFilesModalProps) => {
  const { uploadFile, updateResource } = useResourceAdmin({ token });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    phase: 'idle',
    currentFileIndex: 0,
    totalFiles: 0,
    uploadedUrls: [],
    currentFileName: '',
    percentage: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFileCount = resource.fileUrls.length;
  const maxNewFiles = 50 - currentFileCount;
  const isUploading = uploadProgress.phase !== 'idle';

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileType className="h-5 w-5 text-gray-500" />;

    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }

    return <FileType className="h-5 w-5 text-gray-500" />;
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const newFiles = Array.from(e.target.files);
      const totalFiles = selectedFiles.length + newFiles.length;

      const oversizedFiles = newFiles.filter((file) => file.size > 100 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error('File too large', {
          description: 'Maximum file size is 100MB per file.',
        });
        return;
      }

      if (totalFiles > maxNewFiles) {
        const remainingSlots = maxNewFiles - selectedFiles.length;
        if (remainingSlots <= 0) {
          toast.error('Cannot add more files', {
            description: `Resource already has ${currentFileCount} files. Maximum is 50 files total.`,
          });
          return;
        }

        const filesToAdd = newFiles.slice(0, remainingSlots);
        setSelectedFiles((prev) => [...prev, ...filesToAdd]);

        toast.warning(`Only ${remainingSlots} files added`, {
          description: `Cannot exceed 50 total files. Current: ${currentFileCount}, New: ${remainingSlots}`,
        });
      } else {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [selectedFiles.length, maxNewFiles, currentFileCount]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

      if (uploadProgress.phase !== 'idle') {
        setUploadProgress({
          phase: 'idle',
          currentFileIndex: 0,
          totalFiles: 0,
          uploadedUrls: [],
          currentFileName: '',
          percentage: 0,
        });
      }
    },
    [uploadProgress.phase]
  );

  const handleAddFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    try {
      const totalFiles = selectedFiles.length;
      setUploadProgress({
        phase: 'uploading',
        currentFileIndex: 0,
        totalFiles,
        uploadedUrls: [],
        currentFileName: selectedFiles[0].name,
        percentage: 0,
      });

      const uploadedUrls: string[] = [];

      for (let i = 0; i < totalFiles; i++) {
        const reverseIndex = totalFiles - 1 - i;
        const file = selectedFiles[reverseIndex];

        setUploadProgress((prev) => ({
          ...prev,
          currentFileIndex: i,
          currentFileName: file.name,
          percentage: Math.round((i / totalFiles) * 80),
        }));

        const fileUrl = await uploadFile(file);
        uploadedUrls.push(fileUrl);

        setUploadProgress((prev) => ({
          ...prev,
          uploadedUrls: [...uploadedUrls],
        }));
      }

      // Update resource with new file URLs
      setUploadProgress((prev) => ({
        ...prev,
        phase: 'updating',
        percentage: 90,
        currentFileName: '',
      }));

      const updatedFileUrls = [...resource.fileUrls, ...uploadedUrls];
      await updateResource(resource.resourceId || resource._id || '', {
        fileUrls: updatedFileUrls,
      });

      setUploadProgress((prev) => ({
        ...prev,
        phase: 'completed',
        percentage: 100,
      }));

      toast.success('Files added successfully', {
        description: `Added ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} to resource`,
      });

      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress({
          phase: 'idle',
          currentFileIndex: 0,
          totalFiles: 0,
          uploadedUrls: [],
          currentFileName: '',
          percentage: 0,
        });
        onFilesAdded();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding files:', error);
      toast.error('Failed to add files', {
        description:
          error instanceof Error ? error.message : 'An error occurred while adding files',
      });
      setUploadProgress((prev) => ({ ...prev, phase: 'idle' }));
    }
  }, [selectedFiles, resource, uploadFile, updateResource, onFilesAdded, onClose]);

  const getButtonContent = () => {
    switch (uploadProgress.phase) {
      case 'uploading':
        return `Uploading ${uploadProgress.currentFileIndex + 1}/${uploadProgress.totalFiles} files...`;
      case 'updating':
        return 'Updating resource...';
      case 'completed':
        return 'Files added successfully!';
      default:
        return `Add ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        {/*==================== Header ====================*/}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Files to Resource</h2>
            <p className="text-sm text-gray-500 mt-1">
              {resource.title} • {currentFileCount}/50 files • {maxNewFiles} slots available
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/*==================== End of Header ====================*/}

        {/*==================== Content ====================*/}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/*==================== File Drop Zone ====================*/}
          <div
            onClick={() => maxNewFiles > 0 && !isUploading && handleAddFiles()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              selectedFiles.length > 0 || maxNewFiles === 0
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            } ${maxNewFiles === 0 || isUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-medium">Click to select files</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                Up to {maxNewFiles} more files, 100MB per file
              </p>
              {maxNewFiles === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Resource is at maximum capacity (50 files)
                </p>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={maxNewFiles === 0 || isUploading}
            />
          </div>
          {/*==================== End of File Drop Zone ====================*/}

          {/*==================== Selected Files ====================*/}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles
                  .slice()
                  .reverse()
                  .map((file, reverseIndex) => {
                    const actualIndex = selectedFiles.length - 1 - reverseIndex;
                    const reverseFileIndex = selectedFiles.length - 1 - actualIndex;
                    const isUploaded = uploadProgress.uploadedUrls.length > reverseFileIndex;
                    const isCurrentlyUploading =
                      uploadProgress.phase === 'uploading' &&
                      uploadProgress.currentFileIndex === reverseFileIndex;

                    return (
                      <div
                        key={`${file.name}-${file.size}-${actualIndex}`}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${
                          isUploaded
                            ? 'bg-green-50 border-green-200'
                            : isCurrentlyUploading
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-amber-100/50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {isUploaded ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : isCurrentlyUploading ? (
                            <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                          ) : (
                            getFileIcon(file.type)
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => removeFile(actualIndex)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {/*==================== End of Selected Files ====================*/}

          {/*==================== Upload Progress ====================*/}
          {uploadProgress.phase !== 'idle' && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {uploadProgress.currentFileName || 'Processing...'}
                </span>
                <span className="text-sm text-gray-500">{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}
          {/*==================== End of Upload Progress ====================*/}
        </div>
        {/*==================== End of Content ====================*/}

        {/*==================== Footer ====================*/}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleAddFiles}
            disabled={maxNewFiles === 0 || isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Files
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              {uploadProgress.phase === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
              {getButtonContent()}
            </button>
          </div>
        </div>
        {/*==================== End of Footer ====================*/}
      </motion.div>
    </div>
  );
};

export default AddFilesModal;
