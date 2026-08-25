import { Search, WalletCards } from 'lucide-react';
import { NextApiRequest } from 'next';
import { useCallback, useState } from 'react';
import { requireDuesStaffAuth } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import {
  DuesPaymentRow,
  useDuesList,
} from '@/hooks/dues/use-dues';
import { formatFeeAmount } from '@/utils/fees';

const duesColumns: Column[] = [
  { key: 'student', header: 'Student' },
  { key: 'amount', header: 'Amount' },
  { key: 'total', header: 'Total paid' },
  { key: 'status', header: 'Eligibility' },
  { key: 'date', header: 'Paid' },
];

interface AdminDuesPageProps {
  userData: UserAuth;
}

const AdminDuesPage = ({ userData }: AdminDuesPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eligibility, setEligibility] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = eligibility !== 'all';

  const { payments, total, totalPages, feeTotalRequired, isLoading, isError, refresh } =
    useDuesList({
      token: userData.token,
      page,
      limit,
      search: debouncedSearchQuery,
      eligibility,
    });

  const resetFilters = useCallback(() => {
    if (!hasActiveFilters) return;
    setEligibility('all');
    setPage(0);
  }, [hasActiveFilters]);

  const renderRow = (payment: DuesPaymentRow) => (
    <>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="text-base font-normal text-gray-900">{payment.fullName}</div>
        <div className="text-base text-gray-500">{payment.matricNumber}</div>
        <div className="text-sm text-gray-400">{payment.email}</div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {formatFeeAmount(payment.amount)}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {formatFeeAmount(payment.totalPaid)} / {formatFeeAmount(feeTotalRequired)}
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        {payment.auditEligible ? (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
            Eligible
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-amber-100 px-2 py-2 text-base font-medium text-amber-700">
            Not eligible
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        {payment.paidAt
          ? new Date(payment.paidAt).toLocaleDateString()
          : new Date(payment.createdAt).toLocaleDateString()}
      </td>
    </>
  );

  return (
    <DashboardLayout
      title="Semester Dues"
      token={userData.token}
      role={userData.role}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Semester"
          subtitle="Dues"
          description="Paid semester dues with audit eligibility (D400 total per matric)"
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
              placeholder="Search by name, matric, email..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-lg border-none bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 focus:bg-gray-200/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select
            title="Eligibility filter"
            value={eligibility}
            onChange={(e) => {
              setEligibility(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border-none bg-white py-2.5 pl-3 text-sm text-gray-700 focus:outline-none"
          >
            <option value="all">All eligibility</option>
            <option value="eligible">Eligible</option>
            <option value="not_eligible">Not eligible</option>
          </select>
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

      <div className="overflow-hidden rounded-lg bg-white">
        <Table<DuesPaymentRow>
          data={payments}
          columns={duesColumns}
          keyExtractor={(row) => row._id}
          renderRow={renderRow}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          title="Payments"
          onRefresh={refresh}
          hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
          onClearFilters={() => {
            setSearchTerm('');
            resetFilters();
          }}
          searchTerm={debouncedSearchQuery}
          emptyTitle="No dues payments yet"
          emptyDescription="Successful Modem Pay semester dues will appear here."
          emptyIcon={WalletCards}
          skeleton={<UserTableSkeleton />}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDuesPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireDuesStaffAuth(req);
};
