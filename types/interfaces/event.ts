import { UserAuth } from '..';

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
  registrationRequired: boolean;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  signal?: AbortSignal;
}

export interface UseEventsProps {
  token: string;
}

export interface EventsComponentProps {
  role: 'admin' | 'student';
  userData: UserAuth;
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
  registrationRequired: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    schoolEmail: string;
  }>;
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
  role: 'admin' | 'student';
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onView?: (eventId: string) => void;
  onRegister?: (eventId: string) => Promise<void>;
  onUnregister?: (eventId: string) => Promise<void>;
}

export interface AdminEventsPageProps {
  userData: UserAuth;
}

export interface StudentEventsPageProps {
  userData: UserAuth;
}

export interface ViewEventModalProps {
  token: string;
  isOpen: boolean;
  eventId: string;
  onClose: () => void;
}
