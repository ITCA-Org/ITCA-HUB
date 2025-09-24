import { toast } from 'sonner';
import {
  Resource,
  UploadProgress,
  CreateResourcePayload,
  UseResourceUploaderProps,
} from '@/types/interfaces/resource';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { useState, useRef, useCallback } from 'react';
import { CustomError, ErrorResponseData } from '@/types';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';

const useResourceUploader = ({ token, onUploadComplete, onError }: UseResourceUploaderProps) => {
  const { uploadFile, createResource, isLoading } = useResourceAdmin({ token });

  const [academicLevel, setAcademicLevel] = useState<CreateResourcePayload['academicLevel']>('all');
  const [category, setCategory] = useState<CreateResourcePayload['category']>('lecture_note');
  const [visibility, setVisibility] = useState<CreateResourcePayload['visibility']>('all');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] =
    useState<CreateResourcePayload['department']>('computer_science');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    currentFileIndex: 0,
    totalFiles: 0,
    uploadedUrls: [],
    percentage: 0,
    currentFileName: '',
    phase: 'idle',
  });

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const checkForDuplicates = useCallback(
    async (resourceTitle: string): Promise<boolean> => {
      try {
        const response = await axios.get(`${BASE_URL}/resources`, {
          params: {
            page: 0,
            limit: 10,
            search: resourceTitle.trim(),
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success' && response.data.data.resources) {
          const resources = response.data.data.resources;

          const hasDuplicateTitle = resources.some(
            (resource: Resource) => resource.title.toLowerCase() === resourceTitle.toLowerCase()
          );

          return hasDuplicateTitle;
        }

        return false;
      } catch (error) {
        console.error('Error checking for duplicates:', error);
        return false;
      }
    },
    [token]
  );

  const resetForm = useCallback(() => {
    setSelectedFiles([]);
    setTitle('');
    setDescription('');
    setCategory('lecture_note');
    setVisibility('all');
    setAcademicLevel('all');
    setDepartment('computer_science');

    setUploadProgress({
      currentFileIndex: 0,
      totalFiles: 0,
      uploadedUrls: [],
      percentage: 0,
      currentFileName: '',
      phase: 'idle',
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getButtonContent = useCallback(() => {
    switch (uploadProgress.phase) {
      case 'validating':
        return 'Validating...';
      case 'uploading':
        return `Uploading ${uploadProgress.currentFileIndex + 1}/${uploadProgress.totalFiles} files...`;
      case 'creating':
        return 'Creating Resource...';
      case 'failed':
        return 'Resume Upload';
      default:
        return 'Create Resource';
    }
  }, [uploadProgress.phase, uploadProgress.currentFileIndex, uploadProgress.totalFiles]);

  const isFormValid =
    selectedFiles.length > 0 && title.trim() && description.trim() && category && department;

  const isUploading =
    (uploadProgress.phase !== 'idle' && uploadProgress.phase !== 'failed') || isLoading;

  const handleBatchUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error('Please fill all required fields and select at least one file');
        return;
      }

      try {
        setUploadProgress((prev) => ({ ...prev, phase: 'validating' }));

        const isDuplicate = await checkForDuplicates(title);
        if (isDuplicate) {
          toast.error('Duplicate resource', {
            description:
              'A resource with the same title already exists. Please choose a different title.',
          });
          setUploadProgress((prev) => ({ ...prev, phase: 'idle' }));
          return;
        }

        const totalFiles = selectedFiles.length;
        const startFromIndex = uploadProgress.uploadedUrls.length;

        setUploadProgress((prev) => ({
          ...prev,
          phase: 'uploading',
          totalFiles,
          currentFileIndex: startFromIndex,
          percentage: startFromIndex > 0 ? Math.round((startFromIndex / totalFiles) * 100) : 0,
        }));

        toast.loading(`Uploading resource... 0%`, {
          id: 'resource-upload-progress',
          duration: Infinity,
        });

        const uploadedUrls: string[] = [...uploadProgress.uploadedUrls];

        for (let i = startFromIndex; i < totalFiles; i++) {
          const reverseIndex = totalFiles - 1 - i;
          const file = selectedFiles[reverseIndex];

          const progress = Math.round((i / totalFiles) * 100);

          setUploadProgress((prev) => ({
            ...prev,
            currentFileIndex: i,
            currentFileName: file.name,
            percentage: progress,
          }));

          toast.loading(`Uploading resource... ${progress}%`, {
            id: 'resource-upload-progress',
            duration: Infinity,
          });

          try {
            const fileUrl = await uploadFile(file);
            uploadedUrls.push(fileUrl);

            setUploadProgress((prev) => ({
              ...prev,
              uploadedUrls: [...uploadedUrls],
            }));
          } catch (error) {
            const { message } = getErrorMessage(
              error as AxiosError<ErrorResponseData> | CustomError | Error
            );
            toast.error(`Failed to upload ${file.name}`, {
              description: message,
            });
            setUploadProgress((prev) => ({ ...prev, phase: 'failed' }));
            return;
          }
        }

        setUploadProgress((prev) => ({
          ...prev,
          phase: 'creating',
          percentage: 100,
          currentFileName: '',
        }));

        const resourcePayload: CreateResourcePayload = {
          title: title.trim(),
          description: description.trim(),
          category,
          fileUrls: uploadedUrls,
          visibility,
          academicLevel,
          department,
        };

        await createResource(resourcePayload);

        toast.success('Resource created successfully', {
          id: 'resource-upload-progress',
          description: `${selectedFiles.length} files uploaded successfully`,
        });

        resetForm();

        if (onUploadComplete) {
          onUploadComplete({
            fileName: `${selectedFiles.length} files`,
            fileUrl: uploadedUrls[0],
            fileType: 'multiple',
            fileSize: formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0)),
          });
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Upload failed', {
          id: 'resource-upload-progress',
          description: message,
        });

        if (onError) {
          onError(message);
        }

        setUploadProgress((prev) => ({ ...prev, phase: 'failed' }));
      }
    },
    [
      title,
      onError,
      category,
      resetForm,
      visibility,
      department,
      uploadFile,
      description,
      isFormValid,
      selectedFiles,
      academicLevel,
      formatFileSize,
      createResource,
      onUploadComplete,
      checkForDuplicates,
      uploadProgress.uploadedUrls,
    ]
  );

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

      if (totalFiles > 50) {
        const remainingSlots = 50 - selectedFiles.length;
        const filesToAdd = newFiles.slice(0, remainingSlots);
        setSelectedFiles((prev) => [...prev, ...filesToAdd]);

        if (remainingSlots < newFiles.length) {
          toast.warning(`Only ${remainingSlots} files added`, {
            description: 'Maximum 50 files allowed per resource',
          });
        }
      } else {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }

      if (!title && newFiles.length > 0) {
        const fileName = newFiles[0].name;
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const cleanedName = nameWithoutExt.replace(/[-_]/g, ' ');

        const formattedTitle = cleanedName
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        setTitle(formattedTitle);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [selectedFiles.length, title]
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

      if (uploadProgress.phase !== 'idle') {
        setUploadProgress((prev) => ({
          ...prev,
          phase: 'idle',
          uploadedUrls: [],
          percentage: 0,
          currentFileName: '',
          currentFileIndex: 0,
        }));
      }
    },
    [uploadProgress.phase]
  );

  const addMoreFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
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
    resetForm,
    removeFile,
    setCategory,
    addMoreFiles,
    setVisibility,
    setDepartment,
    formatFileSize,
    setDescription,
    handleFileChange,
    setAcademicLevel,
    getButtonContent,
    handleBatchUpload,
  };
};

export default useResourceUploader;
