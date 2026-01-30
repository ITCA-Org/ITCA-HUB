import { UserAuth } from '..';

export interface UserProfile {
  _id: string;
  __v: number;
  role: string;
  active: boolean;
  lastName: string;
  firstName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  schoolEmail: string;
  lastLoggedIn: string;
  isEmailVerified: boolean;
  profilePictureUrl?: string;
}

export interface UpdateProfilePayload {
  lastName?: string;
  firstName?: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

export interface ProfileComponentProps {
  role: 'admin' | 'student';
  token: string;
}

export interface AdminProfilePageProps {
  userData: UserAuth;
}

export interface StudentProfilePageProps {
  userData: UserAuth;
}
