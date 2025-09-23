import axios from 'axios';
import { toast } from 'sonner';
import { NextApiRequest } from 'next';
import { BASE_URL } from '@/utils/url';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth, UserProps } from '@/types';
import { useState, useEffect, useCallback, FC } from 'react';
import { DashboardStats } from '@/types/interfaces/dashboard';
import UserTable from '@/components/dashboard/table/user-table';
import { Calendar, Users, FileText, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardStatsCard from '@/components/dashboard/layout/dashboard-stats-card';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const AdminDashboard: FC<UserProps> = ({ userData }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalResources: 0,
    activeUsers: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isError, setIsError] = useState(false);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchDashboardData = useCallback(
    async (page: number, limit: number) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const headers = {
          Authorization: `Bearer ${userData.token}`,
        };

        const [stats, recentRegistrations] = await Promise.all([
          axios.get(`${BASE_URL}/admin/stats`, {
            headers,
          }),
          axios.get(`${BASE_URL}/users/recent`, {
            params: { page, limit },
            headers,
          }),
        ]);

        setStats({
          totalUsers: stats.data.data.totalUsers,
          totalEvents: stats.data.data.activeEvents,
          totalResources: stats.data.data.resources,
          activeUsers: stats.data.data.activeUsers,
        });
        setRecentRegistrations(recentRegistrations.data.data);
        setTotal(recentRegistrations.data.total);
        setTotalPages(recentRegistrations.data.pagination.totalPages);
      } catch (error) {
        setIsError(true);

        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'An error occurred';

        toast.error('Failed to load data', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [userData.token]
  );

  useEffect(() => {
    fetchDashboardData(page, limit);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatsCard
          title="Total Users"
          isLoading={isLoading}
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <DashboardStatsCard
          title="Events"
          isLoading={isLoading}
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
        />
        <DashboardStatsCard
          title="Resources"
          isLoading={isLoading}
          value={stats.totalResources}
          icon={<FileText className="h-6 w-6 text-green-500" />}
        />
        <DashboardStatsCard
          title="Active Users"
          isLoading={isLoading}
          value={stats.activeUsers}
          icon={<PieChart className="h-6 w-6 text-purple-500" />}
        />
      </div>
      {/*==================== End of Stats Cards ====================*/}

      {/*==================== Recent Users Table ====================*/}
      <div className="grid grid-cols-1 gap-6 pt-4">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <UserTable
            page={page}
            limit={limit}
            total={total}
            isError={isError}
            setPage={setPage}
            setLimit={setLimit}
            isLoading={isLoading}
            token={userData.token}
            totalPages={totalPages}
            users={recentRegistrations}
            onUserUpdated={() => fetchDashboardData(page, limit)}
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
