import { toast } from 'sonner';
import {
  UsersData,
  UseUsersProps,
  UseUsersReturn,
  FetchUsersParams,
} from '@/types/interfaces/users';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { useState, useRef, useCallback } from 'react';
import { CustomError, ErrorResponseData } from '@/types';

const MIN_REQUEST_INTERVAL = 500;

const useUsers = ({ token }: UseUsersProps): UseUsersReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [usersData, setUsersData] = useState<UsersData>({
    users: [],
    pagination: {
      total: 0,
      totalPages: 0,
    },
  });

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const lastRequestTime = useRef(0);
  const requestCache = useRef<Map<string, { data: UsersData; timestamp: number }>>(new Map());
  const activeRequests = useRef<Map<string, Promise<UsersData>>>(new Map());

  const clearCache = useCallback(() => {
    requestCache.current.clear();
    activeRequests.current.clear();
  }, []);

  const fetchUsers = useCallback(
    async (params: FetchUsersParams = {}): Promise<void> => {
      const { page = 1, limit = 15, search, role, status, signal } = params;

      setIsLoading(true);

      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
      }

      const cacheKey = JSON.stringify({
        page,
        limit,
        search: search?.trim() || '',
        role: role !== 'all' ? role : '',
        status: status !== 'all' ? status : '',
      });

      const cached = requestCache.current.get(cacheKey);

      if (cached && now - cached.timestamp < 300000) {
        setUsersData(cached.data);
        setIsLoading(false);
        setIsError(false);
        return;
      }

      const existingRequest = activeRequests.current.get(cacheKey);
      if (existingRequest) {
        try {
          const data = await existingRequest;
          setUsersData(data);
          setIsLoading(false);
          setIsError(false);
        } catch {
          if (signal?.aborted) return;
          setIsError(true);
          setIsLoading(false);
        }
        return;
      }

      const requestPromise = (async (): Promise<UsersData> => {
        setIsLoading(true);
        setIsError(false);
        lastRequestTime.current = Date.now();

        try {
          const queryParams: Record<string, string | number | boolean> = {
            page: Number(page),
            limit: Number(limit),
          };

          if (search?.trim()) {
            queryParams.search = search.trim();
          }

          if (role && role !== 'all') {
            queryParams.role = role === 'student' ? 'user' : role;
          }

          if (status && status !== 'all') {
            queryParams.isEmailVerified = status === 'verified';
          }

          const { data } = await axios.get(`${BASE_URL}/users`, {
            params: queryParams,
            headers: {
              Authorization: `Bearer ${tokenRef.current}`,
            },
            signal,
          });

          if (signal?.aborted) {
            throw new Error('Request aborted');
          }

          const userData: UsersData = {
            users: data.data,
            pagination: {
              total: data.total,
              totalPages: data.pagination.totalPages,
            },
          };

          requestCache.current.set(cacheKey, {
            data: userData,
            timestamp: Date.now(),
          });

          return userData;
        } catch (error) {
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }

          const { message } = getErrorMessage(
            error as AxiosError<ErrorResponseData> | CustomError | Error
          );

          toast.error('Failed to load users', {
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
          setUsersData(data);
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
    []
  );

  return {
    isError,
    isLoading,
    usersData,
    clearCache,
    fetchUsers,
  };
};

export default useUsers;
