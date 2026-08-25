import { NextApiRequest } from 'next';
import { useCallback, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { requireAdminAuth } from '@/utils/auth';
import useDebounce from '@/utils/debounce';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { formatDalasi } from '@/components/landing-page/shop-data';
import {
  markShopOrderDelivered,
  ShopOrderSummary,
  useShopOrders,
} from '@/hooks/shop/use-shop';
import { getErrorMessage } from '@/utils/error';

const columns: Column[] = [
  { key: 'receipt', header: 'Receipt' },
  { key: 'buyer', header: 'Buyer' },
  { key: 'items', header: 'Items' },
  { key: 'total', header: 'Total' },
  { key: 'status', header: 'Status' },
  { key: 'dates', header: 'Dates' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminShopOrdersPageProps {
  userData: UserAuth;
}

const statusBadge = (status: string) => {
  if (status === 'delivered') {
    return (
      <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-700">
        Delivered
      </span>
    );
  }
  if (status === 'paid') {
    return (
      <span className="inline-flex rounded-md bg-blue-100 px-2 py-2 text-base font-medium text-blue-700">
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium capitalize text-gray-600">
      {status}
    </span>
  );
};

const AdminShopOrdersPage = ({ userData }: AdminShopOrdersPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [limit] = useState(15);
  const [page, setPage] = useState(0);
  const [busyId, setBusyId] = useState('');

  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const hasActiveFilters = status !== 'all';

  const { orders, total, totalPages, isLoading, isError, refresh } =
    useShopOrders({
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

  const handleDeliver = async (order: ShopOrderSummary) => {
    setBusyId(order._id);
    try {
      await markShopOrderDelivered(order._id, userData.token);
      toast.success('Marked delivered');
      refresh();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Could not mark delivered', { description: message });
    } finally {
      setBusyId('');
    }
  };

  const itemsSummary = (order: ShopOrderSummary) =>
    order.lines
      .map((l) => `${l.quantity}× ${l.productName}`)
      .join(', ')
      .slice(0, 80);

  const renderRow = (order: ShopOrderSummary) => (
    <>
      <td className="whitespace-nowrap px-8 py-4 text-base font-medium text-gray-900">
        {order.receiptNumber || '—'}
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="text-base font-normal text-gray-900">{order.fullName}</div>
        <div className="text-sm text-gray-500">{order.email}</div>
        <div className="text-sm text-gray-400">{order.phone}</div>
      </td>
      <td className="max-w-xs px-8 py-4 text-base text-gray-700">
        <span className="line-clamp-2">{itemsSummary(order)}</span>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {formatDalasi(order.amount)}
      </td>
      <td className="whitespace-nowrap px-8 py-4">{statusBadge(order.status)}</td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-500">
        <div>
          Paid:{' '}
          {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : '—'}
        </div>
        <div>
          Delivered:{' '}
          {order.deliveredAt
            ? new Date(order.deliveredAt).toLocaleDateString()
            : '—'}
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-right">
        {order.status === 'paid' && (
          <button
            type="button"
            disabled={busyId === order._id}
            onClick={() => void handleDeliver(order)}
            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
          >
            Mark delivered
          </button>
        )}
      </td>
    </>
  );

  return (
    <DashboardLayout
      title="Shop Orders"
      token={userData.token}
      role={userData.role}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Shop"
          subtitle="Orders"
          description="Track paid shop orders and mark pickup deliveries"
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
              placeholder="Search by name, email, receipt…"
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
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-gray-700 focus:outline-none"
          >
            <option value="all">Paid + delivered</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
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
        <Table<ShopOrderSummary>
          data={orders}
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
          title="Orders"
          onRefresh={refresh}
          hasActiveFilters={!!debouncedSearchQuery || hasActiveFilters}
          onClearFilters={() => {
            setSearchTerm('');
            resetFilters();
          }}
          searchTerm={debouncedSearchQuery}
          emptyTitle="No orders yet"
          emptyDescription="Paid shop orders will show up here for pickup tracking."
          emptyIcon={ShoppingBag}
          skeleton={<UserTableSkeleton />}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminShopOrdersPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
