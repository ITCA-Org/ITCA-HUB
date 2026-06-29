import { NextApiRequest } from 'next';
import { requireAdminAuth } from '@/utils/auth';
import ProfileComponent from '@/components/dashboard/shared/profile/profile';
import { UserAuth } from '@/types';

interface AdminProfilePageProps {
  userData: UserAuth;
}

const AdminProfilePage = ({ userData }: AdminProfilePageProps) => {
  return <ProfileComponent role="admin" token={userData.token} />;
};

export default AdminProfilePage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
