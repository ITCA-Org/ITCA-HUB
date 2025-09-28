import Head from 'next/head';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './dashboard-sidebar';
import DashboardHeader from './dashboard-header';
import { DashboardLayoutProps } from '@/types/interfaces/dashboard';

const DashboardLayout = ({ children, title = 'Dashboard', token }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`ITCA Hub | ${title}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.jpg" />
      </Head>

      <div className="flex h-screen overflow-hidden bg-amber-50/40 relative">
        {/*==================== Background Elements ====================*/}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/*==================== Prominent Geometric Elements - Top Right ====================*/}
          <div className="absolute top-0 right-0 w-2/3 h-full">
            <div className="absolute top-10 right-0 w-full h-full">
              <div className="absolute top-10 right-[-200px] h-[500px] w-[500px] rounded-full border-[40px] border-amber-500/15 animate-pulse"></div>
              <div
                className="absolute top-40 right-[-150px] h-[400px] w-[400px] rounded-full border-[30px] border-blue-700/15 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="absolute top-60 right-[-100px] h-[300px] w-[300px] rounded-full border-[20px] border-amber-500/15 animate-pulse"
                style={{ animationDelay: '0.8s' }}
              ></div>
            </div>
          </div>
          {/*==================== End of Prominent Geometric Elements - Top Right ====================*/}

          {/*==================== Angular Elements - Bottom Left ====================*/}
          <div className="hidden md:block absolute bottom-0 left-15 w-2/5 h-2/5">
            <div className="absolute bottom-10 left-70 w-[200px] h-[200px] origin-center rotate-45 bg-blue-700/15 rounded-xl animate-pulse"></div>
            <div
              className="absolute top-10 left-50 w-[160px] h-[160px] origin-center rotate-[30deg] bg-amber-500/15 rounded-xl animate-pulse"
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

        {/*==================== Sidebar ====================*/}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/*==================== End of Sidebar ====================*/}

        {/*==================== Main Content ====================*/}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader
            token={token}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto w-full overflow-x-hidden px-4 py-12 min-[968px]:px-9 min-[968px]:pr-7 min-[968px]:py-9">
            <motion.div
              transition={{ duration: 0.2 }}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
        {/*==================== End of Main Content ====================*/}
      </div>
    </>
  );
};

export default DashboardLayout;
