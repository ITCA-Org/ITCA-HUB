import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import formatDepartment from '@/utils/format-department';
import { formatAcademicYear } from '@/utils/academic-year';
import {
  downloadPastPaperDocument,
  formatPastPaperSemester,
  normalizePastPaperHtml,
} from '@/utils/past-paper-document';
import { getPastPaper, PastPaper } from '@/hooks/past-papers/use-past-papers';

const PastPaperDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [paper, setPaper] = useState<PastPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady || typeof id !== 'string') return;

    let cancelled = false;
    setIsLoading(true);
    setError('');

    getPastPaper(id)
      .then((data) => {
        if (!cancelled) setPaper(data);
      })
      .catch(() => {
        if (!cancelled) {
          setPaper(null);
          setError('Past paper not found or unavailable.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router.isReady, id]);

  const handleDownload = async () => {
    if (!paper?.displayText?.trim()) {
      toast.error('No paper text is available to download yet.');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadPastPaperDocument(
        {
          title: paper.title,
          course: paper.course,
          lecturer: paper.lecturer,
          year: formatAcademicYear(paper.year),
          semester: paper.semester,
          paperType: paper.paperType,
          department: paper.department,
          displayText: paper.displayText,
        },
        formatDepartment(paper.department)
      );
      toast.success('Download started');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not download this paper.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LandingLayout
      path={typeof id === 'string' ? `/past-papers/${id}` : '/past-papers'}
      title={
        paper
          ? `${paper.title} | Past Papers | ITCA Hub`
          : 'Past Paper | ITCA Hub'
      }
      description={
        paper
          ? `${paper.course} ${paper.paperType} ${formatAcademicYear(paper.year)} — preview and download`
          : 'Preview and download ITCA past papers'
      }
      showFloatingCta={false}
      showNewsletter={false}
    >
      <section className="bg-white px-4 pb-16 pt-10 sm:px-10 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/past-papers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1628]/60 hover:text-[#0A1628]"
          >
            <ArrowLeft className="h-4 w-4" />
            All past papers
          </Link>

          {isLoading && (
            <div className="mt-12 flex items-center gap-3 text-[#0A1628]/70">
              <Loader className="h-5 w-5 animate-spin" />
              Loading paper…
            </div>
          )}

          {!isLoading && (error || !paper) && (
            <div className="mt-12">
              <FileText className="mb-3 h-10 w-10 text-[#0A1628]/25" />
              <h1 className="text-3xl font-bold text-[#0A1628]">Not found</h1>
              <p className="mt-3 text-[#0A1628]/70">
                {error || 'This past paper is unavailable.'}
              </p>
              <Link href="/past-papers" className={`${darkCtaClass} mt-8 inline-flex`}>
                Back to past papers
              </Link>
            </div>
          )}

          {!isLoading && paper && (
            <>
              <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="landing-mono text-sm text-[#FF6A00]">
                    {paper.paperType} · {formatAcademicYear(paper.year)} ·{' '}
                    {formatPastPaperSemester(paper.semester)}
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-[#0A1628] sm:text-4xl">
                    {paper.title}
                  </h1>
                  <dl className="mt-6 grid grid-cols-1 gap-3 text-sm text-[#0A1628]/75 sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-[#0A1628]">Course</dt>
                      <dd>{paper.course}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#0A1628]">Lecturer</dt>
                      <dd>{paper.lecturer}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#0A1628]">Department</dt>
                      <dd>{formatDepartment(paper.department)}</dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!paper.displayText?.trim() || isDownloading}
                  className={`${darkCtaClass} shrink-0 disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {isDownloading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isDownloading ? 'Preparing…' : 'Download'}
                </button>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-lg font-bold text-[#0A1628]">Preview</h2>
                <div className="overflow-hidden rounded-[1.25rem] border border-[#0A1628]/10 bg-[#F5F7FA] p-3 sm:p-6">
                  <article className="mx-auto flex min-h-[28rem] max-w-[800px] flex-col bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-12">
                    <p className="landing-mono text-xs text-[#FF6A00] sm:text-sm">
                      {paper.paperType} · {formatAcademicYear(paper.year)} ·{' '}
                      {formatPastPaperSemester(paper.semester)}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0A1628] sm:text-3xl">
                      {paper.title}
                    </h3>
                    <dl className="mt-5 space-y-1 border-b border-[#0A1628]/15 pb-5 text-sm text-[#0A1628]/75">
                      <div>
                        <dt className="inline font-semibold text-[#0A1628]">
                          Course
                        </dt>
                        <dd className="ml-2 inline">{paper.course}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0A1628]">
                          Lecturer
                        </dt>
                        <dd className="ml-2 inline">{paper.lecturer}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0A1628]">
                          Department
                        </dt>
                        <dd className="ml-2 inline">
                          {formatDepartment(paper.department)}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold text-[#0A1628]">
                          Semester
                        </dt>
                        <dd className="ml-2 inline">
                          {formatPastPaperSemester(paper.semester)}
                        </dd>
                      </div>
                    </dl>

                    {paper.displayText?.trim() ? (
                      <div
                        className="rich-text-content mt-6 flex-1 text-[#0A1628]/85"
                        dangerouslySetInnerHTML={{
                          __html: normalizePastPaperHtml(paper.displayText),
                        }}
                      />
                    ) : (
                      <p className="mt-6 flex-1 text-sm italic text-[#0A1628]/50">
                        No curated paper text is available for this entry yet.
                      </p>
                    )}

                    <footer className="mt-10 border-t border-[#0A1628]/15 pt-4 text-center text-xs font-bold leading-snug tracking-[0.04em] text-[#0A1628] sm:text-sm">
                      University of The Gambia, Information Technology
                      Communication Association
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

export default PastPaperDetailPage;
