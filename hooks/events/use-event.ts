import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { EventProps, CreateEventData } from '@/types/interfaces/event';

type ErrorType = AxiosError<ErrorResponseData> | CustomError | Error;

export interface UseEventsOptions {
  token: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

interface EventsResponse {
  events: EventProps[];
  total: number;
  totalPages: number;
}

async function fetchEvents(
  _url: string,
  token: string,
  page: number,
  limit: number,
  status?: string,
  search?: string
): Promise<EventsResponse> {
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };

  if (status && status !== 'all') {
    params.status = status;
  }

  if (search?.trim()) {
    params.search = search.trim();
  }

  const { data } = await axios.get(`${BASE_URL}/events`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    events: data.data || [],
    total: data.total || 0,
    totalPages: data.pagination?.totalPages || Math.ceil((data.total || 0) / limit),
  };
}

const useEvents = (options: UseEventsOptions) => {
  const { token, page = 0, limit = 9, status, search } = options;

  const { data, error, isLoading, mutate: boundMutate } = useSWR(
    token ? ['/events', page, limit, status, search] : null,
    () => fetchEvents('/events', token, page, limit, status, search),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        toast.error('Failed to load events', {
          description: getErrorMessage(err).message,
        });
      },
    }
  );

  return {
    events: data?.events ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => boundMutate(),
  };
};

export const useEventActions = (token: string) => {
  const invalidateEventsCache = useCallback(() => {
    mutate(
      (key) => Array.isArray(key) && key[0] === '/events',
      undefined,
      { revalidate: true }
    );
  }, []);

  const createEvent = useCallback(
    async (eventData: CreateEventData) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const { data } = await axios.post(`${BASE_URL}/events`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Event created successfully', {
          description: 'The event has been added to the system',
        });

        invalidateEventsCache();
        return data.data;
      } catch (error) {
        toast.error('Failed to create event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateEventsCache]
  );

  const updateEvent = useCallback(
    async (eventId: string, eventData: Partial<CreateEventData>) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const { data } = await axios.put(`${BASE_URL}/events/${eventId}`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Event updated successfully', {
          description: 'The event has been updated',
        });

        invalidateEventsCache();
        return data.data;
      } catch (error) {
        toast.error('Failed to update event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateEventsCache]
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        await axios.delete(`${BASE_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Event deleted successfully', {
          description: 'The event has been removed from the system',
        });

        invalidateEventsCache();
        return true;
      } catch (error) {
        toast.error('Failed to delete event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateEventsCache]
  );

  const registerForEvent = useCallback(
    async (eventId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const { data } = await axios.post(
          `${BASE_URL}/events/${eventId}/register`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Successfully registered for event!', {
          description: 'You will receive updates about this event',
        });

        invalidateEventsCache();
        return data.data;
      } catch (error) {
        toast.error('Failed to register for event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateEventsCache]
  );

  const unregisterFromEvent = useCallback(
    async (eventId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const { data } = await axios.delete(`${BASE_URL}/events/${eventId}/register`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Successfully unregistered from event!', {
          description: 'You will no longer receive updates about this event',
        });

        invalidateEventsCache();
        return data.data;
      } catch (error) {
        toast.error('Failed to unregister from event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateEventsCache]
  );

  const getEventById = useCallback(
    async (eventId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const { data } = await axios.get(`${BASE_URL}/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data.data;
      } catch (error) {
        toast.error('Failed to load event', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    registerForEvent,
    unregisterFromEvent,
  };
};

export default useEvents;
