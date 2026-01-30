import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { UserData } from '@/types/interfaces/table';

export interface UseUsersOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

interface UsersResponse {
  users: UserData[];
  total: number;
  totalPages: number;
}

const fetchUsers = async (
  url: string,
  token: string,
  page: number,
  limit: number,
  search?: string,
  role?: string,
  status?: string
): Promise<UsersResponse> => {
  const params: Record<string, string | number | boolean> = {
    page: page + 1,
    limit,
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (role && role !== 'all') {
    params.role = role === 'student' ? 'user' : role;
  }

  if (status && status !== 'all') {
    params.isEmailVerified = status === 'verified';
  }

  const { data } = await axios.get(`${BASE_URL}${url}`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    users: data.data,
    total: data.total,
    totalPages: data.pagination.totalPages,
  };
};

const useUsers = (options: UseUsersOptions) => {
  const { token, page = 0, limit = 15, search, role, status } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/users', page, limit, search, role, status] : null,
    () => fetchUsers('/users', token, page, limit, search, role, status),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load users', {
          description: message,
          duration: 5000,
        });
      },
    }
  );

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export default useUsers;
