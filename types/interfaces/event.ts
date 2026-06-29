export interface TicketTier {
  type: 'standard' | 'premium';
  enabled: boolean;
  label: string;
  price: number;
  benefits?: string;
  quantityLimit?: number | null;
}

export interface CreateEventData {
  date: string;
  time: string;
  title: string;
  toDate?: string;
  toTime?: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  description: string;
  ticketingEnabled: boolean;
  ticketTiers?: TicketTier[];
}

export interface EventsComponentProps {
  role: 'admin';
  token: string;
  userId: string;
}

export interface EventProps {
  _id: string;
  date: string;
  time: string;
  title: string;
  toDate?: string;
  toTime?: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  description: string;
  ticketingEnabled: boolean;
  ticketTiers?: TicketTier[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventCardProps {
  event: EventProps;
  currentUserId?: string;
  role: 'admin';
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onView?: (eventId: string) => void;
}

export interface ViewEventModalProps {
  isOpen: boolean;
  eventId: string;
  onClose: () => void;
  role?: 'admin';
  token: string;
}

export const DEFAULT_TICKET_TIERS: TicketTier[] = [
  { type: 'standard', enabled: false, label: 'Standard', price: 0 },
  { type: 'premium', enabled: false, label: 'Premium', price: 0, benefits: '' },
];
