import PageHeading from '../components/landing-page/page-heading';
import LandingLayout from '../components/landing-page/landing-layout';
import ShopSection from '../components/landing-page/shop-section';
import { FeaturedHeading, SpotlightCard } from '../components/landing-page/editorial';
import { ShoppingBag } from 'lucide-react';
import { useShopCart } from '../components/landing-page/shop-cart-context';

const ShopPage = () => {
  const { openCart, itemCount } = useShopCart();

  return (
    <LandingLayout
      path="/shop"
      title="Shop | ITCA Hub"
      description="ITCA merch and campus gear for School of ICT students—hoodies, tees, caps, and more."
      showNewsletter={false}
    >
      <PageHeading
        title="ITCA shop"
        description="Browse merchandise, choose your options and add items to your cart."
        action={
          <button
            type="button"
            onClick={openCart}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#005080] px-5 py-3 text-sm font-semibold text-white"
          >
            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
            Cart ({itemCount})
          </button>
        }
      />
      <div id="catalogue">
        <ShopSection compact />
      </div>
      <div>
        <section className="bg-white itca-white-surface px-4 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <FeaturedHeading>What&apos;s in the drop</FeaturedHeading>
            <SpotlightCard
              image="/ITCA_RETREAT/retreat-handshake.jpg"
              imageAlt="ITCA members connecting at retreat"
              kicker="Campus merch"
              title="Hoodies, tees, and small gear—ordered through ITCA"
              tone="#FFFFFF"
              ctaHref="#catalogue"
              ctaLabel="Browse the catalogue"
            />
          </div>
        </section>
      </div>
    </LandingLayout>
  );
};

export default ShopPage;
