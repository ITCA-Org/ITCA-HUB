import Link from 'next/link';
import { Github, GraduationCap, ScrollText } from 'lucide-react';

const resourceCategories = [
  {
    name: 'Past Papers',
    icon: ScrollText,
    description: 'Exams, tests, quizzes — preview & download',
    href: '/past-papers',
    blue: false,
  },
  {
    name: 'GitHub Student Developer Pack',
    icon: Github,
    description: 'Free dev tools for UTG students — step-by-step',
    href: '/resources/github-student-pack',
    blue: false,
  },
  {
    name: 'Course Outlines',
    icon: GraduationCap,
    description: 'Programme requirements — preview & download PDF',
    href: '/course-outlines',
    blue: true,
  },
];

export default function ResourcesSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section
      aria-labelledby={showHeading ? 'resource-heading' : undefined}
      aria-label={showHeading ? undefined : 'Study resources'}
      id="resources"
      className="bg-white itca-white-surface pb-12 pt-6"
    >
      {showHeading && (
        <div className="mx-auto max-w-[1400px] px-5 pb-6 sm:px-10 lg:px-16">
          <h2 id="resource-heading" className="text-2xl font-semibold text-[#005080] sm:text-3xl">
            Study resources
          </h2>
        </div>
      )}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:gap-6 lg:px-16">
        {resourceCategories.map(({ name, icon: Icon, description, href, blue }) => (
          <Link
            key={href}
            href={href}
            className={`flex min-h-[200px] flex-col justify-between gap-8 rounded-2xl border border-[#005080]/20 p-6 transition-colors hover:underline sm:min-h-[220px] sm:p-8 lg:min-h-[240px] ${blue ? 'bg-[#005080] itca-blue-surface text-white' : 'bg-white itca-white-surface text-[#005080]'}`}
          >
            <div className="flex items-start justify-between">
              <Icon aria-hidden="true" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-wide">Open</span>
            </div>
            <div>
              <h3 className="text-xl font-bold sm:text-2xl">{name}</h3>
              <p className="mt-2 text-base leading-7">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
