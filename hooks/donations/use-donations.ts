import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

export type DonationCampaignCategory =
  | 'hackathon'
  | 'itca_week'
  | 'nationwide_tour'
  | 'pad_drive'
  | 'face_of_utg'
  | 'other';

export const DONATION_CATEGORY_LABELS: Record<DonationCampaignCategory, string> = {
  hackathon: 'Hackathon',
  itca_week: 'ITCA Week',
  nationwide_tour: 'Nationwide Tour',
  pad_drive: 'Pad Donation Drive',
  face_of_utg: 'Face of UTG',
  other: 'Other',
};

export interface DonationCampaign {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: DonationCampaignCategory;
  imageUrl: string;
  goalAmount: number;
  suggestedAmounts: number[];
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  sortOrder: number;
  raisedAmount: number;
  donorCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DonationCampaignInput {
  title: string;
  summary: string;
  description?: string;
  category: DonationCampaignCategory;
  imageUrl?: string;
  goalAmount?: number;
  suggestedAmounts?: number[];
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface RecentDonor {
  name: string;
  amount: number;
  message: string;
  paidAt: string;
}

export interface DonationCheckoutInput {
  campaignId: string;
  donorName: string;
  email: string;
  phone?: string;
  message?: string;
  isAnonymous?: boolean;
  amount: number;
}

export interface DonationCheckoutResult {
  donationId: string;
  paymentLink: string;
  accessToken: string;
  amount: number;
  currency: string;
}

export interface DonationSummary {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  email: string;
  phone: string;
  message: string;
  isAnonymous: boolean;
  amount: number;
  currency: string;
  status: string;
  receiptNumber?: string;
  paidAt?: string | null;
  createdAt: string;
}

export interface DonationStats {
  totalRaised: number;
  donationCount: number;
  averageDonation: number;
  largestDonation: number;
  uniqueDonors: number;
  raisedThisMonth: number;
  activeCampaigns: number;
  campaigns: DonationCampaign[];
}

export const campaignProgress = (
  campaign: Pick<DonationCampaign, 'goalAmount' | 'raisedAmount'>
) =>
  campaign.goalAmount > 0
    ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100))
    : 0;

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

// ---------- Public ----------

export async function fetchDonationCampaigns(): Promise<DonationCampaign[]> {
  const { data } = await axios.get(`${BASE_URL}/donations/campaigns`);
  return data.data;
}

export async function fetchDonationCampaign(
  slug: string
): Promise<{ campaign: DonationCampaign; recentDonors: RecentDonor[] }> {
  const { data } = await axios.get(`${BASE_URL}/donations/campaigns/${encodeURIComponent(slug)}`);
  return data.data;
}

export async function checkoutDonation(
  input: DonationCheckoutInput
): Promise<DonationCheckoutResult> {
  const { data } = await axios.post(`${BASE_URL}/donations/checkout`, input);
  return data.data;
}

export async function getDonation(accessToken: string): Promise<{ donation: DonationSummary }> {
  const { data } = await axios.get(
    `${BASE_URL}/donations/order/${encodeURIComponent(accessToken)}`
  );
  return data.data;
}

export const useDonationCampaigns = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/donations/campaigns',
    fetchDonationCampaigns,
    { dedupingInterval: 10000, revalidateOnFocus: false }
  );

  return {
    campaigns: data ?? [],
    hasLoaded: data !== undefined,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export const useDonationCampaign = (slug?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['/donations/campaigns', slug] : null,
    () => fetchDonationCampaign(slug as string),
    { revalidateOnFocus: false }
  );

  return {
    campaign: data?.campaign ?? null,
    recentDonors: data?.recentDonors ?? [],
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

// ---------- Admin ----------

export const useAdminDonationCampaigns = (token: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/donations/campaigns/admin', token] : null,
    async () => {
      const { data: res } = await axios.get(
        `${BASE_URL}/donations/campaigns/admin`,
        authHeaders(token)
      );
      return res.data as DonationCampaign[];
    },
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load campaigns', { description: message });
      },
    }
  );

  return {
    campaigns: data ?? [],
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export const useDonationStats = (token: string, campaignId = 'all') => {
  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/donations/stats', token, campaignId] : null,
    async () => {
      const { data: res } = await axios.get(`${BASE_URL}/donations/stats`, {
        ...authHeaders(token),
        params: campaignId !== 'all' ? { campaignId } : undefined,
      });
      return res.data as DonationStats;
    },
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load donation stats', { description: message });
      },
    }
  );

  return {
    stats: data ?? null,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export interface UseDonationsOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  campaignId?: string;
}

export const useDonations = (options: UseDonationsOptions) => {
  const { token, page = 0, limit = 15, search, status, campaignId } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/donations/admin', page, limit, search, status, campaignId] : null,
    async () => {
      const params: Record<string, string | number> = { page: page + 1, limit };
      if (search?.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;
      if (campaignId && campaignId !== 'all') params.campaignId = campaignId;

      const { data: res } = await axios.get(`${BASE_URL}/donations/admin`, {
        params,
        ...authHeaders(token),
      });
      return {
        donations: res.data as DonationSummary[],
        total: res.total as number,
        totalPages: res.pagination.totalPages as number,
      };
    },
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load donations', { description: message });
      },
    }
  );

  return {
    donations: data?.donations ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export async function createDonationCampaign(
  input: DonationCampaignInput,
  token: string
): Promise<DonationCampaign> {
  const { data } = await axios.post(`${BASE_URL}/donations/campaigns`, input, authHeaders(token));
  return data.data;
}

export async function updateDonationCampaign(
  id: string,
  input: Partial<DonationCampaignInput>,
  token: string
): Promise<DonationCampaign> {
  const { data } = await axios.patch(
    `${BASE_URL}/donations/campaigns/${id}`,
    input,
    authHeaders(token)
  );
  return data.data;
}
