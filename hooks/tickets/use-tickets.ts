import axios from 'axios';
import { BASE_URL } from '@/utils/url';
import { CheckoutResponse, EventSalesData, TicketProps, TicketOrderSummary } from '@/types/interfaces/ticket';
import { EventProps } from '@/types/interfaces/event';

export async function checkoutTicket(params: {
  eventId: string;
  tierType: 'standard' | 'premium';
  buyerName: string;
  buyerEmail?: string;
}): Promise<CheckoutResponse> {
  const { data } = await axios.post(`${BASE_URL}/tickets/checkout`, params);
  return data.data;
}

export async function getTicketOrder(accessToken: string): Promise<{
  order: TicketOrderSummary;
  event: EventProps;
  tickets: TicketProps[];
}> {
  const { data } = await axios.get(`${BASE_URL}/tickets/order/${accessToken}`);
  return data.data;
}

export async function getEventSales(
  eventId: string,
  token: string
): Promise<EventSalesData> {
  const { data } = await axios.get(`${BASE_URL}/events/${eventId}/sales`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function verifyTicket(
  barcodePayload: string,
  token: string,
  eventId?: string
) {
  const { data } = await axios.post(
    `${BASE_URL}/tickets/verify`,
    { barcodePayload, eventId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data;
}

export function getTicketDownloadUrl(ticketId: string, accessToken: string): string {
  return `${BASE_URL}/tickets/${ticketId}/download?token=${accessToken}`;
}
