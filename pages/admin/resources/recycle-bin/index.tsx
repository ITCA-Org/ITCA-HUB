import router from 'next/router';
import { useState, useCallback, useMemo } from 'react';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import {
  Radio,
  Trash2,
  Laptop,
  Database,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { isLoggedIn } from '@/utils/auth';
import { Column } from '@/types/interfaces/table';
import formatDepartment from '@/utils/format-department';
import Table from '@/components/dashboard/table/table';
import { Resource } from '@/types/interfaces/resource';
import { useDeletedResources } from '@/hooks/resources/use-resource';
import { useResourceActions } from '@/hooks/resources/use-resource-admin';
import useResourceTable from '@/hooks/resources/use-resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import DeleteResourceModal from '@/components/dashboard/modals/resources/delete-resource-modal';
import ResourceTableSkeleton from '@/components/dashboard/skeletons/resource-table-skeleton';

const LIMIT = 15;

const recycleBinColumns: Column[] = [
  { key: 'title', header: 'Title' },
  { key: 'description', header: 'Description' },
  { key: 'department', header: 'Department' },
  { key: 'category', header: 'Category' },
  { key: 'actions', header: 'Actions', className: 'w-32' },
];

interface RecycleBinPageProps {
  userData: UserAuth;
}

const RecycleBinPage = ({ userData }: RecycleBinPageProps) => {
  const [page, setPage] = useState(0);

  const { resources, total, totalPages, isLoading, isError, refresh } = useDeletedResources({
    token: userData.token,
    page,
    limit: LIMIT,
  });

  const {
    toggleResourceTrash,
    batchRestoreResources,
    deleteResourcePermanently,
    batchDeleteResourcesPermanently,
  } = useResourceActions(userData.token);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSingleRestore = useCallback(
    async (resourceId: string): Promise<boolean> => {
      try {
        await toggleResourceTrash(resourceId);
        return true;
      } catch {
        return false;
      }
    },
    [toggleResourceTrash]
  );

  const handleBatchRestore = useCallback(
    async (resourceIds: string[]): Promise<boolean> => {
      try {
        const result = await batchRestoreResources(resourceIds);
        return result.successful > 0;
      } catch {
        return false;
      }
    },
    [batchRestoreResources]
  );

  const handleSinglePermanentDelete = useCallback(
    async (resourceId: string): Promise<boolean> => {
      try {
        await deleteResourcePermanently(resourceId);
        return true;
      } catch {
        return false;
      }
    },
    [deleteResourcePermanently]
  );

  const handleBatchPermanentDelete = useCallback(
    async (resourceIds: string[]): Promise<boolean> => {
      try {
        const result = await batchDeleteResourcesPermanently(resourceIds);
        return result.successful > 0;
      } catch {
        return false;
      }
    },
    [batchDeleteResourcesPermanently]
  );

  const {
    selectAll,
    isDeleting,
    isRestoring,
    confirmDelete,
    confirmRestore,
    selectedCount,
    clearSelection,
    showDeleteModal,
    toggleSelection,
    showRestoreModal,
    selectedResources,
    setShowDeleteModal,
    hasMultipleSelected,
    setSelectedResource,
    setShowRestoreModal,
    handleDeleteSelected,
    handleRestoreSelected,
    handleRestoreResource,
    handleDeleteResource: handleDeleteClick,
  } = useResourceTable({
    resources,
    userRole: 'admin',
    onRefresh: refresh,
    mode: 'recycleBin',
    token: userData.token,
    onDeleteResource: handleSinglePermanentDelete,
    onDeleteMultiple: handleBatchPermanentDelete,
    onRestoreResource: handleSingleRestore,
    onRestoreMultiple: handleBatchRestore,
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

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const selectionActions = useMemo(() => {
    return (
      <>
        <button
          onClick={handleRestoreSelected}
          className="inline-flex items-center rounded-lg bg-blue-100 text-green-700 px-3 py-1.5 text-sm font-medium hover:bg-green-200 cursor-pointer"
        >
          Restore Selected
        </button>
        <button
          onClick={handleDeleteSelected}
          className="inline-flex items-center rounded-lg bg-red-100 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-200 cursor-pointer"
        >
          Delete Permanently
        </button>
      </>
    );
  }, [handleDeleteSelected, handleRestoreSelected]);

  const renderRecycleBinRow = (resource: Resource) => (
    <>
      <td className="px-5 py-4">
        <div className="flex items-center">
          <div className="shrink-0">{getDepartmentIcon(resource.department)}</div>
          <div className="ml-2 max-w-[250px]">
            <div className="flex items-center">
              <span className="text-md font-normal text-gray-500 mr-2 truncate">
                {resource.title}
              </span>
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

      <td className="whitespace-nowrap px-5 py-4 text-md font-medium">
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </td>
    </>
  );

  return (
    <DashboardLayout title="Recycle Bin" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Recycle"
          subtitle="Bin"
          description="View and manage deleted resources. Items remain here for 30 days before being permanently removed."
          leftActions={
            <button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 cursor-pointer" />
            </button>
          }
        />
      </div>

      <Table<Resource>
        data={resources}
        columns={recycleBinColumns}
        keyExtractor={(resource) => resource._id}
        renderRow={renderRecycleBinRow}
        page={page}
        limit={LIMIT}
        total={total}
        totalPages={totalPages}
        setPage={handlePageChange}
        isLoading={isLoading}
        isError={isError}
        title="Deleted Resources"
        onRefresh={refresh}
        emptyDescription="No resources in recycle bin. Deleted resources will appear here."
        emptyIcon={ArrowLeft}
        skeleton={<ResourceTableSkeleton />}
        selectable={true}
        selectedItems={selectedResources}
        onSelectItem={(resource, e) => toggleSelection(resource, e)}
        onSelectAll={selectAll}
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        selectionActions={selectionActions}
      />

      {showDeleteModal && (
        <DeleteResourceModal
          mode="permanent"
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

      {showRestoreModal && (
        <DeleteResourceModal
          mode="restore"
          isLoading={isRestoring}
          isOpen={showRestoreModal}
          onConfirm={confirmRestore}
          onClose={() => {
            setShowRestoreModal(false);
            setSelectedResource(null);
          }}
          resourceCount={hasMultipleSelected ? selectedCount : 1}
        />
      )}
    </DashboardLayout>
  );
};

export default RecycleBinPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
        permanent: false,
      },
    };
  }

  return {
    props: { userData },
  };
};
