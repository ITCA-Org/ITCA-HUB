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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const requestCacheRef = useRef<
    Map<string, { data: ResourcesResponse | SingleResourceResponse; timestamp: number }>
  >(new Map());
  const activeRequestsRef = useRef<Map<string, Promise<ResourcesResponse>>>(new Map());
  const singleResourceRequestsRef = useRef<Map<string, Promise<SingleResourceResponse>>>(new Map());
  const CACHE_DURATION = 300000;

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
      });

      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        if (!signal?.aborted) {
          const resourcesData = cached.data as ResourcesResponse;
          if ('resources' in resourcesData.data) {
            let filteredResources = resourcesData.data.resources;

            if (!includeDeleted) {
              filteredResources = filteredResources.filter(
                (resource: Resource) => !resource.isDeleted
              );
            }

            setResources(filteredResources);
            setPagination((prev) => ({
              ...prev,
              ...resourcesData.data.pagination,
            }));
            setIsError(false);
            setIsLoading(false);
          }
        }
        return;
      }

      const existingRequest = activeRequestsRef.current.get(cacheKey);
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
            requestCacheRef.current.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
            return data;
          } else {
            throw new Error('Failed to fetch resources');
          }
        } finally {
          activeRequestsRef.current.delete(cacheKey);
        }
      })();

      activeRequestsRef.current.set(cacheKey, requestPromise);

      try {
        const data = await requestPromise;

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

      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        if (!signal?.aborted) {
          const resourcesData = cached.data as ResourcesResponse;
          if ('resources' in resourcesData.data) {
            setResources(resourcesData.data.resources);
            setPagination((prev) => ({
              ...prev,
              ...resourcesData.data.pagination,
            }));
            setIsError(false);
            setIsLoading(false);
          }
        }
        return;
      }

      const existingRequest = activeRequestsRef.current.get(cacheKey);
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
            requestCacheRef.current.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
            return data;
          } else {
            throw new Error('Failed to fetch deleted resources');
          }
        } finally {
          activeRequestsRef.current.delete(cacheKey);
        }
      })();

      activeRequestsRef.current.set(cacheKey, requestPromise);

      try {
        const data = await requestPromise;

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

      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (!signal?.aborted && cached.data.status === 'success') {
          const singleResourceData = cached.data as SingleResourceResponse;
          if ('resource' in singleResourceData.data) {
            const resource = singleResourceData.data.resource;
            return {
              ...resource,
              _id: resource.resourceId || resource._id,
            };
          }
        }
      }

      const existingRequest = singleResourceRequestsRef.current.get(cacheKey);
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
            requestCacheRef.current.set(cacheKey, {
              data: response.data,
              timestamp: Date.now(),
            });
            return response.data;
          } else {
            throw new Error('Failed to fetch resource');
          }
        } finally {
          singleResourceRequestsRef.current.delete(cacheKey);
        }
      })();

      singleResourceRequestsRef.current.set(cacheKey, requestPromise);

      try {
        const data = await requestPromise;
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

  const fetchFileMediaLink = useCallback(async (fileUrl: string): Promise<string> => {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid file URL');
    }

    const response = await axios.get(
      `https://jeetix-file-service.onrender.com/api/storage/file/itca-resources/${fileName}`
    );
    const data = response.data;

    if (data.status === 'success' && data.data.metadata?.mediaLink) {
      return data.data.metadata.mediaLink;
    } else {
      throw new Error('Failed to get mediaLink from JeeTix');
    }
  }, []);

  const downloadFile = useCallback(
    async (fileUrl: string, resourceId?: string, role?: 'admin' | 'student') => {
      try {
        if (resourceId && role) {
          await trackDownload(resourceId, role);
        }

        const downloadUrl = await fetchFileMediaLink(fileUrl);

        const link = document.createElement('a');
        link.href = downloadUrl;
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
    [trackDownload, fetchFileMediaLink]
  );

  const downloadResource = useCallback(
    async (resource: Resource, role?: 'admin' | 'student') => {
      try {
        setIsDownloading(true);
        setDownloadProgress(0);

        if (role) {
          await trackDownload(resource._id, role);
        }

        const fileUrls = resource.fileUrls.map((fileItem) => fileItem.filePath);

        if (fileUrls.length === 1) {
          await downloadFile(fileUrls[0], resource._id, role);
          setIsDownloading(false);
          return;
        } else if (fileUrls.length > 1) {
          const zip = new JSZip();
          const folder = zip.folder(resource.title);
          const totalFiles = fileUrls.length;

          const downloadPromises = fileUrls.map(async (fileUrl, index) => {
            try {
              const downloadUrl = await fetchFileMediaLink(fileUrl);
              const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

              const fileName = resource.fileUrls[index].fileName || `file_${index + 1}`;

              folder?.file(fileName, response.data);

              const progress = Math.round(((index + 1) / totalFiles) * 80);
              setDownloadProgress(progress);
            } catch (error) {
              console.error(`Failed to download file ${index + 1}:`, error);
            }
          });

          await Promise.all(downloadPromises);

          setDownloadProgress(90);
          const content = await zip.generateAsync({ type: 'blob' });

          setDownloadProgress(100);
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
          description: `Downloaded ${fileUrls.length} file${fileUrls.length > 1 ? 's' : ''}`,
        });
      } catch (error) {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error
        );
        toast.error('Failed to download resource', {
          description: message,
          duration: 5000,
        });
      } finally {
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    },
    [trackDownload, downloadFile, fetchFileMediaLink]
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
    activeRequestsRef.current.clear();
    singleResourceRequestsRef.current.clear();
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
    isDownloading,
    fetchResources,
    refreshResources,
    downloadResource,
    downloadProgress,
    fetchFileMediaLink,
    fetchSingleResource,
    fetchDeletedResources,
  };
};

export default useResources;
