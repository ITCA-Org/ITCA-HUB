import JSZip from 'jszip';
import { toast } from 'sonner';
import {
  Resource,
  Pagination,
  UseResourcesProps,
  ResourcesResponse,
  SingleResourceResponse,
  FetchResourcesParams,
} from '@/types/interfaces/resource';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import useDebounce from '@/utils/debounce';
import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';

const useResources = ({ token }: UseResourcesProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 10,
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  const fetchResources = useCallback(
    async (params: FetchResourcesParams = {}) => {
      const {
        category,
        page = 0,
        limit = 10,
        department,
        visibility,
        academicLevel,
        sortOrder = 'desc',
        sortBy = 'createdAt',
        includeDeleted = false,
      } = params;

      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await axios.get<ResourcesResponse>(`${BASE_URL}/resources`, {
          params: {
            page: page.toString(),
            limit: limit.toString(),
            ...(debouncedSearchQuery?.trim() && { search: debouncedSearchQuery.trim() }),
            ...(category && category !== 'all' && { category }),
            ...(visibility && { visibility }),
            ...(academicLevel && academicLevel !== 'all' && { academicLevel }),
            ...(department && department !== 'all' && { department }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (data.status === 'success') {
          let filteredResources = data.data.resources;

          if (!includeDeleted) {
            filteredResources = filteredResources.filter(
              (resource: Resource) => !resource.isDeleted
            );
          }

          setResources(filteredResources);
          setPagination((prev) => ({
            ...prev,
            ...data.data.pagination,
          }));
          setIsError(false);
        } else {
          throw new Error('Failed to fetch resources');
        }
      } catch (error) {
        setIsError(true);
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load resources', {
          description: message,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token, debouncedSearchQuery]
  );

  const fetchSingleResource = useCallback(
    async (resourceId: string): Promise<Resource | null> => {
      try {
        const response = await axios.get<SingleResourceResponse>(
          `${BASE_URL}/resources/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          const resource = response.data.data.resource;
          return {
            ...resource,
            _id: resource.resourceId || resource._id,
          };
        } else {
          throw new Error('Failed to fetch resource');
        }
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to fetch resource', {
          description: message,
          duration: 5000,
        });
        return null;
      }
    },
    [token]
  );

  const trackView = useCallback(
    async (resourceId: string) => {
      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-view/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        console.warn('Failed to track resource view:', message);
      }
    },
    [token]
  );

  const trackDownload = useCallback(
    async (resourceId: string) => {
      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-download/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        console.warn('Failed to track resource download:', message);
      }
    },
    [token]
  );

  const downloadResource = useCallback(
    async (resource: Resource) => {
      try {
        await trackDownload(resource._id);

        if (resource.fileUrls.length === 1) {
          window.open(resource.fileUrls[0], '_blank');
          return;
        }

        const zip = new JSZip();
        const promises = resource.fileUrls.map(async (fileUrl, index) => {
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const fileName = fileUrl.split('/').pop() || `file_${index + 1}`;
          zip.file(fileName, blob);
        });

        await Promise.all(promises);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);

        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = `${resource.title}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(zipUrl);
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to download resource', {
          description: message,
          duration: 5000,
        });
      }
    },
    [trackDownload]
  );

  const downloadFile = useCallback(
    async (fileUrl: string, resourceId?: string) => {
      try {
        if (resourceId) {
          await trackDownload(resourceId);
        }
        window.open(fileUrl, '_blank');
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to download file', {
          description: message,
          duration: 5000,
        });
      }
    },
    [trackDownload]
  );

  const refreshResources = useCallback(
    (params: FetchResourcesParams = {}) => {
      fetchResources({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...params,
      });
    },
    [fetchResources, pagination.currentPage, pagination.limit]
  );

  return {
    isError,
    trackView,
    resources,
    isLoading,
    pagination,
    searchTerm,
    downloadFile,
    setSearchTerm,
    trackDownload,
    fetchResources,
    refreshResources,
    downloadResource,
    fetchSingleResource,
    debouncedSearchQuery,
  };
};

export default useResources;
