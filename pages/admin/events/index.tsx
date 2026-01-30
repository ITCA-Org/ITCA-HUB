import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import EventsComponent from '@/components/dashboard/shared/events/events';

interface AdminEventsPageProps {
  userData: UserAuth;
}

const AdminEventsPage = ({ userData }: AdminEventsPageProps) => {
  return <EventsComponent role="admin" token={userData.token} userId={userData.userId} />;
};

export default AdminEventsPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
        permanent: false,
      },
    };
  }

  return {
    props: { userData },
  };
};
