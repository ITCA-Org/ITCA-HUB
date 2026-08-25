import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { CONTACT_MAIL } from './brand';
import { BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
};

const fieldClass =
  'mt-1.5 w-full rounded-md border-0 bg-white px-3 py-2.5 text-sm text-[#0A1628] placeholder:text-[#0A1628]/40 outline-none focus:ring-2 focus:ring-[#0A1628]/20';

const FeedbackModal = ({ open, onClose }: FeedbackModalProps) => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const fullName = String(data.get('fullName') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const organization = String(data.get('organization') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    try {
      await axios.post(`${BASE_URL}/feedback`, {
        fullName: fullName || undefined,
        email: email || undefined,
        organization,
        message,
      });

      toast.success('Feedback sent', {
        description: email
          ? 'Thanks — check your inbox for a confirmation email.'
          : 'Thanks — the ITCA team has received your message.',
      });
      form.reset();
      onClose();
    } catch (error) {
      const { message: errorMessage } = getErrorMessage(error as Error);
      toast.error('Could not send feedback', {
        description: errorMessage,
      });
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
            aria-labelledby="feedback-title"
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
                  id="feedback-title"
                  className="max-w-md text-3xl font-bold leading-[1.15] text-[#0A1628] sm:text-4xl lg:text-[2.75rem]"
                >
                  Whether you have thoughts on a recent event, something that could work better, or
                  just want to say hi—you&apos;re in the right place.
                </h2>
                <p className="text-sm text-[#0A1628]">
                  If you&apos;d prefer to reach out directly...{' '}
                  <a href={CONTACT_MAIL} className="underline underline-offset-4">
                    itca@utg.edu.gm
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label htmlFor="fullName" className="text-sm font-medium text-[#0A1628]">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name..."
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-[#0A1628]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your email address..."
                    className={fieldClass}
                  />
                  <p className="mt-1.5 text-xs text-[#0A1628]/55">
                    Optional — add it to receive a confirmation email.
                  </p>
                </div>

                <div>
                  <label htmlFor="organization" className="text-sm font-medium text-[#0A1628]">
                    School / Department<span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    id="organization"
                    name="organization"
                    defaultValue=""
                    className={`${fieldClass} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a programme...
                    </option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information System">Information System</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-[#0A1628]">
                    Feedback<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    required
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Share your feedback or question..."
                    className={`${fieldClass} resize-y`}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-[#0A1628] transition hover:bg-[#0A1628] hover:text-[#FF6A00] disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
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

export default FeedbackModal;
