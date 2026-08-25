import { NextApiRequest } from 'next';
import { useCallback, useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { requireAdminAuth } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import PastPaperFormModal from '@/components/dashboard/modals/past-papers/past-paper-form-modal';
import formatDepartment from '@/utils/format-department';
import { formatAcademicYear } from '@/utils/academic-year';
import { formatPastPaperSemester } from '@/utils/past-paper-document';
import {
  deletePastPaper,
  PastPaper,
  PAST_PAPER_TYPES,
  useAdminPastPapers,
} from '@/hooks/past-papers/use-past-papers';
import { getErrorMessage } from '@/utils/error';

const columns: Column[] = [
  { key: 'paper', header: 'Paper' },
  { key: 'meta', header: 'Details' },
  { key: 'type', header: 'Type' },
  { key: 'extract', header: 'Extract' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminPastPapersPageProps {
  userData: UserAuth;
}

const AdminPastPapersPage = ({ userData }: AdminPastPapersPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paperType, setPaperType] = useState('');
  const [published, setPublished] = useState('all');
  const [page, setPage] = useState(0);
  const [limit] = useState(15);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PastPaper | null>(null);
  const [busyId, setBusyId] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);
  const hasActiveFilters = !!paperType || published !== 'all';

  const { papers, total, totalPages, isLoading, isError, refresh } =
    useAdminPastPapers({
      token: userData.token,
      page,
      limit,
      search: debouncedSearch,
      paperType,
      published,
    });

  const resetFilters = useCallback(() => {
    setPaperType('');
    setPublished('all');
    setPage(0);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (paper: PastPaper) => {
    setEditing(paper);
    setModalOpen(true);
  };

  const handleDelete = async (paper: PastPaper) => {
    if (!window.confirm(`Delete “${paper.title}”?`)) return;
    setBusyId(paper._id);
    try {
      await deletePastPaper(paper._id, userData.token);
      toast.success('Past paper deleted');
      refresh();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Delete failed', { description: message });
    } finally {
      setBusyId('');
    }
  };

  const renderRow = (paper: PastPaper) => (
    <>
      <td className="px-8 py-4">
        <div className="text-base font-medium text-gray-900">{paper.title}</div>
        <div className="text-sm text-gray-500">{paper.course}</div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        <div>
          {formatAcademicYear(paper.year)} ·{' '}
          {formatPastPaperSemester(paper.semester)}
        </div>
        <div className="text-sm text-gray-500">{paper.lecturer}</div>
        <div className="text-sm text-gray-400">
          {formatDepartment(paper.department)}
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {paper.paperType}
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        <span
          className={`inline-flex rounded-md px-2 py-1 text-sm font-medium capitalize ${
            paper.extractionStatus === 'ready'
              ? 'bg-green-100 text-green-700'
              : paper.extractionStatus === 'failed'
                ? 'bg-red-100 text-red-700'
                : paper.extractionStatus === 'empty'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
          }`}
        >
          {paper.extractionStatus || '—'}
        </span>
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        {paper.isPublished ? (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
            Published
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium text-gray-600">
            Draft
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(paper)}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={busyId === paper._id}
            onClick={() => void handleDelete(paper)}
            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </td>
    </>
  );

  return (
    <DashboardLayout
      title="Past Papers"
      token={userData.token}
      role={userData.role}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Past"
          subtitle="Papers"
          description="Upload exams, tests, quizzes with metadata and curated display text"
        />
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add past paper
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              placeholder="Search title, course, lecturer…"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            value={paperType}
            onChange={(e) => {
              setPaperType(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border-none bg-white py-2.5 px-3 text-sm"
          >
            <option value="">All types</option>
            {PAST_PAPER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={published}
            onChange={(e) => {
              setPublished(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border-none bg-white py-2.5 px-3 text-sm"
          >
            <option value="all">All status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              hasActiveFilters
                ? 'bg-white text-gray-700 hover:bg-gray-200'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white">
        <Table<PastPaper>
          data={papers}
          columns={columns}
          keyExtractor={(row) => row._id}
          renderRow={renderRow}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          title="Past papers"
          onRefresh={refresh}
          hasActiveFilters={!!debouncedSearch || hasActiveFilters}
          onClearFilters={() => {
            setSearchTerm('');
            resetFilters();
          }}
          searchTerm={debouncedSearch}
          emptyTitle="No past papers yet"
          emptyDescription="Upload a PDF with year, semester, course, and paper type."
          emptyIcon={FileText}
          skeleton={<UserTableSkeleton />}
        />
      </div>

      <PastPaperFormModal
        isOpen={modalOpen}
        token={userData.token}
        paper={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => refresh()}
      />
    </DashboardLayout>
  );
};

export default AdminPastPapersPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
