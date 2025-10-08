import { Search } from 'lucide-react';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import useUsers from '@/hooks/users/use-users';
import { AdminUsersPageProps, UserAuth } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import UserTable from '@/components/dashboard/table/user-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const AdminUsersPage = ({ userData }: AdminUsersPageProps) => {
  const { isError, isLoading, usersData, clearCache, fetchUsers } = useUsers({
    token: userData.token,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [isClearingFilters, setIsClearingFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  const hasActiveFilters = role !== 'all' || status !== 'all';

  const refreshUsers = useCallback(() => {
    if (isLoading) return;
    clearCache();
    const controller = new AbortController();
    fetchUsers({
      page,
      limit,
      search: debouncedSearchQuery,
      role,
      status,
      signal: controller.signal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCache, page, limit, debouncedSearchQuery, role, status, isLoading]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const resetFilters = useCallback(() => {
    if (!hasActiveFilters) return;
    setIsClearingFilters(true);
    setRole('all');
    setStatus('all');
    setPage(1);
    clearCache();
  }, [clearCache, hasActiveFilters]);

  useEffect(() => {
    if (isClearingFilters && !isLoading) {
      setIsClearingFilters(false);
    }
  }, [isClearingFilters, isLoading]);

  useEffect(() => {
    const abortController = new AbortController();
    let isActive = true;

    const loadData = async () => {
      try {
        await fetchUsers({
          page,
          limit,
          search: debouncedSearchQuery,
          role,
          status,
          signal: abortController.signal,
        });
      } catch (error) {
        if (isActive && !(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to fetch users:', error);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearchQuery, role, status]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, role, status]);

  return (
    <DashboardLayout title="User Management" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="User"
          subtitle="Management"
          description="Manage user accounts, roles, and permissions"
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Filters ====================*/}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              placeholder="Search users by name or email..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              value={role}
              title="select"
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <select
              title="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none  focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                hasActiveFilters
                  ? 'bg-white text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/*==================== End of Filters ====================*/}

      {/*==================== Users Table ====================*/}
      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-lg bg-white">
          <UserTable
            page={page}
            limit={limit}
            isError={isError}
            setLimit={setLimit}
            token={userData.token}
            users={usersData.users}
            setPage={handlePageChange}
            onUserUpdated={refreshUsers}
            onClearFilters={resetFilters}
            total={usersData.pagination.total}
            isLoading={isLoading || isClearingFilters}
            totalPages={usersData.pagination.totalPages}
            hasActiveFilters={(!!debouncedSearchQuery || hasActiveFilters) && !isClearingFilters}
          />
        </div>
      </div>
      {/*==================== End of Users Table ====================*/}
    </DashboardLayout>
  );
};

export default AdminUsersPage;

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
