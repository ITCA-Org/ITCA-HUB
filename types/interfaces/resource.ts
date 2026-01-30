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
  fileUrls: FileUpload[];
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

export interface UseResourceTableProps {
  resources: Resource[];
  userRole: 'admin' | 'user';
  onRefresh: () => void;
  mode?: 'default' | 'recycleBin';
  token: string;
  onDeleteResource?: (resourceId: string, mode?: 'soft' | 'permanent') => Promise<boolean>;
  onDeleteMultiple?: (resourceIds: string[], mode?: 'soft' | 'permanent') => Promise<boolean>;
  onRestoreResource?: (resourceId: string) => Promise<boolean>;
  onRestoreMultiple?: (resourceIds: string[]) => Promise<boolean>;
}


export interface FileUpload {
  fileName: string;
  filePath: string;
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
  fileUrls: FileUpload[];
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
  fileUrls?: FileUpload[];
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
    visibility: string;
    department: string;
    description: string;
    academicLevel: string;
    fileUrls: FileUpload[];
  };
}

export interface ResourcesComponentProps {
  role: 'admin' | 'student';
  token: string;
}

export interface ResourceUploaderProps {
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
  currentFileName: string;
  currentFileIndex: number;
  uploadedFiles: FileUpload[];
  phase: 'idle' | 'validating' | 'uploading' | 'creating' | 'failed';
}

export interface UseResourceUploaderProps {
  onError?: ResourceUploaderProps['onError'];
  onUploadComplete?: ResourceUploaderProps['onUploadComplete'];
}

export interface ResourceViewerComponentProps {
  role: 'admin' | 'student';
  token: string;
}

export interface FileItem {
  url: string;
  name: string;
  type: string;
}

export interface ResourceFilterSkeletonProps {
  role: 'admin' | 'student';
}

