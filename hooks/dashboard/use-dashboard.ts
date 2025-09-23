import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { UserData } from '@/types/interfaces/table';
import { useState, useRef, useCallback } from 'react';
import { CustomError, ErrorResponseData } from '@/types';
import { DashboardStats } from '@/types/interfaces/dashboard';

const MIN_REQUEST_INTERVAL = 500;

interface UseDashboardProps {
  token: string;
}

interface FetchDashboardParams {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

interface DashboardData {
  stats: DashboardStats;
  recentRegistrations: UserData[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

interface UseDashboardReturn {
  isError: boolean;
  isLoading: boolean;
  dashboardData: DashboardData;
  clearCache: () => void;
  fetchDashboardData: (params?: FetchDashboardParams) => Promise<void>;
}

const useDashboard = ({ token }: UseDashboardProps): UseDashboardReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalUsers: 0,
      totalEvents: 0,
      totalResources: 0,
      activeUsers: 0,
    },
    recentRegistrations: [],
    pagination: {
      total: 0,
      totalPages: 0,
    },
  });

  const lastRequestTime = useRef(0);
  const requestCache = useRef<Map<string, { data: DashboardData; timestamp: number }>>(new Map());
  const activeRequests = useRef<Map<string, Promise<DashboardData>>>(new Map());

  const clearCache = useCallback(() => {
    requestCache.current.clear();
    activeRequests.current.clear();
  }, []);

  const fetchDashboardData = useCallback(
    async (params: FetchDashboardParams = {}): Promise<void> => {
      const { page = 1, limit = 10, signal } = params;

      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
      }

      const cacheKey = JSON.stringify({ page, limit });
      const cached = requestCache.current.get(cacheKey);
      const CACHE_TTL = 30000;

      if (cached && now - cached.timestamp < CACHE_TTL) {
        setDashboardData(cached.data);
        setIsLoading(false);
        setIsError(false);
        return;
      }

      const existingRequest = activeRequests.current.get(cacheKey);
      if (existingRequest) {
        try {
          const data = await existingRequest;
          setDashboardData(data);
          setIsLoading(false);
          setIsError(false);
        } catch {
          if (signal?.aborted) return;
          setIsError(true);
          setIsLoading(false);
        }
        return;
      }

      const requestPromise = (async (): Promise<DashboardData> => {
        setIsLoading(true);
        setIsError(false);
        lastRequestTime.current = Date.now();

        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const [statsResponse, recentRegistrationsResponse] = await Promise.all([
            axios.get(`${BASE_URL}/admin/stats`, {
              headers,
              signal,
            }),
            axios.get(`${BASE_URL}/users/recent`, {
              params: { page, limit },
              headers,
              signal,
            }),
          ]);

          if (signal?.aborted) {
            throw new Error('Request aborted');
          }

          const data: DashboardData = {
            stats: {
              totalUsers: statsResponse.data.data.totalUsers,
              totalEvents: statsResponse.data.data.activeEvents,
              totalResources: statsResponse.data.data.resources,
              activeUsers: statsResponse.data.data.activeUsers,
            },
            recentRegistrations: recentRegistrationsResponse.data.data,
            pagination: {
              total: recentRegistrationsResponse.data.total,
              totalPages: recentRegistrationsResponse.data.pagination.totalPages,
            },
          };

          requestCache.current.set(cacheKey, {
            data,
            timestamp: Date.now(),
          });

          return data;
        } catch (error) {
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }

          const { message } = getErrorMessage(
            error as AxiosError<ErrorResponseData> | CustomError | Error
          );

          toast.error('Failed to load dashboard data', {
            description: message,
            duration: 5000,
          });

          throw error;
        } finally {
          activeRequests.current.delete(cacheKey);
        }
      })();

      activeRequests.current.set(cacheKey, requestPromise);

      try {
        const data = await requestPromise;
        if (!signal?.aborted) {
          setDashboardData(data);
          setIsLoading(false);
          setIsError(false);
        }
      } catch {
        if (!signal?.aborted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    },
    [token]
  );

  return {
    isError,
    isLoading,
    dashboardData,
    clearCache,
    fetchDashboardData,
  };
};

export default useDashboard;
