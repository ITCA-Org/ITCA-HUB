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

export interface UserTableProps {
  page: number;
  limit: number;
  token: string;
  total?: number;
  setPage: Function;
  isError?: boolean;
  setLimit: Function;
  totalPages: number;
  users?: UserData[];
  isLoading?: boolean;
  showActions?: boolean;
  onUserUpdated: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}
