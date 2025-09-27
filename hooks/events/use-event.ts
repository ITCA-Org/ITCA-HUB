import { toast } from 'sonner';
import {
  EventProps,
  UseEventsProps,
  GetEventsParams,
  CreateEventData,
} from '@/types/interfaces/event';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import useDebounce from '@/utils/debounce';
import { getErrorMessage } from '@/utils/error';
import { useState, useCallback, useRef } from 'react';
import { CustomError, ErrorResponseData } from '@/types';

const useEvents = ({ token }: UseEventsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isError, setIsError] = useState(false);
  const lastRequestRef = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 500;

  const requestCacheRef = useRef<Map<string, { data: { events: EventProps[]; pagination: Record<string, unknown>; total: number }; timestamp: number }>>(new Map());
  const activeRequestsRef = useRef<Map<string, Promise<{ events: EventProps[]; pagination: Record<string, unknown>; total: number }>>>(new Map());
  const CACHE_DURATION = 300000;

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  /**==============================================
   * Get all events with pagination and filtering.
   ==============================================*/
  const getAllEvents = useCallback(
    async (params: GetEventsParams = {}) => {
      const now = Date.now();
      if (now - lastRequestRef.current < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestRef.current))
        );
      }
      lastRequestRef.current = Date.now();

      const cacheKey = JSON.stringify({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status,
        search: debouncedSearchQuery.trim(),
      });

      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setIsLoading(false);
        setIsError(false);
        return cached.data;
      }

      const existingRequest = activeRequestsRef.current.get(cacheKey);
      if (existingRequest) {
        try {
          const data = await existingRequest;
          setIsLoading(false);
          setIsError(false);
          return data;
        } catch {
          if (params.signal?.aborted) return { events: [], pagination: {}, total: 0 };
          setIsError(true);
          setIsLoading(false);
          return { events: [], pagination: {}, total: 0 };
        }
      }

      setIsLoading(true);
      setIsError(false);

      const requestPromise = (async () => {
        try {
          const { data } = await axios.get(`${BASE_URL}/events`, {
            params: {
              page: params.page || 1,
              limit: params.limit || 10,
              ...(params.status && params.status !== 'all' && { status: params.status }),
              ...(debouncedSearchQuery.trim() && { search: debouncedSearchQuery.trim() }),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: params.signal,
          });

          const result = {
            events: data.data || [],
            pagination: data.pagination || {},
            total: data.total || 0,
          };

          requestCacheRef.current.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });

          setIsError(false);
          return result;
        } catch (error) {
          if (axios.isCancel(error)) {
            return {
              events: [],
              pagination: {},
              total: 0,
            };
          }

          setIsError(true);
          const { message } = getErrorMessage(
            error as AxiosError<ErrorResponseData> | CustomError | Error
          );

          toast.error('Failed to load events', {
            description: message,
            duration: 5000,
          });

          return {
            events: [],
            pagination: {},
            total: 0,
          };
        } finally {
          setIsLoading(false);
          activeRequestsRef.current.delete(cacheKey);
        }
      })();

      activeRequestsRef.current.set(cacheKey, requestPromise);

      try {
        const data = await requestPromise;
        if (!params.signal?.aborted) {
          setIsLoading(false);
          setIsError(false);
        }
        return data;
      } catch {
        if (!params.signal?.aborted) {
          setIsError(true);
          setIsLoading(false);
        }
        return { events: [], pagination: {}, total: 0 };
      }
    },
    [token, debouncedSearchQuery]
  );

  const createEvent = useCallback(
    async (eventData: CreateEventData, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.post(`${BASE_URL}/events`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!signal?.aborted) {
          toast.success('Event created successfully', {
            description: 'The event has been added to the system',
            duration: 4000,
          });

          requestCacheRef.current.clear();
          activeRequestsRef.current.clear();
        }

        return data.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to create event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const updateEvent = useCallback(
    async (eventId: string, eventData: Partial<CreateEventData>, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.put(`${BASE_URL}/events/${eventId}`, eventData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!signal?.aborted) {
          toast.success('Event updated successfully', {
            description: 'The event has been updated',
            duration: 4000,
          });

          requestCacheRef.current.clear();
          activeRequestsRef.current.clear();
        }

        return data.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to update event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteEvent = useCallback(
    async (eventId: string, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        await axios.delete(`${BASE_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!signal?.aborted) {
          toast.success('Event deleted successfully', {
            description: 'The event has been removed from the system',
            duration: 4000,
          });

          requestCacheRef.current.clear();
          activeRequestsRef.current.clear();
        }

        return true;
      } catch (error) {
        if (axios.isCancel(error)) {
          return false;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to delete event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const registerForEvent = useCallback(
    async (eventId: string, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.post(
          `${BASE_URL}/events/${eventId}/register`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal,
          }
        );

        if (!signal?.aborted) {
          toast.success('Successfully registered for event!', {
            description: 'You will receive updates about this event',
            duration: 4000,
          });

          requestCacheRef.current.clear();
          activeRequestsRef.current.clear();
        }

        return data.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to register for event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const unregisterFromEvent = useCallback(
    async (eventId: string, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.delete(`${BASE_URL}/events/${eventId}/register`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!signal?.aborted) {
          toast.success('Successfully unregistered from event!', {
            description: 'You will no longer receive updates about this event',
            duration: 4000,
          });

          requestCacheRef.current.clear();
          activeRequestsRef.current.clear();
        }

        return data.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to unregister from event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getEventById = useCallback(
    async (eventId: string, signal?: AbortSignal) => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get(`${BASE_URL}/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        setIsError(false);
        return data.data;
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load event', {
          description: message,
          duration: 5000,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const clearCache = useCallback(() => {
    requestCacheRef.current.clear();
    activeRequestsRef.current.clear();
  }, []);

  return {
    isError,
    isLoading,
    searchTerm,
    clearCache,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    setSearchTerm,
    registerForEvent,
    unregisterFromEvent,
    debouncedSearchQuery,
  };
};

export default useEvents;
