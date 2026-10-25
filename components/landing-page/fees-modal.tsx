'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { FEE_TOTAL_REQUIRED, type FeeAmount, formatFeeAmount } from '@/utils/fees';
import { checkoutDues } from '@/hooks/dues/use-dues';
import { getErrorMessage } from '@/utils/error';

type FeesModalProps = {
  open: boolean;
  onClose: () => void;
};

const fieldClass =
  'mt-1.5 w-full rounded-md border-0 bg-white itca-white-surface px-3 py-2.5 text-sm text-[#005080] placeholder:text-[#005080]/40 outline-none focus:ring-2 focus:ring-[#005080]/20';

const FeesModal = ({ open, onClose }: FeesModalProps) => {
  const dialog = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState<FeeAmount>(50);
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
        ) ?? []
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const resetForm = () => {
    setFullName('');
    setMatricNumber('');
    setEmail('');
    setPhone('');
    setAmount(50);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !matricNumber.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await checkoutDues({
        fullName: fullName.trim(),
        matricNumber: matricNumber.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount,
      });

      toast.success('Redirecting to payment…', {
        description: `Pay ${formatFeeAmount(amount)} securely via Modem Pay.`,
      });
      resetForm();
      onClose();
      window.location.href = result.paymentLink;
    } catch (error) {
      const { message } = getErrorMessage(error as Error);
      toast.error('Could not start payment', { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#005080]/55 px-0 pt-16 sm:pt-20"
          onClick={onClose}
        >
          <motion.div
            ref={dialog}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fees-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden rounded-t-[2.5rem] bg-[#FFFFFF] sm:max-h-[calc(100dvh-5rem)] sm:rounded-t-[3.5rem]"
          >
            <div className="flex justify-end shrink-0 px-5 pt-4 sm:px-8 sm:pt-5 lg:px-12">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#005080] itca-blue-surface min-h-11 px-5 py-2 text-sm font-semibold text-[var(--itca-accent-ink)] transition hover:brightness-110"
              >
                Close
              </button>
            </div>

            <div className="grid w-full min-h-0 flex-1 gap-8 overflow-y-auto overscroll-contain px-5 pb-8 pt-2 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-12">
              <div className="flex flex-col justify-between gap-6">
                <h2
                  id="fees-title"
                  className="max-w-md text-3xl font-bold leading-[1.15] text-[#005080] sm:text-4xl lg:text-[2.75rem]"
                >
                  Pay D50 a semester, or settle {formatFeeAmount(FEE_TOTAL_REQUIRED)} in full before
                  you graduate.
                </h2>
                <p className="text-sm leading-relaxed text-[#005080]/75">
                  After payment you&apos;ll get a receipt email with a QR code. Present it to the
                  faculty officer to verify your dues.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-[#005080]">Choose amount</p>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Fee amount">
                    {(
                      [
                        { value: 50 as FeeAmount, label: 'D50', hint: 'One semester' },
                        { value: 400 as FeeAmount, label: 'D400', hint: 'Pay in full' },
                      ] as const
                    ).map((option) => {
                      const active = amount === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setAmount(option.value)}
                          aria-pressed={active}
                          className={`rounded-full px-4 py-3 text-left transition ${
                            active
                              ? 'bg-[#005080] itca-blue-surface text-[var(--itca-accent-ink)]'
                              : 'bg-white itca-white-surface text-[#005080] hover:bg-white/80'
                          }`}
                        >
                          <span className="block text-base font-bold sm:text-lg">
                            {option.label}
                          </span>
                          <span
                            className={`mt-0.5 block text-xs ${
                              active ? 'text-[var(--itca-accent-ink)]/80' : 'text-[#005080]/55'
                            }`}
                          >
                            {option.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="fee-full-name" className="text-sm font-medium text-[#005080]">
                    Full name<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fee-full-name"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="As on your student ID"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="fee-matric" className="text-sm font-medium text-[#005080]">
                    Matric number<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fee-matric"
                    required
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    placeholder="UTG/ICT/2023/001"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="fee-email" className="text-sm font-medium text-[#005080]">
                    Email<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fee-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@utg.edu.gm"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="fee-phone" className="text-sm font-medium text-[#005080]">
                    Telephone number<span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fee-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+220 …"
                    className={fieldClass}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-11 rounded-md bg-white itca-white-surface px-6 py-2.5 text-base font-semibold text-[#005080] transition hover:bg-[#005080] hover:text-white disabled:opacity-60"
                  >
                    {isSubmitting ? 'Starting payment…' : `Pay ${formatFeeAmount(amount)}`}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeesModal;
