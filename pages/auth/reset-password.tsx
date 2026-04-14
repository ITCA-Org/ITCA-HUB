import Link from 'next/link';
import { toast } from 'sonner';
import { NextApiRequest } from 'next';
import { BASE_URL } from '@/utils/url';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn } from '@/utils/auth';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import useTimedError from '@/hooks/timed-error';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData, UserAuth } from '@/types';
import { Eye, EyeOff, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import AuthButton from '@/components/dashboard/authentication/auth-button';
import AuthLayout from '@/components/dashboard/authentication/auth-layout';
import PasswordStrengthIndicator from '@/components/dashboard/authentication/sign-up/password-strength-indicator';

interface ResetPasswordDTO {
  resetToken: string;
  newPassword: string;
}

const ResetPassword = () => {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useTimedError();
  const [resetComplete, setResetComplete] = useState(false);

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      setResetToken(token as string);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetToken) {
      setError('Please enter the reset code from your email');
      toast.error('Reset code required', {
        description: 'Please check your email for the code',
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      toast.error('Password too short', {
        description: 'Please use at least 8 characters for security',
      });
      return;
    }

    setIsLoading(true);

    try {
      const resetPasswordData: ResetPasswordDTO = {
        resetToken,
        newPassword,
      };

      await axios.post(`${BASE_URL}/auth/reset-password`, resetPasswordData);

      setResetComplete(true);
      toast.success('Password has been reset successfully', {
        id: toast.loading('Resetting password...'),
        description: 'You can now sign in with your new password',
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
      <h2 className="text-5xl font-bold mb-6">Secure Your Account</h2>
      <p className="text-lg text-white/80 mb-8">
        Enter the verification code sent to your email and create a new secure password for your
        ITCA account.
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
        <h3 className="font-semibold text-lg mb-4">Password Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">Use a mix of letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">Avoid using easily guessable information like birthdays</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">Use a different password for each of your accounts</span>
          </li>
          <li className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <span className="text-sm">Consider using a password manager for added security</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Reset Password"
      rightSideContent={rightSideContent}
      description="Create a new password for your ITCA account"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600 mb-8">
          Enter the verification code from your email and create a new secure password
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 bg-green-50 rounded-lg border border-green-100"
          >
            <div className="mb-4 flex justify-center">
              <ShieldCheck className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Password Reset Complete</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link href="/auth">
              <AuthButton>Sign In</AuthButton>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  id="newPassword"
                  value={newPassword}
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator password={newPassword} />
            </div>

            <AuthButton type="submit" isLoading={isLoading} loadingText="Resetting password...">
              Reset Password
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

export default ResetPassword;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  // If there is user data and the user data type is not boolean, which means it is of type UserAuth object, then
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
