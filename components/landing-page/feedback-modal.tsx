import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { CONTACT_MAIL } from './brand';

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get('firstName') ?? '');
    const lastName = String(data.get('lastName') ?? '');
    const email = String(data.get('email') ?? '');
    const organization = String(data.get('organization') ?? '');
    const message = String(data.get('message') ?? '');

    const subject = encodeURIComponent(`ITCA Hub feedback from ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\nOrganization: ${organization}\n\n${message}`
    );

    window.location.href = `mailto:itca@utg.edu.gm?subject=${subject}&body=${body}`;
    toast.success('Opening your email app to send feedback.');
    setIsSubmitting(false);
    form.reset();
    onClose();
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
                  <label htmlFor="firstName" className="text-sm font-medium text-[#0A1628]">
                    First Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Your first name..."
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-[#0A1628]">
                    Last Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Your last name..."
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-[#0A1628]">
                    Email<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address..."
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="text-sm font-medium text-[#0A1628]">
                    School / Department<span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    id="organization"
                    name="organization"
                    type="text"
                    placeholder="e.g. School of ICT..."
                    className={fieldClass}
                  />
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
