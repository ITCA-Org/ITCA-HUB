import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import {
  DashboardStats,
  UseDashboardOptions,
  RecentUsersResponse,
} from '@/types/interfaces/dashboard';

const fetchStats = async (url: string, token: string): Promise<DashboardStats> => {
  const { data } = await axios.get(`${BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    totalUsers: data.data.totalUsers,
    totalEvents: data.data.activeEvents,
    totalResources: data.data.resources,
    activeUsers: data.data.activeUsers,
  };
};

const fetchRecentUsers = async (
  url: string,
  token: string,
  page: number,
  limit: number
): Promise<RecentUsersResponse> => {
  const { data } = await axios.get(`${BASE_URL}${url}`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    data: data.data,
    total: data.total,
    pagination: {
      totalPages: data.pagination.totalPages,
    },
  };
};

const useDashboard = (options: UseDashboardOptions) => {
  const { token, page = 0, limit = 15 } = options;

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR(
    token ? ['/admin/stats'] : null,
    () => fetchStats('/admin/stats', token),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (error) => {
        const { message } = getErrorMessage(error);
        toast.error('Failed to load dashboard stats', {
          description: message,
          duration: 5000,
        });
      },
    }
  );

  const {
    data: recentUsersData,
    error: usersError,
    isLoading: usersLoading,
    mutate: mutateUsers,
  } = useSWR(
    token ? ['/users/recent', page, limit] : null,
    () => fetchRecentUsers('/users/recent', token, page + 1, limit),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (error) => {
        const { message } = getErrorMessage(error);
        toast.error('Failed to load recent registrations', {
          description: message,
          duration: 5000,
        });
      },
    }
  );

  return {
    stats: stats ?? {
      totalUsers: 0,
      totalEvents: 0,
      totalResources: 0,
      activeUsers: 0,
    },
    recentRegistrations: recentUsersData?.data ?? [],
    pagination: {
      total: recentUsersData?.total ?? 0,
      totalPages: recentUsersData?.pagination.totalPages ?? 0,
    },
    isLoading: statsLoading || usersLoading,
    statsLoading,
    usersLoading,
    isError: !!statsError || !!usersError,
    refreshUsers: () => mutateUsers(),
  };
};

export default useDashboard;
