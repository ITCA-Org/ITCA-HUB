import Link from 'next/link';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { ArrowLeft } from 'lucide-react';
import { isLoggedIn } from '@/utils/auth';
import useResources from '@/hooks/resources/use-resource';
import { useState, useEffect, useCallback, useMemo } from 'react';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import ResourceTable from '@/components/dashboard/table/resource-table';
import { RecycleBinPageProps, Resource } from '@/types/interfaces/resource';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const RecycleBinPage = ({ userData }: RecycleBinPageProps) => {
  const { resources, isLoading, pagination, fetchResources } = useResources({
    token: userData.token,
  });

  const { toggleResourceTrash, deleteResourcePermanently } = useResourceAdmin({
    token: userData.token,
  });

  const [deletedResources, setDeletedResources] = useState<typeof resources>([]);

  const { currentPage, limit } = pagination;

  const fetchParams = useMemo(
    () => ({
      includeDeleted: true,
      page: currentPage,
      limit,
    }),
    [currentPage, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchResources({
      ...fetchParams,
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [fetchResources, fetchParams]);

  useEffect(() => {
    setDeletedResources(resources.filter((r: Resource) => r.isDeleted));
  }, [resources]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const controller = new AbortController();
      fetchResources({
        includeDeleted: true,
        page: newPage,
        limit,
        signal: controller.signal,
      });
    },
    [fetchResources, limit]
  );

  const handleRefresh = useCallback(() => {
    fetchResources({
      includeDeleted: true,
      page: currentPage,
      limit,
    });
  }, [fetchResources, currentPage, limit]);

  return (
    <DashboardLayout title="Recycle Bin" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Recycle"
          subtitle="Bin"
          description="View and manage deleted resources. Items remain here for 30 days before being permanently removed."
          actions={
            <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
              <Link
                href="/admin/resources"
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
              </Link>
            </div>
          }
        />
      </div>

      <ResourceTable
        searchTerm=""
        limit={limit}
        isError={false}
        userRole="admin"
        mode="recycleBin"
        page={currentPage}
        isLoading={isLoading}
        token={userData.token}
        onClearFilters={() => {}}
        onRefresh={handleRefresh}
        setPage={handlePageChange}
        resources={deletedResources}
        total={deletedResources.length}
        allResources={deletedResources}
        totalPages={Math.ceil(deletedResources.length / limit)}
        onRestoreResource={async (resourceId: string) => {
          try {
            await toggleResourceTrash(resourceId);
            return true;
          } catch {
            return false;
          }
        }}
        onDeleteResource={async (resourceId: string) => {
          try {
            await deleteResourcePermanently(resourceId);
            return true;
          } catch {
            return false;
          }
        }}
      />
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
