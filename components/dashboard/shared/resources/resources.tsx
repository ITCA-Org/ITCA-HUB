import Link from 'next/link';
import { useState, useMemo, useCallback } from 'react';
import {
  Eye,
  Edit,
  Users,
  Radio,
  Trash,
  Search,
  Upload,
  Filter,
  Laptop,
  Trash2,
  Database,
  Download,
  BarChart2,
  Building2,
  Tag,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import useDebounce from '@/utils/debounce';
import formatDepartment from '@/utils/format-department';
import Table from '@/components/dashboard/table/table';
import { Column } from '@/types/interfaces/table';
import { useResources, useResourceDownload } from '@/hooks/resources/use-resource';
import { useResourceActions } from '@/hooks/resources/use-resource-admin';
import useResourceTable from '@/hooks/resources/use-resource-table';
import { Resource, ResourcesComponentProps } from '@/types/interfaces/resource';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceEditModal from '@/components/dashboard/modals/resources/edit-resource-modal';
import ResourceTableSkeleton from '@/components/dashboard/skeletons/resource-table-skeleton';
import DeleteResourceModal from '@/components/dashboard/modals/resources/delete-resource-modal';
import ResourceAnalytics from '@/components/dashboard/modals/resources/analytics-resource-modal';
import DownloadResourceModal from '@/components/dashboard/modals/resources/download-resource-modal';

const LIMIT = 15;

const ResourcesComponent = ({ role, token }: ResourcesComponentProps) => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: 'all' as 'all' | 'computer_science' | 'information_systems' | 'telecommunications',
    category: 'all',
    visibility: 'all' as 'all' | 'admin',
    academicLevel: 'all' as 'all' | 'undergraduate' | 'postgraduate',
  });

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadingResource, setDownloadingResource] = useState<Resource | null>(null);

  const debouncedSearch = useDebounce(filters.searchTerm, 500);
  const userRole = role === 'admin' ? 'admin' : 'user';

  const visibilityParam = useMemo(() => {
    if (role === 'student') return undefined;
    if (filters.visibility === 'admin') return 'admin';
    return undefined;
  }, [role, filters.visibility]);

  const { resources, total, totalPages, isLoading, isError, refresh } = useResources({
    token,
    page,
    limit: LIMIT,
    search: debouncedSearch,
    category: filters.category,
    department: filters.department,
    visibility: visibilityParam,
    academicLevel: filters.academicLevel,
  });

  const { downloadResource, isDownloading, downloadProgress } = useResourceDownload(token, userRole);

  const {
    toggleResourceTrash,
    batchToggleResourceTrash,
    batchRestoreResources,
    deleteResourcePermanently,
    batchDeleteResourcesPermanently,
  } = useResourceActions(token);

  const handleDeleteResource = useCallback(
    async (resourceId: string, mode: 'soft' | 'permanent' = 'soft'): Promise<boolean> => {
      if (role !== 'admin') return false;
      try {
        if (mode === 'permanent') {
          await deleteResourcePermanently(resourceId);
        } else {
          await toggleResourceTrash(resourceId);
        }
        return true;
      } catch {
        return false;
      }
    },
    [role, deleteResourcePermanently, toggleResourceTrash]
  );

  const handleDeleteMultiple = useCallback(
    async (resourceIds: string[], mode: 'soft' | 'permanent' = 'soft'): Promise<boolean> => {
      if (role !== 'admin') return false;
      try {
        if (mode === 'permanent') {
          await batchDeleteResourcesPermanently(resourceIds);
        } else {
          await batchToggleResourceTrash(resourceIds);
        }
        return true;
      } catch {
        return false;
      }
    },
    [role, batchDeleteResourcesPermanently, batchToggleResourceTrash]
  );

  const handleRestoreResource = useCallback(
    async (resourceId: string): Promise<boolean> => {
      if (role !== 'admin') return false;
      try {
        await toggleResourceTrash(resourceId);
        return true;
      } catch {
        return false;
      }
    },
    [role, toggleResourceTrash]
  );

  const handleRestoreMultiple = useCallback(
    async (resourceIds: string[]): Promise<boolean> => {
      if (role !== 'admin') return false;
      try {
        await batchRestoreResources(resourceIds);
        return true;
      } catch {
        return false;
      }
    },
    [role, batchRestoreResources]
  );

  const {
    isEditing,
    selectAll,
    isDeleting,
    confirmDelete,
    showEditModal,
    showAnalytics,
    clearSelection,
    selectedCount,
    showDeleteModal,
    toggleSelection,
    selectedResource,
    setShowEditModal,
    setShowAnalytics,
    selectedResources,
    handleDoubleClick,
    setShowDeleteModal,
    handleSaveResource,
    handleEditResource,
    handleViewAnalytics,
    hasMultipleSelected,
    setSelectedResource,
    handleDeleteSelected,
    handleDeleteResource: handleDeleteClick,
  } = useResourceTable({
    resources,
    userRole,
    onRefresh: refresh,
    token,
    onDeleteResource: role === 'admin' ? handleDeleteResource : undefined,
    onDeleteMultiple: role === 'admin' ? handleDeleteMultiple : undefined,
    onRestoreResource: role === 'admin' ? handleRestoreResource : undefined,
    onRestoreMultiple: role === 'admin' ? handleRestoreMultiple : undefined,
  });

  const hasActiveFilters = useMemo(() => {
    return (
      filters.department !== 'all' ||
      filters.category !== 'all' ||
      filters.academicLevel !== 'all' ||
      (role === 'admin' && filters.visibility !== 'all')
    );
  }, [filters, role]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    if (!hasActiveFilters) return;
    setFilters((prev) => ({
      ...prev,
      department: 'all',
      category: 'all',
      visibility: 'all',
      academicLevel: 'all',
    }));
    setPage(0);
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'computer_science':
        return (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100/70">
            <Laptop className="h-5 w-5 text-blue-500" />
          </div>
        );
      case 'information_systems':
        return (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100/70">
            <Database className="h-5 w-5 text-blue-500" />
          </div>
        );
      case 'telecommunications':
        return (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100/70">
            <Radio className="h-5 w-5 text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100/70">
            <Database className="h-5 w-5 text-gray-500" />
          </div>
        );
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    if (userRole === 'user') return null;

    switch (visibility) {
      case 'all':
        return <Users className="h-4.5 w-4.5 text-blue-500 mr-1" />;
      case 'admin':
        return <ShieldAlert className="h-4.5 w-4.5 text-blue-500 mr-1" />;
      default:
        return null;
    }
  };

  const handleDownload = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingResource(resource);
    setShowDownloadModal(true);
  };

  const handleConfirmDownload = async () => {
    if (!downloadingResource) return;
    await downloadResource(downloadingResource);
    setShowDownloadModal(false);
    setDownloadingResource(null);
  };

  const handleCloseDownloadModal = () => {
    if (isDownloading) return;
    setShowDownloadModal(false);
    setDownloadingResource(null);
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const columns: Column[] = useMemo(() => {
    const baseColumns: Column[] = [
      { key: 'title', header: 'Title' },
      { key: 'description', header: 'Description' },
      { key: 'department', header: 'Department' },
      { key: 'category', header: 'Category' },
    ];

    if (userRole === 'admin') {
      baseColumns.push({ key: 'usage', header: 'Usage' });
    }

    baseColumns.push({ key: 'actions', header: 'Actions', className: 'w-32' });

    return baseColumns;
  }, [userRole]);

  const handleStudentRowClick = (resource: Resource) => {
    handleDoubleClick(resource);
  };

  const handleAdminRowDoubleClick = (resource: Resource) => {
    handleDoubleClick(resource);
  };

  const selectionActions = useMemo(() => {
    if (userRole !== 'admin') return null;

    return (
      <button
        onClick={handleDeleteSelected}
        className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200 cursor-pointer"
      >
        Delete Selected
      </button>
    );
  }, [userRole, handleDeleteSelected]);

  const renderResourceRow = (resource: Resource) => (
    <>
      <td className="px-5 py-4">
        <div className="flex items-center">
          <div className="shrink-0">{getDepartmentIcon(resource.department)}</div>
          <div className="ml-2 max-w-[250px]">
            <div className="flex items-center">
              <span className="text-md font-normal text-gray-500 mr-2 truncate">
                {resource.title}
              </span>
              <span>{getVisibilityIcon(resource.visibility)}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 max-w-[250px] text-md font-normal text-gray-500 truncate">
        {resource.description}
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-md text-gray-500">
        <span className="inline-flex items-center px-1.5 py-0.5 text-md font-normal text-gray-500">
          {formatDepartment(resource.department)}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-md">
        <span className="inline-flex items-center rounded-full px-1.5 gap-2 py-0.5 text-md font-normal text-slate-500">
          {formatCategoryName(resource.category)}
        </span>
      </td>

      {userRole === 'admin' && (
        <td className="whitespace-nowrap px-5 py-4 text-md text-gray-500">
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4 text-gray-400" />
            <span>{resource.downloads}</span>
            <span className="text-gray-300">|</span>
            <Eye className="h-4 w-4 text-gray-400" />
            <span>{resource.viewCount}</span>
          </div>
        </td>
      )}

      <td className="whitespace-nowrap px-5 py-4 text-md font-medium">
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          {userRole === 'admin' ? (
            <>
              <button
                title="Edit Resource"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedResource(resource);
                  handleEditResource(resource, e);
                }}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                title="Download Resource"
                onClick={(e) => handleDownload(resource, e)}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                title="View Analytics"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedResource(resource);
                  handleViewAnalytics(resource, e);
                }}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
              >
                <BarChart2 className="h-4 w-4" />
              </button>

              {selectedResources[resource._id] && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResource(resource);
                    handleDeleteClick(resource, e);
                  }}
                  className="rounded-full p-1.5 text-amber-500 hover:bg-amber-50"
                  title="Delete Resource"
                >
                  <Trash className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <button
              title="Download Resource"
              onClick={(e) => handleDownload(resource, e)}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-500"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </>
  );

  const pageConfig = {
    admin: {
      title: 'Resource',
      subtitle: 'Management',
      description: 'Upload, manage, and organize educational materials',
      dashboardTitle: 'Resource Management',
      actions: (
        <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
          <Link
            href="/admin/resources/recycle-bin"
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Recycle Bin
          </Link>
          <Link
            href="/admin/resources/upload"
            className="group inline-flex items-center rounded-lg bg-linear-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Upload className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            Upload Resource
          </Link>
        </div>
      ),
    },
    student: {
      title: 'Resource',
      subtitle: 'Library',
      description: 'Explore and access educational materials for your studies',
      dashboardTitle: 'Resource Library',
      actions: <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3"></div>,
    },
  };

  const config = pageConfig[role];

  return (
    <DashboardLayout title={config.dashboardTitle} token={token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title={config.title}
          actions={config.actions}
          subtitle={config.subtitle}
          description={config.description}
        />
      </div>

      <div className="mb-6 bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-left md:items-center justify-between mb-4">
          <div className="flex md:flex-row items-left md:items-center">
            <div className="mr-2 bg-blue-100/80 p-2 rounded-full">
              <Filter className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Filter Resources</h3>
          </div>
          <button
            onClick={clearFilters}
            disabled={isLoading || !hasActiveFilters}
            className={`text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              hasActiveFilters
                ? 'text-gray-500 hover:text-blue-500 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Clear Filters
          </button>
        </div>

        <div className="mb-4 pt-2">
          <label className="block text-sm font-medium text-gray-500 mb-1">Search</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={filters.searchTerm}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }));
                setPage(0);
              }}
              placeholder="Search resources by title or description..."
              className="w-full rounded-lg bg-gray-100/70 pl-10 pr-4 py-2.5 text-sm text-gray-500 focus:bg-slate-200/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 pt-2`}
        >
          <div>
            <label className="flex items-center text-m text-gray-500 mb-2">
              <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  department: e.target.value as typeof prev.department,
                }));
                setPage(0);
              }}
              className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
            >
              <option value="all">All Departments</option>
              <option value="computer_science">Computer Science</option>
              <option value="information_systems">Information Systems</option>
              <option value="telecommunications">Telecommunications</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-m text-gray-500 mb-2">
              <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                <Tag className="h-5 w-5 text-blue-500" />
              </div>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, category: e.target.value }));
                setPage(0);
              }}
              className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="lecture_note">Lecture Notes</option>
              <option value="assignment">Assignments</option>
              <option value="past_papers">Past Papers</option>
              <option value="tutorial">Tutorials</option>
              <option value="textbook">Textbooks</option>
              <option value="research_papers">Research Papers</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-m text-gray-500 mb-2">
              <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
              </div>
              Academic Level
            </label>
            <select
              value={filters.academicLevel}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  academicLevel: e.target.value as typeof prev.academicLevel,
                }));
                setPage(0);
              }}
              className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          </div>

          {role === 'admin' && (
            <div>
              <label className="flex items-center text-m text-gray-500 mb-2">
                <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                Visibility
              </label>
              <select
                value={filters.visibility}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    visibility: e.target.value as 'all' | 'admin',
                  }));
                  setPage(0);
                }}
                className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
              >
                <option value="all">All Resources</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <Table<Resource>
        data={resources}
        columns={columns}
        keyExtractor={(resource) => resource._id}
        renderRow={renderResourceRow}
        page={page}
        limit={LIMIT}
        total={total}
        totalPages={totalPages}
        setPage={handlePageChange}
        isLoading={isLoading}
        isError={isError}
        title="Resources"
        onRefresh={refresh}
        hasActiveFilters={!!debouncedSearch || hasActiveFilters}
        onClearFilters={clearFilters}
        searchTerm={filters.searchTerm}
        emptyDescription={
          userRole === 'user'
            ? "No resources exist. When the admin uploads resources, you'll see them here."
            : 'Upload resources to the library by clicking the `Upload Resource` button.'
        }
        skeleton={<ResourceTableSkeleton />}
        selectable={userRole === 'admin'}
        selectedItems={selectedResources}
        onSelectItem={userRole === 'admin' ? toggleSelection : undefined}
        onSelectAll={selectAll}
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        selectionActions={selectionActions}
        onRowClick={userRole === 'user' ? handleStudentRowClick : undefined}
        onRowDoubleClick={userRole === 'admin' ? handleAdminRowDoubleClick : undefined}
      />

      {userRole === 'admin' && (
        <>
          {showAnalytics && selectedResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <ResourceAnalytics
                isOpen={showAnalytics}
                resource={selectedResource}
                onClose={() => setShowAnalytics(false)}
                token={token}
              />
            </div>
          )}

          {showEditModal && selectedResource && (
            <ResourceEditModal
              isLoading={isEditing}
              isOpen={showEditModal}
              resource={selectedResource}
              onSave={handleSaveResource}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </>
      )}

      {userRole === 'admin' && showDeleteModal && (
        <DeleteResourceModal
          mode="soft"
          isLoading={isDeleting}
          isOpen={showDeleteModal}
          onConfirm={confirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedResource(null);
          }}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
        />
      )}

      <DownloadResourceModal
        isOpen={showDownloadModal}
        isDownloading={isDownloading}
        resource={downloadingResource}
        onConfirm={handleConfirmDownload}
        onClose={handleCloseDownloadModal}
        downloadProgress={downloadProgress}
      />
    </DashboardLayout>
  );
};

export default ResourcesComponent;
