import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Loader, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { formatDalasi } from './shop-data';
import { useShopCart } from './shop-cart-context';
import { checkoutShop } from '@/hooks/shop/use-shop';
import { getErrorMessage } from '@/utils/error';

const inputClass =
  'w-full rounded-xl border border-[#0A1628]/12 bg-white px-3.5 py-3 text-sm text-[#0A1628] placeholder:text-[#0A1628]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20';

const ShopCartDrawer = () => {
  const {
    isOpen,
    closeCart,
    detailedLines,
    itemCount,
    subtotal,
    setQuantity,
    removeItem,
    clearCart,
  } = useShopCart();
  const [isMobile, setIsMobile] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupNote, setPickupNote] = useState('');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutOpen(false);
    }
  }, [isOpen]);

  const panelMotion = isMobile
    ? {
        initial: { y: '100%' as const },
        animate: { y: 0 },
        exit: { y: '100%' as const },
      }
    : {
        initial: { x: '100%' as const },
        animate: { x: 0 },
        exit: { x: '100%' as const },
      };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || detailedLines.length === 0) return;

    setIsSubmitting(true);
    try {
      const result = await checkoutShop({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        pickupNote: pickupNote.trim() || undefined,
        lines: detailedLines.map((line) => ({
          productId: line.product.id,
          color: line.color,
          size: line.size,
          quantity: line.quantity,
        })),
      });

      clearCart();
      closeCart();
      window.location.href = result.paymentLink;
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Checkout failed', { description: message });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[70] bg-[#0A1628]/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="landing-itca fixed inset-x-0 bottom-0 z-[80] flex max-h-[92svh] w-full flex-col rounded-t-[1.75rem] bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:max-w-md sm:rounded-none"
            {...panelMotion}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex justify-center pt-3 sm:hidden" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-[#0A1628]/15" />
            </div>

            <div className="flex items-center justify-between border-b border-[#0A1628]/10 px-4 py-3 sm:px-5 sm:py-4">
              <div>
                <p className="landing-mono text-xs text-[#FF6A00]">
                  {checkoutOpen ? 'Checkout' : 'Your cart'}
                </p>
                <h2 className="text-lg font-bold text-[#0A1628] sm:text-xl">
                  {checkoutOpen
                    ? 'Pickup details'
                    : itemCount === 0
                      ? 'No items yet'
                      : `${itemCount} item${itemCount === 1 ? '' : 's'}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full bg-[#0A1628] p-2.5 text-[#FF6A00] transition hover:brightness-110"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutOpen ? (
              <form
                onSubmit={handleCheckout}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                  <p className="text-sm text-[#0A1628]/65">
                    Pickup at Faraba Banta campus. Total{' '}
                    <strong className="text-[#0A1628]">{formatDalasi(subtotal)}</strong>
                  </p>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#0A1628]/60">
                      Full name
                    </span>
                    <input
                      required
                      maxLength={120}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#0A1628]/60">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      maxLength={200}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      autoComplete="email"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#0A1628]/60">
                      Phone
                    </span>
                    <input
                      required
                      maxLength={40}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      autoComplete="tel"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-[#0A1628]/60">
                      Pickup note (optional)
                    </span>
                    <textarea
                      maxLength={300}
                      rows={3}
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="Preferred day or time…"
                    />
                  </label>
                </div>
                <div className="border-t border-[#0A1628]/10 px-4 py-4 sm:px-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${darkCtaClass} min-h-12 w-full disabled:opacity-60`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      `Pay ${formatDalasi(subtotal)}`
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setCheckoutOpen(false)}
                    className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 text-sm font-semibold text-[#0A1628]/55 hover:text-[#0A1628]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to cart
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                  {detailedLines.length === 0 ? (
                    <div className="flex min-h-[40svh] flex-col items-center justify-center gap-3 px-4 text-center sm:h-full sm:min-h-0">
                      <ShoppingBag className="h-10 w-10 text-[#0A1628]/30" />
                      <p className="text-sm text-[#0A1628]/70">
                        Browse the shop and add merch to your cart.
                      </p>
                      <button type="button" onClick={closeCart} className={darkCtaClass}>
                        Keep shopping
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3 sm:space-y-4">
                      {detailedLines.map(
                        ({ key, product, color, size, quantity, lineTotal }) => {
                          const swatch = product.colors.find((c) => c.name === color);
                          return (
                            <li
                              key={key}
                              className="flex gap-3 rounded-2xl border border-[#0A1628]/08 p-3"
                            >
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                                <Image
                                  fill
                                  alt={product.alt}
                                  src={product.image}
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-semibold leading-snug text-[#0A1628] sm:text-base">
                                    {product.name}
                                  </h3>
                                  <p className="shrink-0 text-sm font-bold text-[#0A1628]">
                                    {formatDalasi(lineTotal)}
                                  </p>
                                </div>
                                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#0A1628]/55">
                                  <span className="inline-flex items-center gap-1.5">
                                    {swatch && (
                                      <span
                                        className="inline-block h-3 w-3 rounded-full ring-1 ring-[#0A1628]/15"
                                        style={{ backgroundColor: swatch.hex }}
                                        aria-hidden
                                      />
                                    )}
                                    {color}
                                  </span>
                                  <span aria-hidden>·</span>
                                  <span>{size}</span>
                                </p>
                                <p className="mt-0.5 text-xs text-[#0A1628]/45">
                                  {formatDalasi(product.price)} each
                                </p>
                                <div className="mt-2.5 flex items-center justify-between gap-2">
                                  <div className="inline-flex items-center gap-0.5 rounded-full bg-[#0A1628]/05 p-1">
                                    <button
                                      type="button"
                                      aria-label={`Decrease ${product.name}`}
                                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#0A1628] transition hover:bg-white"
                                      onClick={() => setQuantity(key, quantity - 1)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="min-w-8 text-center text-sm font-semibold text-[#0A1628]">
                                      {quantity}
                                    </span>
                                    <button
                                      type="button"
                                      aria-label={`Increase ${product.name}`}
                                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#0A1628] transition hover:bg-white"
                                      onClick={() => setQuantity(key, quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    className="min-h-9 px-2 text-xs font-semibold text-[#0A1628]/55 underline underline-offset-2 hover:text-[#0A1628]"
                                    onClick={() => removeItem(key)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </div>

                {detailedLines.length > 0 && (
                  <div className="border-t border-[#0A1628]/10 px-4 py-4 sm:px-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#0A1628]/70">
                        Subtotal
                      </span>
                      <span className="text-xl font-bold text-[#0A1628]">
                        {formatDalasi(subtotal)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(true)}
                      className={`${darkCtaClass} min-h-12 w-full`}
                    >
                      Checkout
                    </button>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="mt-3 min-h-10 w-full text-center text-sm font-semibold text-[#0A1628]/55 underline underline-offset-2 hover:text-[#0A1628]"
                    >
                      Clear cart
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShopCartDrawer;
