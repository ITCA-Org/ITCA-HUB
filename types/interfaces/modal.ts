import { ActionType } from '..';
import { ReactNode } from 'react';
import { Resource } from './resource';
import { CreateEventData, EventProps } from './event';

export interface ModalState {
  userId: string;
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isLoading: boolean;
  actionType: ActionType;
}

export type UserActionModalType = 'delete' | 'changeRole' | 'toggleActivation';

export interface UserActionsModalProps {
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: UserActionModalType;
}

export interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventProps | null;
  onSave: (eventId: string, eventData: CreateEventData) => Promise<void>;
}

export interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEvent: CreateEventData) => Promise<void>;
}


export interface ResourceEditModalProps {
  isOpen: boolean;
  resource: Resource;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (updatedResource: Partial<Resource>) => Promise<void>;
}

export interface ResourceAnalyticsProps {
  token: string;
  isOpen?: boolean;
  resource: Resource;
  onClose: () => void;
}

export interface ResourceAnalyticsData {
  views: number;
  downloads: number;
  uniqueViewers: number;
  uniqueDownloaders: number;
  viewsByDay: Array<{
    date: string;
    count: number;
  }>;
  downloadsByDay: Array<{
    date: string;
    count: number;
  }>;
  resource: {
    _id: string;
    title: string;
    category: string;
    downloads: number;
    viewCount: number;
    fileUrls: string[];
    visibility: string;
    department: string;
    description: string;
    academicLevel: string;
  };
}

export interface ResourceAnalyticsResponse {
  status: string;
  data: ResourceAnalyticsData;
}

export interface DeleteResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  resourceCount: number;
  onConfirm: () => Promise<void>;
  mode?: 'delete' | 'restore' | 'permanent';
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalActionProps extends BaseModalProps {
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export interface ModalApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface ResourceModalActions {
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  onAnalytics: (resource: Resource) => void;
  onRestore?: (resource: Resource) => void;
}

export interface ConfirmationModalProps {
  title: string;
  isOpen: boolean;
  message: string;
  icon?: ReactNode;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  onClose: () => void;
  loadingText?: string;
  onConfirm: () => void;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
}
