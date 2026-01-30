import JSZip from 'jszip';
import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { Resource, ResourcesResponse, SingleResourceResponse } from '@/types/interfaces/resource';

type ErrorType = AxiosError<ErrorResponseData> | CustomError | Error;

export interface UseResourcesOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  department?: string;
  visibility?: string;
  academicLevel?: string;
}

interface ResourcesData {
  resources: Resource[];
  total: number;
  totalPages: number;
  currentPage: number;
}

async function fetchResources(
  _url: string,
  token: string,
  page: number,
  limit: number,
  search?: string,
  category?: string,
  department?: string,
  visibility?: string,
  academicLevel?: string
): Promise<ResourcesData> {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search?.trim()) params.search = search.trim();
  if (category && category !== 'all') params.category = category;
  if (department && department !== 'all') params.department = department;
  if (visibility && visibility !== 'all') params.visibility = visibility;
  if (academicLevel && academicLevel !== 'all') params.academicLevel = academicLevel;

  const { data } = await axios.get<ResourcesResponse>(`${BASE_URL}/resources`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  const resources = data.data.resources.filter((r) => !r.isDeleted);

  return {
    resources,
    total: data.data.pagination.total,
    totalPages: data.data.pagination.totalPages,
    currentPage: data.data.pagination.currentPage,
  };
}

export const useResources = (options: UseResourcesOptions) => {
  const { token, page = 0, limit = 15, search, category, department, visibility, academicLevel } = options;

  const { data, error, isLoading, mutate: boundMutate } = useSWR(
    token ? ['/resources', page, limit, search, category, department, visibility, academicLevel] : null,
    () => fetchResources('/resources', token, page, limit, search, category, department, visibility, academicLevel),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        toast.error('Failed to load resources', {
          description: getErrorMessage(err).message,
        });
      },
    }
  );

  return {
    resources: data?.resources ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.currentPage ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => boundMutate(),
  };
};

async function fetchDeletedResources(
  _url: string,
  token: string,
  page: number,
  limit: number
): Promise<ResourcesData> {
  const { data } = await axios.get<ResourcesResponse>(`${BASE_URL}/resources/trash/deleted`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    resources: data.data.resources,
    total: data.data.pagination.total,
    totalPages: data.data.pagination.totalPages,
    currentPage: data.data.pagination.currentPage,
  };
}

export const useDeletedResources = (options: { token: string; page?: number; limit?: number }) => {
  const { token, page = 0, limit = 15 } = options;

  const { data, error, isLoading, mutate: boundMutate } = useSWR(
    token ? ['/resources/deleted', page, limit] : null,
    () => fetchDeletedResources('/resources/deleted', token, page, limit),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        toast.error('Failed to load deleted resources', {
          description: getErrorMessage(err).message,
        });
      },
    }
  );

  return {
    resources: data?.resources ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.currentPage ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => boundMutate(),
  };
};

async function fetchSingleResource(
  _url: string,
  token: string,
  resourceId: string
): Promise<Resource> {
  const { data } = await axios.get<SingleResourceResponse>(`${BASE_URL}/resources/${resourceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const resource = data.data.resource;
  return {
    ...resource,
    _id: resource.resourceId || resource._id,
  };
}

export const useResource = (token: string, resourceId: string | null) => {
  const { data, error, isLoading, mutate: boundMutate } = useSWR(
    token && resourceId ? ['/resources/single', resourceId] : null,
    () => fetchSingleResource('/resources/single', token, resourceId!),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onError: (err) => {
        toast.error('Failed to load resource', {
          description: getErrorMessage(err).message,
        });
      },
    }
  );

  return {
    resource: data ?? null,
    isLoading,
    isError: !!error,
    refresh: () => boundMutate(),
  };
};

export const useResourceDownload = (token: string, role: string) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const fetchFileMediaLink = useCallback(async (fileUrl: string): Promise<string> => {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid file URL');

    const response = await axios.get(
      `https://jeetix-file-service.onrender.com/api/storage/file/itca-resources/${fileName}`
    );

    if (response.data.status === 'success' && response.data.data.metadata?.mediaLink) {
      return response.data.data.metadata.mediaLink;
    }
    throw new Error('Failed to get mediaLink');
  }, []);

  const trackDownload = useCallback(
    async (resourceId: string) => {
      if (role !== 'user') return;
      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-download/${resourceId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.warn('Failed to track download:', getErrorMessage(error as ErrorType).message);
      }
    },
    [token, role]
  );

  const downloadFile = useCallback(
    async (fileUrl: string, fileName?: string, resourceId?: string) => {
      try {
        if (resourceId) await trackDownload(resourceId);

        const downloadUrl = await fetchFileMediaLink(fileUrl);
        const response = await axios.get(downloadUrl, { responseType: 'blob' });

        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName || fileUrl.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        toast.error('Failed to download file', {
          description: getErrorMessage(error as ErrorType).message,
        });
      }
    },
    [trackDownload, fetchFileMediaLink]
  );

  const downloadResource = useCallback(
    async (resource: Resource) => {
      try {
        setIsDownloading(true);
        setDownloadProgress(0);

        await trackDownload(resource._id);

        const fileUrls = resource.fileUrls.map((f) => f.filePath);

        if (fileUrls.length === 1) {
          await downloadFile(fileUrls[0], resource.fileUrls[0].fileName, resource._id);
          setIsDownloading(false);
          return;
        }

        const zip = new JSZip();
        const folder = zip.folder(resource.title);
        const totalFiles = fileUrls.length;

        const downloadPromises = fileUrls.map(async (fileUrl, index) => {
          try {
            const downloadUrl = await fetchFileMediaLink(fileUrl);
            const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const fileName = resource.fileUrls[index].fileName || `file_${index + 1}`;
            folder?.file(fileName, response.data);
            setDownloadProgress(Math.round(((index + 1) / totalFiles) * 80));
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

        toast.success('Resource downloaded successfully', {
          description: `Downloaded ${fileUrls.length} files`,
        });
      } catch (error) {
        toast.error('Failed to download resource', {
          description: getErrorMessage(error as ErrorType).message,
        });
      } finally {
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    },
    [trackDownload, downloadFile, fetchFileMediaLink]
  );

  const trackView = useCallback(
    async (resourceId: string) => {
      if (role !== 'user') return;

      const storageKey = `resource_view_${resourceId}`;
      const lastTracked = localStorage.getItem(storageKey);
      const now = Date.now();

      if (lastTracked && now - parseInt(lastTracked) < 30000) return;

      try {
        await axios.post(
          `${BASE_URL}/resources/analytics/track-view/${resourceId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.setItem(storageKey, now.toString());
      } catch (error) {
        console.warn('Failed to track view:', getErrorMessage(error as ErrorType).message);
      }
    },
    [token, role]
  );

  return {
    isDownloading,
    downloadProgress,
    downloadFile,
    downloadResource,
    trackView,
    fetchFileMediaLink,
  };
};

export const invalidateResourcesCache = () => {
  mutate((key) => Array.isArray(key) && key[0] === '/resources', undefined, { revalidate: true });
};

export const invalidateDeletedResourcesCache = () => {
  mutate((key) => Array.isArray(key) && key[0] === '/resources/deleted', undefined, { revalidate: true });
};

export const invalidateSingleResourceCache = (resourceId?: string) => {
  if (resourceId) {
    mutate((key) => Array.isArray(key) && key[0] === '/resources/single' && key[2] === resourceId, undefined, { revalidate: true });
  } else {
    mutate((key) => Array.isArray(key) && key[0] === '/resources/single', undefined, { revalidate: true });
  }
};

export default useResources;
