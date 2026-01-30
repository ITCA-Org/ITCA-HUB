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

export interface EventsComponentProps {
  role: 'admin' | 'student';
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


export interface ViewEventModalProps {
  isOpen: boolean;
  eventId: string;
  onClose: () => void;
  role?: 'admin' | 'student';
  token: string;
}
