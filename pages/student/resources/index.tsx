import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { StudentResourcesPageProps } from '@/types/interfaces/resource';
import ResourcesComponent from '@/components/dashboard/shared/resources/resources';

const StudentResourcesPage = ({ userData }: StudentResourcesPageProps) => {
  return <ResourcesComponent role="student" userData={userData} />;
};

export default StudentResourcesPage;

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
