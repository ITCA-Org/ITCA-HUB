import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import {
  githubStudentPackIntro,
  githubStudentPackOfficialLinks,
  githubStudentPackPrerequisites,
  githubStudentPackRenewalSteps,
  githubStudentPackSetupSteps,
  githubStudentPackTips,
  type GuideStep,
} from '@/content/github-student-pack-guide';
import { darkCtaClass } from '@/components/landing-page/brand';

type GuideStepListProps = {
  steps: GuideStep[];
  startNumber?: number;
};

const GuideStepList = ({ steps, startNumber = 1 }: GuideStepListProps) => (
  <ol className="space-y-6">
    {steps.map((step, index) => {
      const stepNumber = startNumber + index;
      return (
        <li
          key={step.title}
          className="rounded-[1.25rem] border border-[#0A1628]/10 bg-white p-6 sm:p-8"
        >
          <div className="flex gap-4 sm:gap-5">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#005080] text-sm font-bold text-white"
            >
              {stepNumber}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-[#0A1628] sm:text-xl">
                {step.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#0A1628]/75 sm:text-base">
                {step.body.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6A00]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {step.links && step.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {step.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${darkCtaClass} text-sm`}
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </li>
      );
    })}
  </ol>
);

const GithubStudentPackGuide = () => (
  <>
    <section className="bg-white px-4 pb-8 pt-10 sm:px-10 lg:px-16 lg:pt-14">
      <div className="mx-auto max-w-[900px]">
        <p className="landing-mono text-sm text-[#FF6A00]">
          {githubStudentPackIntro.kicker}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
          {githubStudentPackIntro.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#0A1628]/70 sm:text-lg">
          {githubStudentPackIntro.summary}
        </p>
      </div>
    </section>

    <section className="bg-[#F7F7F7] px-4 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-[1.25rem] border border-[#0A1628]/10 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0A1628]">
            {githubStudentPackPrerequisites.title}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[#0A1628]/75 sm:text-base">
            {githubStudentPackPrerequisites.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-semibold text-[#005080]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[900px]">
        <p className="landing-mono text-sm text-[#FF6A00]">First-time setup</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0A1628] sm:text-3xl">
          Apply and claim your tools
        </h2>
        <p className="mt-3 text-sm text-[#0A1628]/65 sm:text-base">
          Follow these steps in order. External links open official GitHub and
          partner sites.
        </p>
        <div className="mt-8">
          <GuideStepList steps={githubStudentPackSetupSteps} />
        </div>
      </div>
    </section>

    <section className="bg-[#FFE0CC]/40 px-4 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[900px]">
        <p className="landing-mono text-sm text-[#FF6A00]">Stay verified</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0A1628] sm:text-3xl">
          Renew your access
        </h2>
        <p className="mt-3 text-sm text-[#0A1628]/65 sm:text-base">
          Student benefits do not last forever. Use this section when GitHub or
          JetBrains asks you to renew, or when your IDE license stops working.
        </p>
        <div className="mt-8">
          <GuideStepList steps={githubStudentPackRenewalSteps} />
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-12 sm:px-10 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-xl font-bold text-[#0A1628] sm:text-2xl">
          ITCA tips
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-[#0A1628]/75 sm:text-base">
          {githubStudentPackTips.map((tip) => (
            <li
              key={tip}
              className="rounded-xl border border-[#0A1628]/08 bg-[#F7F7F7] px-4 py-3"
            >
              {tip}
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-[1.25rem] bg-[#0A1628] p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold">Official links</h2>
          <ul className="mt-4 space-y-3">
            {githubStudentPackOfficialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2"
                >
                  <span className="font-semibold text-[#FF6A00] group-hover:underline">
                    {link.label}
                  </span>
                  {link.description && (
                    <span className="text-sm text-white/60">
                      — {link.description}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/55">
            Partner offers and renewal rules can change. Always confirm details
            on GitHub&apos;s and JetBrains&apos; official sites.
          </p>
          <Link
            href="/resources"
            className={`${darkCtaClass} mt-6 inline-flex bg-white text-[#0A1628] hover:bg-white/90`}
          >
            Back to resources
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default GithubStudentPackGuide;
