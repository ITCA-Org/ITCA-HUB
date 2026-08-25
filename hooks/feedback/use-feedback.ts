import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

export type FeedbackStatus = 'new' | 'read' | 'archived';

export interface FeedbackItem {
  _id: string;
  fullName?: string;
  email?: string;
  organization: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UseFeedbackOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface FeedbackResponse {
  feedback: FeedbackItem[];
  total: number;
  totalPages: number;
}

const fetchFeedback = async (
  token: string,
  page: number,
  limit: number,
  search?: string,
  status?: string
): Promise<FeedbackResponse> => {
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

  const { data } = await axios.get(`${BASE_URL}/feedback`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    feedback: data.data,
    total: data.total,
    totalPages: data.pagination.totalPages,
  };
};

const useFeedback = (options: UseFeedbackOptions) => {
  const { token, page = 0, limit = 15, search, status } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/feedback', page, limit, search, status] : null,
    () => fetchFeedback(token, page, limit, search, status),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load feedback', {
          description: message,
          duration: 5000,
        });
      },
    }
  );

  const updateStatus = useCallback(
    async (id: string, nextStatus: FeedbackStatus) => {
      try {
        await axios.patch(
          `${BASE_URL}/feedback/${id}/status`,
          { status: nextStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Status updated');
        await mutate();
      } catch (err) {
        const { message } = getErrorMessage(err as Error);
        toast.error('Could not update status', { description: message });
      }
    },
    [token, mutate]
  );

  return {
    feedback: data?.feedback ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
    updateStatus,
  };
};

export default useFeedback;
