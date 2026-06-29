import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { requireAdminAuth } from '@/utils/auth';
import ResourceViewerComponent from '@/components/dashboard/shared/resources/resource-viewer';

interface AdminResourceViewPageProps {
  userData: UserAuth;
}

const AdminResourceViewPage = ({ userData }: AdminResourceViewPageProps) => {
  return <ResourceViewerComponent role="admin" token={userData.token} />;
};

export default AdminResourceViewPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
