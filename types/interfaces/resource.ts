import { UserAuth } from '..';

export interface Resource {
  _id: string;
  title: string;
  category: string;
  downloads: number;
  viewCount: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  fileUrls: string[];
  isDeleted: boolean;
  updatedBy?: string;
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
  includeDeleted?: boolean;
  sortOrder?: 'asc' | 'desc';
  visibility?: 'all' | 'admin';
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
  allResources: Resource[];
  userRole: 'admin' | 'user';
  onClearFilters: () => void;
  mode?: 'default' | 'recycleBin';
  setPage: (page: number) => void;
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
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
  role: 'admin' | 'student';
  userData: UserAuth;
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
  onUploadComplete?: ResourceUploaderProps['onUploadComplete'];
  onError?: ResourceUploaderProps['onError'];
}

export interface UseResourceTableProps {
  token: string;
  onRefresh: () => void;
  resources: Resource[];
  userRole: 'admin' | 'user';
  onDeleteResource?: (resourceId: string) => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[]) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
}

export interface AdminResourceViewPageProps {
  userData: UserAuth;
}

export interface StudentResourceViewPageProps {
  userData: UserAuth;
}
