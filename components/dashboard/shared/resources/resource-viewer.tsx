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
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useResources from '@/hooks/resources/use-resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { FileItem, Resource, ResourceViewerComponentProps } from '@/types/interfaces/resource';

const ResourceViewerComponent = ({ role, userData }: ResourceViewerComponentProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [resource, setResource] = useState<Resource | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);

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

          // Process files from fileUrls array
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

          await trackView(resourceData._id);
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

  /*==================== Download File Handler ====================*/
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

  /*==================== Delete File Handler (Admin Only) ====================*/
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

  /*==================== Get File Type ====================*/
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

  /*==================== Format Functions ====================*/
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
    if (creator.firstName && creator.lastName) {
      return `${creator.firstName} ${creator.lastName}`;
    }
    return 'Unknown';
  };

  /*==================== Loading State ====================*/
  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." token={userData.token}>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading resource...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*==================== Error State ====================*/
  if (error || !resource) {
    return (
      <DashboardLayout title="Error" token={userData.token}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">Resource Not Found</h3>
              <p className="text-red-600 mb-4">
                {error || 'The requested resource could not be found.'}
              </p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={resource.title} token={userData.token}>
      {/*==================== Header ====================*/}
      <div className="mb-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-blue-700 mr-2">Resource</span>
              <span className="text-amber-500">Details</span>
            </h1>
            <p className="text-gray-600">
              {role === 'admin'
                ? 'Manage and view resource content'
                : 'View and download resource content'}
            </p>
          </div>
        </div>
      </div>
      {/*==================== End of Header ====================*/}

      {/*==================== Resource Information ====================*/}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
          <div className="flex-1 mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{resource.title}</h2>
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

        {/*==================== Resource Stats Grid ====================*/}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-600 mb-2">
              <Eye className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{resource.viewCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-600 mb-2">
              <Download className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Downloads</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{resource.downloads}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center text-purple-600 mb-2">
              <FileText className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Files</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{files.length}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center text-amber-600 mb-2">
              <Tag className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Category</span>
            </div>
            <p className="text-sm font-semibold text-amber-700">
              {formatCategory(resource.category)}
            </p>
          </div>
        </div>

        {/*==================== Resource Details Grid ====================*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Building2 className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Department</span>
            </div>
            <p className="text-gray-900 font-medium">{formatDepartment(resource.department)}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Academic Level</span>
            </div>
            <p className="text-gray-900 font-medium">
              {formatAcademicLevel(resource.academicLevel)}
            </p>
          </div>

          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Shield className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Visibility</span>
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
            <div className="flex items-center text-gray-500 mb-2">
              <User className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Created By</span>
            </div>
            <p className="text-gray-900 font-medium">{formatCreator(resource.createdBy)}</p>
          </div>

          <div>
            <div className="flex items-center text-gray-500 mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Created At</span>
            </div>
            <p className="text-gray-900 font-medium">{formatDate(resource.createdAt)}</p>
          </div>

          {resource.updatedAt !== resource.createdAt && (
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-gray-900 font-medium">{formatDate(resource.updatedAt)}</p>
            </div>
          )}
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
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No files available for this resource.</p>
          </div>
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
    </DashboardLayout>
  );
};

export default ResourceViewerComponent;
