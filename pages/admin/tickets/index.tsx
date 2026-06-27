import { NextApiRequest } from 'next';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import TicketsComponent from '@/components/tickets/tickets';

interface AdminTicketsPageProps {
  userData: UserAuth;
}

const AdminTicketsPage = ({ userData }: AdminTicketsPageProps) => {
  return <TicketsComponent role={userData.role} token={userData.token} />;
};

export default AdminTicketsPage;

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
