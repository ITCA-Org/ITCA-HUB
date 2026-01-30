import {
  User,
  Users,
  Crown,
  Trash,
  Search,
  UserX,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { useState, useCallback } from 'react';
import useUsers from '@/hooks/users/use-users';
import Table from '@/components/dashboard/table/table';
import { UserData, Column } from '@/types/interfaces/table';
import useUserActions from '@/hooks/users/use-user-actions';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import UserActionsModal from '@/components/dashboard/modals/user/user-actions-modal';

const userColumns: Column[] = [
  { key: 'user', header: 'User' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Email Status' },
  { key: 'joined', header: 'Joined' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminUsersPageProps {
  userData: UserAuth;
}

const AdminUsersPage = ({ userData }: AdminUsersPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [role, setRole] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = role !== 'all' || status !== 'all';

  const { users, total, totalPages, isLoading, isError, refresh } = useUsers({
    token: userData.token,
    page,
    limit,
    search: debouncedSearchQuery,
    role,
    status,
  });

  const {
    deleteUser,
    modalState,
    closeModal,
    executeAction,
    updateUserRole,
    toggleUserActivation,
  } = useUserActions(userData.token);

  const resetFilters = useCallback(() => {
    if (!hasActiveFilters) return;
    setRole('all');
    setStatus('all');
    setPage(0);
  }, [hasActiveFilters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0);
  };

  const renderUserRow = (user: UserData) => {
    const userName = user.name || `${user.firstName} ${user.lastName}`;

    return (
      <>
        <td className="whitespace-nowrap px-8 py-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-lg shadow-blue-200">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <div className="text-base font-normal text-gray-900">{userName}</div>
              <div className="text-base text-gray-500">{user.schoolEmail}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
          {user.role.toLowerCase() === 'user' ? 'Student' : 'Admin'}
        </td>
        <td className="whitespace-nowrap px-8 py-4">
          {user.isEmailVerified ? (
            <span className="inline-flex px-2 py-2 text-base font-medium rounded-md bg-green-100 text-green-600">
              Verified
            </span>
          ) : (
            <span className="inline-flex px-2 py-2 text-base font-medium rounded-md bg-red-100/70 text-red-600">
              Unverified
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
          {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}
        </td>
        <td className="whitespace-nowrap px-2 py-4 text-right text-base font-medium">
          <div className="flex items-center space-x-1 justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateUserRole(user._id!, userName, user.role);
              }}
              className="rounded-full p-2 text-gray-400 hover:bg-white cursor-pointer"
              title={user.role.toLowerCase() === 'admin' ? 'Make Student' : 'Make Admin'}
            >
              {user.role.toLowerCase() === 'admin' ? (
                <GraduationCap className="h-4.5 w-4.5 text-gray-500 rounded-full" />
              ) : (
                <Crown className="h-4.5 w-4.5 text-gray-500 rounded-full" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleUserActivation(user._id!, userName, user.isActive ?? false);
              }}
              title={user.isActive ? 'Suspend User' : 'Activate User'}
              className="rounded-full p-2 text-gray-400 hover:bg-white cursor-pointer"
            >
              {user.isActive ? (
                <UserX className="h-4.5 w-4.5 text-gray-500 rounded-full" />
              ) : (
                <UserCheck className="h-4.5 w-4.5 text-gray-500 rounded-full" />
              )}
            </button>
            <button
              title="Delete User"
              onClick={(e) => {
                e.stopPropagation();
                deleteUser(user._id!, userName);
              }}
              className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-red-500 cursor-pointer"
            >
              <Trash className="h-4.5 w-4.5" />
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <DashboardLayout title="User Management" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="User"
          subtitle="Management"
          description="Manage user accounts, roles, and permissions"
        />
      </div>

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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border-none bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              value={role}
              title="select"
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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

      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-lg bg-white">
          <Table<UserData>
            data={users}
            columns={userColumns}
            keyExtractor={(user) => user._id!}
            renderRow={renderUserRow}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            setPage={setPage}
            isLoading={isLoading}
            isError={isError}
            title="Users"
            onRefresh={refresh}
            hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
            onClearFilters={resetFilters}
            searchTerm={debouncedSearchQuery}
            emptyTitle="No users found"
            emptyDescription="No users found in the system. New user registrations will appear here."
            emptyIcon={Users}
            skeleton={<UserTableSkeleton />}
          />
        </div>
      </div>

      <UserActionsModal
        onClose={closeModal}
        onConfirm={executeAction}
        isOpen={modalState.isOpen}
        userName={modalState.userName}
        userRole={modalState.userRole}
        isActive={modalState.isActive}
        isLoading={modalState.isLoading}
        actionType={modalState.actionType}
      />
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
    props: { userData },
  };
};
