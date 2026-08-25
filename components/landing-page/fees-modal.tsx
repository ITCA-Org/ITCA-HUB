'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  FEE_TOTAL_REQUIRED,
  type FeeAmount,
  formatFeeAmount,
  saveFeePayment,
  totalPaidForMatric,
  isAuditEligible,
} from '@/utils/fees';

type FeesModalProps = {
  open: boolean;
  onClose: () => void;
};

const fieldClass =
  'mt-1.5 w-full rounded-md border-0 bg-white px-3 py-2.5 text-sm text-[#0A1628] placeholder:text-[#0A1628]/40 outline-none focus:ring-2 focus:ring-[#0A1628]/20';

const FeesModal = ({ open, onClose }: FeesModalProps) => {
  const [amount, setAmount] = useState<FeeAmount>(50);
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
      const payment = saveFeePayment({
        fullName,
        matricNumber,
        email,
        phone,
        amount,
      });

      const total = totalPaidForMatric(payment.matricNumber);
      const eligible = isAuditEligible(payment.matricNumber);

      toast.success('Payment recorded', {
        description: eligible
          ? `${formatFeeAmount(amount)} saved. Total ${formatFeeAmount(total)} — audit form eligible.`
          : `${formatFeeAmount(amount)} saved. Total ${formatFeeAmount(total)} of ${formatFeeAmount(FEE_TOTAL_REQUIRED)} before graduation.`,
      });

      resetForm();
      onClose();
    } catch {
      toast.error('Could not save payment. Try again.');
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
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0A1628]/55 px-0 pt-16 sm:pt-20"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fees-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[calc(100svh-4rem)] w-full flex-col overflow-hidden rounded-t-[2.5rem] bg-[#FFE0CC] sm:max-h-[calc(100svh-5rem)] sm:rounded-t-[3.5rem]"
          >
            <div className="flex justify-end px-5 pt-4 sm:px-8 sm:pt-5 lg:px-12">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#0A1628] px-5 py-2 text-sm font-semibold text-[#FF6A00] transition hover:brightness-110"
              >
                Close
              </button>
            </div>

            <div className="grid w-full flex-1 gap-8 overflow-y-auto px-5 pb-8 pt-2 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-12">
              <div className="flex flex-col justify-between gap-6">
                <h2
                  id="fees-title"
                  className="max-w-md text-3xl font-bold leading-[1.15] text-[#0A1628] sm:text-4xl lg:text-[2.75rem]"
                >
                  Pay D50 a semester, or settle {formatFeeAmount(FEE_TOTAL_REQUIRED)} in full before
                  you graduate.
                </h2>
                <p className="text-sm leading-relaxed text-[#0A1628]/75">
                  Demo only for now — submissions save on this device. Bring proof to the admin
                  office until online payment goes live.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-[#0A1628]">Choose amount</p>
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
                              ? 'bg-[#0A1628] text-[#FF6A00]'
                              : 'bg-white text-[#0A1628] hover:bg-white/80'
                          }`}
                        >
                          <span className="block text-base font-bold sm:text-lg">{option.label}</span>
                          <span
                            className={`mt-0.5 block text-xs ${
                              active ? 'text-[#FF6A00]/80' : 'text-[#0A1628]/55'
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
                  <label htmlFor="fee-full-name" className="text-sm font-medium text-[#0A1628]">
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
                  <label htmlFor="fee-matric" className="text-sm font-medium text-[#0A1628]">
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
                  <label htmlFor="fee-email" className="text-sm font-medium text-[#0A1628]">
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
                  <label htmlFor="fee-phone" className="text-sm font-medium text-[#0A1628]">
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
                    className="rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-[#0A1628] transition hover:bg-[#0A1628] hover:text-[#FF6A00] disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving…' : `Submit ${formatFeeAmount(amount)}`}
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
