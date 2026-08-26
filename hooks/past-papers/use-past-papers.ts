import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

export type PastPaperSemester = 'First' | 'Second';
export type PastPaperType = 'Exam' | 'Test' | 'Make-up Test' | 'Quiz';
export type PastPaperDepartment =
  | 'computer_science'
  | 'information_systems'
  | 'telecommunications'
  | 'all';
export type PastPaperExtractionStatus =
  | 'pending'
  | 'ready'
  | 'failed'
  | 'empty';

export interface PastPaper {
  _id: string;
  title: string;
  course: string;
  lecturer: string;
  year: string;
  semester: PastPaperSemester;
  paperType: PastPaperType;
  department: PastPaperDepartment;
  fileUrl: string;
  fileName: string;
  displayText: string;
  extractedText?: string;
  extractionStatus?: PastPaperExtractionStatus;
  isPublished: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PastPaperInput {
  title: string;
  course: string;
  lecturer: string;
  year: string;
  semester: PastPaperSemester;
  paperType: PastPaperType;
  department?: PastPaperDepartment;
  fileUrl?: string;
  fileName?: string;
  displayText?: string;
  isPublished?: boolean;
}

export interface PastPaperUpdateInput extends Partial<PastPaperInput> {
  resetDisplayFromExtract?: boolean;
}

export const PAST_PAPER_SEMESTERS: PastPaperSemester[] = ['First', 'Second'];
export const PAST_PAPER_TYPES: PastPaperType[] = [
  'Exam',
  'Test',
  'Make-up Test',
  'Quiz',
];

export async function createPastPaper(
  input: PastPaperInput,
  token: string
): Promise<PastPaper> {
  const { data } = await axios.post(`${BASE_URL}/past-papers`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function updatePastPaper(
  id: string,
  input: PastPaperUpdateInput,
  token: string
): Promise<PastPaper> {
  const { data } = await axios.patch(`${BASE_URL}/past-papers/${id}`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function deletePastPaper(
  id: string,
  token: string
): Promise<void> {
  await axios.delete(`${BASE_URL}/past-papers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPastPaper(
  id: string,
  token?: string
): Promise<PastPaper> {
  const { data } = await axios.get(`${BASE_URL}/past-papers/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data.data;
}

export interface UsePastPapersOptions {
  page?: number;
  limit?: number;
  search?: string;
  year?: string;
  semester?: string;
  paperType?: string;
  department?: string;
  course?: string;
}

const fetchPublicList = async (options: UsePastPapersOptions) => {
  const {
    page = 0,
    limit = 15,
    search,
    year,
    semester,
    paperType,
    department,
    course,
  } = options;
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };
  if (search?.trim()) params.search = search.trim();
  if (year) params.year = year;
  if (semester) params.semester = semester;
  if (paperType) params.paperType = paperType;
  if (department && department !== 'all') params.department = department;
  if (course?.trim()) params.course = course.trim();

  const { data } = await axios.get(`${BASE_URL}/past-papers`, { params });
  return {
    papers: data.data as PastPaper[],
    total: data.total as number,
    totalPages: data.pagination.totalPages as number,
  };
};

export const usePastPapers = (options: UsePastPapersOptions = {}) => {
  const { page = 0, limit = 15, search, year, semester, paperType, department, course } =
    options;

  const { data, error, isLoading, mutate } = useSWR(
    [
      '/past-papers',
      page,
      limit,
      search,
      year,
      semester,
      paperType,
      department,
      course,
    ],
    () => fetchPublicList(options),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load past papers', { description: message });
      },
    }
  );

  return {
    papers: data?.papers ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export interface UseAdminPastPapersOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  year?: string;
  semester?: string;
  paperType?: string;
  department?: string;
  published?: string;
  status?: string;
}

const fetchAdminList = async (options: UseAdminPastPapersOptions) => {
  const {
    token,
    page = 0,
    limit = 15,
    search,
    year,
    semester,
    paperType,
    department,
    published,
    status,
  } = options;
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };
  if (search?.trim()) params.search = search.trim();
  if (year) params.year = year;
  if (semester) params.semester = semester;
  if (paperType) params.paperType = paperType;
  if (department && department !== 'all') params.department = department;
  if (published && published !== 'all') params.published = published;
  if (status) params.status = status;

  const { data } = await axios.get(`${BASE_URL}/past-papers/admin`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    papers: data.data as PastPaper[],
    total: data.total as number,
    totalPages: data.pagination.totalPages as number,
  };
};

export const useAdminPastPapers = (options: UseAdminPastPapersOptions) => {
  const {
    token,
    page = 0,
    limit = 15,
    search,
    year,
    semester,
    paperType,
    department,
    published,
    status,
  } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token
      ? [
          '/past-papers/admin',
          page,
          limit,
          search,
          year,
          semester,
          paperType,
          department,
          published,
          status,
        ]
      : null,
    () => fetchAdminList(options),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load past papers', { description: message });
      },
    }
  );

  return {
    papers: data?.papers ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};
