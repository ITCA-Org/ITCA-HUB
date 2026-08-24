import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import useTimedError from '@/hooks/timed-error';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { CustomError, ErrorResponseData } from '@/types';
import AuthButton from '@/components/dashboard/authentication/auth-button';
import LandingLayout from '@/components/landing-page/landing-layout';
import { easeOut } from '@/components/landing-page/reveal';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [schoolEmail, setSchoolEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useTimedError();
  const reduce = useReducedMotion();

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

  return (
    <LandingLayout
      path="/auth"
      title="Admin Sign In | ITCA Hub"
      description="Sign in to the ITCA admin dashboard"
      showFloatingCta={false}
      showNewsletter={false}
    >
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <section className="bg-white px-4 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:px-16 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <motion.article
            className="grid overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:grid-cols-2 lg:rounded-[2.5rem]"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: easeOut }}
          >
            {/* Form first on mobile so credentials are above the fold */}
            <div
              className="order-1 flex flex-col justify-center p-5 sm:p-10 lg:order-2 lg:p-12"
              style={{ backgroundColor: '#D4E6F2' }}
            >
              <p className="landing-mono text-xs text-[#0A1628]/70 sm:text-sm">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#0A1628]" />
                Admin
              </p>

              <h1 className="mt-4 text-2xl font-bold leading-tight text-[#0A1628] sm:mt-6 sm:text-4xl lg:text-5xl">
                Sign in to the dashboard
              </h1>
              <p className="mt-2 max-w-md text-sm text-[#0A1628]/70 sm:mt-3 sm:text-base">
                Use your administrator credentials to manage users, events, and resources.
              </p>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mt-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#0A1628]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-[#0A1628]/40" />
                    </div>
                    <input
                      required
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={schoolEmail}
                      placeholder="your.email@utg.edu.gm"
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      className="w-full rounded-2xl border border-[#0A1628]/15 bg-white py-3.5 pl-10 pr-4 text-base text-[#0A1628] transition-all placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20 sm:py-3"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#0A1628]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-[#0A1628]/40" />
                    </div>
                    <input
                      required
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[#0A1628]/15 bg-white py-3.5 pl-10 pr-12 text-base text-[#0A1628] transition-all placeholder:text-[#0A1628]/35 focus:border-[#005080] focus:outline-none focus:ring-2 focus:ring-[#005080]/20 sm:py-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center pr-3"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#0A1628]/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#0A1628]/40" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <AuthButton type="submit" isLoading={isLoading} loadingText="Signing in...">
                    Sign in
                  </AuthButton>
                </div>
              </form>
            </div>

            <div className="relative order-2 hidden overflow-hidden lg:order-1 lg:block lg:min-h-[420px]">
              <Image
                fill
                priority
                alt="ITCA campus building"
                src="/images/main-building.jpeg"
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          </motion.article>
        </div>
      </section>
    </LandingLayout>
  );
};

export default AdminLogin;
