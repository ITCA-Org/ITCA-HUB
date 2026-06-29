import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { requireAdminAuth } from '@/utils/auth';
import EventsComponent from '@/components/dashboard/shared/events/events';

interface AdminEventsPageProps {
  userData: UserAuth;
}

const AdminEventsPage = ({ userData }: AdminEventsPageProps) => {
  return <EventsComponent role="admin" token={userData.token} userId={userData.userId} />;
};

export default AdminEventsPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
