'use client';

import { FormEvent, useState } from 'react';
import { Loader, Search } from 'lucide-react';
import { toast } from 'sonner';
import { checkDuesStatus, DuesStatusResult } from '@/hooks/dues/use-dues';
import { getErrorMessage } from '@/utils/error';
import { FEE_TOTAL_REQUIRED, formatFeeAmount, getFeeBalanceRemaining } from '@/utils/fees';

const inputClass =
  'w-full rounded-full border border-[#005080]/10 bg-white itca-white-surface px-4 py-3 text-sm text-[#005080] placeholder:text-[#005080]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20';

const FeesStatusCheck = ({ compact = false }: { compact?: boolean }) => {
  const [matricNumber, setMatricNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DuesStatusResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!matricNumber.trim()) {
      toast.error('Enter your matric number');
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const data = await checkDuesStatus({
        matricNumber: matricNumber.trim(),
      });
      setResult(data);
      setMatricNumber(data.matricNumber);
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Could not find dues record', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const balance =
    result == null
      ? 0
      : (result.balanceRemaining ??
        getFeeBalanceRemaining(result.totalPaid, result.feeTotalRequired));

  return (
    <section
      id="fee-status"
      style={{ scrollMarginTop: '8rem' }}
      className={`bg-[#FFFFFF] px-4 sm:px-10 lg:px-16 ${compact ? 'py-6' : 'py-14'}`}
    >
      <div className="mx-auto max-w-[720px] rounded-[1.75rem] border border-[#005080]/30 bg-white itca-white-surface p-6 sm:p-8">
        <p className="landing-mono text-xs text-[var(--itca-accent-ink)]">Fee status</p>
        <h2 className="mt-2 text-2xl font-bold text-[#005080] sm:text-3xl">
          Check your fee status
        </h2>
        <p className="mt-2 text-sm text-[#005080]/70">
          Enter your matric number to see how much you have paid and any balance remaining toward{' '}
          {formatFeeAmount(FEE_TOTAL_REQUIRED)}.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <label
            htmlFor="dues-matric-number"
            className="block text-sm font-semibold text-[#005080]"
          >
            Matric number
          </label>
          <input
            id="dues-matric-number"
            name="matricNumber"
            required
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            placeholder="Matric number"
            className={inputClass}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#005080] itca-blue-surface px-6 text-sm font-semibold text-[var(--itca-accent-ink)] transition hover:brightness-110 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? 'Checking…' : 'Check status'}
          </button>
        </form>

        {result && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-[1.25rem] bg-[#FFFFFF] p-5 text-[#005080]"
          >
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#005080]/70">Matric</dt>
                <dd className="font-semibold">{result.matricNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#005080]/70">Total paid</dt>
                <dd className="font-semibold">
                  {formatFeeAmount(result.totalPaid)} / {formatFeeAmount(result.feeTotalRequired)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#005080]/70">Balance</dt>
                <dd
                  className={`font-semibold ${balance <= 0 ? 'text-green-800' : 'text-amber-800'}`}
                >
                  {balance <= 0 ? 'Full fee met' : formatFeeAmount(balance)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#005080]/70">Eligibility</dt>
                <dd
                  className={`font-semibold ${
                    result.auditEligible ? 'text-green-800' : 'text-amber-800'
                  }`}
                >
                  {result.auditEligible ? 'Audit eligible' : 'Not yet eligible'}
                </dd>
              </div>
            </dl>

            {result.payments.length > 0 && (
              <div className="mt-4 border-t border-[#005080]/15 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#005080]/55">
                  Paid receipts
                </p>
                <ul className="space-y-1 text-sm">
                  {result.payments.map((payment, index) => (
                    <li
                      key={`${payment.receiptNumber || index}-${payment.paidAt}`}
                      className="flex justify-between gap-3"
                    >
                      <span className="truncate text-[#005080]/70">
                        {payment.receiptNumber || 'Receipt'}
                        {payment.paidAt
                          ? ` · ${new Date(payment.paidAt).toLocaleDateString()}`
                          : ''}
                      </span>
                      <span className="font-medium">{formatFeeAmount(payment.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeesStatusCheck;
