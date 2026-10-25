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

  const { papers, total, totalPages, isLoading, isError, refresh } = usePastPapers({
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
    >
      <section className="bg-white itca-white-surface px-4 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1200px]">
          <p className="landing-mono mb-3 text-sm text-[var(--itca-accent-ink)]">Past papers</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#005080] sm:text-5xl">
            Exams, tests, and quizzes — preview or download.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#005080]/70 sm:text-lg">
            Filter by course and department. No login required.
          </p>

          <div className="mt-6 space-y-4 rounded-[1.75rem] bg-[#F7F7F7] p-4 sm:p-6">
            <label htmlFor="paper-search" className="block text-sm font-semibold text-[#005080]">
              Search past papers
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#005080]/35" />
              <input
                id="paper-search"
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                placeholder="Search questions, topics, course, lecturer…"
                className="w-full rounded-full border border-[#005080]/10 bg-white itca-white-surface py-3.5 pl-12 pr-4 text-base text-[#005080] placeholder:text-[#005080]/40 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="paper-course"
                  className="mb-2 block text-sm font-semibold text-[#005080]"
                >
                  Course code
                </label>
                <input
                  id="paper-course"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Course code"
                  className="w-full rounded-full border border-[#005080]/10 bg-white itca-white-surface px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="paper-department"
                  className="mb-2 block text-sm font-semibold text-[#005080]"
                >
                  Department
                </label>
                <select
                  id="paper-department"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPage(0);
                  }}
                  className="w-full rounded-full border border-[#005080]/10 bg-white itca-white-surface px-4 py-3 text-sm"
                >
                  <option value="all">All departments</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="information_systems">Information Systems</option>
                  <option value="telecommunications">Telecommunications</option>
                </select>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-[#005080]/55">
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
            <div className="mt-10 rounded-[1.5rem] border border-dashed border-[#005080]/20 px-6 py-16 text-center">
              <FileText className="mx-auto mb-3 h-10 w-10 text-[#005080]/25" />
              <p className="text-lg font-semibold text-[#005080]">No papers found</p>
              <p className="mt-2 text-sm text-[#005080]/65">
                Try clearing filters or check back after new uploads.
              </p>
            </div>
          )}

          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {papers.map((paper) => (
              <li key={paper._id}>
                <Link
                  href={`/past-papers/${paper._id}`}
                  className="block rounded-[1.5rem] border border-[#005080]/08 bg-white itca-white-surface p-6 transition hover:border-[#005080]/30 hover:shadow-sm"
                >
                  <h2 className="text-xl font-bold text-[#005080]">{paper.title}</h2>
                  <p className="mt-2 text-sm text-[#005080]/70">
                    {paper.course} · {paper.lecturer}
                  </p>
                  <p className="mt-1 text-xs text-[#005080]/45">
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
