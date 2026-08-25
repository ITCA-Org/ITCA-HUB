import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { Reveal, easeOut } from './reveal';
import {
  SHOP_CATEGORIES,
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
  const [openOptions, setOpenOptions] = useState(false);

  const selectedColor =
    product.colors.find((c) => c.name === color) ?? product.colors[0];

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
      className="group flex flex-col bg-white"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        delay: reduce ? 0 : (index % 3) * 0.06,
        ease: easeOut,
      }}
    >
      <button
        type="button"
        onClick={() => setOpenOptions((open) => !open)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F3F3] text-left"
        aria-expanded={openOptions}
        aria-label={`${product.name} — ${openOptions ? 'hide' : 'show'} options`}
      >
        <Image
          fill
          alt={product.alt}
          src={product.image}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </button>

      <div className="px-4 pb-8 pt-5 sm:px-5 sm:pb-10 sm:pt-6 lg:px-6">
        <h3 className="text-xl font-bold leading-snug tracking-tight text-[#0A1628] sm:text-2xl lg:text-[1.65rem]">
          {product.name}
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#0A1628]/75 sm:text-base">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0A1628]"
            aria-hidden
          />
          <span>{product.category}</span>
          <span className="text-[#0A1628]/35">·</span>
          <span className="font-semibold text-[#0A1628]">
            {formatDalasi(product.price)}
          </span>
        </p>

        <AnimatePresence initial={false}>
          {openOptions && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-4 border-t border-[#0A1628]/10 pt-5">
                <p className="text-sm leading-relaxed text-[#0A1628]/70">
                  {product.blurb}
                </p>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0A1628]/55">
                    Color · {selectedColor?.name}
                  </p>
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label={`${product.name} colors`}
                  >
                    {product.colors.map((option) => {
                      const active = color === option.name;
                      const isLight =
                        option.hex.toUpperCase() === '#FFFFFF' ||
                        option.hex === '#D4E6F2' ||
                        option.hex === '#FFE0CC';
                      return (
                        <button
                          key={option.name}
                          type="button"
                          title={option.name}
                          aria-label={option.name}
                          aria-pressed={active}
                          onClick={() => setColor(option.name)}
                          className={`h-8 w-8 rounded-full border-2 transition ${
                            active
                              ? 'scale-110 border-[#0A1628]'
                              : 'border-transparent'
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
                  <div
                    className="flex flex-wrap gap-1.5"
                    role="group"
                    aria-label={`${product.name} sizes`}
                  >
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
                              : 'bg-[#F3F3F3] text-[#0A1628] hover:bg-[#0A1628]/10'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

const ShopSection = () => {
  const reduce = useReducedMotion();
  const { openCart, itemCount, products, productsLoading } = useShopCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | ShopCategory>('All');
  const [sort, setSort] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount =
    (category !== 'All' ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (sort !== 'featured' ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category;
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
  }, [products, query, category, sort]);

  return (
    <section className="bg-white pb-14 pt-6 sm:pb-20 sm:pt-10 md:pt-12 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10 lg:px-16">
        <Reveal className="mb-8 hidden items-end justify-between gap-6 md:mb-10 md:flex">
          <div className="max-w-2xl">
            <p className="landing-mono mb-3 text-xs text-[#FF6A00] sm:mb-4 sm:text-sm">
              Merch & gear
            </p>
            <h2 className="text-2xl font-bold leading-tight text-[#0A1628] sm:text-4xl lg:text-5xl">
              Browse the catalogue and add items to your cart.
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

        <div className="mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center gap-4 rounded-full bg-[#E8E8E8] px-6 py-4 text-left transition hover:bg-[#E0E0E0] sm:px-8 sm:py-[1.15rem]"
          >
            <span className="min-w-0 flex-1 text-[15px] font-medium tracking-tight text-[#0A1628] sm:text-base">
              Filters ({activeFilterCount})
            </span>

            <span className="flex shrink-0 items-center gap-2.5 text-[15px] font-medium tracking-tight text-[#0A1628] sm:gap-3 sm:text-base">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-[#0A1628]"
                aria-hidden
              />
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              <ChevronDown
                className={`ml-0.5 h-[18px] w-[18px] text-[#0A1628] transition ${
                  filtersOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={reduce ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-4 rounded-[1.75rem] bg-[#F7F7F7] p-4 sm:rounded-[2rem] sm:p-6">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tees, hoodies, colors…"
                    aria-label="Search shop items"
                    className="w-full rounded-full border border-[#0A1628]/10 bg-white px-5 py-3.5 text-base text-[#0A1628] placeholder:text-[#0A1628]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20"
                  />

                  <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
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

                  <label className="inline-flex w-full items-center gap-2 text-sm text-[#0A1628]/70 sm:w-auto">
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

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#FF6A00] underline underline-offset-4"
                      onClick={() => {
                        setQuery('');
                        setCategory('All');
                        setSort('featured');
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {productsLoading ? (
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 lg:px-16">
          <p className="py-16 text-center text-[#0A1628]/60">
            Loading catalogue…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 lg:px-16">
          <div className="rounded-[1.25rem] border border-dashed border-[#0A1628]/20 px-5 py-12 text-center sm:rounded-[1.5rem] sm:px-6 sm:py-16">
            <p className="text-lg font-semibold text-[#0A1628]">
              {products.length === 0 ? 'Shop coming soon' : 'No items match'}
            </p>
            <p className="mt-2 text-sm text-[#0A1628]/65">
              {products.length === 0
                ? 'Products will appear here once an admin adds them.'
                : 'Try another search or clear the category filter.'}
            </p>
            {products.length > 0 && (
              <button
                type="button"
                className={`mt-6 w-full sm:w-auto ${darkCtaClass}`}
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                  setSort('featured');
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="mx-auto mt-12 max-w-[1400px] px-4 sm:mt-20 sm:px-10 lg:px-16">
        <Reveal className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
          <p className="max-w-md text-sm text-[#0A1628]/70 sm:text-base">
            Looking for something custom for a cohort or event? We can help.
          </p>
          <Link
            href="/events"
            className={`${darkCtaClass} w-full justify-center sm:w-auto`}
          >
            See upcoming events
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default ShopSection;
