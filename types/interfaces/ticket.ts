export type TicketType = 'VIP' | 'Student';

export interface TicketProps {
  id: string;
  eventId: string;
  attendeeName: string;
  email: string;
  phoneNumber: string;
  ticketType: TicketType;
  barcode: string;
  scanned: boolean;
  scannedAt?: string;
  issuedAt: string;
}

export interface CreateTicketData {
  eventId: string;
  attendeeName: string;
  email?: string;
  phoneNumber: string;
  ticketType: TicketType;
}

export interface ScanResult {
  valid: boolean;
  alreadyScanned?: boolean;
  message: string;
  attendee?: string;
  event?: string;
  ticketType?: string;
  scannedAt?: string;
}
