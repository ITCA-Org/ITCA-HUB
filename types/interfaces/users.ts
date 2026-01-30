import { UserData } from './table';

export interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  totalPages: number;
}
