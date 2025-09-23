import { UserData } from './table';

export interface UseUsersProps {
  token: string;
}

export interface FetchUsersParams {
  page?: number;
  role?: string;
  limit?: number;
  search?: string;
  status?: string;
  signal?: AbortSignal;
}

export interface UsersData {
  users: UserData[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

export interface UseUsersReturn {
  isError: boolean;
  isLoading: boolean;
  usersData: UsersData;
  clearCache: () => void;
  fetchUsers: (params?: FetchUsersParams) => Promise<void>;
}
