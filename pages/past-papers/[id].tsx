import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import LandingLayout from '@/components/landing-page/landing-layout';
import { darkCtaClass } from '@/components/landing-page/brand';
import formatDepartment from '@/utils/format-department';
import { downloadPastPaperDocument, normalizePastPaperHtml } from '@/utils/past-paper-document';
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
          department: paper.department,
          displayText: paper.displayText,
        },
        formatDepartment(paper.department)
      );
      toast.success('Download started');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not download this paper.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LandingLayout
      path={typeof id === 'string' ? `/past-papers/${id}` : '/past-papers'}
      title={paper ? `${paper.title} | Past Papers | ITCA Hub` : 'Past Paper | ITCA Hub'}
      description={
        paper ? `${paper.course} — preview and download` : 'Preview and download ITCA past papers'
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
              <p className="mt-3 text-[#0A1628]/70">{error || 'This past paper is unavailable.'}</p>
              <Link href="/past-papers" className={`${darkCtaClass} mt-8 inline-flex`}>
                Back to past papers
              </Link>
            </div>
          )}

          {!isLoading && paper && (
            <>
              <div className="sticky top-24 z-20 mt-6 flex flex-col gap-4 rounded-2xl border border-[#0A1628]/10 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold text-[#0A1628] sm:text-2xl">
                    {paper.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-[#0A1628]/75">
                    {paper.course && (
                      <span className="rounded-full bg-[#D4E6F2] px-3 py-1">{paper.course}</span>
                    )}
                    {paper.lecturer && (
                      <span className="rounded-full bg-[#0A1628]/5 px-3 py-1">
                        {paper.lecturer}
                      </span>
                    )}
                    <span className="rounded-full bg-[#0A1628]/5 px-3 py-1">
                      {formatDepartment(paper.department)}
                    </span>
                  </div>
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
                  {isDownloading ? 'Preparing PDF…' : 'Download PDF'}
                </button>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-[#F5F7FA] p-2 sm:p-8">
                <article className="mx-auto flex min-h-[28rem] max-w-[820px] flex-col rounded-xl bg-white px-5 py-8 shadow-[0_1px_3px_rgba(10,22,40,0.08),0_12px_32px_rgba(10,22,40,0.06)] sm:px-14 sm:py-14">
                  <header className="border-b border-[#0A1628]/15 pb-6 text-center">
                    <p className="landing-mono text-xs uppercase tracking-[0.14em] text-[#FF6A00]">
                      Past paper
                    </p>
                    <h2 className="mt-3 text-2xl font-bold leading-tight text-[#0A1628] sm:text-3xl">
                      {paper.title}
                    </h2>
                    <p className="mt-3 text-sm text-[#0A1628]/65">
                      {[paper.course, paper.lecturer].filter(Boolean).join(' · ')}
                    </p>
                  </header>

                  {paper.displayText?.trim() ? (
                    <div
                      className="rich-text-content past-paper-content mt-8 flex-1 text-[15px] text-[#0A1628] sm:text-base"
                      dangerouslySetInnerHTML={{
                        __html: normalizePastPaperHtml(paper.displayText),
                      }}
                    />
                  ) : (
                    <p className="mt-8 flex-1 text-sm italic text-[#0A1628]/50">
                      No curated paper text is available for this entry yet.
                    </p>
                  )}

                  <footer className="mt-12 border-t border-[#0A1628]/15 pt-4 text-center text-xs font-bold leading-snug tracking-[0.04em] text-[#0A1628]/80 sm:text-sm">
                    University of The Gambia, Information Technology Communication Association
                  </footer>
                </article>
              </div>
            </>
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default PastPaperDetailPage;
