import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth, UserProps } from '@/types';
import useDashboard from '@/hooks/dashboard/use-dashboard';
import { useState, useEffect, useCallback, FC } from 'react';
import UserTable from '@/components/dashboard/table/user-table';
import { Calendar, Users, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardStatsCard from '@/components/dashboard/layout/dashboard-stats-card';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const AdminDashboard: FC<UserProps> = ({ userData }) => {
  const { isError, isLoading, dashboardData, fetchDashboardData } = useDashboard({
    token: userData.token,
  });

  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const loadDashboardData = useCallback(
    (page: number, limit: number) => {
      const controller = new AbortController();
      fetchDashboardData({
        page,
        limit,
        signal: controller.signal,
      });
      return controller;
    },
    [fetchDashboardData]
  );

  useEffect(() => {
    const abortController = new AbortController();
    let isActive = true;

    const loadData = async () => {
      try {
        await fetchDashboardData({
          page,
          limit,
          signal: abortController.signal,
        });
      } catch (error) {
        if (isActive && !(error instanceof Error && error.name === 'AbortError')) {
          console.error('Failed to fetch dashboard data:', error);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [fetchDashboardData, page, limit]);

  return (
    <DashboardLayout title="Admin Dashboard" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Dashboard"
          subtitle="Overview"
          description="Welcome to the ITCA Hub admin dashboard"
        />
      </div>
      {/*==================== End of Page Header ====================*/}

      {/*==================== Stats Cards ====================*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 mb-8">
        <DashboardStatsCard
          title="Total Users"
          isLoading={isLoading}
          value={dashboardData.stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Events"
          isLoading={isLoading}
          value={dashboardData.stats.totalEvents}
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Resources"
          isLoading={isLoading}
          value={dashboardData.stats.totalResources}
          icon={<FileText className="h-6 w-6 text-blue-500" />}
        />
        <DashboardStatsCard
          title="Active Users"
          isLoading={isLoading}
          value={dashboardData.stats.activeUsers}
          icon={<PieChart className="h-6 w-6 text-blue-500" />}
        />
      </div>
      {/*==================== End of Stats Cards ====================*/}

      {/*==================== Recent Users Table ====================*/}
      <div className="grid grid-cols-1 gap-6 pt-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Registrations</h2>
          <UserTable
            page={page}
            limit={limit}
            isError={isError}
            setPage={setPage}
            setLimit={setLimit}
            showActions={false}
            isLoading={isLoading}
            token={userData.token}
            total={dashboardData.pagination.total}
            users={dashboardData.recentRegistrations}
            totalPages={dashboardData.pagination.totalPages}
            onUserUpdated={() => loadDashboardData(page, limit)}
          />
        </div>
      </div>
      {/*==================== End of Recent Users Table ====================*/}
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
