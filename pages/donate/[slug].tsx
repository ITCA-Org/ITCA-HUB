import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, HeartHandshake, Loader } from 'lucide-react';
import { toast } from 'sonner';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import DonationProgress from '@/components/landing-page/donation-progress';
import { formatDalasi } from '@/components/landing-page/shop-data';
import {
  checkoutDonation,
  DONATION_CATEGORY_LABELS,
  useDonationCampaign,
} from '@/hooks/donations/use-donations';
import { getErrorMessage } from '@/utils/error';

const MIN_DONATION = 10;

const inputClass =
  'w-full rounded-xl border border-[#0A1628]/15 bg-white px-4 py-3 text-base text-[#0A1628] focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#D4E6F2]';

const DonateCampaignPage = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined;
  const { campaign, recentDonors, isLoading, isError } = useDonationCampaign(slug);

  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!campaign || isSubmitting) return;

    const value = Math.round(Number(amount));
    if (!Number.isFinite(value) || value < MIN_DONATION) {
      toast.error(`Minimum donation is ${formatDalasi(MIN_DONATION)}`);
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      toast.error('Please enter your name, or choose to donate anonymously');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email so we can send your receipt');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await checkoutDonation({
        campaignId: campaign._id,
        donorName: isAnonymous ? '' : donorName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
        isAnonymous,
        amount: value,
      });
      window.location.href = result.paymentLink;
    } catch (err: unknown) {
      const { message: errorMessage } = getErrorMessage(err as Error);
      toast.error('Could not start donation', { description: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <LandingLayout
      path={`/donate/${slug ?? ''}`}
      title={campaign ? `Donate to ${campaign.title} | ITCA Hub` : 'Donate | ITCA Hub'}
      description={campaign?.summary ?? 'Support ITCA activities'}
    >
      <section className="bg-white px-4 pb-24 pt-28 sm:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#005080] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            All campaigns
          </Link>

          {isLoading && (
            <div className="mt-10 flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Loading campaign…
            </div>
          )}

          {!isLoading && (isError || (!campaign && slug)) && (
            <div className="mt-10">
              <h1 className="text-4xl font-bold text-[#0A1628]">Campaign not found</h1>
              <p className="mt-4 text-lg text-[#0A1628]/70">It may have ended or been closed.</p>
            </div>
          )}

          {campaign && (
            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="min-w-0">
                <p className="landing-mono text-sm text-[#FF6A00]">
                  {DONATION_CATEGORY_LABELS[campaign.category] ?? 'Campaign'}
                </p>
                <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
                  {campaign.title}
                </h1>
                <p className="mt-4 text-lg text-[#0A1628]/75">{campaign.summary}</p>

                {campaign.imageUrl && (
                  <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] bg-[#D4E6F2]">
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="mt-8 rounded-[1.75rem] bg-[#D4E6F2]/60 p-6">
                  <DonationProgress campaign={campaign} />
                </div>

                {campaign.description && (
                  <div className="mt-8 whitespace-pre-line text-base leading-relaxed text-[#0A1628]/80">
                    {campaign.description}
                  </div>
                )}

                {recentDonors.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-xl font-bold text-[#0A1628]">Recent supporters</h2>
                    <ul className="mt-4 divide-y divide-[#0A1628]/10">
                      {recentDonors.map((donor, i) => (
                        <li key={`${donor.paidAt}-${i}`} className="py-3">
                          <div className="flex justify-between gap-4">
                            <span className="font-medium text-[#0A1628]">{donor.name}</span>
                            <span className="text-[#0A1628]/70">{formatDalasi(donor.amount)}</span>
                          </div>
                          {donor.message && (
                            <p className="mt-1 text-sm text-[#0A1628]/60">“{donor.message}”</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-fit rounded-[1.75rem] bg-[#FFE0CC]/60 p-6 sm:p-8 lg:sticky lg:top-28"
              >
                <div className="flex items-center gap-2 text-[#0A1628]">
                  <HeartHandshake className="h-6 w-6 text-[#FF6A00]" />
                  <h2 className="text-2xl font-bold">Make a donation</h2>
                </div>

                <label className="mt-6 block">
                  <span className="mb-1 block text-sm font-medium text-[#0A1628]">
                    Amount (GMD)
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={MIN_DONATION}
                    step={1}
                    required
                    placeholder={`Enter any amount (min ${formatDalasi(MIN_DONATION)})`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 inline-flex items-center gap-2 text-sm text-[#0A1628]/80">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Donate anonymously
                </label>

                {!isAnonymous && (
                  <label className="mt-4 block">
                    <span className="mb-1 block text-sm font-medium text-[#0A1628]">Full name</span>
                    <input
                      required
                      maxLength={120}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="mt-4 block">
                  <span className="mb-1 block text-sm font-medium text-[#0A1628]">
                    Email <span className="font-normal text-[#0A1628]/50">(for your receipt)</span>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-1 block text-sm font-medium text-[#0A1628]">
                    Phone <span className="font-normal text-[#0A1628]/50">(optional)</span>
                  </span>
                  <input
                    type="tel"
                    maxLength={40}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-1 block text-sm font-medium text-[#0A1628]">
                    Message <span className="font-normal text-[#0A1628]/50">(optional)</span>
                  </span>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${darkCtaClass} mt-6 w-full py-4 text-base disabled:opacity-60`}
                >
                  {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
                  {isSubmitting
                    ? 'Redirecting to payment…'
                    : `Donate ${Number(amount) >= MIN_DONATION ? formatDalasi(Math.round(Number(amount))) : ''}`}
                </button>
                <p className="mt-3 text-center text-xs text-[#0A1628]/55">
                  Payments are processed securely by Modem Pay.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default DonateCampaignPage;
