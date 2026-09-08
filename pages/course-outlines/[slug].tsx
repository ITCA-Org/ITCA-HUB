import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import { getCourseOutline, totalCreditHours } from '@/content/course-outlines';
import { downloadCourseOutlineDocument } from '@/utils/course-outline-document';

const CourseOutlineDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const outline = typeof slug === 'string' ? getCourseOutline(slug) : null;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!outline) return;

    setIsDownloading(true);
    try {
      await downloadCourseOutlineDocument(outline);
      toast.success('Download started');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not download this outline.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LandingLayout
      path={typeof slug === 'string' ? `/course-outlines/${slug}` : '/course-outlines'}
      title={
        outline
          ? `${outline.title} | Course Outlines | ITCA Hub`
          : 'Course Outline | ITCA Hub'
      }
      description={
        outline
          ? `${outline.programme} — preview and download as PDF`
          : 'Preview and download School of ICT course outlines'
      }
      showFloatingCta={false}
      showNewsletter={false}
    >
      <section className="bg-white px-4 pb-16 pt-10 sm:px-10 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/course-outlines"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628]/60 hover:text-[#0A1628]"
          >
            <ArrowLeft className="h-4 w-4" />
            All course outlines
          </Link>

          {!router.isReady && (
            <div className="mt-12 flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Loading outline…
            </div>
          )}

          {router.isReady && !outline && (
            <div className="mt-12">
              <FileText className="mb-3 h-10 w-10 text-[#0A1628]/25" />
              <h1 className="text-3xl font-bold text-[#0A1628]">Not found</h1>
              <p className="mt-3 text-[#0A1628]/70">
                This course outline is unavailable.
              </p>
              <Link href="/course-outlines" className={`${darkCtaClass} mt-8 inline-flex`}>
                Back to course outlines
              </Link>
            </div>
          )}

          {router.isReady && outline && (
            <>
              <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="landing-mono text-sm text-[#FF6A00]">{outline.university}</p>
                  <h1 className="mt-2 text-3xl font-bold text-[#0A1628] sm:text-4xl">
                    {outline.title}
                  </h1>
                  <p className="mt-3 text-sm text-[#0A1628]/70 sm:text-base">
                    {outline.school}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-[#0A1628]/75">
                    {outline.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`${darkCtaClass} shrink-0 disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {isDownloading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isDownloading ? 'Preparing…' : 'Download PDF'}
                </button>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-lg font-bold text-[#0A1628]">Preview</h2>
                <div className="overflow-hidden rounded-[1.25rem] border border-[#0A1628]/10 bg-[#F5F7FA] p-3 sm:p-6">
                  <article className="mx-auto max-w-[800px] bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12">
                    <p className="landing-mono text-xs text-[#FF6A00] sm:text-sm">
                      {outline.university}
                    </p>
                    <p className="mt-1 text-sm text-[#0A1628]/70">{outline.school}</p>
                    <h3 className="mt-4 text-2xl font-bold text-[#0A1628] sm:text-3xl">
                      {outline.title}
                    </h3>
                    <p className="mt-4 border-b border-[#0A1628]/15 pb-5 text-sm leading-relaxed text-[#0A1628]/75">
                      {outline.summary}
                    </p>

                    <h4 className="mt-6 text-base font-bold text-[#0A1628]">
                      {outline.tableHeading}
                    </h4>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#0A1628]/15 bg-[#F3F6F9]">
                            <th className="px-3 py-2.5 font-semibold text-[#0A1628]">S/N</th>
                            <th className="px-3 py-2.5 font-semibold text-[#0A1628]">
                              Course Code
                            </th>
                            <th className="px-3 py-2.5 font-semibold text-[#0A1628]">
                              Course Title
                            </th>
                            <th className="px-3 py-2.5 text-center font-semibold text-[#0A1628]">
                              Credit Hrs.
                            </th>
                            <th className="px-3 py-2.5 font-semibold text-[#0A1628]">Section</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outline.courses.map((course) => (
                            <tr
                              key={`${course.code}-${course.sn}`}
                              className="border-b border-[#0A1628]/08"
                            >
                              <td className="px-3 py-2.5 text-[#0A1628]/70">{course.sn}</td>
                              <td className="px-3 py-2.5 font-medium text-[#0A1628]">
                                {course.code}
                              </td>
                              <td className="px-3 py-2.5 text-[#0A1628]">{course.title}</td>
                              <td className="px-3 py-2.5 text-center text-[#0A1628]/70">
                                {course.creditHours}
                              </td>
                              <td className="px-3 py-2.5 text-[#0A1628]/70">{course.section}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-[#F8FAFC]">
                            <td
                              colSpan={3}
                              className="px-3 py-2.5 font-semibold text-[#0A1628]"
                            >
                              Listed core courses
                            </td>
                            <td className="px-3 py-2.5 text-center font-semibold text-[#0A1628]">
                              {totalCreditHours(outline)}
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-[#0A1628]">
                              {outline.courses.length} courses
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <footer className="mt-10 border-t border-[#0A1628]/15 pt-4 text-center text-xs font-bold leading-snug tracking-[0.04em] text-[#0A1628] sm:text-sm">
                      University of The Gambia, Information Technology Communication
                      Association
                    </footer>
                  </article>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default CourseOutlineDetailPage;
