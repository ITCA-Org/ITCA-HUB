import { UserAuth } from '..';

export interface CreateEventData {
  title: string;
  date: string;
  time: string;
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
  title: string;
  description: string;
  date: string;
  time: string;
  toDate?: string;
  toTime?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  capacity: number;
  imageUrl?: string;
  registrationRequired: boolean;
  attendees: Array<{
    _id: string;
  }>;
  createdBy: {
    _id: string;
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
  onRegister?: (eventId: string) => Promise<void>;
  onUnregister?: (eventId: string) => Promise<void>;
}

export interface AdminEventsPageProps {
  userData: UserAuth;
}

export interface StudentEventsPageProps {
  userData: UserAuth;
}
