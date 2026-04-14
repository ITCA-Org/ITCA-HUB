import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  rightSideContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  rightSideContent,
}) => {
  return (
    <>
      <Head>
        <title>{`ITCA Hub | ${title}`}</title>
        <link rel="icon" href="/images/logo.jpg" />
        <meta name="description" content={description} />
      </Head>

      <div className="flex flex-col md:flex-row md:min-h-screen">
        {/*==================== Left Side - Form ====================*/}
        <div className="relative w-full md:w-1/2 min-h-screen bg-linear-to-b from-white to-gray-100">
          {/*==================== Background Elements ====================*/}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/*==================== Glowing Dots at Intersections ====================*/}
            <div className="absolute inset-0">
              {/*==================== Glowing Dots Row 1 ====================*/}
              <div className="absolute top-25 left-10 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500"></div>
              <div
                className="absolute top-25 left-2/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="absolute top-25 right-10 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500"
                style={{ animationDelay: '0.4s' }}
              ></div>
              {/*==================== End of Glowing Dots Row 1 ====================*/}

              {/*==================== Glowing Dots Row 2 ====================*/}
              <div
                className="absolute top-2/4 left-10 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="absolute top-2/4 left-2/4 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500"
                style={{ animationDelay: '0.7s' }}
              ></div>
              <div
                className="absolute top-2/4 right-10 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500"
                style={{ animationDelay: '0.1s' }}
              ></div>
              {/*==================== End of Glowing Dots Row 2 ====================*/}

              {/*==================== Glowing Dots Row 3 ====================*/}
              <div
                className="absolute top-3/4 left-10 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500"
                style={{ animationDelay: '0.6s' }}
              ></div>
              <div
                className="absolute top-3/4 left-2/4 h-2 w-2 rounded-full bg-amber-500/40 animate-pulse shadow-sm shadow-amber-500"
                style={{ animationDelay: '0.8s' }}
              ></div>
              <div
                className="absolute top-3/4 right-10 h-2 w-2 rounded-full bg-blue-500/40 animate-pulse shadow-sm shadow-blue-500"
                style={{ animationDelay: '0.7s' }}
              ></div>
              {/*==================== End of Glowing Dots at Intersections Row 3 ====================*/}
            </div>
            {/*==================== End of Glowing Dots at Intersections ====================*/}

            {/*==================== Subtle Dot Pattern ====================*/}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(30,64,175,1) 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            ></div>
            {/*==================== End of Subtle Dot Pattern ====================*/}
          </div>
          {/*==================== End of Background Elements ====================*/}

          {/*==================== Content Container ====================*/}
          <div className="relative flex items-center justify-center min-h-screen p-8 md:p-16">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </div>

              <div className="mb-8 flex justify-center md:justify-start">
                <Link href="/">
                  <Image
                    priority
                    width={150}
                    height={150}
                    alt="ITCA Logo"
                    src="/images/logo.jpg"
                    className="mr-2 h-auto"
                  />
                </Link>
              </div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -70 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
          {/*==================== End of Content Container ====================*/}
        </div>
        {/*==================== End of Left Side - Form ====================*/}

        {/*==================== Right Side - Image/Design ====================*/}
        <div className="hidden md:block md:w-1/2 md:min-h-screen bg-linear-to-br from-blue-700 to-gray-900 relative overflow-hidden">
          {/*==================== Background Image ====================*/}
          <div className="absolute inset-0 z-0">
            <Image
              fill
              priority
              alt="Background"
              className="opacity-20"
              style={{ objectFit: 'cover' }}
              src="/images/main-building.jpeg"
            />
          </div>

          {/*==================== Content Slot For the Right Side ====================*/}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white z-30">
            {rightSideContent}
          </div>

          {/*==================== Decorative elements ====================*/}
          <div className="absolute -bottom-20 -left-20 w-50 h-50 rounded-full bg-blue-400 blur-3xl z-10"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400 blur-3xl z-10"></div>
          {/*==================== End of Decorative elements ====================*/}
        </div>
        {/*==================== End of Right Side - Image/Design ====================*/}
      </div>
    </>
  );
};

export default AuthLayout;
