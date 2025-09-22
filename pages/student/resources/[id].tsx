import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { StudentResourceViewPageProps } from '@/types/interfaces/resource';
import ResourceViewerComponent from '@/components/dashboard/shared/resources/resource-viewer';

const StudentResourceViewPage = ({ userData }: StudentResourceViewPageProps) => {
  return <ResourceViewerComponent role="student" userData={userData} />;
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
    props: {
      userData,
    },
  };
};
