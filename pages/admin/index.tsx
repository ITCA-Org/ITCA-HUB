import { useState, FC } from 'react';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';
import Table from '@/components/dashboard/table/table';
import useDashboard from '@/hooks/dashboard/use-dashboard';
import { UserData, Column } from '@/types/interfaces/table';
import { User, Users, Calendar, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardStatsCard from '@/components/dashboard/layout/dashboard-stats-card';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const recentUsersColumns: Column[] = [
  { key: 'user', header: 'User' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Email Status' },
  { key: 'joined', header: 'Joined' },
];

interface AdminDashboardProps {
  userData: UserAuth;
}

const AdminDashboard: FC<AdminDashboardProps> = ({ userData }) => {
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const { stats, recentRegistrations, pagination, isLoading, isError, refreshUsers } = useDashboard(
    { token: userData.token, page, limit }
  );

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
      </>
    );
  };

  return (
    <DashboardLayout title="Admin Dashboard" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Dashboard"
          subtitle="Overview"
          description="Welcome to the ITCA Hub admin dashboard"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 mb-8">
        <DashboardStatsCard
          title="Total Users"
          isLoading={isLoading}
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Events"
          isLoading={isLoading}
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Resources"
          isLoading={isLoading}
          value={stats.totalResources}
          icon={<FileText className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Active Users"
          isLoading={isLoading}
          value={stats.activeUsers}
          icon={<PieChart className="h-6 w-6 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 pt-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Registrations</h2>
          <Table<UserData>
            page={page}
            limit={limit}
            setPage={setPage}
            isError={isError}
            emptyIcon={Users}
            isLoading={isLoading}
            total={pagination.total}
            onRefresh={refreshUsers}
            renderRow={renderUserRow}
            data={recentRegistrations}
            emptyTitle="No users found"
            title="Recent Registrations"
            columns={recentUsersColumns}
            totalPages={pagination.totalPages}
            keyExtractor={(user) => user._id!}
            skeleton={<UserTableSkeleton rows={5} />}
            emptyDescription="No users found in the system. New user registrations will appear here."
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

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
