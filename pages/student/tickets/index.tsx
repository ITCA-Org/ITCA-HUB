import { NextApiRequest } from 'next';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import TicketsComponent from '@/components/tickets/tickets';

interface StudentTicketsPageProps {
  userData: UserAuth;
}

const StudentTicketsPage = ({ userData }: StudentTicketsPageProps) => {
  return <TicketsComponent role={userData.role} token={userData.token} />;
};

export default StudentTicketsPage;

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

  if (userAuth.role !== 'user') {
    return {
      redirect: {
        destination: '/admin/tickets',
        permanent: false,
      },
    };
  }

  return {
    props: { userData },
  };
};
