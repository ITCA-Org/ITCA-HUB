import '@/styles/globals.css';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { ShopCartProvider } from '@/components/landing-page/shop-cart-context';
import ShopCartDrawer from '@/components/landing-page/shop-cart-drawer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      <ShopCartProvider>
        <Toaster position="top-right" richColors />
        <Component {...pageProps} />
        <ShopCartDrawer />
      </ShopCartProvider>
    </SWRConfig>
  );
}
