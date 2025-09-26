import { UserAuth } from '..';

export interface Resource {
  _id: string;
  title: string;
  category: string;
  downloads: number;
  viewCount: number;
  resourceId?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  fileUrls: string[];
  isDeleted: boolean;
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  description: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
  __v?: number;
}

export interface Pagination {
  total: number;
  limit: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ResourcesResponse {
  status: string;
  data: {
    message: string;
    resources: Resource[];
    pagination: Pagination;
  };
}

export interface SingleResourceResponse {
  status: string;
  data: {
    resourceId: string;
    message: string;
    resource: Resource;
  };
}

export interface UseResourcesProps {
  token: string;
}

export interface FetchResourcesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  category?: string;
  signal?: AbortSignal;
  includeDeleted?: boolean;
  sortOrder?: 'asc' | 'desc';
  visibility?: 'all' | 'admin';
  isIncrementalUpdate?: boolean;
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
}

export interface ResourceTableProps {
  page: number;
  total: number;
  token: string;
  limit: number;
  isError?: boolean;
  isLoading: boolean;
  searchTerm: string;
  totalPages: number;
  onRefresh: () => void;
  resources: Resource[];
  hasActiveFilters?: boolean;
  userRole: 'admin' | 'user';
  onClearFilters: () => void;
  mode?: 'default' | 'recycleBin';
  setPage: (page: number) => void;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onDeleteResource?: (resourceId: string, mode?: 'soft' | 'permanent') => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[], mode?: 'soft' | 'permanent') => Promise<boolean>;
}

export interface AdminResourcesPageProps {
  userData: UserAuth;
}

export interface StudentResourcesPageProps {
  userData: UserAuth;
}

export interface CreateResourcePayload {
  title: string;
  description: string;
  category:
    | 'lecture_note'
    | 'assignment'
    | 'past_papers'
    | 'tutorial'
    | 'textbook'
    | 'research_papers';
  fileUrls: string[];
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
  department: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
}

export interface UpdateResourcePayload {
  title?: string;
  description?: string;
  category?:
    | 'lecture_note'
    | 'assignment'
    | 'past_papers'
    | 'tutorial'
    | 'textbook'
    | 'research_papers';
  fileUrls?: string[];
  visibility?: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
  department?: 'computer_science' | 'information_systems' | 'telecommunications' | 'all';
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

export interface UseResourceAdminProps {
  token: string;
}

export interface ResourcesComponentProps {
  userData: UserAuth;
  role: 'admin' | 'student';
}

export interface RecycleBinPageProps {
  userData: UserAuth;
}

export interface ResourceUploaderProps {
  token: string;
  onUploadComplete?: (fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => void;
  onError?: (error: string) => void;
}

export interface UploadProgress {
  percentage: number;
  totalFiles: number;
  uploadedUrls: string[];
  currentFileName: string;
  currentFileIndex: number;
  phase: 'idle' | 'validating' | 'uploading' | 'creating' | 'failed';
}

export interface AdminResourceUploadPageProps {
  userData: UserAuth;
}

export interface UseResourceUploaderProps {
  token: string;
  onError?: ResourceUploaderProps['onError'];
  onUploadComplete?: ResourceUploaderProps['onUploadComplete'];
}

export interface UseResourceTableProps {
  token: string;
  onRefresh: () => void;
  resources: Resource[];
  userRole: 'admin' | 'user';
  mode?: 'default' | 'recycleBin';
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onDeleteResource?: (resourceId: string, mode?: 'soft' | 'permanent') => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[], mode?: 'soft' | 'permanent') => Promise<boolean>;
}

export interface AdminResourceViewPageProps {
  userData: UserAuth;
}

export interface StudentResourceViewPageProps {
  userData: UserAuth;
}

export interface ResourceViewerComponentProps {
  userData: UserAuth;
  role: 'admin' | 'student';
}

export interface FileItem {
  url: string;
  name: string;
  type: string;
}

export interface ResourceFilterSkeletonProps {
  role: 'admin' | 'student';
}

export interface UseResourcesReturn {
  isError: boolean;
  isLoading: boolean;
  resources: Resource[];
  pagination: Pagination;
  clearCache: () => void;
  isDownloading: boolean;
  downloadProgress: number;
  fetchFileMediaLink: (fileUrl: string) => Promise<string>;
  refreshResources: (params?: FetchResourcesParams) => void;
  fetchResources: (params?: FetchResourcesParams) => Promise<void>;
  fetchDeletedResources: (params?: FetchResourcesParams) => Promise<void>;
  trackDownload: (resourceId: string, role?: 'admin' | 'student') => Promise<void>;
  downloadResource: (resource: Resource, role?: 'admin' | 'student') => Promise<void>;
  fetchSingleResource: (resourceId: string, signal?: AbortSignal) => Promise<Resource | null>;
  downloadFile: (fileUrl: string, resourceId?: string, role?: 'admin' | 'student') => Promise<void>;
  trackView: (resourceId: string, role: 'admin' | 'student', signal?: AbortSignal) => Promise<void>;
}
