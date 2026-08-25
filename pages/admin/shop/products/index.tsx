import Image from 'next/image';
import { NextApiRequest } from 'next';
import { useState } from 'react';
import { Package, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { requireAdminAuth } from '@/utils/auth';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ProductFormModal from '@/components/dashboard/modals/shop/product-form-modal';
import { formatDalasi } from '@/components/landing-page/shop-data';
import {
  deactivateShopProduct,
  ShopProductApi,
  updateShopProduct,
  useAdminShopProducts,
} from '@/hooks/shop/use-shop';
import { getErrorMessage } from '@/utils/error';

const columns: Column[] = [
  { key: 'product', header: 'Product' },
  { key: 'price', header: 'Price' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminShopProductsPageProps {
  userData: UserAuth;
}

const AdminShopProductsPage = ({ userData }: AdminShopProductsPageProps) => {
  const { products, isLoading, isError, refresh } = useAdminShopProducts(
    userData.token
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShopProductApi | null>(null);
  const [busyId, setBusyId] = useState('');
  const [page, setPage] = useState(0);
  const limit = 15;

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: ShopProductApi) => {
    setEditing(product);
    setModalOpen(true);
  };

  const toggleActive = async (product: ShopProductApi) => {
    setBusyId(product._id);
    try {
      if (product.isActive) {
        await deactivateShopProduct(product._id, userData.token);
        toast.success('Product deactivated');
      } else {
        await updateShopProduct(
          product._id,
          { isActive: true },
          userData.token
        );
        toast.success('Product activated');
      }
      refresh();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Update failed', { description: message });
    } finally {
      setBusyId('');
    }
  };

  const paged = products.slice(page * limit, page * limit + limit);
  const totalPages = Math.ceil(products.length / limit) || 1;

  const renderRow = (product: ShopProductApi) => (
    <>
      <td className="whitespace-nowrap px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.imageUrl}
              alt={product.alt || product.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-base font-medium text-gray-900">
              {product.name}
            </div>
            <div className="max-w-xs truncate text-sm text-gray-500">
              {product.blurb}
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {formatDalasi(product.price)}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {product.category}
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        {product.isActive ? (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium text-gray-600">
            Inactive
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(product)}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={busyId === product._id}
            onClick={() => void toggleActive(product)}
            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
          >
            {product.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </td>
    </>
  );

  return (
    <DashboardLayout
      title="Shop Products"
      token={userData.token}
      role={userData.role}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Shop"
          subtitle="Products"
          description="Add and manage merchandise available in the public shop"
        />
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white">
        <Table<ShopProductApi>
          data={paged}
          columns={columns}
          keyExtractor={(row) => row._id}
          renderRow={renderRow}
          page={page}
          limit={limit}
          total={products.length}
          totalPages={totalPages}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          title="Products"
          onRefresh={refresh}
          emptyTitle="No products yet"
          emptyDescription="Create your first product to populate the shop catalogue."
          emptyIcon={Package}
          skeleton={<UserTableSkeleton />}
        />
      </div>

      <ProductFormModal
        isOpen={modalOpen}
        token={userData.token}
        product={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => refresh()}
      />
    </DashboardLayout>
  );
};

export default AdminShopProductsPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
