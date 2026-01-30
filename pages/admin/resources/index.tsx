import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import ResourcesComponent from '@/components/dashboard/shared/resources/resources';

interface AdminResourcesPageProps {
  userData: UserAuth;
}

const AdminResourcesPage = ({ userData }: AdminResourcesPageProps) => {
  return <ResourcesComponent role="admin" token={userData.token} />;
};

export default AdminResourcesPage;

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
