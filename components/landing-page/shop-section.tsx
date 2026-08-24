import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { Reveal, easeOut } from './reveal';
import {
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  formatDalasi,
  type ShopCategory,
  type ShopProduct,
} from './shop-data';
import { useShopCart } from './shop-cart-context';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

const ShopProductCard = ({
  product,
  index,
  reduce,
}: {
  product: ShopProduct;
  index: number;
  reduce: boolean | null;
}) => {
  const { addItem } = useShopCart();
  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [size, setSize] = useState(product.sizes[0] ?? '');

  const selectedColor = product.colors.find((c) => c.name === color) ?? product.colors[0];

  const handleAdd = () => {
    if (!color || !size) {
      toast.error('Pick a color and size');
      return;
    }
    addItem(product.id, { color, size });
    toast.success('Added to cart', {
      description: `${product.name} · ${color} · ${size}`,
    });
  };

  return (
    <motion.article
      className="flex flex-col overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] lg:rounded-[2rem]"
      style={{ backgroundColor: product.tone }}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: reduce ? 0 : (index % 3) * 0.05,
        ease: easeOut,
      }}
    >
      <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[4/3]">
        <Image
          fill
          alt={product.alt}
          src={product.image}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:gap-5 sm:p-6">
        <div>
          <p className="landing-mono text-xs text-[#0A1628]/60">{product.category}</p>
          <div className="mt-2 flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold leading-snug text-[#0A1628] sm:text-2xl">
              {product.name}
            </h3>
            <p className="shrink-0 text-base font-bold text-[#0A1628] sm:text-lg">
              {formatDalasi(product.price)}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#0A1628]/75">{product.blurb}</p>

          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0A1628]/55">
                Color · {selectedColor?.name}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`${product.name} colors`}>
                {product.colors.map((option) => {
                  const active = color === option.name;
                  const isLight = option.hex.toUpperCase() === '#FFFFFF' || option.hex === '#D4E6F2' || option.hex === '#FFE0CC';
                  return (
                    <button
                      key={option.name}
                      type="button"
                      title={option.name}
                      aria-label={option.name}
                      aria-pressed={active}
                      onClick={() => setColor(option.name)}
                      className={`h-8 w-8 rounded-full border-2 transition ${
                        active ? 'border-[#0A1628] scale-110' : 'border-transparent'
                      } ${isLight ? 'ring-1 ring-[#0A1628]/20' : ''}`}
                      style={{ backgroundColor: option.hex }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0A1628]/55">
                Size
              </p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${product.name} sizes`}>
                {product.sizes.map((option) => {
                  const active = size === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSize(option)}
                      className={`min-h-9 min-w-10 rounded-full px-3 text-xs font-semibold transition sm:text-sm ${
                        active
                          ? 'bg-[#0A1628] text-[#FF6A00]'
                          : 'bg-white/80 text-[#0A1628] hover:bg-white'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`${darkCtaClass} min-h-11 w-full sm:w-fit`}
        >
          Add to cart
        </button>
      </div>
    </motion.article>
  );
};

const ShopSection = () => {
  const reduce = useReducedMotion();
  const { openCart, itemCount } = useShopCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ShopCategory>('All');
  const [sort, setSort] = useState<SortOption>('featured');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = SHOP_PRODUCTS.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.blurb.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.colors.some((c) => c.name.toLowerCase().includes(q)) ||
        product.sizes.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    if (sort === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [query, category, sort]);

  return (
    <section className="bg-white px-4 pb-14 pt-6 sm:px-10 sm:py-20 md:pt-20 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-8 hidden items-end justify-between gap-6 md:mb-12 md:flex">
          <div className="max-w-2xl">
            <p className="landing-mono mb-3 text-xs text-[#FF6A00] sm:mb-4 sm:text-sm">
              Merch & gear
            </p>
            <h2 className="text-2xl font-bold leading-tight text-[#0A1628] sm:text-4xl lg:text-5xl">
              Search the catalogue, filter by type, and add items to your cart.
            </h2>
          </div>
          <button
            type="button"
            onClick={openCart}
            className={`${darkCtaClass} relative shrink-0`}
          >
            <ShoppingBag className="h-4 w-4" />
            View cart
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6A00] px-1 text-xs font-bold text-[#0A1628]">
                {itemCount}
              </span>
            )}
          </button>
        </Reveal>

        <div className="mb-6 space-y-3 rounded-[1.25rem] bg-[#F4F7FA] p-3 sm:mb-8 sm:space-y-4 sm:rounded-[1.5rem] sm:p-5 lg:rounded-[2rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0A1628]/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tees, hoodies, colors…"
              aria-label="Search shop items"
              className="w-full rounded-full border border-[#0A1628]/10 bg-white py-3.5 pl-11 pr-4 text-base text-[#0A1628] placeholder:text-[#0A1628]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20 sm:py-3"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {SHOP_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#0A1628] text-[#FF6A00]'
                      : 'bg-white text-[#0A1628] hover:bg-[#0A1628]/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="order-2 text-sm text-[#0A1628]/60 sm:order-1">
              Showing {filtered.length} of {SHOP_PRODUCTS.length}
              {category !== 'All' ? ` in ${category}` : ''}
              {query.trim() ? ` for “${query.trim()}”` : ''}
            </p>

            <label className="order-1 inline-flex w-full items-center gap-2 text-sm text-[#0A1628]/70 sm:order-2 sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <span className="shrink-0">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="min-h-11 flex-1 rounded-full border border-[#0A1628]/10 bg-white px-3 py-2 text-sm font-semibold text-[#0A1628] focus:border-[#005080] focus:outline-none sm:flex-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-[#0A1628]/20 px-5 py-12 text-center sm:rounded-[1.5rem] sm:px-6 sm:py-16">
            <p className="text-lg font-semibold text-[#0A1628]">No items match</p>
            <p className="mt-2 text-sm text-[#0A1628]/65">
              Try another search or clear the category filter.
            </p>
            <button
              type="button"
              className={`mt-6 w-full sm:w-auto ${darkCtaClass}`}
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {filtered.map((product, index) => (
              <ShopProductCard
                key={product.id}
                product={product}
                index={index}
                reduce={reduce}
              />
            ))}
          </div>
        )}

        <Reveal className="mt-12 flex flex-col items-stretch gap-4 sm:mt-20 sm:flex-row sm:items-center sm:gap-6">
          <p className="max-w-md text-sm text-[#0A1628]/70 sm:text-base">
            Looking for something custom for a cohort or event? We can help.
          </p>
          <Link href="/events" className={`${darkCtaClass} w-full justify-center sm:w-auto`}>
            See upcoming events
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default ShopSection;
