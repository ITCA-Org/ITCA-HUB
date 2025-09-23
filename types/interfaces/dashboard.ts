import { ReactNode } from 'react';
import { UserData } from './table';

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  token?: string;
}

export interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  token?: string;
}

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  showPulse?: boolean;
  actions?: ReactNode;
  description?: string;
  titleColors?: {
    primary: string;
    secondary: string;
  };
  leftActions?: React.ReactNode;
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalResources: number;
  activeUsers: number;
}

export interface DashboardStatsCardProps {
  title: string;
  icon: ReactNode;
  isLoading?: boolean;
  value: string | number;
  valueClassName?: string;
}

export interface UseDashboardProps {
  token: string;
}

export interface FetchDashboardParams {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface DashboardData {
  stats: DashboardStats;
  recentRegistrations: UserData[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

export interface UseDashboardReturn {
  isError: boolean;
  isLoading: boolean;
  dashboardData: DashboardData;
  clearCache: () => void;
  fetchDashboardData: (params?: FetchDashboardParams) => Promise<void>;
}
