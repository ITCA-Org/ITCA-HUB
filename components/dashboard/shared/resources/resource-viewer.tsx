import {
  Tag,
  Eye,
  User,
  File,
  Plus,
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
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import useResources from '@/hooks/resources/use-resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { NetworkError, EmptyState } from '@/components/dashboard/error-messages';
import ConfirmationModal from '@/components/dashboard/modals/confirmation-modal';
import AddFilesModal from '@/components/dashboard/modals/resources/add-files-modal';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { FileItem, Resource, ResourceViewerComponentProps } from '@/types/interfaces/resource';
import ResourceViewerSkeleton from '@/components/dashboard/skeletons/resource-viewer-skeleton';

const ResourceViewerComponent = ({ role, userData }: ResourceViewerComponentProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [fileToDownload, setFileToDownload] = useState<FileItem | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);
  const [showDownloadFileModal, setShowDownloadFileModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [showAddFilesModal, setShowAddFilesModal] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchSingleResource, trackView, downloadFile } = useResources({
    token: userData.token,
  });

  const adminHook = useResourceAdmin({ token: userData.token });

  const loadResource = useCallback(
    async (shouldTrackView: boolean = true) => {
      if (!id || !userData.token) return;

      const abortController = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const resourceData = await fetchSingleResource(id as string, abortController.signal);

        if (resourceData && !abortController.signal.aborted) {
          setResource(resourceData);

          const processedFiles = resourceData.fileUrls.map((url: string) => {
            const fileName = url.split('/').pop() || 'Unknown';
            const fileType = getFileType(fileName);

            return {
              url,
              name: fileName,
              type: fileType,
            };
          });

          setFiles(processedFiles);

          if (shouldTrackView) {
            const resourceId = resourceData._id || resourceData.resourceId;
            if (resourceId) {
              await trackView(resourceId, role, abortController.signal);
            }
          }
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load resource');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [id, userData.token, fetchSingleResource, trackView, role]
  );

  useEffect(() => {
    loadResource(true);
  }, [loadResource]);

  const handleDownload = async (file: FileItem) => {
    if (!resource) return;

    setFileToDownload(file);
    setShowDownloadFileModal(true);
  };

  const confirmDownloadFile = async () => {
    if (!fileToDownload || !resource) return;

    try {
      setIsDownloading(fileToDownload.url);
      await downloadFile(fileToDownload.url, resource._id, role);

      setShowDownloadFileModal(false);
      setFileToDownload(null);
    } catch {
    } finally {
      setIsDownloading(null);
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
      await adminHook.deleteFileFromResource(resource.resourceId || resource._id, fileToDelete);

      await loadResource(false);

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
    window.location.reload();
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
    <DashboardLayout title={resource?.title || 'Resource Details'} token={userData.token}>
      {/*==================== Header ====================*/}
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
      {/*==================== End of Header ====================*/}

      {/*==================== Content Area ====================*/}
      {isLoading ? (
        <ResourceViewerSkeleton role={role} />
      ) : error || !resource ? (
        <NetworkError
          onRetry={handleRetry}
          retryButtonText="Reload Page"
          title="Unable to fetch the resource"
          description="Please check your internet connection and try again."
        />
      ) : (
        <>
          {/*==================== Resource Information ====================*/}
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
                <div className="flex flex-col sm:flex-row gap-2">
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

            {/*==================== Resource Stats Grid  ====================*/}
            {role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Views</span>
                  </div>
                  <p className="text-2xl font-normal text-blue-700">{resource.viewCount}</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-100/70 p-2 rounded-full mr-2">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Downloads</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{resource.downloads}</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100/70 p-2 rounded-full mr-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Files</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{files.length}</p>
                </div>
                <div className="bg-gradient-to-r from-amber-100/70 to-blue-100/70 rounded-lg p-4">
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
            {/*==================== End of Resource Stats Grid ====================*/}

            {/*==================== Resource Details Grid ====================*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/*==================== Department ====================*/}
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-500">DEPARTMENT</span>
                </div>
                <p className="text-gray-500 font-normal">{formatDepartment(resource.department)}</p>
              </div>
              {/*==================== End of Department ====================*/}

              {/*==================== Academic Level ====================*/}
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-green-100/70 p-2 rounded-full mr-2">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-normal text-gray-500">ACADEMIC LEVEL</span>
                </div>
                <p className="text-gray-500 font-normal">
                  {formatAcademicLevel(resource.academicLevel)}
                </p>
              </div>
              {/*==================== End of Academic Level ====================*/}

              {/*==================== Category (Student Only) ====================*/}
              {role === 'student' && (
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-amber-100/70 p-2 rounded-full mr-2">
                      <Tag className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-normal text-gray-500">CATEGORY</span>
                  </div>
                  <p className="text-gray-500 font-normal">{formatCategory(resource.category)}</p>
                </div>
              )}
              {/*==================== End of Category ====================*/}

              {/*==================== Admin-Only Fields ====================*/}
              {role === 'admin' && (
                <>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-orange-100/70 p-2 rounded-full mr-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-normal text-gray-500">VISIBILITY</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resource.visibility === 'all'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {resource.visibility === 'all' ? 'Public' : 'Admin Only'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100/70 p-2 rounded-full mr-2">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-normal text-gray-500">CREATED BY</span>
                    </div>
                    <p className="text-gray-500 font-normal">{formatCreator(resource.createdBy)}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <div className="bg-amber-100/70 p-2 rounded-full mr-2">
                        <Calendar className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-normal text-gray-500">CREATED AT</span>
                    </div>
                    <p className="text-gray-500 font-normal">{formatDate(resource.createdAt)}</p>
                  </div>

                  {resource.updatedAt !== resource.createdAt && (
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-red-100/70 p-2 rounded-full mr-2">
                          <Clock className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-sm font-normal text-gray-500">LAST UPDATED</span>
                      </div>
                      <p className="text-gray-500 font-normal">{formatDate(resource.updatedAt)}</p>
                    </div>
                  )}
                </>
              )}
              {/*==================== End of Admin-Only Fields ====================*/}
            </div>
          </div>
          {/*==================== End of Resource Information ====================*/}

          {/*==================== Files Table ====================*/}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Files ({files.length})
              </h3>
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
                        className={`${
                          index % 2 === 1 ? 'bg-gray-100/80' : ''
                        } hover:bg-amber-100 border-none transition-colors cursor-pointer`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
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
                        <td className="whitespace-nowrap px-5 py-4 text-md">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                              }}
                              disabled={isDownloading === file.url}
                              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-50"
                              title="Download File"
                            >
                              {isDownloading === file.url ? (
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
          {/*==================== End of Files Table ====================*/}
        </>
      )}
      {/*==================== End of Content Area ====================*/}

      {/*==================== Download File Confirmation Modal ====================*/}
      <ConfirmationModal
        variant="primary"
        title="Download File"
        cancelText="Cancel"
        confirmText="Download"
        loadingText="Downloading..."
        isOpen={showDownloadFileModal}
        onConfirm={confirmDownloadFile}
        onClose={handleCloseDownloadModal}
        isLoading={isDownloading === fileToDownload?.url}
        message={`Are you sure you want to download "${fileToDownload?.name}"? This action will start the file download.`}
      />
      {/*==================== End of Download File Confirmation Modal ====================*/}

      {/*==================== Delete File Confirmation Modal ====================*/}
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
      {/*==================== End of Delete File Confirmation Modal ====================*/}

      {/*==================== Add Files Modal ====================*/}
      {resource && (
        <AddFilesModal
          resource={resource}
          token={userData.token}
          isOpen={showAddFilesModal}
          onClose={() => setShowAddFilesModal(false)}
          onFilesAdded={async () => {
            await loadResource(false);
          }}
        />
      )}
      {/*==================== End of Add Files Modal ====================*/}
    </DashboardLayout>
  );
};

export default ResourceViewerComponent;
