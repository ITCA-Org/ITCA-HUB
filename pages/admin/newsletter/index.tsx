import { Mail, Search, Users } from 'lucide-react';
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
import useNewsletterSubscribers, {
  NewsletterSubscriber,
} from '@/hooks/newsletter/use-newsletter-subscribers';

const subscriberColumns: Column[] = [
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'subscribed', header: 'Subscribed' },
];

interface AdminNewsletterPageProps {
  userData: UserAuth;
}

const AdminNewsletterPage = ({ userData }: AdminNewsletterPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = status !== 'all';

  const { subscribers, total, totalPages, isLoading, isError, refresh } =
    useNewsletterSubscribers({
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

  const renderSubscriberRow = (subscriber: NewsletterSubscriber) => (
    <>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-lg shadow-blue-200">
            <Mail className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-base font-normal text-gray-900">
              {subscriber.email}
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        {subscriber.isActive ? (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-red-100/70 px-2 py-2 text-base font-medium text-red-600">
            Unsubscribed
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        {new Date(subscriber.subscribedAt).toLocaleDateString()}
      </td>
    </>
  );

  return (
    <DashboardLayout title="Newsletter Subscribers" token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Newsletter"
          subtitle="Subscribers"
          description="People who subscribed via the landing-page newsletter form"
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
              placeholder="Search subscribers by email..."
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
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
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
          <Table<NewsletterSubscriber>
            data={subscribers}
            columns={subscriberColumns}
            keyExtractor={(subscriber) => subscriber._id}
            renderRow={renderSubscriberRow}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            setPage={setPage}
            isLoading={isLoading}
            isError={isError}
            title="Subscribers"
            onRefresh={refresh}
            hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
            onClearFilters={() => {
              setSearchTerm('');
              resetFilters();
            }}
            searchTerm={debouncedSearchQuery}
            emptyTitle="No subscribers yet"
            emptyDescription="Newsletter subscribers from the website will appear here."
            emptyIcon={Users}
            skeleton={<UserTableSkeleton />}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminNewsletterPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
