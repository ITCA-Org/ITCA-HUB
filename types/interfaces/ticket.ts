export interface TicketOrderSummary {
  _id: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  amount: number;
  currency: string;
  tierType: 'standard' | 'premium';
  buyerName: string;
  buyerEmail: string;
  createdAt: string;
}

export interface TicketProps {
  _id: string;
  orderId: string;
  eventId: string;
  tierType: 'standard' | 'premium';
  tierLabel: string;
  ticketNumber: string;
  barcodePayload: string;
  holderName: string;
  holderEmail: string;
  status: 'active' | 'used' | 'cancelled';
  isCheckedIn?: boolean;
  pdfUrl?: string;
  usedAt?: string;
  createdAt: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentLink: string;
  accessToken: string;
  amount: number;
  currency: string;
  tierLabel: string;
}

export interface EventSalesData {
  eventId: string;
  eventTitle: string;
  totalRevenue: number;
  currency: string;
  ticketsSold: number;
  ticketsCheckedIn: number;
  capacity: number;
  remainingCapacity: number;
  tierBreakdown: Array<{
    count: number;
    revenue: number;
    label: string;
  }>;
  orders: Array<{
    _id: string;
    buyerName: string;
    buyerEmail: string;
    tierType: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface VerifyTicketResult {
  valid: boolean;
  message: string;
  isCheckedIn?: boolean;
  usedAt?: string;
  ticket?: {
    ticketNumber: string;
    holderName: string;
    tierLabel: string;
    event?: {
      title: string;
      date: string;
      location: string;
    };
  };
}
