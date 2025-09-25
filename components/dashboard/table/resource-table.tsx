import {
  Eye,
  Edit,
  Users,
  Radio,
  Trash,
  Trash2,
  Laptop,
  Database,
  Download,
  BarChart2,
  RotateCcw,
  RefreshCw,
  ArrowLeft,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import formatDepartment from '@/utils/format-department';
import useResources from '@/hooks/resources/use-resource';
import useResourceTable from '@/hooks/resources/use-resource-table';
import ResourceEditModal from '../modals/resources/edit-resource-modal';
import ResourceTableSkeleton from '../skeletons/resource-table-skeleton';
import { Resource, ResourceTableProps } from '@/types/interfaces/resource';
import DeleteResourceModal from '../modals/resources/delete-resource-modal';
import ResourceAnalytics from '../modals/resources/analytics-resource-modal';
import { EmptyState, NetworkError, NoResults } from '@/components/dashboard/error-messages';

const ResourceTable = ({
  page,
  token,
  total,
  limit,
  setPage,
  userRole,
  onRefresh,
  resources,
  isLoading,
  totalPages,
  searchTerm,
  onClearFilters,
  isError = false,
  mode = 'default',
  onDeleteResource,
  hasActiveFilters,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
}: ResourceTableProps) => {
  const { downloadResource } = useResources({ token });

  const {
    isEditing,
    selectAll,
    isDeleting,
    isRestoring,
    selectedCount,
    confirmDelete,
    showEditModal,
    showAnalytics,
    confirmRestore,
    clearSelection,
    showDeleteModal,
    toggleSelection,
    selectedResource,
    showRestoreModal,
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
    setShowRestoreModal,
    handleDeleteSelected,
    handleRestoreSelected,
    handleRestoreResource,
    handleDeleteResource: handleDeleteClick,
  } = useResourceTable({
    resources,
    token,
    userRole,
    onRefresh,
    onDeleteResource,
    onDeleteMultiple,
    onRestoreResource,
    onRestoreMultiple,
    mode,
  });

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
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100/70">
            <Database className="h-5 w-5 text-green-500" />
          </div>
        );
      case 'telecommunications':
        return (
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100/70">
            <Radio className="h-5 w-5 text-purple-500" />
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
        return <Users className="h-4 w-4 text-green-500 mr-1" />;
      case 'admin':
        return <ShieldAlert className="h-4 w-4 text-purple-500 mr-1" />;
      default:
        return null;
    }
  };

  const handleDownload = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const role = userRole === 'admin' ? 'admin' : 'student';
    await downloadResource(resource, role);
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return <ResourceTableSkeleton />;
  }

  return (
    <>
      {/*==================== Error States ====================*/}
      {isError && <NetworkError onRetry={onRefresh} />}

      {!isError &&
        resources.length === 0 &&
        (hasActiveFilters ? (
          <NoResults filterTerm={searchTerm} onClearFilters={onClearFilters} />
        ) : (
          <EmptyState
            itemName="resource"
            showUploadButton={mode === 'recycleBin' || userRole === 'admin'}
            showRefreshButton={mode !== 'recycleBin' && userRole === 'user'}
            uploadButtonText={mode === 'recycleBin' ? 'Go Back to Resources' : undefined}
            onRefresh={mode !== 'recycleBin' && userRole === 'user' ? onRefresh : undefined}
            uploadIcon={mode === 'recycleBin' ? ArrowLeft : undefined}
            description={
              mode === 'recycleBin'
                ? 'No resources in recycle bin. Deleted resources will appear here.'
                : 'Get started by uploading your first educational resource to the library.'
            }
          />
        ))}
      {/*==================== End of Error States ====================*/}

      {/*==================== Results Table ====================*/}
      {!isError && resources.length > 0 && (
        <div className="rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'recycleBin' ? 'Deleted Resources' : 'Resources'}
            </h3>
            <div className="flex items-center mt-2 sm:mt-0">
              {selectedCount > 0 ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedCount} resource{selectedCount > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="inline-flex items-center rounded-lg bg-gray-100 text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-200"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={selectAll}
                    className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium hover:bg-blue-200"
                  >
                    {resources.every((item) => selectedResources[item._id])
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                  {userRole === 'admin' && (
                    <>
                      {mode === 'recycleBin' ? (
                        <>
                          <button
                            onClick={handleRestoreSelected}
                            className="inline-flex items-center rounded-lg bg-green-100 text-green-700 px-3 py-1.5 text-sm font-medium hover:bg-green-200"
                          >
                            Restore Selected
                          </button>
                          <button
                            onClick={handleDeleteSelected}
                            className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200"
                          >
                            Delete Permanently
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleDeleteSelected}
                          className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200"
                        >
                          Delete Selected
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Showing {resources.length} of {total} resources
                </p>
              )}
              <button
                onClick={onRefresh}
                title="Refresh resources"
                className="ml-3 p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              {/*==================== Table Head ====================*/}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                  >
                    Category
                  </th>
                  {userRole === 'admin' && mode === 'default' && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500"
                    >
                      Usage
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500 w-32"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              {/*==================== End of Table Head ====================*/}

              {/*==================== Table Body ====================*/}
              <tbody className="bg-white">
                {resources.map((resource, index) => (
                  <tr
                    key={resource._id}
                    onClick={
                      userRole === 'user'
                        ? () => handleDoubleClick(resource)
                        : (e) => toggleSelection(resource, e)
                    }
                    onDoubleClick={
                      userRole === 'admin' ? () => handleDoubleClick(resource) : undefined
                    }
                    className={`${
                      userRole === 'admin' && selectedResources[resource._id]
                        ? 'bg-amber-100'
                        : index % 2 === 1
                          ? 'bg-gray-100/80'
                          : ''
                    } hover:bg-amber-100 border-none transition-colors cursor-pointer`}
                  >
                    {/*==================== Title Column ====================*/}
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getDepartmentIcon(resource.department)}
                        </div>
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
                    {/*==================== End of Title Column ====================*/}

                    {/*==================== Description Column ====================*/}
                    <td className="px-5 py-4 max-w-[250px] text-md font-normal text-gray-500 truncate">
                      {resource.description}
                    </td>
                    {/*==================== End of Description Column ====================*/}

                    {/*==================== Department Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-md text-gray-500">
                      <span className="inline-flex items-center px-1.5 py-0.5 text-md font-normal text-gray-500">
                        {formatDepartment(resource.department)}
                      </span>
                    </td>
                    {/*==================== End of Department Column ====================*/}

                    {/*==================== Category Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-md">
                      <span className="inline-flex items-center rounded-full px-1.5 gap-2 py-0.5 text-md font-normal text-slate-500">
                        {formatCategoryName(resource.category)}
                      </span>
                    </td>
                    {/*==================== End of Category Column ====================*/}

                    {/*==================== Usage Column (Admin Default Only) ====================*/}
                    {userRole === 'admin' && mode === 'default' && (
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
                    {/*==================== End of Usage Column ====================*/}

                    {/*==================== Actions Column ====================*/}
                    <td className="whitespace-nowrap px-5 py-4 text-md font-medium">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        {userRole === 'admin' ? (
                          <>
                            {mode === 'recycleBin' ? (
                              <>
                                {/*==================== Recycle Bin Actions ====================*/}
                                <button
                                  title="Restore Resource"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreResource(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>

                                <button
                                  title="Delete Permanently"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleDeleteClick(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {/*==================== End of Recycle Bin Actions ====================*/}
                              </>
                            ) : (
                              <>
                                {/*==================== Default Admin Actions ====================*/}
                                <button
                                  title="Edit Resource"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    handleEditResource(resource, e);
                                  }}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>

                                <button
                                  title="Download Resource"
                                  onClick={(e) => handleDownload(resource, e)}
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
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
                                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
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
                                {/*==================== End of Default Admin Actions ====================*/}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {/*==================== Student Actions ====================*/}
                            <button
                              title="Download Resource"
                              onClick={(e) => handleDownload(resource, e)}
                              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {/*==================== End of Student Actions ====================*/}
                          </>
                        )}
                      </div>
                    </td>
                    {/*==================== End of Actions Column ====================*/}
                  </tr>
                ))}
              </tbody>
              {/*==================== End of Table Body ====================*/}
            </table>
          </div>

          {/*==================== Pagination Controls ====================*/}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{page * limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min((page + 1) * limit, total)}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNumber;

                      if (totalPages <= 7) {
                        pageNumber = i;
                      } else if (page < 3) {
                        pageNumber = i < 5 ? i : totalPages - (7 - i);
                      } else if (page > totalPages - 4) {
                        pageNumber = totalPages - 7 + i;
                      } else {
                        pageNumber = page - 3 + i;
                      }

                      if (pageNumber >= 0 && pageNumber < totalPages) {
                        if (
                          (i === 5 && pageNumber < totalPages - 1) ||
                          (i === 1 && pageNumber > 1)
                        ) {
                          return (
                            <span key={`dots-${pageNumber}`} className="px-3 py-1 text-gray-700">
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md ${
                              page === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      }

                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {/*==================== End of Pagination Controls ====================*/}
        </div>
      )}
      {/*==================== End of Results Table ====================*/}

      {/*==================== Admin-Only Modals ====================*/}
      {userRole === 'admin' && mode === 'default' && (
        <>
          {/*==================== Analytics Modal ====================*/}
          {showAnalytics && selectedResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <ResourceAnalytics
                token={token}
                isOpen={showAnalytics}
                resource={selectedResource}
                onClose={() => setShowAnalytics(false)}
              />
            </div>
          )}
          {/*==================== End of Analytics Modal ====================*/}

          {/*==================== Edit Modal ====================*/}
          {showEditModal && selectedResource && (
            <ResourceEditModal
              isLoading={isEditing}
              isOpen={showEditModal}
              resource={selectedResource}
              onSave={handleSaveResource}
              onClose={() => setShowEditModal(false)}
            />
          )}
          {/*==================== End of Edit Modal ====================*/}
        </>
      )}

      {/*==================== Delete Modal ====================*/}
      {userRole === 'admin' && showDeleteModal && (
        <DeleteResourceModal
          isLoading={isDeleting}
          isOpen={showDeleteModal}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
          mode={mode === 'recycleBin' ? 'permanent' : 'soft'}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
        />
      )}
      {/*==================== End of Delete Modal ====================*/}

      {/*==================== Restore Modal ====================*/}
      {userRole === 'admin' && mode === 'recycleBin' && showRestoreModal && (
        <DeleteResourceModal
          mode="restore"
          isLoading={isRestoring}
          isOpen={showRestoreModal}
          onConfirm={confirmRestore}
          onClose={() => setShowRestoreModal(false)}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
        />
      )}
      {/*==================== End of Restore Modal ====================*/}
    </>
  );
};

export default ResourceTable;
