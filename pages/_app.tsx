import { Manrope } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { ShopCartProvider } from '@/components/landing-page/shop-cart-context';
import ShopCartDrawer from '@/components/landing-page/shop-cart-drawer';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      <ShopCartProvider>
        <style jsx global>{`
          :root {
            --font-manrope: ${manrope.style.fontFamily};
          }
        `}</style>
        <Toaster position="top-right" richColors />
        <Component {...pageProps} />
        <ShopCartDrawer />
      </ShopCartProvider>
    </SWRConfig>
  );
}
