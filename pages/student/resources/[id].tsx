import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import ResourceViewerComponent from '@/components/dashboard/shared/resources/resource-viewer';

interface StudentResourceViewPageProps {
  userData: UserAuth;
}

const StudentResourceViewPage = ({ userData }: StudentResourceViewPageProps) => {
  return <ResourceViewerComponent role="student" token={userData.token} />;
};

export default StudentResourceViewPage;

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

  if (userAuth.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: { userData },
  };
};
