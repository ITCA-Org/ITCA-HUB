import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState, FC } from 'react';
import { NextApiRequest } from 'next';
import { UserAuth } from '@/types';
import Table from '@/components/dashboard/table/table';
import useDashboard from '@/hooks/dashboard/use-dashboard';
import { UserData, Column } from '@/types/interfaces/table';
import { User, Users, Calendar, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardStatsCard from '@/components/dashboard/layout/dashboard-stats-card';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { requireAdminAuth } from '@/utils/auth';

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4E6F2] text-[#005080]">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-normal text-gray-900">{userName}</div>
              <div className="text-sm text-gray-500">{user.schoolEmail}</div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
          {user.role.toLowerCase() === 'user' ? 'Student' : 'Admin'}
        </td>
        <td className="whitespace-nowrap px-8 py-4">
          {user.isEmailVerified ? (
            <span className="inline-flex px-2 py-2 text-sm font-medium rounded-md bg-green-100 text-green-600">
              Verified
            </span>
          ) : (
            <span className="inline-flex px-2 py-2 text-sm font-medium rounded-md bg-red-100/70 text-red-600">
              Unverified
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
          {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}
        </td>
      </>
    );
  };

  return (
    <DashboardLayout title="Admin Dashboard" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Workspace"
          subtitle="Overview"
          description="A little oversight. A lot of possibility. Here is what is happening across your community."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <section
        aria-label="Quick actions"
        className="mb-8 grid gap-6 overflow-hidden rounded-3xl bg-[#D4E6F2] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div>
          <p className="landing-mono mb-3 text-[10px] uppercase tracking-[0.16em] text-[#005080]">
            Keep the community moving
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0A1628]">
            Make room for <span className="landing-serif font-normal italic">what is next.</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#0A1628]/65">
            Plan the next event, share learning materials, or check in on your members.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events"
            className="inline-flex min-h-11 items-center rounded-full bg-[#0A1628] px-5 py-3 text-sm font-semibold text-[#FF6A00] hover:brightness-125"
          >
            Manage events{' '}
            <ArrowUpRight aria-hidden="true" className="ml-2 inline-block h-4 w-4 shrink-0" />
          </Link>
          <Link
            href="/admin/resources/upload"
            className="inline-flex min-h-11 items-center rounded-full border border-[#0A1628]/20 px-5 py-3 text-sm font-medium text-[#0A1628] hover:bg-white/50"
          >
            Upload resources{' '}
            <ArrowUpRight aria-hidden="true" className="ml-2 inline-block h-4 w-4 shrink-0" />
          </Link>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
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
  return requireAdminAuth(req);
};
