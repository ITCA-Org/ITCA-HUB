import { toast } from 'sonner';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { BASE_URL, JEETIX_BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { backendFetcher } from '@/lib/fetcher';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '@/types/interfaces/profile';

const PROFILE_KEY = '/users/profile';

const useProfile = (token: string) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: profile, error, isLoading } = useSWR<UserProfile>(
    token ? [PROFILE_KEY] : null,
    () => backendFetcher<UserProfile>(PROFILE_KEY, token),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!token) return;

    setIsUpdatingProfile(true);

    try {
      if (payload.firstName && (payload.firstName.length < 2 || payload.firstName.length > 50)) {
        throw new Error('First name must be between 2-50 characters');
      }
      if (payload.lastName && (payload.lastName.length < 2 || payload.lastName.length > 50)) {
        throw new Error('Last name must be between 2-50 characters');
      }

      const cleanPayload: UpdateProfilePayload = {};
      if (payload.firstName?.trim()) cleanPayload.firstName = payload.firstName.trim();
      if (payload.lastName?.trim()) cleanPayload.lastName = payload.lastName.trim();
      if (payload.profilePictureUrl?.trim())
        cleanPayload.profilePictureUrl = payload.profilePictureUrl.trim();

      const { data } = await axios.put(`${BASE_URL}/users/profile`, cleanPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      mutate([PROFILE_KEY], data.data, false);

      toast.success('Profile updated successfully', {
        description: 'Your profile information has been updated.',
        duration: 4000,
      });
    } catch (err) {
      const { message } = getErrorMessage(
        err as AxiosError<ErrorResponseData> | CustomError | Error
      );

      toast.error('Failed to update profile', {
        description: message,
        duration: 5000,
      });
      throw err;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    if (!token) return;

    setIsChangingPassword(true);

    try {
      if (payload.newPassword.length < 6 || payload.newPassword.length > 128) {
        throw new Error('Password must be between 6-128 characters');
      }

      const hasUppercase = /[A-Z]/.test(payload.newPassword);
      const hasLowercase = /[a-z]/.test(payload.newPassword);
      const hasNumber = /\d/.test(payload.newPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(payload.newPassword);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        throw new Error(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        );
      }

      if (payload.newPassword !== payload.confirmPassword) {
        throw new Error('New password and confirmation password do not match');
      }

      await axios.post(
        `${BASE_URL}/users/change-password`,
        {
          currentPassword: payload.currentPassword,
          newPassword: payload.newPassword,
          confirmPassword: payload.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully', {
        description: 'Your password has been updated.',
        duration: 4000,
      });
    } catch (err) {
      const { message } = getErrorMessage(
        err as AxiosError<ErrorResponseData> | CustomError | Error
      );

      toast.error('Failed to change password', {
        description: message,
        duration: 5000,
      });
      throw err;
    } finally {
      setIsChangingPassword(false);
    }
  };

  const uploadImageOnly = async (file: File) => {
    setIsUploadingImage(true);

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image file size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'itca-profiles');

      const { data } = await axios.post(
        `${JEETIX_BASE_URL}/api/storage/upload`,
        formData
      );

      if (data.status !== 'success' || !data.data?.fileUrl) {
        throw new Error('Failed to upload image');
      }

      toast.success('Image uploaded! Click "Save Changes" to update your profile');
      return data.data.fileUrl;
    } catch (err) {
      const { message } = getErrorMessage(
        err as AxiosError<ErrorResponseData> | CustomError | Error
      );

      toast.error('Failed to upload image', {
        description: message,
        duration: 5000,
      });
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const refetchProfile = () => {
    if (token) {
      mutate([PROFILE_KEY]);
    }
  };

  return {
    profile: profile ?? null,
    error: error ? getErrorMessage(error).message : null,
    isLoading,
    updateProfile,
    changePassword,
    uploadImageOnly,
    isUploadingImage,
    isUpdatingProfile,
    isChangingPassword,
    refetchProfile,
  };
};

export default useProfile;
