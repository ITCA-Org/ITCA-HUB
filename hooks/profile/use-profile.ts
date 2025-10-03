import { toast } from 'sonner';
import {
  UseProfileProps,
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '@/types/interfaces/profile';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { useState, useEffect, useCallback } from 'react';
import { CustomError, ErrorResponseData } from '@/types';

const MIN_REQUEST_INTERVAL = 500;
const CACHE_DURATION = 300000;

const sharedCache = {
  data: null as UserProfile | null,
  timestamp: 0,
  activeRequest: null as Promise<UserProfile | null> | null,
  lastRequestTime: 0,
  subscribers: new Set<(data: UserProfile | null) => void>(),
};

const useProfile = ({ token }: UseProfileProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(sharedCache.data);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!sharedCache.data);

  /**=================================
   * Fetches user profile from API
   =================================*/
  const fetchProfile = useCallback(
    async (abortSignal?: AbortSignal, forceRefresh = false): Promise<UserProfile | null> => {
      const now = Date.now();

      if (!forceRefresh && sharedCache.data) {
        const age = now - sharedCache.timestamp;
        if (age < CACHE_DURATION) {
          setProfile(sharedCache.data);
          setIsLoading(false);
          setError(null);
          return sharedCache.data;
        }
      }

      if (sharedCache.activeRequest) {
        try {
          const data = await sharedCache.activeRequest;
          if (!abortSignal?.aborted && data) {
            setProfile(data);
            setIsLoading(false);
            setError(null);
          }
          return data;
        } catch (err) {
          if (axios.isCancel(err)) {
            setIsLoading(false);
            return null;
          }
          if (!abortSignal?.aborted) {
            setIsLoading(false);
          }
          throw err;
        }
      }

      const timeSinceLastRequest = now - sharedCache.lastRequestTime;
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
      }

      setIsLoading(true);
      setError(null);
      sharedCache.lastRequestTime = Date.now();

      const requestPromise = (async (): Promise<UserProfile | null> => {
        try {
          const { data } = await axios.get(`${BASE_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const profileData = data.data;

          sharedCache.data = profileData;
          sharedCache.timestamp = Date.now();

          sharedCache.subscribers.forEach((callback) => callback(profileData));

          return profileData;
        } catch (err) {
          const { message } = getErrorMessage(
            err as AxiosError<ErrorResponseData> | CustomError | Error
          );

          setError(message);
          setIsLoading(false);

          toast.error('Failed to load profile', {
            description: message,
            duration: 5000,
          });

          sharedCache.subscribers.forEach((callback) => callback(null));
          throw err;
        } finally {
          sharedCache.activeRequest = null;
        }
      })();

      sharedCache.activeRequest = requestPromise;

      try {
        const data = await requestPromise;
        if (!abortSignal?.aborted && data) {
          setProfile(data);
          setError(null);
          setIsLoading(false);
        }
        return data;
      } catch (err) {
        if (!abortSignal?.aborted) {
          setIsLoading(false);
        }
        throw err;
      }
    },
    [token]
  );

  /**================================
   * Updates user profile
   ================================*/
  const updateProfile = async (payload: UpdateProfilePayload) => {
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

      const updatedProfile = data.data;

      sharedCache.data = updatedProfile;
      sharedCache.timestamp = Date.now();

      setProfile(updatedProfile);
      sharedCache.subscribers.forEach((callback) => callback(updatedProfile));

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

  /**=========================
   * Changes user password
   =========================*/
  const changePassword = async (payload: ChangePasswordPayload) => {
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

  /**=========================================
   * Uploads profile image to Jeetix ONLY
   * Does not save to database
   =========================================*/
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
        'https://jeetix-file-service.onrender.com/api/storage/upload',
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

  /**===========================================================
   * Fetch profile when component mounts
   * Subscribe to shared cache updates
   ===========================================================*/
  useEffect(() => {
    const updateProfile = (data: UserProfile | null) => {
      setProfile(data);
      setIsLoading(false);
      if (data) {
        setError(null);
      }
    };

    sharedCache.subscribers.add(updateProfile);

    const abortController = new AbortController();
    fetchProfile(abortController.signal);

    return () => {
      sharedCache.subscribers.delete(updateProfile);
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    error,
    profile,
    isLoading,
    updateProfile,
    changePassword,
    uploadImageOnly,
    isUploadingImage,
    isUpdatingProfile,
    isChangingPassword,
    refetchProfile: fetchProfile,
  };
};

export default useProfile;
