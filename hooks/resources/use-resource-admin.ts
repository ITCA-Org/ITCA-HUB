import { toast } from 'sonner';
import {
  CreateResourcePayload,
  ResourceAnalyticsData,
  UpdateResourcePayload,
  UseResourceAdminProps,
} from '@/types/interfaces/resource';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';

const useResourceAdmin = ({ token }: UseResourceAdminProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'itca-resources');

    try {
      const response = await axios.post(
        'https://jeetix-file-service.onrender.com/api/storage/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        return response.data.data.fileUrl;
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      throw new Error(`File upload failed: ${message}`);
    }
  }, []);

  const createResource = useCallback(
    async (payload: CreateResourcePayload) => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/resources`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          return response.data.data.resource;
        } else {
          throw new Error('Failed to create resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to create resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const updateResource = useCallback(
    async (resourceId: string, payload: UpdateResourcePayload) => {
      setIsLoading(true);
      try {
        const response = await axios.patch(`${BASE_URL}/resources/${resourceId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'success') {
          toast.success('Resource updated successfully');
          return response.data.data.resource;
        } else {
          throw new Error('Failed to update resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to update resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const toggleResourceTrash = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          const action = response.data.data.action;
          toast.success(action === 'deleted' ? 'Resource moved to trash' : 'Resource restored', {
            description:
              action === 'deleted'
                ? 'Resource can be restored from the recycle bin.'
                : 'Resource is now available in the main library.',
          });
          return response.data.data;
        } else {
          throw new Error('Failed to update resource status');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to update resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const batchToggleResourceTrash = useCallback(
    async (resourceIds: string[]) => {
      setIsLoading(true);
      try {
        const promises = resourceIds.map((resourceId) =>
          axios.patch(
            `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((result) => result.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} moved to recycle bin`, {
            description: failed > 0 ? `${failed} failed to delete` : undefined,
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to move resources to recycle bin');
        }

        return { successful, failed };
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to move resources to recycle bin', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const batchRestoreResources = useCallback(
    async (resourceIds: string[]) => {
      setIsLoading(true);
      try {
        const promises = resourceIds.map((resourceId) =>
          axios.patch(
            `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((result) => result.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} restored`, {
            description: failed > 0 ? `${failed} failed to restore` : undefined,
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to restore resources');
        }

        return { successful, failed };
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to restore resources', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteResourcePermanently = useCallback(
    async (resourceId: string) => {
      setIsLoading(true);
      try {
        await axios.delete(`${BASE_URL}/resources/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success('Resource permanently deleted', {
          description: 'This action cannot be undone.',
        });
        return true;
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to delete resource', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const batchDeleteResourcesPermanently = useCallback(
    async (resourceIds: string[]) => {
      setIsLoading(true);
      try {
        const promises = resourceIds.map((resourceId) =>
          axios.delete(`${BASE_URL}/resources/${resourceId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((result) => result.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} permanently deleted`, {
            description:
              failed > 0 ? `${failed} failed to delete` : 'This action cannot be undone.',
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to delete resources permanently');
        }

        return { successful, failed };
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to delete resources permanently', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteFileFromResource = useCallback(
    async (resourceId: string, fileUrlToDelete: string) => {
      setIsLoading(true);
      try {
        const currentResourceResponse = await axios.get(`${BASE_URL}/resources/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (currentResourceResponse.data.status !== 'success') {
          throw new Error('Failed to fetch current resource');
        }

        const currentFileUrls = currentResourceResponse.data.data.resource.fileUrls;
        const updatedFileUrls = currentFileUrls.filter((url: string) => url !== fileUrlToDelete);

        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}`,
          { fileUrls: updatedFileUrls },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          toast.success('File deleted successfully');
          return response.data.data.resource;
        } else {
          throw new Error('Failed to delete file');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to delete file', {
          description: message,
          duration: 5000,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getResourceAnalytics = useCallback(
    async (resourceId: string, signal?: AbortSignal): Promise<ResourceAnalyticsData | null> => {
      try {
        const response = await axios.get(`${BASE_URL}/resources/analytics/${resourceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal,
        });

        if (response.data.status === 'success') {
          return response.data.data;
        } else {
          throw new Error('Failed to get analytics data');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to load analytics', {
          description: message,
          duration: 5000,
        });
        throw error;
      }
    },
    [token]
  );

  return {
    isLoading,
    uploadFile,
    createResource,
    updateResource,
    toggleResourceTrash,
    getResourceAnalytics,
    batchRestoreResources,
    deleteFileFromResource,
    batchToggleResourceTrash,
    deleteResourcePermanently,
    batchDeleteResourcesPermanently,
  };
};

export default useResourceAdmin;
