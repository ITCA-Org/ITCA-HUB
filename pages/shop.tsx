import LandingLayout from '../components/landing-page/landing-layout';
import ShopSection from '../components/landing-page/shop-section';
import {
  EditorialHero,
  FeaturedHeading,
  SpotlightCard,
} from '../components/landing-page/editorial';
import { ShoppingBag } from 'lucide-react';
import { useShopCart } from '../components/landing-page/shop-cart-context';

const ShopPage = () => {
  const { openCart, itemCount } = useShopCart();

  return (
    <LandingLayout
      path="/shop"
      title="Shop | ITCA Hub"
      description="ITCA merch and campus gear for School of ICT students—hoodies, tees, caps, and more."
    >
      {/* Marketing sections — desktop/tablet only */}
      <div className="hidden md:block">
        <EditorialHero
          stats={[
            { value: 'Wear', label: 'Hoodies, tees & caps' },
            { value: 'Campus', label: 'Pickup at Faraba Banta' },
            { value: 'ITCA', label: 'Gear that shows you belong' },
          ]}
        >
          Represent the association.{' '}
          <span className="underline decoration-2 underline-offset-8">Shop</span> the gear that
          says you&apos;re{' '}
          <span className="underline decoration-2 underline-offset-8">ITCA</span>.
        </EditorialHero>

        <section className="bg-white px-4 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <FeaturedHeading>What&apos;s in the drop</FeaturedHeading>
            <SpotlightCard
              image="/ITCA_RETREAT/retreat-handshake.jpg"
              imageAlt="ITCA members connecting at retreat"
              kicker="Campus merch"
              title="Hoodies, tees, and small gear—ordered through ITCA"
              tone="#FFE0CC"
              ctaHref="#catalogue"
              ctaLabel="Browse the catalogue"
            />
          </div>
        </section>
      </div>

      {/* Compact mobile intro + cart icon */}
      <div className="bg-white px-4 pb-2 pt-24 md:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="landing-mono text-xs text-[#FF6A00]">Shop</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0A1628]">
              ITCA merch &amp; gear
            </h1>
          </div>
          <button
            type="button"
            onClick={openCart}
            aria-label={itemCount > 0 ? `View cart, ${itemCount} items` : 'View cart'}
            className="relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A1628] text-[#FF6A00] transition hover:brightness-110"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6A00] px-1 text-[11px] font-bold text-[#0A1628]">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div id="catalogue">
        <ShopSection />
      </div>
    </LandingLayout>
  );
};

export default ShopPage;
