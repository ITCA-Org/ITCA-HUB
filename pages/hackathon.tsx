import Link from 'next/link';
import axios from 'axios';
import useSWR from 'swr';
import { BASE_URL } from '@/utils/url';
import type { HackathonSettings } from '@/types/interfaces/hackathon';
export type { HackathonSettings } from '@/types/interfaces/hackathon';
import LandingLayout from '@/components/landing-page/landing-layout';

export default function HackathonPage() {
  const { data: settings, error } = useSWR<HackathonSettings>('/hackathon/public', async () => {
    const response = await axios.get(`${BASE_URL}/hackathon`);
    return response.data.data;
  });
  return (
    <LandingLayout
      path="/hackathon"
      title="Hackathon & Seminar 2026 | ITCA Hub"
      description="Form a team, build a working software product, and connect with students at the ITCA Hackathon & Seminar 2026."
      showFloatingCta={false}
      showNewsletter={false}
    >
      <section className="bg-[#0A1628] px-5 pb-20 pt-32 text-white md:pt-44">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">ITCA</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Your team. Your ideas.
            <br />
            <span className="text-orange-400">Build something that matters.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Hackathon & Seminar 2026 brings students together to turn real-world problems into
            working web, mobile, or desktop software.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/30 px-5 py-3">21 October 2026</span>
            <span className="rounded-full border border-white/30 px-5 py-3">
              ITC Theatre · proposed venue
            </span>
            <span className="rounded-full border border-white/30 px-5 py-3">
              Open to interested students
            </span>
          </div>
          {settings?.applicationsOpen === false ? (
            <p className="mt-9 text-orange-300">Team applications are currently closed.</p>
          ) : (
            <Link
              href="/hackathon/apply"
              className="mt-9 inline-block rounded-full bg-[#FF6A00] px-8 py-4 font-semibold"
            >
              Apply with your team →
            </Link>
          )}
        </div>
      </section>
      <section className="bg-[#F5F3EE] px-5 py-16">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {[
            [
              'Build together',
              'Bring your technical and creative skills. Form a team around the skills your project needs.',
            ],
            [
              'Demo your product',
              'Start with a problem, prototype with mentor support, then pitch and demonstrate your working software.',
            ],
            [
              'Connect and celebrate',
              'Join the seminar while judges deliberate, followed by results and recognition.',
            ],
          ].map(([title, text], i) => (
            <div key={title}>
              <p className="text-orange-600 font-bold">0{i + 1}</p>
              <h2 className="mt-3 text-2xl font-bold">{title}</h2>
              <p className="mt-3 text-slate-600">{text}</p>
            </div>
          ))}
          <div className="md:col-span-3 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold">
              Connecting Innovation: Technology and Connectivity Shaping The Gambia&apos;s Future
            </h2>
            <p className="mt-3 text-slate-600">
              The seminar follows the final demos, bringing students together to explore technology,
              connectivity, and innovation. Final schedule and event details will be announced.
            </p>
          </div>
        </div>
      </section>
      <section id="problems" className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">Problem statements</h2>
          <p className="mt-3 text-slate-600">Your next build starts here.</p>
          {error && (
            <p role="alert" className="mt-4 text-sm text-slate-500">
              Unable to refresh event information. Please reload to try again.
            </p>
          )}
          {settings?.problemsPublished ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {settings.problems.map((problem, index) => (
                <article
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-600">
                    Challenge {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-2xl font-bold">{problem.title}</h3>
                  <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-slate-600">
                    {problem.description}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <div
                aria-hidden="true"
                className="pointer-events-none grid select-none gap-5 p-8 blur-md md:grid-cols-2"
              >
                {[1, 2].map((number) => (
                  <div key={number} className="rounded-xl border bg-slate-50 p-6">
                    <div className="h-6 w-2/3 rounded bg-slate-300" />
                    <div className="mt-5 h-3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 px-6 text-center">
                <h3 className="text-xl font-semibold">Problem statements coming soon</h3>
                <p className="mt-2 text-slate-600">
                  {settings?.applicationsOpen === false
                    ? 'Official challenges will be revealed here later.'
                    : 'Apply with your team now. Official challenges will be revealed here later.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
}
