import axios from 'axios';
import useSWR from 'swr';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';
import type { ShopCategory, ShopColor, ShopProduct } from '@/components/landing-page/shop-data';

export interface ShopProductApi {
  _id: string;
  name: string;
  slug: string;
  blurb: string;
  imageUrl: string;
  alt: string;
  tone: string;
  price: number;
  category: ShopCategory;
  colors: ShopColor[];
  sizes: string[];
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopCheckoutInput {
  fullName: string;
  email: string;
  phone: string;
  pickupNote?: string;
  lines: Array<{
    productId: string;
    color: string;
    size: string;
    quantity: number;
  }>;
}

export interface ShopCheckoutResult {
  orderId: string;
  paymentLink: string;
  accessToken: string;
  amount: number;
  currency: string;
}

export interface ShopOrderLine {
  productId: string;
  productName: string;
  color: string;
  size: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ShopOrderSummary {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  pickupNote?: string;
  lines: ShopOrderLine[];
  receiptNumber?: string;
  qrPayload?: string;
  paidAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
}

export interface ShopOrderResponse {
  order: ShopOrderSummary;
}

export interface ShopDeliverResult {
  valid: boolean;
  message: string;
  alreadyDelivered: boolean;
  order?: ShopOrderSummary;
}

export const mapShopProduct = (p: ShopProductApi): ShopProduct => ({
  id: p._id,
  name: p.name,
  blurb: p.blurb,
  image: p.imageUrl,
  alt: p.alt || p.name,
  tone: p.tone || '#D4E6F2',
  price: p.price,
  category: p.category,
  colors: p.colors,
  sizes: p.sizes,
});

export async function fetchPublicShopProducts(): Promise<ShopProduct[]> {
  const { data } = await axios.get(`${BASE_URL}/shop/products`);
  return (data.data as ShopProductApi[]).map(mapShopProduct);
}

export async function checkoutShop(
  input: ShopCheckoutInput
): Promise<ShopCheckoutResult> {
  const { data } = await axios.post(`${BASE_URL}/shop/checkout`, input);
  return data.data;
}

export async function getShopOrder(
  accessToken: string
): Promise<ShopOrderResponse> {
  const { data } = await axios.get(
    `${BASE_URL}/shop/order/${encodeURIComponent(accessToken)}`
  );
  return data.data;
}

export async function deliverShopOrder(
  qrPayload: string,
  token: string
): Promise<ShopDeliverResult> {
  const { data } = await axios.post(
    `${BASE_URL}/shop/orders/deliver`,
    { qrPayload },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data;
}

export async function markShopOrderDelivered(
  orderId: string,
  token: string
): Promise<ShopOrderSummary> {
  const { data } = await axios.patch(
    `${BASE_URL}/shop/orders/${orderId}/status`,
    { status: 'delivered' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.data;
}

export const useShopProducts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/shop/products',
    fetchPublicShopProducts,
    {
      dedupingInterval: 10000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load shop products', { description: message });
      },
    }
  );

  return {
    products: data ?? [],
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export interface UseShopOrdersOptions {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

const fetchShopOrders = async (
  token: string,
  page: number,
  limit: number,
  search?: string,
  status?: string
) => {
  const params: Record<string, string | number> = {
    page: page + 1,
    limit,
  };
  if (search?.trim()) params.search = search.trim();
  if (status && status !== 'all') params.status = status;

  const { data } = await axios.get(`${BASE_URL}/shop/orders`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    orders: data.data as ShopOrderSummary[],
    total: data.total as number,
    totalPages: data.pagination.totalPages as number,
  };
};

export const useShopOrders = (options: UseShopOrdersOptions) => {
  const { token, page = 0, limit = 15, search, status } = options;

  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/shop/orders', page, limit, search, status] : null,
    () => fetchShopOrders(token, page, limit, search, status),
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load shop orders', { description: message });
      },
    }
  );

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export const useAdminShopProducts = (token: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    token ? ['/shop/products/admin', token] : null,
    async () => {
      const { data: res } = await axios.get(`${BASE_URL}/shop/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as ShopProductApi[];
    },
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      onError: (err) => {
        const { message } = getErrorMessage(err);
        toast.error('Failed to load products', { description: message });
      },
    }
  );

  return {
    products: data ?? [],
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
};

export type ShopProductInput = {
  name: string;
  blurb: string;
  imageUrl: string;
  alt?: string;
  tone?: string;
  price: number;
  category: ShopCategory;
  colors: ShopColor[];
  sizes: string[];
  isActive?: boolean;
  sortOrder?: number;
  slug?: string;
};

export async function createShopProduct(
  input: ShopProductInput,
  token: string
): Promise<ShopProductApi> {
  const { data } = await axios.post(`${BASE_URL}/shop/products`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function updateShopProduct(
  id: string,
  input: Partial<ShopProductInput>,
  token: string
): Promise<ShopProductApi> {
  const { data } = await axios.patch(`${BASE_URL}/shop/products/${id}`, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}

export async function deactivateShopProduct(
  id: string,
  token: string
): Promise<ShopProductApi> {
  const { data } = await axios.delete(`${BASE_URL}/shop/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}
