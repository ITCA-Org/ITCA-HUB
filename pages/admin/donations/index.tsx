import { NextApiRequest } from 'next';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { HandCoins, HeartHandshake, Megaphone, Search, TrendingUp, Users } from 'lucide-react';
import { requireAdminAuth } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import DashboardStatsCard from '@/components/dashboard/layout/dashboard-stats-card';
import { formatDalasi } from '@/components/landing-page/shop-data';
import {
  campaignProgress,
  DONATION_CATEGORY_LABELS,
  DonationSummary,
  useDonations,
  useDonationStats,
} from '@/hooks/donations/use-donations';

const columns: Column[] = [
  { key: 'receipt', header: 'Receipt' },
  { key: 'donor', header: 'Donor' },
  { key: 'campaign', header: 'Campaign' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Date' },
];

interface AdminDonationsPageProps {
  userData: UserAuth;
}

const statusBadge = (status: string) => {
  if (status === 'paid') {
    return (
      <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-700">
        Paid
      </span>
    );
  }
  if (status === 'failed' || status === 'cancelled') {
    return (
      <span className="inline-flex rounded-md bg-red-50 px-2 py-2 text-base font-medium capitalize text-red-600">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium capitalize text-gray-600">
      {status}
    </span>
  );
};

const AdminDonationsPage = ({ userData }: AdminDonationsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [campaignId, setCampaignId] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = status !== 'all' || campaignId !== 'all';

  const { stats, isLoading: statsLoading } = useDonationStats(userData.token, campaignId);
  const { donations, total, totalPages, isLoading, isError, refresh } = useDonations({
    token: userData.token,
    page,
    limit,
    search: debouncedSearchQuery,
    status,
    campaignId,
  });

  const resetFilters = useCallback(() => {
    if (!hasActiveFilters) return;
    setStatus('all');
    setCampaignId('all');
    setPage(0);
  }, [hasActiveFilters]);

  const campaigns = stats?.campaigns ?? [];

  const renderRow = (donation: DonationSummary) => (
    <>
      <td className="whitespace-nowrap px-8 py-4 text-base font-medium text-gray-900">
        {donation.receiptNumber || '—'}
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="text-base font-normal text-gray-900">
          {donation.donorName}
          {donation.isAnonymous && (
            <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              Anonymous
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{donation.email}</div>
        {donation.phone && <div className="text-sm text-gray-400">{donation.phone}</div>}
      </td>
      <td className="max-w-xs px-8 py-4 text-base text-gray-700">
        <span className="line-clamp-1">{donation.campaignTitle}</span>
        {donation.message && (
          <span className="mt-1 line-clamp-2 text-sm italic text-gray-500">
            “{donation.message}”
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base font-medium text-gray-900">
        {formatDalasi(donation.amount)}
      </td>
      <td className="whitespace-nowrap px-8 py-4">{statusBadge(donation.status)}</td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        {new Date(donation.paidAt || donation.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  return (
    <DashboardLayout title="Donations" token={userData.token} role={userData.role}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Donations"
          subtitle="Overview"
          description="Track money raised across ITCA activities and campaigns"
        />
        <Link
          href="/admin/donations/campaigns"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Megaphone className="h-4 w-4" />
          Manage campaigns
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatsCard
          title="Total raised"
          icon={<HandCoins className="h-5 w-5" />}
          value={formatDalasi(stats?.totalRaised ?? 0)}
          isLoading={statsLoading}
        />
        <DashboardStatsCard
          title="Raised this month"
          icon={<TrendingUp className="h-5 w-5" />}
          value={formatDalasi(stats?.raisedThisMonth ?? 0)}
          isLoading={statsLoading}
        />
        <DashboardStatsCard
          title="Donations"
          icon={<HeartHandshake className="h-5 w-5" />}
          value={stats?.donationCount ?? 0}
          isLoading={statsLoading}
        />
        <DashboardStatsCard
          title="Unique donors"
          icon={<Users className="h-5 w-5" />}
          value={stats?.uniqueDonors ?? 0}
          isLoading={statsLoading}
        />
      </div>

      {campaignId === 'all' && campaigns.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#0A1628]/10 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#0A1628]">By campaign</h3>
            <span className="text-sm text-[#0A1628]/60">
              Avg. donation {formatDalasi(stats?.averageDonation ?? 0)} · Largest{' '}
              {formatDalasi(stats?.largestDonation ?? 0)}
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {campaigns.map((c) => {
              const percent = campaignProgress(c);
              return (
                <li key={c._id} className="py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCampaignId(c._id);
                      setPage(0);
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-medium text-gray-900">{c.title}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {DONATION_CATEGORY_LABELS[c.category] ?? c.category}
                        </span>
                        {!c.isActive && (
                          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                            Closed
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">{formatDalasi(c.raisedAmount)}</span>
                        {c.goalAmount > 0 && (
                          <span className="text-gray-500">
                            {' '}
                            / {formatDalasi(c.goalAmount)} ({percent}%)
                          </span>
                        )}
                        <span className="text-gray-500"> · {c.donorCount} donations</span>
                      </div>
                    </div>
                    {c.goalAmount > 0 && (
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mb-6 mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            value={searchTerm}
            placeholder="Search by name, email, receipt…"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border-none bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
          />
        </div>

        <select
          value={campaignId}
          onChange={(e) => {
            setCampaignId(e.target.value);
            setPage(0);
          }}
          className="w-full rounded-lg border-none bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none"
        >
          <option value="all">All campaigns</option>
          {campaigns.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border-none bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none"
          >
            <option value="all">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
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
        <Table<DonationSummary>
          data={donations}
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
          title="Donations"
          onRefresh={refresh}
          hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
          onClearFilters={() => {
            setSearchTerm('');
            resetFilters();
          }}
          searchTerm={debouncedSearchQuery}
          emptyTitle="No donations yet"
          emptyDescription="Completed donations will appear here as they come in."
          emptyIcon={HeartHandshake}
          skeleton={<UserTableSkeleton />}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDonationsPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
