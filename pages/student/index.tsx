import { NextApiRequest } from 'next';
import { isLoggedIn } from '@/utils/auth';

import React from 'react';

const index = () => {
  return (
    <div className="bg-red-100/80 p-4">
      <h1 className="text-red-700">Lol, Where do you think you're going to? Funny guy💀</h1>
    </div>
  );
};

export default index;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (!userData) {
    return { redirect: { destination: '/auth', permanent: false } };
  }

  return {
    redirect: {
      destination: '/student/resources',
      permanent: false,
    },
  };
};
