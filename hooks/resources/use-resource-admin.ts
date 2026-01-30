import { useCallback } from 'react';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import {
  invalidateResourcesCache,
  invalidateDeletedResourcesCache,
  invalidateSingleResourceCache,
} from './use-resource';
import {
  CreateResourcePayload,
  UpdateResourcePayload,
  ResourceAnalyticsData,
  FileUpload,
} from '@/types/interfaces/resource';

type ErrorType = AxiosError<ErrorResponseData> | CustomError | Error;

export const useResourceActions = (token: string) => {

  const invalidateAllCaches = useCallback(() => {
    invalidateResourcesCache();
    invalidateDeletedResourcesCache();
    invalidateSingleResourceCache();
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'itca-resources');

    try {
      const response = await axios.post(
        'https://jeetix-file-service.onrender.com/api/storage/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status === 'success') {
        return response.data.data.fileUrl;
      }
      throw new Error('File upload failed');
    } catch (error) {
      const { message } = getErrorMessage(error as ErrorType);
      throw new Error(`File upload failed: ${message}`);
    }
  }, []);

  const createResource = useCallback(
    async (payload: CreateResourcePayload) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const response = await axios.post(`${BASE_URL}/resources`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'success') {
          toast.success('Resource created successfully');
          invalidateResourcesCache();
          return response.data.data.resource;
        }
        throw new Error('Failed to create resource');
      } catch (error) {
        toast.error('Failed to create resource', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const updateResource = useCallback(
    async (resourceId: string, payload: UpdateResourcePayload) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const response = await axios.patch(`${BASE_URL}/resources/${resourceId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'success') {
          toast.success('Resource updated successfully');
          invalidateResourcesCache();
          invalidateSingleResourceCache(resourceId);
          return response.data.data.resource;
        }
        throw new Error('Failed to update resource');
      } catch (error) {
        toast.error('Failed to update resource', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const toggleResourceTrash = useCallback(
    async (resourceId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === 'success') {
          const action = response.data.data.action;
          toast.success(action === 'deleted' ? 'Resource moved to trash' : 'Resource restored', {
            description:
              action === 'deleted'
                ? 'Resource can be restored from the recycle bin.'
                : 'Resource is now available in the main library.',
          });
          invalidateAllCaches();
          return response.data.data;
        }
        throw new Error('Failed to update resource status');
      } catch (error) {
        toast.error('Failed to update resource', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateAllCaches]
  );

  const batchToggleResourceTrash = useCallback(
    async (resourceIds: string[]) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const promises = resourceIds.map((resourceId) =>
          axios.patch(
            `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((r) => r.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} moved to recycle bin`, {
            description: failed > 0 ? `${failed} failed to delete` : undefined,
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to move resources to recycle bin');
        }

        invalidateAllCaches();
        return { successful, failed };
      } catch (error) {
        toast.error('Failed to move resources to recycle bin', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateAllCaches]
  );

  const batchRestoreResources = useCallback(
    async (resourceIds: string[]) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const promises = resourceIds.map((resourceId) =>
          axios.patch(
            `${BASE_URL}/resources/${resourceId}/trash-or-restore`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((r) => r.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} restored`, {
            description: failed > 0 ? `${failed} failed to restore` : undefined,
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to restore resources');
        }

        invalidateAllCaches();
        return { successful, failed };
      } catch (error) {
        toast.error('Failed to restore resources', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateAllCaches]
  );

  const deleteResourcePermanently = useCallback(
    async (resourceId: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        await axios.delete(`${BASE_URL}/resources/${resourceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Resource permanently deleted', {
          description: 'This action cannot be undone.',
        });
        invalidateAllCaches();
        return true;
      } catch (error) {
        toast.error('Failed to delete resource', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateAllCaches]
  );

  const batchDeleteResourcesPermanently = useCallback(
    async (resourceIds: string[]) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const promises = resourceIds.map((resourceId) =>
          axios.delete(`${BASE_URL}/resources/${resourceId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const responses = await Promise.allSettled(promises);
        const successful = responses.filter((r) => r.status === 'fulfilled').length;
        const failed = responses.length - successful;

        if (successful > 0) {
          toast.success(`${successful} resource${successful > 1 ? 's' : ''} permanently deleted`, {
            description: failed > 0 ? `${failed} failed to delete` : 'This action cannot be undone.',
          });
        }

        if (failed > 0 && successful === 0) {
          throw new Error('Failed to delete resources permanently');
        }

        invalidateAllCaches();
        return { successful, failed };
      } catch (error) {
        toast.error('Failed to delete resources permanently', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token, invalidateAllCaches]
  );

  const deleteFileFromResource = useCallback(
    async (resourceId: string, fileUrlToDelete: string) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const currentResponse = await axios.get(`${BASE_URL}/resources/${resourceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (currentResponse.data.status !== 'success') {
          throw new Error('Failed to fetch current resource');
        }

        const currentFileUrls = currentResponse.data.data.resource.fileUrls;
        const updatedFileUrls = currentFileUrls.filter(
          (fileItem: FileUpload) => fileItem.filePath !== fileUrlToDelete
        );

        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}`,
          { fileUrls: updatedFileUrls },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === 'success') {
          toast.success('File deleted successfully');
          invalidateSingleResourceCache(resourceId);
          return response.data.data.resource;
        }
        throw new Error('Failed to delete file');
      } catch (error) {
        toast.error('Failed to delete file', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const addFilesToResource = useCallback(
    async (resourceId: string, newFileUrls: FileUpload[]) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const currentResponse = await axios.get(`${BASE_URL}/resources/${resourceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (currentResponse.data.status !== 'success') {
          throw new Error('Failed to fetch current resource');
        }

        const currentFileUrls = currentResponse.data.data.resource.fileUrls;
        const updatedFileUrls = [...currentFileUrls, ...newFileUrls];

        const response = await axios.patch(
          `${BASE_URL}/resources/${resourceId}`,
          { fileUrls: updatedFileUrls },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === 'success') {
          toast.success('Files added successfully');
          invalidateSingleResourceCache(resourceId);
          return response.data.data.resource;
        }
        throw new Error('Failed to add files');
      } catch (error) {
        toast.error('Failed to add files', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  const getResourceAnalytics = useCallback(
    async (resourceId: string): Promise<ResourceAnalyticsData | null> => {
      if (!token) throw new Error('Not authenticated');

      try {
        const response = await axios.get(`${BASE_URL}/resources/analytics/${resourceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 'success') {
          return response.data.data;
        }
        throw new Error('Failed to get analytics data');
      } catch (error) {
        toast.error('Failed to load analytics', {
          description: getErrorMessage(error as ErrorType).message,
        });
        throw error;
      }
    },
    [token]
  );

  return {
    uploadFile,
    createResource,
    updateResource,
    toggleResourceTrash,
    addFilesToResource,
    getResourceAnalytics,
    batchRestoreResources,
    deleteFileFromResource,
    batchToggleResourceTrash,
    deleteResourcePermanently,
    batchDeleteResourcesPermanently,
  };
};

export default useResourceActions;
