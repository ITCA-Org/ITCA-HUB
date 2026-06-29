import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import useTimedError from '@/hooks/timed-error';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { CustomError, ErrorResponseData } from '@/types';
import AuthButton from '@/components/dashboard/authentication/auth-button';
import AuthLayout from '@/components/dashboard/authentication/auth-layout';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [schoolEmail, setSchoolEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useTimedError();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!schoolEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/login', { schoolEmail, password });

      toast.success('Login successful', { description: 'You have been logged in successfully' });
      router.replace('/admin');
    } catch (err) {
      const { message } = getErrorMessage(
        err as AxiosError<ErrorResponseData> | CustomError | Error
      );
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const rightSideContent = (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 70 }}
      className="max-w-4xl text-center"
      transition={{ duration: 1, delay: 0.5 }}
    >
      <h2 className="text-6xl font-bold mb-6">ITCA Admin</h2>
      <p className="text-lg text-white/80 mb-8">
        Sign in to manage users, events, and resources for the Information Technology Communication
        Association.
      </p>
    </motion.div>
  );

  return (
    <AuthLayout
      title="Admin Sign In"
      rightSideContent={rightSideContent}
      description="Sign in to the ITCA admin dashboard"
    >
      <>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin access</h1>
        <p className="text-gray-600 mb-8">Sign in with your administrator credentials</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
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

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                id="password"
                value={password}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
            Sign in
          </AuthButton>
        </form>
      </>
    </AuthLayout>
  );
};

export default AdminLogin;
