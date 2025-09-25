import JSZip from 'jszip';
import { toast } from 'sonner';
import {
  Resource,
  Pagination,
  UseResourcesProps,
  ResourcesResponse,
  UseResourcesReturn,
  FetchResourcesParams,
  SingleResourceResponse,
} from '@/types/interfaces/resource';
import { BASE_URL } from '@/utils/url';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { useState, useCallback, useRef } from 'react';
import { CustomError, ErrorResponseData } from '@/types';

const useResources = ({ token }: UseResourcesProps): UseResourcesReturn => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    limit: 15,
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const lastRequestRef = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 500;

  const requestCacheRef = useRef<Map<string, Promise<unknown>>>(new Map());
  const cacheTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const CACHE_DURATION = 30000;

  const fetchResources = useCallback(
    async (params: FetchResourcesParams = {}) => {
      const now = Date.now();
      if (now - lastRequestRef.current < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestRef.current))
        );
      }
      lastRequestRef.current = Date.now();

      const {
        signal,
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

      const cacheKey = JSON.stringify({
        page: page.toString(),
        limit: limit.toString(),
        search: params.search?.trim() || '',
        category: category && category !== 'all' ? category : '',
        visibility: visibility || '',
        academicLevel: academicLevel && academicLevel !== 'all' ? academicLevel : '',
        department: department && department !== 'all' ? department : '',
        sortBy: sortBy || '',
        sortOrder: sortOrder || '',
        includeDeleted,
        signal: signal ? 'present' : 'absent',
      });

      const existingRequest = requestCacheRef.current.get(cacheKey) as
        | Promise<ResourcesResponse>
        | undefined;
      if (existingRequest) {
        try {
          const data = await existingRequest;
          if (!signal?.aborted) {
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
            setIsLoading(false);
          }
          return;
        } catch {}
      }

      setIsLoading(true);
      setIsError(false);

      const requestPromise = (async () => {
        try {
          const { data } = await axios.get<ResourcesResponse>(`${BASE_URL}/resources`, {
            signal,
            params: {
              page: page.toString(),
              limit: limit.toString(),
              ...(params.search?.trim() && { search: params.search.trim() }),
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
            return data;
          } else {
            throw new Error('Failed to fetch resources');
          }
        } finally {
          requestCacheRef.current.delete(cacheKey);
          const timeout = cacheTimeoutRef.current.get(cacheKey);
          if (timeout) {
            clearTimeout(timeout);
            cacheTimeoutRef.current.delete(cacheKey);
          }
        }
      })();

      requestCacheRef.current.set(cacheKey, requestPromise);

      const timeout = setTimeout(() => {
        requestCacheRef.current.delete(cacheKey);
        cacheTimeoutRef.current.delete(cacheKey);
      }, CACHE_DURATION);
      cacheTimeoutRef.current.set(cacheKey, timeout);

      try {
        const data = (await requestPromise) as ResourcesResponse;

        if (!signal?.aborted) {
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
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }
        setIsError(true);
        setIsLoading(false);
        const { message } = getErrorMessage(
          err as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load resources', {
          description: message,
          duration: 5000,
        });
      }
    },
    [token]
  );

  const fetchDeletedResources = useCallback(
    async (params: FetchResourcesParams = {}) => {
      const now = Date.now();
      if (now - lastRequestRef.current < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestRef.current))
        );
      }
      lastRequestRef.current = Date.now();

      const {
        signal,
        category,
        page = 0,
        limit = 10,
        department,
        visibility,
        academicLevel,
        sortOrder = 'desc',
        sortBy = 'createdAt',
      } = params;

      const cacheKey = JSON.stringify({
        endpoint: 'deleted',
        page: page.toString(),
        limit: limit.toString(),
        search: params.search?.trim() || '',
        category: category && category !== 'all' ? category : '',
        visibility: visibility || '',
        academicLevel: academicLevel && academicLevel !== 'all' ? academicLevel : '',
        department: department && department !== 'all' ? department : '',
        sortBy: sortBy || '',
        sortOrder: sortOrder || '',
        signal: signal ? 'present' : 'absent',
      });

      const existingRequest = requestCacheRef.current.get(cacheKey) as
        | Promise<ResourcesResponse>
        | undefined;
      if (existingRequest) {
        try {
          const data = await existingRequest;
          if (!signal?.aborted) {
            setResources(data.data.resources);
            setPagination((prev) => ({
              ...prev,
              ...data.data.pagination,
            }));
            setIsError(false);
            setIsLoading(false);
          }
          return;
        } catch {}
      }

      setIsLoading(true);
      setIsError(false);

      const requestPromise = (async () => {
        try {
          const { data } = await axios.get<ResourcesResponse>(
            `${BASE_URL}/resources/trash/deleted`,
            {
              signal,
              params: {
                page: page.toString(),
                limit: limit.toString(),
                ...(params.search?.trim() && { search: params.search.trim() }),
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
            }
          );

          if (data.status === 'success') {
            return data;
          } else {
            throw new Error('Failed to fetch deleted resources');
          }
        } finally {
          requestCacheRef.current.delete(cacheKey);
          const timeout = cacheTimeoutRef.current.get(cacheKey);
          if (timeout) {
            clearTimeout(timeout);
            cacheTimeoutRef.current.delete(cacheKey);
          }
        }
      })();

      requestCacheRef.current.set(cacheKey, requestPromise);

      const timeout = setTimeout(() => {
        requestCacheRef.current.delete(cacheKey);
        cacheTimeoutRef.current.delete(cacheKey);
      }, CACHE_DURATION);
      cacheTimeoutRef.current.set(cacheKey, timeout);

      try {
        const data = (await requestPromise) as ResourcesResponse;

        if (!signal?.aborted) {
          setResources(data.data.resources);
          setPagination((prev) => ({
            ...prev,
            ...data.data.pagination,
          }));
          setIsError(false);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          return;
        }
        setIsError(true);
        setIsLoading(false);
        const { message } = getErrorMessage(
          err as AxiosError<ErrorResponseData> | CustomError | Error
        );

        toast.error('Failed to load deleted resources', {
          description: message,
          duration: 5000,
        });
      }
    },
    [token]
  );

  const fetchSingleResource = useCallback(
    async (resourceId: string, signal?: AbortSignal): Promise<Resource | null> => {
      const cacheKey = `single_resource_${resourceId}`;

      const existingRequest = requestCacheRef.current.get(cacheKey) as
        | Promise<SingleResourceResponse>
        | undefined;
      if (existingRequest) {
        try {
          const data = await existingRequest;
          if (!signal?.aborted && data.status === 'success') {
            const resource = data.data.resource;
            return {
              ...resource,
              _id: resource.resourceId || resource._id,
            };
          }
        } catch {}
      }

      const requestPromise = (async () => {
        try {
          const response = await axios.get<SingleResourceResponse>(
            `${BASE_URL}/resources/${resourceId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              signal,
            }
          );

          if (!signal?.aborted && response.data.status === 'success') {
            return response.data;
          } else {
            throw new Error('Failed to fetch resource');
          }
        } finally {
          requestCacheRef.current.delete(cacheKey);
          const timeout = cacheTimeoutRef.current.get(cacheKey);
          if (timeout) {
            clearTimeout(timeout);
            cacheTimeoutRef.current.delete(cacheKey);
          }
        }
      })();

      requestCacheRef.current.set(cacheKey, requestPromise);

      const timeout = setTimeout(() => {
        requestCacheRef.current.delete(cacheKey);
        cacheTimeoutRef.current.delete(cacheKey);
      }, CACHE_DURATION);
      cacheTimeoutRef.current.set(cacheKey, timeout);

      try {
        const data = (await requestPromise) as SingleResourceResponse;
        const resource = data.data.resource;
        return {
          ...resource,
          _id: resource.resourceId || resource._id,
        };
      } catch (error) {
        if (axios.isCancel(error)) {
          return null;
        }

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
    async (resourceId: string, role: 'admin' | 'student', signal?: AbortSignal) => {
      if (role !== 'student') return;
      const storageKey = `resource_view_${resourceId}`;
      const lastTracked = localStorage.getItem(storageKey);
      const now = Date.now();

      if (lastTracked && now - parseInt(lastTracked) < 30000) {
        return;
      }

      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-view/${resourceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            signal,
          }
        );

        localStorage.setItem(storageKey, now.toString());
      } catch (error) {
        if (axios.isCancel(error)) return;

        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        console.warn('Failed to track resource view:', message);
      }
    },
    [token]
  );

  const trackDownload = useCallback(
    async (resourceId: string, role?: 'admin' | 'student') => {
      if (role !== 'student') return;

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

  const downloadFile = useCallback(
    async (fileUrl: string, resourceId?: string, role?: 'admin' | 'student') => {
      try {
        if (resourceId && role) {
          await trackDownload(resourceId, role);
        }

        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.download = fileUrl.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

  const downloadResource = useCallback(
    async (resource: Resource, role?: 'admin' | 'student') => {
      try {
        if (role) {
          await trackDownload(resource._id, role);
        }

        if (resource.fileUrls.length === 1) {
          const fileUrl = resource.fileUrls[0];
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.download = fileUrl.split('/').pop() || `${resource.title}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (resource.fileUrls.length > 1) {  
          const zip = new JSZip();
          const folder = zip.folder(resource.title);

          const downloadPromises = resource.fileUrls.map(async (fileUrl, index) => {
            try {
              const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
              const fileName = fileUrl.split('/').pop() || `file_${index + 1}`;
              folder?.file(fileName, response.data);
            } catch (error) {
              console.error(`Failed to download file ${index + 1}:`, error);
            }
          });

          await Promise.all(downloadPromises);

          const content = await zip.generateAsync({ type: 'blob' });
          const url = window.URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${resource.title}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }

        toast.success('Resource downloaded successfully', {
          description: `Downloaded ${resource.fileUrls.length} file${
            resource.fileUrls.length > 1 ? 's' : ''
          }`,
        });
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

  const clearCache = useCallback(() => {
    requestCacheRef.current.clear();
    cacheTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    cacheTimeoutRef.current.clear();
  }, []);

  return {
    isError,
    trackView,
    resources,
    isLoading,
    pagination,
    clearCache,
    downloadFile,
    trackDownload,
    fetchResources,
    refreshResources,
    downloadResource,
    fetchSingleResource,
    fetchDeletedResources,
  };
};

export default useResources;
