import {
  Tag,
  Eye,
  User,
  Plus,
  Clock,
  Trash2,
  Loader,
  Shield,
  Calendar,
  Download,
  FileText,
  ArrowLeft,
  Building2,
  GraduationCap,
  Laptop,
  Database,
  Radio,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useResources from '@/hooks/resources/use-resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { NetworkError, EmptyState } from '@/components/dashboard/error-messages';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceViewerSkeleton from '@/components/dashboard/skeletons/resource-viewer-skeleton';
import { FileItem, Resource, ResourceViewerComponentProps } from '@/types/interfaces/resource';

const ResourceViewerComponent = ({ role, userData }: ResourceViewerComponentProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchSingleResource, trackView, downloadFile, trackDownload } = useResources({
    token: userData.token,
  });

  const adminHook = useResourceAdmin({ token: userData.token });

  /*==================== Fetch Resource Data ====================*/
  useEffect(() => {
    const loadResource = async () => {
      if (!id || !userData.token) return;

      try {
        setIsLoading(true);
        setError(null);

        const resourceData = await fetchSingleResource(id as string);

        if (resourceData) {
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

          const resourceId = resourceData._id || resourceData.resourceId;
          if (resourceId) {
            await trackView(resourceId);
          }
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resource');
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [id, userData.token, fetchSingleResource, trackView]);

  const handleDownload = async (file: FileItem) => {
    if (!resource) return;

    try {
      setIsDownloading(file.url);
      await trackDownload(resource._id);
      await downloadFile(file.url, resource._id);
    } catch {
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    if (!resource || role !== 'admin') return;

    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      setIsDeletingFile(fileUrl);
      const updatedResource = await adminHook.deleteFileFromResource(resource._id, fileUrl);

      // Update local state
      setFiles((prev) => prev.filter((file) => file.url !== fileUrl));
      if (updatedResource) {
        setResource(updatedResource);
      }
    } catch {
    } finally {
      setIsDeletingFile(null);
    }
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
        actions={
          <button
            onClick={() => router.back()}
            className="inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
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
                    onClick={() => {
                      // TODO: Open add files modal
                      toast.info('Add files modal coming soon');
                    }}
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
                <div className="bg-gray-100 rounded-lg p-4">
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
                        <Shield className="-d4 w-4 normalrange-600" />
                      </div>
                      <span className="text5sm font-normal text-gray-500">VISIBILITY</span>
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
            <div className="px-6 py-4 border-b border-gray-200">
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDownload(file)}
                              disabled={isDownloading === file.url}
                              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              {isDownloading === file.url ? (
                                <Loader className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </>
                              )}
                            </button>

                            {role === 'admin' && (
                              <button
                                onClick={() => handleDeleteFile(file.url)}
                                disabled={isDeletingFile === file.url}
                                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                              >
                                {isDeletingFile === file.url ? (
                                  <Loader className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="mr-1 h-3 w-3" />
                                    Delete
                                  </>
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
    </DashboardLayout>
  );
};

export default ResourceViewerComponent;
