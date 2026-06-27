import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { TicketProps, CreateTicketData, ScanResult } from '@/types/interfaces/ticket';
import { EventProps } from '@/types/interfaces/event';

type ErrorType = AxiosError<ErrorResponseData> | CustomError | Error;

export interface UseTicketsOptions {
  token: string;
  eventId?: string;
  page?: number;
  limit?: number;
}

interface TicketsResponse {
  tickets: TicketProps[];
  total: number;
  totalPages: number;
}

async function fetchTickets(
  _url: string,
  token: string,
  eventId?: string,
  page?: number,
  limit?: number
): Promise<TicketsResponse> {
  const params: Record<string, string | number> = {
    page: (page ?? 0) + 1,
    limit: limit ?? 20,
  };
  if (eventId) params.eventId = eventId;

  const { data } = await axios.get(`${BASE_URL}/tickets`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    tickets: data.data || [],
    total: data.total || 0,
    totalPages: data.pagination?.totalPages || Math.ceil((data.total || 0) / (limit ?? 20)),
  };
}

const useTickets = (options: UseTicketsOptions) => {
  const { token, eventId, page = 0, limit = 20 } = options;

  const {
    data,
    error,
    isLoading,
    mutate: boundMutate,
  } = useSWR(
    token ? ['/tickets', eventId, page, limit] : null,
    () => fetchTickets('/tickets', token, eventId, page, limit),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        toast.error('Failed to load tickets', {
          description: getErrorMessage(err).message,
        });
      },
    }
  );

  return {
    tickets: data?.tickets ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => boundMutate(),
  };
};

const invalidateTicketsCache = () => {
  mutate((key) => Array.isArray(key) && key[0] === '/tickets', undefined, { revalidate: true });
};

export const useTicketActions = (token: string) => {
  const createTicket = useCallback(
    async (ticketData: CreateTicketData): Promise<TicketProps> => {
      if (!token) throw new Error('Not authenticated');

      if (ticketData.eventId) {
        try {
          const { data: eventData } = await axios.get(`${BASE_URL}/events/${ticketData.eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const event: EventProps = eventData.data;

          if (!event.requiresTicket) {
            const errMsg = 'This event does not require a ticket. Booking is not available.';
            toast.error('Booking unavailable', { description: errMsg });
            throw new Error(errMsg);
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('does not require a ticket')) {
            throw error;
          }
          toast.error('Failed to verify event', {
            description: getErrorMessage(error as ErrorType).message,
          });
          throw error;
        }
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/tickets`, ticketData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Ticket issued', {
          description: `Barcode: ${data.data?.barcode}`,
        });
        invalidateTicketsCache();
        return data.data;
      } catch (error) {
        toast.error('Failed to issue ticket', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const scanTicket = useCallback(
    async (barcode: string): Promise<ScanResult> => {
      if (!token) throw new Error('Not authenticated');
      try {
        const { data } = await axios.post(
          `${BASE_URL}/tickets/scan`,
          { barcode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        invalidateTicketsCache();
        return data.data as ScanResult;
      } catch (error) {
        toast.error('Scan failed', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const getTicketById = useCallback(
    async (ticketId: string): Promise<TicketProps> => {
      if (!token) throw new Error('Not authenticated');
      try {
        const { data } = await axios.get(`${BASE_URL}/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return data.data;
      } catch (error) {
        toast.error('Failed to load ticket', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const getTicketBarcode = useCallback(
    async (ticketId: string): Promise<Blob> => {
      if (!token) throw new Error('Not authenticated');
      const response = await axios.get(`${BASE_URL}/tickets/${ticketId}/barcode`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      return response.data;
    },
    [token]
  );

  const deleteTicket = useCallback(
    async (ticketId: string): Promise<boolean> => {
      if (!token) throw new Error('Not authenticated');
      try {
        await axios.delete(`${BASE_URL}/tickets/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Ticket deleted');
        invalidateTicketsCache();
        return true;
      } catch (error) {
        toast.error('Failed to delete ticket', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  return {
    createTicket,
    scanTicket,
    getTicketById,
    getTicketBarcode,
    deleteTicket,
  };
};

export default useTickets;
