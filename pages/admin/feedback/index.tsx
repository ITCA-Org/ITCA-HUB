import {
  Archive,
  CheckCheck,
  Mail,
  MessageSquare,
  Search,
  User,
} from 'lucide-react';
import { NextApiRequest } from 'next';
import { useCallback, useState } from 'react';
import { requireAdminAuth } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import useFeedback, {
  FeedbackItem,
  FeedbackStatus,
} from '@/hooks/feedback/use-feedback';

const feedbackColumns: Column[] = [
  { key: 'sender', header: 'From' },
  { key: 'organization', header: 'Programme' },
  { key: 'message', header: 'Message' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Submitted' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminFeedbackPageProps {
  userData: UserAuth;
}

const statusBadge = (status: FeedbackStatus) => {
  if (status === 'new') {
    return (
      <span className="inline-flex rounded-md bg-amber-100 px-2 py-2 text-base font-medium text-amber-700">
        New
      </span>
    );
  }
  if (status === 'read') {
    return (
      <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
        Read
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium text-gray-600">
      Archived
    </span>
  );
};

const AdminFeedbackPage = ({ userData }: AdminFeedbackPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = status !== 'all';

  const { feedback, total, totalPages, isLoading, isError, refresh, updateStatus } =
    useFeedback({
      token: userData.token,
      page,
      limit,
      search: debouncedSearchQuery,
      status,
    });

  const resetFilters = useCallback(() => {
    if (!hasActiveFilters) return;
    setStatus('all');
    setPage(0);
  }, [hasActiveFilters]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0);
  };

  const truncate = (text: string, max = 80) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

  const renderFeedbackRow = (item: FeedbackItem) => (
    <>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-lg shadow-blue-200">
            {item.email ? <Mail className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div className="ml-4">
            <div className="text-base font-normal text-gray-900">
              {item.fullName?.trim() || 'Anonymous'}
            </div>
            <div className="text-base text-gray-500">
              {item.email?.trim() || 'No email'}
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        {item.organization}
      </td>
      <td className="max-w-xs px-8 py-4 text-base text-gray-700">
        <span title={item.message}>{truncate(item.message)}</span>
      </td>
      <td className="whitespace-nowrap px-8 py-4">{statusBadge(item.status)}</td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="whitespace-nowrap px-2 py-4 text-right text-base font-medium">
        <div className="flex items-center justify-end space-x-1">
          {item.status !== 'read' && (
            <button
              type="button"
              title="Mark as read"
              onClick={(e) => {
                e.stopPropagation();
                void updateStatus(item._id, 'read');
              }}
              className="cursor-pointer rounded-full p-2 text-gray-400 hover:bg-white"
            >
              <CheckCheck className="h-4.5 w-4.5 text-gray-500" />
            </button>
          )}
          {item.status !== 'archived' && (
            <button
              type="button"
              title="Archive"
              onClick={(e) => {
                e.stopPropagation();
                void updateStatus(item._id, 'archived');
              }}
              className="cursor-pointer rounded-full p-2 text-gray-400 hover:bg-white"
            >
              <Archive className="h-4.5 w-4.5 text-gray-500" />
            </button>
          )}
          {item.status === 'archived' && (
            <button
              type="button"
              title="Mark as new"
              onClick={(e) => {
                e.stopPropagation();
                void updateStatus(item._id, 'new');
              }}
              className="cursor-pointer rounded-full p-2 text-gray-400 hover:bg-white"
            >
              <MessageSquare className="h-4.5 w-4.5 text-gray-500" />
            </button>
          )}
        </div>
      </td>
    </>
  );

  return (
    <DashboardLayout title="Feedback" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Feedback"
          subtitle="Inbox"
          description="Messages submitted through the website feedback form"
        />
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
              placeholder="Search by name, email, or message..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <select
              title="Status filter"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                hasActiveFilters
                  ? 'bg-white text-gray-700 hover:bg-gray-200'
                  : 'cursor-not-allowed bg-gray-100 text-gray-400'
              }`}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="overflow-hidden rounded-lg bg-white">
          <Table<FeedbackItem>
            data={feedback}
            columns={feedbackColumns}
            keyExtractor={(item) => item._id}
            renderRow={renderFeedbackRow}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            setPage={setPage}
            isLoading={isLoading}
            isError={isError}
            title="Feedback"
            onRefresh={refresh}
            hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
            onClearFilters={() => {
              setSearchTerm('');
              resetFilters();
            }}
            searchTerm={debouncedSearchQuery}
            emptyTitle="No feedback yet"
            emptyDescription="Feedback submitted from the website will appear here."
            emptyIcon={MessageSquare}
            skeleton={<UserTableSkeleton />}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedbackPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
