import router from 'next/router';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { ArrowLeft } from 'lucide-react';
import { isLoggedIn } from '@/utils/auth';
import { useEffect, useCallback, useMemo } from 'react';
import useResources from '@/hooks/resources/use-resource';
import { RecycleBinPageProps } from '@/types/interfaces/resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import ResourceTable from '@/components/dashboard/table/resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const RecycleBinPage = ({ userData }: RecycleBinPageProps) => {
  const { resources, isLoading, isError, pagination, fetchDeletedResources } = useResources({
    token: userData.token,
  });

  const {
    toggleResourceTrash,
    batchRestoreResources,
    deleteResourcePermanently,
    batchDeleteResourcesPermanently,
  } = useResourceAdmin({
    token: userData.token,
  });

  const { currentPage, limit, total, totalPages } = pagination;

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit,
    }),
    [currentPage, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchDeletedResources({
      ...fetchParams,
      signal: controller.signal,
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchParams]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const controller = new AbortController();
      fetchDeletedResources({
        page: newPage,
        limit,
        signal: controller.signal,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit]
  );

  const handleRefresh = useCallback(() => {
    fetchDeletedResources({
      page: currentPage,
      limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit]);

  const handleSingleRestore = useCallback(
    async (resourceId: string): Promise<boolean> => {
      try {
        await toggleResourceTrash(resourceId);
        handleRefresh();
        return true;
      } catch {
        return false;
      }
    },
    [toggleResourceTrash, handleRefresh]
  );

  const handleBatchRestore = useCallback(
    async (resourceIds: string[]): Promise<boolean> => {
      try {
        const result = await batchRestoreResources(resourceIds);
        handleRefresh();
        return result.successful > 0;
      } catch {
        return false;
      }
    },
    [batchRestoreResources, handleRefresh]
  );

  const handleSinglePermanentDelete = useCallback(
    async (resourceId: string): Promise<boolean> => {
      try {
        await deleteResourcePermanently(resourceId);
        handleRefresh();
        return true;
      } catch {
        return false;
      }
    },
    [deleteResourcePermanently, handleRefresh]
  );

  const handleBatchPermanentDelete = useCallback(
    async (resourceIds: string[]): Promise<boolean> => {
      try {
        const result = await batchDeleteResourcesPermanently(resourceIds);
        handleRefresh();
        return result.successful > 0;
      } catch {
        return false;
      }
    },
    [batchDeleteResourcesPermanently, handleRefresh]
  );

  return (
    <DashboardLayout title="Recycle Bin" token={userData.token}>
      {/*==================== Page Header ====================*/}
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
      {/*==================== End of Page Header ====================*/}

      {/*==================== Resource Table ====================*/}
      <ResourceTable
        searchTerm=""
        total={total}
        limit={limit}
        userRole="admin"
        mode="recycleBin"
        isError={isError}
        page={currentPage}
        isLoading={isLoading}
        token={userData.token}
        resources={resources}
        totalPages={totalPages}
        onRefresh={handleRefresh}
        onClearFilters={() => {}}
        setPage={handlePageChange}
        onRestoreMultiple={handleBatchRestore}
        onRestoreResource={handleSingleRestore}
        onDeleteMultiple={handleBatchPermanentDelete}
        onDeleteResource={handleSinglePermanentDelete}
      />
      {/*==================== End of Resource Table ====================*/}
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
    props: {
      userData,
    },
  };
};
