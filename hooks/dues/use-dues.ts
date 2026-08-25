import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

export type DuesAmount = 50 | 400;

export interface DuesCheckoutInput {
  fullName: string;
  matricNumber: string;
  email: string;
  phone: string;
  amount: DuesAmount;
}

export interface DuesCheckoutResult {
  orderId: string;
  paymentLink: string;
  accessToken: string;
  amount: number;
  currency: string;
}

export interface DuesOrderSummary {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  fullName: string;
  matricNumber: string;
  email: string;
  phone: string;
  receiptNumber?: string;
  qrPayload?: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface DuesOrderResponse {
  order: DuesOrderSummary;
  totalPaid: number;
  auditEligible: boolean;
  feeTotalRequired: number;
}

export interface DuesPaymentRow {
  _id: string;
  fullName: string;
  matricNumber: string;
  email: string;
  phone: string;
  amount: number;
  status: string;
  receiptNumber?: string;
  paidAt?: string | null;
  createdAt: string;
  totalPaid: number;
  auditEligible: boolean;
  verifiedAt?: string | null;
}

export interface VerifyDuesResult {
  valid: boolean;
  message: string;
  receipt?: {
    receiptNumber?: string;
    fullName: string;
    matricNumber: string;
    email: string;
    phone: string;
    amount: number;
    paidAt?: string | null;
  };
  totalPaid?: number;
  auditEligible?: boolean;
  feeTotalRequired?: number;
  verifiedAt?: string | null;
}

export async function checkoutDues(
  input: DuesCheckoutInput
): Promise<DuesCheckoutResult> {
  const { data } = await axios.post(`${BASE_URL}/dues/checkout`, input);
  return data.data;
}

export async function getDuesOrder(
  accessToken: string
): Promise<DuesOrderResponse> {
  const { data } = await axios.get(
    `${BASE_URL}/dues/order/${encodeURIComponent(accessToken)}`
  );
  return data.data;
}

export async function verifyDuesReceipt(
  qrPayload: string,
  token: string
): Promise<VerifyDuesResult> {
  const { data } = await axios.post(
    `${BASE_URL}/dues/verify`,
    { qrPayload },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data;
}

export interface UseDuesListOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  eligibility?: string;
}

const fetchDuesList = async (
  token: string,
  page: number,
  limit: number,
  search?: string,
  eligibility?: string
) => {
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };
  if (search?.trim()) params.search = search.trim();
  if (eligibility && eligibility !== 'all') params.eligibility = eligibility;

  const { data } = await axios.get(`${BASE_URL}/dues`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    payments: data.data as DuesPaymentRow[],
    total: data.total as number,
    totalPages: data.pagination.totalPages as number,
    feeTotalRequired: data.feeTotalRequired as number,
  };
};

export const useDuesList = (options: UseDuesListOptions) => {
  const { token, page = 0, limit = 15, search, eligibility } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/dues', page, limit, search, eligibility] : null,
    () => fetchDuesList(token, page, limit, search, eligibility),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load dues payments', { description: message });
      },
    }
  );

  return {
    payments: data?.payments ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    feeTotalRequired: data?.feeTotalRequired ?? 400,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};
