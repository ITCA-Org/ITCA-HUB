import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UseNewsletterSubscribersOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface SubscribersResponse {
  subscribers: NewsletterSubscriber[];
  total: number;
  totalPages: number;
}

const fetchSubscribers = async (
  token: string,
  page: number,
  limit: number,
  search?: string,
  status?: string
): Promise<SubscribersResponse> => {
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (status && status !== 'all') {
    params.status = status;
  }

  const { data } = await axios.get(`${BASE_URL}/newsletter-subscribers`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    subscribers: data.data,
    total: data.total,
    totalPages: data.pagination.totalPages,
  };
};

const useNewsletterSubscribers = (options: UseNewsletterSubscribersOptions) => {
  const { token, page = 0, limit = 15, search, status } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/newsletter-subscribers', page, limit, search, status] : null,
    () => fetchSubscribers(token, page, limit, search, status),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load subscribers', {
          description: message,
          duration: 5000,
        });
      },
    }
  );

  return {
    subscribers: data?.subscribers ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export default useNewsletterSubscribers;
