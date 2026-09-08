import Link from 'next/link';
import { Download, FileText } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import { COURSE_OUTLINES, outlineMetaLabel } from '@/content/course-outlines';

const CourseOutlinesPage = () => {
  return (
    <LandingLayout
      path="/course-outlines"
      title="Course Outlines | ITCA Hub"
      description="Browse and download School of ICT course outlines and programme requirements as PDF."
      showFloatingCta={false}
    >
      <section className="bg-white px-4 pb-16 pt-10 sm:px-10 lg:px-16 lg:pb-24 lg:pt-14">
        <div className="mx-auto max-w-[1200px]">
          <p className="landing-mono mb-3 text-sm text-[#FF6A00]">Course outlines</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
            Programme requirements — preview or download as PDF.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#0A1628]/70 sm:text-lg">
            Official School of ICT course outlines and minor requirements. More programmes will be
            added here as they become available.
          </p>

          <p className="mt-8 text-sm text-[#0A1628]/55">
            {COURSE_OUTLINES.length} outline{COURSE_OUTLINES.length === 1 ? '' : 's'}
          </p>

          {COURSE_OUTLINES.length === 0 ? (
            <div className="mt-10 rounded-[1.5rem] border border-dashed border-[#0A1628]/20 px-6 py-16 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-[#0A1628]/25" />
              <p className="text-lg font-semibold text-[#0A1628]">No outlines yet</p>
              <p className="mt-2 text-sm text-[#0A1628]/65">Check back soon for new uploads.</p>
            </div>
          ) : (
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {COURSE_OUTLINES.map((outline) => (
                <li key={outline.slug}>
                  <Link
                    href={`/course-outlines/${outline.slug}`}
                    className="block rounded-[1.5rem] border border-[#0A1628]/08 bg-white p-6 transition hover:border-[#005080]/30 hover:shadow-sm"
                  >
                    <h2 className="text-xl font-bold text-[#0A1628]">{outline.title}</h2>
                    <p className="mt-2 text-sm text-[#0A1628]/70">{outline.programme}</p>
                    <p className="mt-1 text-xs text-[#0A1628]/45">
                      {outlineMetaLabel(outline)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#005080]">
                      Preview & download
                      <Download className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default CourseOutlinesPage;
