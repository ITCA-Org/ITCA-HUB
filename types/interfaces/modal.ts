import { ActionType } from '..';
import { ReactNode } from 'react';
import { Resource, FileUpload } from './resource';
import { CreateEventData, EventProps } from './event';

export interface ModalState {
  userId: string;
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isActive?: boolean;
  isLoading: boolean;
  actionType: ActionType;
}

export type UserActionModalType = 'delete' | 'changeRole' | 'toggleActivation';

export interface UserActionsModalProps {
  isOpen: boolean;
  userName: string;
  userRole?: string;
  isActive?: boolean;
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

export interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export interface ResourceEditModalProps {
  isOpen: boolean;
  resource: Resource;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (updatedResource: Partial<Resource>) => Promise<void>;
}

export interface ResourceAnalyticsProps {
  isOpen?: boolean;
  resource: Resource;
  onClose: () => void;
  token: string;
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
    visibility: string;
    department: string;
    description: string;
    academicLevel: string;
    fileUrls: FileUpload[];
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
  mode?: 'soft' | 'restore' | 'permanent';
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalActionProps extends BaseModalProps {
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
}

export interface ModalApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status: 'success' | 'error';
}

export interface ResourceModalActions {
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
  onRestore?: (resource: Resource) => void;
  onAnalytics: (resource: Resource) => void;
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

export interface AddFilesModalProps {
  isOpen: boolean;
  resource: Resource;
  onClose: () => void;
  onFilesAdded: () => void;
  token: string;
}

export interface UploadProgress {
  totalFiles: number;
  percentage: number;
  currentFileName: string;
  currentFileIndex: number;
  uploadedFiles: FileUpload[];
  phase: 'idle' | 'uploading' | 'updating' | 'completed';
}

export interface DownloadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDownloading: boolean;
  downloadProgress: number;
  resource: Resource | null;
}
