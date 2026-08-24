import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { darkCtaClass } from './brand';
import { Reveal } from './reveal';
import {
  FEE_TOTAL_REQUIRED,
  type FeeAmount,
  formatFeeAmount,
  saveFeePayment,
  totalPaidForMatric,
  isAuditEligible,
} from '@/utils/fees';

const fieldClass =
  'mt-1.5 w-full min-h-12 rounded-2xl border border-[#0A1628]/15 bg-white px-4 py-3.5 text-base text-[#0A1628] placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20 sm:py-3';

const FeesSection = () => {
  const [amount, setAmount] = useState<FeeAmount>(50);
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setFullName('');
      setMatricNumber('');
      setEmail('');
      setPhone('');
      setAmount(50);
    } catch {
      toast.error('Could not save payment. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pay" className="bg-white px-4 pb-14 pt-6 sm:px-10 sm:py-20 md:pt-14 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-8 hidden max-w-3xl md:mb-14 md:block">
          <p className="landing-mono mb-4 text-sm text-[#FF6A00]">Semester fees</p>
          <h2 className="text-3xl font-bold leading-tight text-[#0A1628] sm:text-4xl lg:text-5xl">
            Pay D50 per semester, or D400 in full
          </h2>
          <p className="mt-4 max-w-2xl text-base text-[#0A1628]/70 sm:text-lg">
            Before you graduate you must have paid a total of{' '}
            <strong className="font-semibold text-[#0A1628]">
              {formatFeeAmount(FEE_TOTAL_REQUIRED)}
            </strong>
            . Students who have not cleared their dues cannot collect their audit form from the
            admin office.
          </p>
        </Reveal>

        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-xl rounded-[1.25rem] bg-[#D4E6F2] p-4 sm:rounded-[2rem] sm:p-8"
          >
            <p className="text-sm font-semibold text-[#0A1628]">Choose amount</p>
            <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Fee amount">
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
                    className={`min-h-[4.5rem] rounded-2xl px-3 py-3 text-left transition sm:px-4 sm:py-4 ${
                      active
                        ? 'bg-[#0A1628] text-[#FF6A00]'
                        : 'bg-white text-[#0A1628] hover:bg-white/80'
                    }`}
                  >
                    <span className="block text-lg font-bold sm:text-xl">{option.label}</span>
                    <span
                      className={`mt-1 block text-[11px] leading-snug sm:text-xs ${
                        active ? 'text-[#FF6A00]/80' : 'text-[#0A1628]/60'
                      }`}
                    >
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
              <div>
                <label htmlFor="fee-full-name" className="text-sm font-medium text-[#0A1628]">
                  Full name
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
                  Matric number
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
                  Email
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
                  Telephone number
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${darkCtaClass} mt-5 min-h-12 w-full disabled:opacity-70 sm:mt-6`}
            >
              {isSubmitting ? 'Saving…' : `Submit ${formatFeeAmount(amount)}`}
            </button>

            <p className="mt-3 text-xs leading-relaxed text-[#0A1628]/55">
              UI demo only — payments are saved on this device for now. Bring proof to the admin
              office until online payment goes live.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default FeesSection;
