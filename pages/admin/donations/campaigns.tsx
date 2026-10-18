import Link from 'next/link';
import { NextApiRequest } from 'next';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, Megaphone, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { requireAdminAuth } from '@/utils/auth';
import { UserAuth } from '@/types';
import { Column } from '@/types/interfaces/table';
import Table from '@/components/dashboard/table/table';
import UserTableSkeleton from '@/components/dashboard/skeletons/user-table-skeleton';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import CampaignFormModal from '@/components/dashboard/modals/donations/campaign-form-modal';
import { formatDalasi } from '@/components/landing-page/shop-data';
import {
  campaignProgress,
  DONATION_CATEGORY_LABELS,
  DonationCampaign,
  updateDonationCampaign,
  useAdminDonationCampaigns,
} from '@/hooks/donations/use-donations';
import { getErrorMessage } from '@/utils/error';

const columns: Column[] = [
  { key: 'campaign', header: 'Campaign' },
  { key: 'activity', header: 'Activity' },
  { key: 'raised', header: 'Raised' },
  { key: 'dates', header: 'Window' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions', className: 'text-right' },
];

interface AdminDonationCampaignsPageProps {
  userData: UserAuth;
}

const AdminDonationCampaignsPage = ({ userData }: AdminDonationCampaignsPageProps) => {
  const { campaigns, isLoading, isError, refresh } = useAdminDonationCampaigns(userData.token);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DonationCampaign | null>(null);
  const [busyId, setBusyId] = useState('');
  const [page, setPage] = useState(0);
  const limit = 15;

  const toggleActive = async (campaign: DonationCampaign) => {
    setBusyId(campaign._id);
    try {
      await updateDonationCampaign(campaign._id, { isActive: !campaign.isActive }, userData.token);
      toast.success(campaign.isActive ? 'Campaign closed' : 'Campaign reopened');
      refresh();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Update failed', { description: message });
    } finally {
      setBusyId('');
    }
  };

  const paged = campaigns.slice(page * limit, page * limit + limit);
  const totalPages = Math.ceil(campaigns.length / limit) || 1;

  const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString() : '—';

  const renderRow = (campaign: DonationCampaign) => (
    <>
      <td className="px-8 py-4">
        <div className="text-base font-medium text-gray-900">{campaign.title}</div>
        <div className="max-w-xs truncate text-sm text-gray-500">{campaign.summary}</div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        {DONATION_CATEGORY_LABELS[campaign.category] ?? campaign.category}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-base text-gray-700">
        <div className="font-medium text-gray-900">{formatDalasi(campaign.raisedAmount)}</div>
        <div className="text-sm text-gray-500">
          {campaign.goalAmount > 0
            ? `${campaignProgress(campaign)}% of ${formatDalasi(campaign.goalAmount)}`
            : 'No goal'}{' '}
          · {campaign.donorCount} donations
        </div>
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
        <div>Opens: {formatDate(campaign.startDate)}</div>
        <div>Closes: {formatDate(campaign.endDate)}</div>
      </td>
      <td className="whitespace-nowrap px-8 py-4">
        {campaign.isActive ? (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-2 text-base font-medium text-green-600">
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-md bg-gray-100 px-2 py-2 text-base font-medium text-gray-600">
            Closed
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-8 py-4 text-right">
        <div className="flex justify-end gap-2">
          <a
            href={`/donate/${campaign.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View
          </a>
          <button
            type="button"
            onClick={() => {
              setEditing(campaign);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            disabled={busyId === campaign._id}
            onClick={() => void toggleActive(campaign)}
            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
          >
            {campaign.isActive ? 'Close' : 'Reopen'}
          </button>
        </div>
      </td>
    </>
  );

  return (
    <DashboardLayout title="Donation Campaigns" token={userData.token} role={userData.role}>
      <Link
        href="/admin/donations"
        className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Donations overview
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title="Donations"
          subtitle="Campaigns"
          description="Create a campaign for each activity people can donate to"
        />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New campaign
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white">
        <Table<DonationCampaign>
          data={paged}
          columns={columns}
          keyExtractor={(row) => row._id}
          renderRow={renderRow}
          page={page}
          limit={limit}
          total={campaigns.length}
          totalPages={totalPages}
          setPage={setPage}
          isLoading={isLoading}
          isError={isError}
          title="Campaigns"
          onRefresh={refresh}
          emptyTitle="No campaigns yet"
          emptyDescription="Create a campaign (e.g. Hackathon, ITCA Week, Pad Drive) to start accepting donations."
          emptyIcon={Megaphone}
          skeleton={<UserTableSkeleton />}
        />
      </div>

      <CampaignFormModal
        isOpen={modalOpen}
        token={userData.token}
        campaign={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => refresh()}
      />
    </DashboardLayout>
  );
};

export default AdminDonationCampaignsPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
