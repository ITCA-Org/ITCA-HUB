import { JSX } from 'react';

export interface ErrorResponseData {
  message?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface UserAuth {
  role: string;
  token: string;
  userId: string;
  lastName: string | undefined;
  firstName: string | undefined;
  schoolEmail: string | undefined;
  profilePictureUrl: string | undefined;
}

export type UserProps = {
  userData: UserAuth;
};

export type NavItem = {
  name: string;
  href: string;
  icon: JSX.Element;
  children?: NavItem[];
};
export interface UseUserActionsProps {
  token: string;
  onUserUpdated: () => void;
}

export type ActionType = 'delete' | 'changeRole' | 'toggleActivation';

export interface AdminUsersPageProps {
  userData: UserAuth;
}

export interface CreateResourcePayload {
  title: string;
  category: string;
  fileUrls: string[];
  department: string;
  description: string;
  visibility: 'all' | 'admin';
  academicLevel: 'undergraduate' | 'postgraduate' | 'all';
}

export interface UpdateResourcePayload {
  title?: string;
  category?: string;
  department?: string;
  fileUrls?: string[];
  description?: string;
  visibility?: 'all' | 'admin';
  academicLevel?: 'undergraduate' | 'postgraduate' | 'all';
}
