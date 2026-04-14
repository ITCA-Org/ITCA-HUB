import { NextApiRequest } from 'next';
import { motion } from 'framer-motion';
import { BASE_URL } from '@/utils/url';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { isLoggedIn } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData, UserAuth } from '@/types';
import { CheckCircle, Loader2, AlertCircle, Mail } from 'lucide-react';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const verifyEmail = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/verify-email`, { verificationToken: token });
      setStatus('Email verified successfully! Redirecting to login...');
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => router.push('/auth'), 3000);
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      setStatus(message);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/*==================== Background Elements ====================*/}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/*==================== Prominent Geometric Elements - Top Right ====================*/}
        <div className="absolute top-0 right-0 w-2/3 h-full">
          <div className="absolute top-10 right-0 w-full h-full">
            <div className="absolute top-10 right-[-200px] h-[500px] w-[500px] rounded-full border-40 border-amber-500/15 animate-pulse"></div>
            <div
              className="absolute top-40 right-[-150px] h-[400px] w-[400px] rounded-full border-30 border-blue-700/15 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute top-60 right-[-100px] h-[300px] w-[300px] rounded-full border-20 border-amber-500/15 animate-pulse"
              style={{ animationDelay: '0.8s' }}
            ></div>
          </div>
        </div>
        {/*==================== End of Prominent Geometric Elements - Top Right ====================*/}

        {/*==================== Angular Elements - Bottom Left ====================*/}
        <div className="hidden md:block absolute bottom-0 left-0 w-2/5 h-2/5">
          <div className="absolute bottom-10 left-70 w-[200px] h-[200px] origin-center rotate-45 bg-blue-700/15 rounded-xl animate-pulse"></div>
          <div
            className="absolute top-10 left-50 w-40 h-40 origin-center rotate-30 bg-amber-500/15 rounded-xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className="absolute top-40 left-100 w-[120px] h-[120px] origin-center rotate-20 bg-amber-700/15 rounded-xl animate-pulse"
            style={{ animationDelay: '0.8s' }}
          ></div>
        </div>
        {/*==================== End of Angular Elements - Bottom Left ====================*/}
      </div>
      {/*==================== End of Background Elements ====================*/}

      {/*==================== Main Content ====================*/}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg"
      >
        {/*==================== Verification Card ====================*/}
        <div className="bg-transparent p-8 md:p-12 space-y-8">
          {/*==================== ITCA Header ====================*/}

          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="mx-auto w-18 h-18 p-4 bg-amber-200 rounded-full flex items-center justify-center mb-4"
            >
              <Mail className="h-8 w-8 text-amber-700" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-800">Email Verification</h1>
            <p className="text-gray-600 text-lg">ITCA Account Activation</p>
          </div>

          {/*==================== Status Display ====================*/}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-6"
          >
            {/*==================== Status Icon ====================*/}
            <div className="flex justify-center">
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-16 w-16 text-amber-500" />
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
              )}

              {isError && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <AlertCircle className="h-16 w-16 text-red-500" />
                </motion.div>
              )}
            </div>

            {/*==================== Status Message ====================*/}
            <motion.div
              className="space-y-4"
              transition={{ delay: 0.7 }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
            >
              <p className="text-gray-800 text-xl font-semibold">{status}</p>
            </motion.div>

            {/*==================== Success Animation ====================*/}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-sm text-gray-600"
              >
                Redirecting you to login in 3 seconds...
              </motion.div>
            )}

            {/*==================== Error Actions ====================*/}
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 pt-4"
              >
                <button
                  onClick={() => router.push('/auth')}
                  className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Go to Sign In
                </button>

                <button
                  onClick={() => router.push('/auth/sign-up')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300"
                >
                  Create New Account
                </button>
              </motion.div>
            )}
          </motion.div>

          {/*==================== Footer ====================*/}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center pt-6 border-t border-gray-200"
          >
            <p className="text-md text-gray-500">
              Powered by{' '}
              <span className="font-semibold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ITCA Hub
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData && typeof userData !== 'boolean') {
    const { role } = userData as UserAuth;

    switch (role) {
      case 'admin':
        return {
          redirect: {
            destination: '/admin',
            permanent: false,
          },
        };
      case 'user':
        return {
          redirect: {
            destination: '/student',
            permanent: false,
          },
        };
      default:
        break;
    }
  }

  return {
    props: {
      userData,
    },
  };
};
