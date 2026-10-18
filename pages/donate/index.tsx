import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, Loader } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import DonationProgress from '@/components/landing-page/donation-progress';
import { DONATION_CATEGORY_LABELS, useDonationCampaigns } from '@/hooks/donations/use-donations';

const DonatePage = () => {
  const { campaigns, isLoading, isError, refresh } = useDonationCampaigns();

  return (
    <LandingLayout
      path="/donate"
      title="Donate | ITCA Hub"
      description="Support ITCA activities: hackathons, ITCA Week, the nationwide tour, pad donation drives, Face of UTG and more."
    >
      <section className="bg-white px-4 pb-10 pt-28 sm:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <p className="landing-mono text-base text-[#FF6A00]">Donate</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
            Back the activities that make ITCA what it is.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[#0A1628]/70">
            Every dalasi goes straight to the campaign you choose. Pick one below and give securely
            with Modem Pay.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          {isLoading && (
            <div className="flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Loading campaigns…
            </div>
          )}

          {isError && (
            <div className="rounded-[1.75rem] bg-[#FFE0CC] p-8">
              <p className="text-lg text-[#0A1628]">We couldn&apos;t load campaigns.</p>
              <button type="button" onClick={refresh} className={`${darkCtaClass} mt-5`}>
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && campaigns.length === 0 && (
            <div className="rounded-[1.75rem] bg-[#D4E6F2] p-10 text-center">
              <HeartHandshake className="mx-auto h-10 w-10 text-[#005080]" />
              <p className="mt-4 text-lg font-semibold text-[#0A1628]">
                No open campaigns right now
              </p>
              <p className="mt-2 text-[#0A1628]/70">Check back soon.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
              <Link
                key={campaign._id}
                href={`/donate/${campaign.slug}`}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-[#D4E6F2]/60 transition hover:bg-[#D4E6F2]"
              >
                <div className="relative aspect-[16/10] w-full bg-[#0A1628]/10">
                  {campaign.imageUrl ? (
                    <Image
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <HeartHandshake className="h-12 w-12 text-[#005080]/50" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="landing-mono text-xs text-[#FF6A00]">
                    {DONATION_CATEGORY_LABELS[campaign.category] ?? 'Campaign'}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#0A1628]">{campaign.title}</h2>
                  <p className="mt-2 line-clamp-3 text-[#0A1628]/70">{campaign.summary}</p>
                  <div className="mt-auto pt-6">
                    <DonationProgress campaign={campaign} />
                    <span className={`${darkCtaClass} mt-5 w-full`}>Donate</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default DonatePage;
