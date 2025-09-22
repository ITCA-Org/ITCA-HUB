import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { AdminResourceViewPageProps } from '@/types/interfaces/resource';
import ResourceViewerComponent from '@/components/dashboard/shared/resources/resource-viewer';

const AdminResourceViewPage = ({ userData }: AdminResourceViewPageProps) => {
  return <ResourceViewerComponent role="admin" userData={userData} />;
};

export default AdminResourceViewPage;

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
    props: {
      userData,
    },
  };
};
