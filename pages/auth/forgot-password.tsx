import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { NextApiRequest } from 'next';
import { BASE_URL } from '@/utils/url';
import { motion } from 'framer-motion';
import { isLoggedIn } from '@/utils/auth';
import axios, { AxiosError } from 'axios';
import useTimedError from '@/hooks/timed-error';
import { getErrorMessage } from '@/utils/error';
import { Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { CustomError, ErrorResponseData, UserAuth } from '@/types';
import AuthButton from '@/components/dashboard/authentication/auth-button';
import AuthLayout from '@/components/dashboard/authentication/auth-layout';

const ForgotPassword = () => {
  const [schoolEmail, setSchoolEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useTimedError();

  const isValidUTGEmail = (email: string): boolean => {
    return email.trim().toLowerCase().endsWith('@utg.edu.gm');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!schoolEmail) {
      setError('Please enter your UTG email address');
      return;
    }

    if (!isValidUTGEmail(schoolEmail)) {
      setError('Please enter a valid UTG email address ending with @utg.edu.gm');
      toast.error('Invalid email format', {
        description: 'Only UTG email addresses (@utg.edu.gm) are allowed',
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, { schoolEmail });

      setEmailSent(true);
      toast.success('Reset code sent to your UTG email', {
        id: toast.loading('Sending reset code...'),
        description: 'Please check your inbox, spam, and junk folders',
        duration: 5000,
      });
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const rightSideContent = (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl text-center"
    >
      <h2 className="text-5xl font-bold mb-6">Reset Your Password</h2>
      <p className="text-lg text-white/80 mb-8">
        We will send a reset password link to your UTG email so you can reset your password and
        access ITCA resources.
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="bg-amber-500/20 rounded-full p-3">
            <Mail className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Check Your UTG Email</h3>
            <p className="text-sm text-white/80">
              After submitting, you will receive a password reset link
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-amber-500/20 rounded-full p-3">
            <ArrowRight className="h-6 w-6 text-amber-500" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-medium">Enter your new Password</h3>
            <p className="text-sm text-white/80">Create a new password</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Forgot Password"
      rightSideContent={rightSideContent}
      description="Reset your ITCA account password"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your UTG email address and we will send you a link to reset your password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {emailSent ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 70 }}
            className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100"
          >
            <div className="mb-4 flex justify-center">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Check your UTG email</h2>
            <p className="text-gray-600 mb-4">
              We have sent a reset password link to:{' '}
              <span className="font-medium">{schoolEmail}</span>
            </p>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Please check all folders including spam and junk. The link is valid for 24 hours.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                UTG Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  id="email"
                  type="email"
                  value={schoolEmail}
                  placeholder="your.email@utg.edu.gm"
                  onChange={(e) => setSchoolEmail(e.target.value)}
                  className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <AuthButton type="submit" isLoading={isLoading} loadingText="Sending reset code...">
              Send reset link
            </AuthButton>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link
              href="/auth"
              className="text-blue-700 hover:text-blue-500 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </>
    </AuthLayout>
  );
};

export default ForgotPassword;

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
