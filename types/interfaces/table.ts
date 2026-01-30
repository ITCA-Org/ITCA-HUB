import { LucideIcon } from 'lucide-react';

export interface UserData {
  _id?: string;
  name: string;
  role: string;
  lastName: string;
  createdAt: string;
  firstName: string;
  isActive?: boolean;
  joinedDate: string;
  schoolEmail: string;
  isEmailVerified?: boolean;
}

export interface Column {
  key: string;
  header: string;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column[];
  keyExtractor: (item: T) => string;
  renderRow: (item: T, index: number) => React.ReactNode;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  title?: string;
  onRefresh?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  searchTerm?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  skeleton?: React.ReactNode;
  selectable?: boolean;
  selectedItems?: Record<string, boolean>;
  onSelectItem?: (item: T, event: React.MouseEvent) => void;
  onSelectAll?: () => void;
  selectedCount?: number;
  onClearSelection?: () => void;
  selectionActions?: React.ReactNode;
  onRowClick?: (item: T, event: React.MouseEvent) => void;
  onRowDoubleClick?: (item: T, event: React.MouseEvent) => void;
}
