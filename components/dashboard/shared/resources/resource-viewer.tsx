import {
  X,
  Tag,
  Eye,
  User,
  File,
  Plus,
  Edit,
  Video,
  Music,
  Clock,
  Radio,
  Trash,
  Laptop,
  Loader,
  Shield,
  Archive,
  Calendar,
  Database,
  Download,
  FileText,
  ArrowLeft,
  Building2,
  FileImage,
  Presentation,
  GraduationCap,
  FileSpreadsheet,
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useResource, useResourceDownload } from '@/hooks/resources/use-resource';
import { useResourceActions } from '@/hooks/resources/use-resource-admin';
import PDFViewer from '@/components/dashboard/resource-viewers/pdf-viewer';
import TextViewer from '@/components/dashboard/resource-viewers/text-viewer';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import AudioViewer from '@/components/dashboard/resource-viewers/audio-viewer';
import ImageViewer from '@/components/dashboard/resource-viewers/image-viewer';
import VideoViewer from '@/components/dashboard/resource-viewers/video-viewer';
import { NetworkError, EmptyState } from '@/components/dashboard/error-messages';
import ConfirmationModal from '@/components/dashboard/modals/confirmation-modal';
import GenericViewer from '@/components/dashboard/resource-viewers/generic-viewer';
import AddFilesModal from '@/components/dashboard/modals/resources/add-files-modal';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceEditModal from '@/components/dashboard/modals/resources/edit-resource-modal';
import ResourceViewerSkeleton from '@/components/dashboard/skeletons/resource-viewer-skeleton';
import DownloadResourceModal from '@/components/dashboard/modals/resources/download-resource-modal';
import {
  FileItem,
  Resource,
  UpdateResourcePayload,
  ResourceViewerComponentProps,
} from '@/types/interfaces/resource';

const ResourceViewerComponent = ({ role, token }: ResourceViewerComponentProps) => {
  const router = useRouter();
  const { id } = router.query;
  const resourceId = typeof id === 'string' ? id : null;
  const userRole = role === 'admin' ? 'admin' : 'user';

  const [loadingFileSizes, setLoadingFileSizes] = useState<{ [key: string]: boolean }>({});
  const [fileToDownload, setFileToDownload] = useState<FileItem | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);
  const [fileSizes, setFileSizes] = useState<{ [key: string]: string }>({});
  const [showDownloadFileModal, setShowDownloadFileModal] = useState(false);
  const [isDownloadingFile, setIsDownloadingFile] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAddFilesModal, setShowAddFilesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const { resource, isLoading, isError, refresh } = useResource(token, resourceId);

  const {
    trackView,
    downloadFile,
    downloadResource,
    isDownloading: isDownloadingResource,
    downloadProgress,
  } = useResourceDownload(token, userRole);

  const { updateResource, deleteFileFromResource } = useResourceActions(token);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    const typeMap: { [key: string]: string } = {
      pdf: 'PDF',
      doc: 'Word',
      docx: 'Word',
      ppt: 'PowerPoint',
      pptx: 'PowerPoint',
      xls: 'Excel',
      xlsx: 'Excel',
      zip: 'Archive',
      rar: 'Archive',
      txt: 'Text',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image',
      mp4: 'Video',
      mp3: 'Audio',
    };

    return typeMap[extension] || 'File';
  };

  const fetchFileSizes = useCallback(async (fileList: FileItem[]) => {
    const loadingState = fileList.reduce((acc, file) => ({ ...acc, [file.url]: true }), {});
    setLoadingFileSizes(loadingState);

    const fetchPromises = fileList.map(async (file) => {
      try {
        const fileId = file.url.split('/').pop();
        const response = await axios.get(
          `https://jeetix-file-service.onrender.com/api/storage/file/itca-resources/${fileId}`
        );
        const data = response.data;

        if (data.status === 'success' && data.data.metadata?.size) {
          const sizeInBytes = parseInt(data.data.metadata.size);
          const formattedSize = formatFileSize(sizeInBytes);
          return { url: file.url, size: formattedSize };
        } else {
          return { url: file.url, size: 'Unknown' };
        }
      } catch {
        return { url: file.url, size: 'Unknown' };
      }
    });

    const results = await Promise.all(fetchPromises);

    const sizesUpdate = results.reduce(
      (acc, result) => ({ ...acc, [result.url]: result.size }),
      {}
    );
    const loadingUpdate = fileList.reduce((acc, file) => ({ ...acc, [file.url]: false }), {});

    setFileSizes((prev) => ({ ...prev, ...sizesUpdate }));
    setLoadingFileSizes((prev) => ({ ...prev, ...loadingUpdate }));
  }, []);

  useEffect(() => {
    if (resource) {
      const processedFiles = resource.fileUrls.map((fileItem) => ({
        url: fileItem.filePath,
        name: fileItem.fileName,
        type: getFileType(fileItem.fileName),
      }));

      setFiles(processedFiles);
      fetchFileSizes(processedFiles);

      if (!hasTrackedView && resource._id) {
        trackView(resource._id);
        setHasTrackedView(true);
      }
    }
  }, [resource, fetchFileSizes, trackView, hasTrackedView]);

  const handleDownload = async (file: FileItem) => {
    if (!resource) return;
    setFileToDownload(file);
    setShowDownloadFileModal(true);
  };

  const confirmDownloadFile = async () => {
    if (!fileToDownload || !resource) return;

    try {
      setIsDownloadingFile(fileToDownload.url);
      await downloadFile(fileToDownload.url, fileToDownload.name, resource._id);
      setShowDownloadFileModal(false);
      setFileToDownload(null);
    } catch {
    } finally {
      setIsDownloadingFile(null);
    }
  };

  const handleCloseDownloadModal = () => {
    setShowDownloadFileModal(false);
    setFileToDownload(null);
  };

  const handleDeleteFile = async (fileUrl: string) => {
    if (!resource || role !== 'admin') return;
    setFileToDelete(fileUrl);
    setShowDeleteFileModal(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !resource) return;

    try {
      setIsDeletingFile(fileToDelete);
      await deleteFileFromResource(resource.resourceId || resource._id, fileToDelete);
      refresh();
      setShowDeleteFileModal(false);
      setFileToDelete(null);
    } catch {
    } finally {
      setIsDeletingFile(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteFileModal(false);
    setFileToDelete(null);
  };

  const handleRetry = () => {
    refresh();
  };

  const handleDownloadAll = () => {
    if (!resource) return;
    setShowDownloadModal(true);
  };

  const confirmDownloadAll = async () => {
    if (!resource) return;
    try {
      await downloadResource(resource);
      setShowDownloadModal(false);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleEditResource = () => {
    setShowEditModal(true);
  };

  const handleSaveResource = async (updatedResource: Partial<Resource>) => {
    if (!resource) return;

    try {
      setIsEditLoading(true);
      const resourceIdValue = resource._id || resource.resourceId;
      if (!resourceIdValue) {
        throw new Error('Resource ID not found');
      }

      const payload: UpdateResourcePayload = {
        title: updatedResource.title,
        description: updatedResource.description,
        category: updatedResource.category as UpdateResourcePayload['category'],
        visibility: updatedResource.visibility,
        academicLevel: updatedResource.academicLevel,
        department: updatedResource.department,
      };

      await updateResource(resourceIdValue, payload);
      refresh();
      setShowEditModal(false);
    } catch (error) {
      throw error;
    } finally {
      setIsEditLoading(false);
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'computer_science':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100/70 mr-3">
            <Laptop className="h-4 w-4 text-blue-500" />
          </div>
        );
      case 'information_systems':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100/70 mr-3">
            <Database className="h-4 w-4 text-green-500" />
          </div>
        );
      case 'telecommunications':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100/70 mr-3">
            <Radio className="h-4 w-4 text-purple-500" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100/70 mr-3">
            <Database className="h-4 w-4 text-gray-500" />
          </div>
        );
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
      case 'pdf':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100/70">
            <FileText className="h-4 w-4 text-red-500" />
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100/70">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100/70">
            <FileSpreadsheet className="h-4 w-4 text-green-500" />
          </div>
        );
      case 'ppt':
      case 'pptx':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100/70">
            <Presentation className="h-4 w-4 text-orange-500" />
          </div>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100/70">
            <FileImage className="h-4 w-4 text-purple-500" />
          </div>
        );
      case 'zip':
      case 'rar':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100/70">
            <Archive className="h-4 w-4 text-yellow-600" />
          </div>
        );
      case 'mp3':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100/70">
            <Music className="h-4 w-4 text-pink-500" />
          </div>
        );
      case 'mp4':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100/70">
            <Video className="h-4 w-4 text-indigo-500" />
          </div>
        );
      case 'txt':
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100/70">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100/70">
            <File className="h-4 w-4 text-blue-500" />
          </div>
        );
    }
  };

  const handleViewFile = (file: FileItem) => {
    setViewingFile(file);
  };

  const handleCloseFileModal = () => {
    setViewingFile(null);
  };

  const renderFileViewer = (file: FileItem) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageViewer fileUrl={file.url} title={file.name} />;
      case 'pdf':
        return <PDFViewer fileUrl={file.url} title={file.name} />;
      case 'txt':
        return <TextViewer fileUrl={file.url} title={file.name} />;
      case 'mp3':
        return <AudioViewer fileUrl={file.url} title={file.name} />;
      case 'mp4':
        return <VideoViewer fileUrl={file.url} title={file.name} />;
      default:
        return <GenericViewer fileUrl={file.url} title={file.name} />;
    }
  };

  const formatCategory = (category: string): string => {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDepartment = (department: string): string => {
    const deptMap: { [key: string]: string } = {
      computer_science: 'Computer Science',
      information_systems: 'Information Systems',
      telecommunications: 'Telecommunications',
      all: 'All Departments',
    };
    return deptMap[department] || department;
  };

  const formatAcademicLevel = (level: string): string => {
    const levelMap: { [key: string]: string } = {
      undergraduate: 'Undergraduate',
      postgraduate: 'Postgraduate',
      all: 'All Levels',
    };
    return levelMap[level] || level;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCreator = (creator: { _id: string; firstName: string; lastName: string }): string => {
    if (creator?.firstName && creator?.lastName) {
      return `${creator.firstName} ${creator.lastName}`;
    }
    return 'Unknown';
  };

  return (
    <DashboardLayout title={resource?.title || 'Resource Details'} token={token}>
      <DashboardPageHeader
        title="Resource"
        subtitle="Details"
        description={
          role === 'admin'
            ? 'Manage and view resource content'
            : 'View and download resource content'
        }
        leftActions={
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 cursor-pointer" />
          </button>
        }
      />

      {isLoading ? (
        <ResourceViewerSkeleton role={role} />
      ) : isError || !resource ? (
        <NetworkError
          onRetry={handleRetry}
          retryButtonText="Refresh"
          title="Unable to fetch the resource"
          description="Please check your internet connection and try again."
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center mb-3">
                  {getDepartmentIcon(resource.department)}
                  <h2 className="text-2xl font-bold text-gray-900">{resource.title}</h2>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
              </div>
              {role === 'admin' && (
                <div className="flex flex-col sm:flex-row gap-4 md:gap-2 mb-4 md:mb-0">
                  <button
                    onClick={handleEditResource}
                    className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200/70 cursor-pointer transition-colors"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Resource
                  </button>
                  <button
                    onClick={() => setShowAddFilesModal(true)}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Files
                  </button>
                </div>
              )}
            </div>

            {role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 mb-8">
                <div className="bg-linear-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Views</span>
                  </div>
                  <p className="text-2xl font-normal text-blue-700">{resource.viewCount}</p>
                </div>
                <div className="bg-linear-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-100/70 p-2 rounded-full mr-2">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Downloads</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{resource.downloads}</p>
                </div>
                <div className="bg-linear-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100/70 p-2 rounded-full mr-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Files</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{files.length}</p>
                </div>
                <div className="bg-linear-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-amber-100/70 p-2 rounded-full mr-2">
                      <Tag className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Category</span>
                  </div>
                  <p className="text-sm font-semibold text-amber-700">
                    {formatCategory(resource.category)}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-base font-normal text-gray-500">DEPARTMENT</span>
                </div>
                <p className="text-gray-500 font-normal">{formatDepartment(resource.department)}</p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-base font-normal text-gray-500">ACADEMIC LEVEL</span>
                </div>
                <p className="text-gray-500 font-normal">
                  {formatAcademicLevel(resource.academicLevel)}
                </p>
              </div>

              {role === 'student' && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-base font-normal text-gray-500">CATEGORY</span>
                  </div>
                  <p className="text-gray-500 font-normal">{formatCategory(resource.category)}</p>
                </div>
              )}

              {role === 'admin' && (
                <>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-base font-normal text-gray-500">VISIBILITY</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resource.visibility === 'all'
                          ? 'bg-blue-100 text-blue-500'
                          : 'bg-blue-100 text-blue-500'
                      }`}
                    >
                      {resource.visibility === 'all' ? 'Public' : 'Admin Only'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                        <User className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-base font-normal text-gray-500">CREATED BY</span>
                    </div>
                    <p className="text-gray-500 font-normal">{formatCreator(resource.createdBy)}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-base font-normal text-gray-500">CREATED AT</span>
                    </div>
                    <p className="text-gray-500 font-normal">{formatDate(resource.createdAt)}</p>
                  </div>

                  {resource.updatedAt !== resource.createdAt && (
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-base font-normal text-gray-500">LAST UPDATED</span>
                      </div>
                      <p className="text-gray-500 font-normal">{formatDate(resource.updatedAt)}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Files ({files.length})
                </h3>
                {files.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloadingResource}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isDownloadingResource ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download All
                  </button>
                )}
              </div>
            </div>

            {files.length === 0 ? (
              <EmptyState
                itemName="file"
                title="No files found"
                showUploadButton={false}
                showRefreshButton={false}
                description="No files are available for this resource."
              />
            ) : (
              <div className="overflow-x-auto hide-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                      >
                        File Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                      >
                        Size
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500 w-32"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {files.map((file, index) => (
                      <tr
                        key={index}
                        onClick={() => handleViewFile(file)}
                        className={`${
                          index % 2 === 1 ? 'bg-gray-100/80' : ''
                        } hover:bg-amber-100 border-none transition-colors cursor-pointer`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center">
                            <div className="shrink-0">{getFileIcon(file.name)}</div>
                            <div className="ml-2 max-w-[250px]">
                              <div className="flex items-center">
                                <span className="text-md font-normal text-gray-500 mr-2 truncate">
                                  {file.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-[250px] text-md font-normal text-gray-500 truncate">
                          <span className="inline-flex items-center px-1.5 py-0.5 text-md font-normal text-gray-500">
                            {file.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-md font-normal text-gray-500">
                          {loadingFileSizes[file.url] ? (
                            <div className="flex items-center">
                              <Loader className="h-3 w-3 animate-spin mr-2" />
                              <span className="text-sm text-gray-400">Loading...</span>
                            </div>
                          ) : (
                            <span>{fileSizes[file.url] || 'Unknown'}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-md">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                              }}
                              disabled={isDownloadingFile === file.url}
                              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-500 disabled:opacity-50"
                              title="Download File"
                            >
                              {isDownloadingFile === file.url ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </button>

                            {role === 'admin' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(file.url);
                                }}
                                disabled={isDeletingFile === file.url}
                                className="rounded-full p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                title="Delete File"
                              >
                                {isDeletingFile === file.url ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmationModal
        variant="primary"
        title="Download File"
        cancelText="Cancel"
        confirmText="Download"
        loadingText="Downloading..."
        isOpen={showDownloadFileModal}
        onConfirm={confirmDownloadFile}
        onClose={handleCloseDownloadModal}
        isLoading={isDownloadingFile === fileToDownload?.url}
        message={`Are you sure you want to download "${fileToDownload?.name}"? This action will start the file download.`}
      />

      <ConfirmationModal
        variant="danger"
        title="Delete File"
        cancelText="Cancel"
        confirmText="Delete File"
        isOpen={showDeleteFileModal}
        onConfirm={confirmDeleteFile}
        loadingText="Deleting File..."
        onClose={handleCloseDeleteModal}
        isLoading={isDeletingFile === fileToDelete}
        message="Are you sure you want to delete this file? This action cannot be undone and the file will be permanently removed from this resource."
      />

      {resource && (
        <AddFilesModal
          token={token}
          resource={resource}
          isOpen={showAddFilesModal}
          onClose={() => setShowAddFilesModal(false)}
          onFilesAdded={async () => {
            refresh();
          }}
        />
      )}

      {viewingFile && (
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 transition-opacity"
              onClick={handleCloseFileModal}
            />

            <div className="relative w-full max-w-7xl bg-white rounded-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  {getFileIcon(viewingFile.name)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{viewingFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {viewingFile.type} • {fileSizes[viewingFile.url] || 'Unknown size'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseFileModal}
                  className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="h-96 md:h-208">{renderFileViewer(viewingFile)}</div>

              <div className="flex items-center justify-end space-x-3 p-4 border-t">
                <button
                  onClick={() => handleDownload(viewingFile)}
                  disabled={isDownloadingFile === viewingFile.url}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {isDownloadingFile === viewingFile.url ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </button>
                <button
                  onClick={handleCloseFileModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resource && (
        <ResourceEditModal
          resource={resource}
          isOpen={showEditModal}
          isLoading={isEditLoading}
          onSave={handleSaveResource}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <DownloadResourceModal
        resource={resource}
        isOpen={showDownloadModal}
        onConfirm={confirmDownloadAll}
        downloadProgress={downloadProgress}
        isDownloading={isDownloadingResource}
        onClose={() => setShowDownloadModal(false)}
      />
    </DashboardLayout>
  );
};

export default ResourceViewerComponent;
