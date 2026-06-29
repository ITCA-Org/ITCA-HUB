import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';
import { UserAuth } from '@/types';
import AdminLogin from '@/components/dashboard/authentication/admin-login';

const SignInPage = () => {
  return <AdminLogin />;
};

export default SignInPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData && typeof userData !== 'boolean') {
    const { role } = userData as UserAuth;

    if (role === 'admin') {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};
