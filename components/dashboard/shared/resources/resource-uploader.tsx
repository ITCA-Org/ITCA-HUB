import {
  X,
  Plus,
  Video,
  Loader,
  Upload,
  FileText,
  FileType,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import useResourceUploader from '@/hooks/resources/use-resource-uploader';
import { ResourceUploaderProps, CreateResourcePayload } from '@/types/interfaces/resource';

const ResourceUploader = ({ token, onUploadComplete, onError }: ResourceUploaderProps) => {
  const {
    title,
    category,
    visibility,
    department,
    description,
    isFormValid,
    isUploading,
    fileInputRef,
    selectedFiles,
    academicLevel,
    uploadProgress,
    setTitle,
    removeFile,
    setCategory,
    addMoreFiles,
    setDepartment,
    setVisibility,
    setDescription,
    formatFileSize,
    getButtonContent,
    setAcademicLevel,
    handleFileChange,
    handleBatchUpload,
  } = useResourceUploader({ token, onUploadComplete, onError });

  const categories: CreateResourcePayload['category'][] = [
    'lecture_note',
    'assignment',
    'past_papers',
    'tutorial',
    'textbook',
    'research_papers',
  ];

  const departments: CreateResourcePayload['department'][] = [
    'computer_science',
    'information_systems',
    'telecommunications',
  ];

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

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDepartmentName = (department: string) => {
    return department.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <form onSubmit={handleBatchUpload} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/*==================== Left Column: Resource Information ====================*/}
        <div className="rounded-2xl bg-white/50 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Resource Information
          </h3>

          <div className="space-y-4">
            {/*==================== Title Field ====================*/}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="title"
                type="text"
                value={title}
                placeholder="Enter resource title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
              />
            </div>
            {/*==================== End of Title Field ====================*/}

            {/*==================== Description Field ====================*/}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                id="description"
                value={description}
                placeholder="Describe what this resource contains..."
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none resize-none"
              />
            </div>
            {/*==================== End of Description Field ====================*/}

            {/*==================== Category and Department Row ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CreateResourcePayload['category'])}
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {formatCategoryName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  id="department"
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value as CreateResourcePayload['department'])
                  }
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {formatDepartmentName(dept)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/*==================== End of Category and Department Row ====================*/}

            {/*==================== Visibility and Academic Level Row ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) =>
                    setVisibility(e.target.value as CreateResourcePayload['visibility'])
                  }
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="academic-level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Academic Level
                </label>
                <select
                  id="academic-level"
                  value={academicLevel}
                  onChange={(e) =>
                    setAcademicLevel(e.target.value as CreateResourcePayload['academicLevel'])
                  }
                  className="w-full rounded-lg bg-gray-100 p-2.5 text-sm text-gray-700 focus:bg-gray-200/50 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
            {/*==================== End of Visibility and Academic Level Row ====================*/}
          </div>
        </div>
        {/*==================== End of Left Column: Resource Information ====================*/}

        {/*==================== Right Column: File Upload ====================*/}
        <div className="rounded-2xl bg-white/50 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <Upload className="h-5 w-5 text-green-600 mr-2" />
            Upload Files
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({selectedFiles.length}/20)
            </span>
          </h3>

          {/*==================== File Upload Area ====================*/}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                selectedFiles.length > 0
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-medium">Click to select files</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">Up to 20 files, 100MB per file</p>
              </div>
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
          {/*==================== End of File Upload Area ====================*/}

          {/*==================== Selected Files List ====================*/}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
                {selectedFiles.length < 20 && (
                  <button
                    type="button"
                    onClick={addMoreFiles}
                    disabled={isUploading}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add More
                  </button>
                )}
              </div>

              <div className="max-h-50 overflow-y-auto space-y-2">
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
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isUploaded
                            ? 'bg-green-50 border-green-200'
                            : isCurrentlyUploading
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-amber-100/50 border-gray-200'
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
          {/*==================== End of Selected Files List ====================*/}

          {/*==================== File Upload Status ====================*/}
          {selectedFiles.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No files selected</p>
              <p className="text-sm text-gray-400">Select files to create your resource</p>
            </div>
          )}
          {/*==================== End of File Upload Status ====================*/}
        </div>
        {/*==================== End of Right Column: File Upload ====================*/}
      </div>

      {/*==================== Upload Progress Bar ====================*/}
      {uploadProgress.phase !== 'idle' && (
        <div className="rounded-lg bg-white/50 p-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">
              {uploadProgress.phase === 'validating' && 'Validating resource...'}
              {uploadProgress.phase === 'uploading' &&
                `Uploading files: ${uploadProgress.currentFileIndex + 1}/${uploadProgress.totalFiles}`}
              {uploadProgress.phase === 'creating' && 'Creating resource...'}
              {uploadProgress.phase === 'failed' && 'Upload paused - ready to resume'}
            </span>
            <span className="text-gray-500">{uploadProgress.percentage}%</span>
          </div>

          {uploadProgress.currentFileName && (
            <p className="text-sm text-gray-500 mb-2">Current: {uploadProgress.currentFileName}</p>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                uploadProgress.phase === 'failed' ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
              style={{ width: `${uploadProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
      {/*==================== End of Upload Progress Bar ====================*/}

      {/*==================== Submit Button ====================*/}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || isUploading}
          className={`inline-flex items-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-300 shadow-md hover:shadow-lg ${
            isFormValid && !isUploading
              ? uploadProgress.phase === 'failed'
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600'
                : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="flex items-center">
            {uploadProgress.phase === 'validating' && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {uploadProgress.phase === 'uploading' && <Upload className="mr-2 h-4 w-4" />}
            {uploadProgress.phase === 'creating' && (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            )}
            {uploadProgress.phase === 'failed' && <Upload className="mr-2 h-4 w-4" />}
            {uploadProgress.phase === 'idle' && <Upload className="mr-2 h-4 w-4" />}
            {getButtonContent()}
          </span>
        </button>
      </div>
      {/*==================== End of Submit Button ====================*/}
    </form>
  );
};

export default ResourceUploader;
