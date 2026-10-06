const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
export const BASE_URL: string =
  process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
    ? '/backend-api'
    : configuredApiUrl;

export const JEETIX_BASE_URL: string =
  process.env.NEXT_PUBLIC_JEETIX_URL ?? 'https://file-service-1t33.onrender.com';
