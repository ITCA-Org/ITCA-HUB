import axios from 'axios';
import { BASE_URL } from '@/utils/url';

export const backendFetcher = async <T>(url: string, token: string): Promise<T> => {
  const res = await axios.get(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
