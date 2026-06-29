import { NextApiRequest } from 'next';
import { requireAdminAuth } from '@/utils/auth';
import ResourcesComponent from '@/components/dashboard/shared/resources/resources';
import { UserAuth } from '@/types';

interface AdminResourcesPageProps {
  userData: UserAuth;
}

const AdminResourcesPage = ({ userData }: AdminResourcesPageProps) => {
  return <ResourcesComponent role="admin" token={userData.token} />;
};

export default AdminResourcesPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
