import { UserAuth } from '@/types';
import { parse } from 'cookie';
import { GetServerSidePropsContext, NextApiRequest } from 'next';

export const isLoggedIn = (req: NextApiRequest): boolean | UserAuth => {
  if (!req || !req.headers || !req.headers.cookie) {
    return false;
  }

  const cookies = parse(req.headers.cookie || '');

  if (cookies && cookies.itca_hub) return JSON.parse(cookies.itca_hub) as UserAuth;

  return false;
};

export const requireAdminAuth = (req: NextApiRequest) => {
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

  if (userAuth.role !== 'admin') {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData: userAuth,
    },
  };
};

/** Admin or faculty officer — semester dues list + scanner only. */
export const requireDuesStaffAuth = (req: NextApiRequest) => {
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

  if (userAuth.role !== 'admin' && userAuth.role !== 'faculty_officer') {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData: userAuth,
    },
  };
};

export type AdminAuthContext = GetServerSidePropsContext & { req: NextApiRequest };
