import { useState } from 'react';
import Link from 'next/link';
import { Download, FileText, Search } from 'lucide-react';
import LandingLayout from '@/components/landing-page/landing-layout';
import ListPagination from '@/components/landing-page/list-pagination';
import useDebounce from '@/utils/debounce';
import formatDepartment from '@/utils/format-department';
import { usePastPapers } from '@/hooks/past-papers/use-past-papers';

const PastPapersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [course, setCourse] = useState('');
  const [page, setPage] = useState(0);
  const limit = 12;

  const debouncedSearch = useDebounce(searchTerm, 400);
  const debouncedCourse = useDebounce(course, 400);

  const { papers, total, totalPages, isLoading, isError, refresh } =
    usePastPapers({
      page,
      limit,
      search: debouncedSearch,
      department,
      course: debouncedCourse,
    });

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LandingLayout
      path="/past-papers"
      title="Past Papers | ITCA Hub"
      description="Browse, preview, and download School of ICT past exams, tests, quizzes, and make-up papers."
      showFloatingCta={false}
    >
      <section className="bg-white px-4 pb-16 pt-10 sm:px-10 lg:px-16 lg:pb-24 lg:pt-14">
        <div className="mx-auto max-w-[1200px]">
          <p className="landing-mono mb-3 text-sm text-[#FF6A00]">Past papers</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#0A1628] sm:text-5xl">
            Exams, tests, and quizzes — preview or download.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#0A1628]/70 sm:text-lg">
            Filter by course and department. No login required.
          </p>

          <div className="mt-10 space-y-4 rounded-[1.75rem] bg-[#F7F7F7] p-4 sm:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0A1628]/35" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                placeholder="Search questions, topics, course, lecturer…"
                className="w-full rounded-full border border-[#0A1628]/10 bg-white py-3.5 pl-12 pr-4 text-base text-[#0A1628] placeholder:text-[#0A1628]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setPage(0);
                }}
                placeholder="Course code"
                className="rounded-full border border-[#0A1628]/10 bg-white px-4 py-3 text-sm"
              />
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(0);
                }}
                className="rounded-full border border-[#0A1628]/10 bg-white px-4 py-3 text-sm"
              >
                <option value="all">All departments</option>
                <option value="computer_science">Computer Science</option>
                <option value="information_systems">Information Systems</option>
                <option value="telecommunications">Telecommunications</option>
              </select>
            </div>
          </div>

          <p className="mt-6 text-sm text-[#0A1628]/55">
            {isLoading ? 'Loading…' : `${total} paper${total === 1 ? '' : 's'}`}
          </p>

          {isError && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              Could not load past papers.{' '}
              <button type="button" className="underline" onClick={() => refresh()}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && papers.length === 0 && (
            <div className="mt-10 rounded-[1.5rem] border border-dashed border-[#0A1628]/20 px-6 py-16 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-[#0A1628]/25" />
              <p className="text-lg font-semibold text-[#0A1628]">No papers found</p>
              <p className="mt-2 text-sm text-[#0A1628]/65">
                Try clearing filters or check back after new uploads.
              </p>
            </div>
          )}

          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {papers.map((paper) => (
              <li key={paper._id}>
                <Link
                  href={`/past-papers/${paper._id}`}
                  className="block rounded-[1.5rem] border border-[#0A1628]/08 bg-white p-6 transition hover:border-[#005080]/30 hover:shadow-sm"
                >
                  <h2 className="text-xl font-bold text-[#0A1628]">
                    {paper.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#0A1628]/70">
                    {paper.course} · {paper.lecturer}
                  </p>
                  <p className="mt-1 text-xs text-[#0A1628]/45">
                    {formatDepartment(paper.department)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#005080]">
                    Preview & download
                    <Download className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {!isLoading && !isError && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
              itemLabel={`paper${total === 1 ? '' : 's'}`}
            />
          )}
        </div>
      </section>
    </LandingLayout>
  );
};

export default PastPapersPage;
