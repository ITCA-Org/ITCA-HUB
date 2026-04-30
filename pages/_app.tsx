import '@/styles/globals.css';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      <Toaster position="top-right" richColors />
      <Component {...pageProps} />
    </SWRConfig>
  );
}
