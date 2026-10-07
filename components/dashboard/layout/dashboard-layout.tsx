import Head from 'next/head';
import { useState } from 'react';
import Sidebar from './dashboard-sidebar';
import DashboardHeader from './dashboard-header';
import { DashboardLayoutProps } from '@/types/interfaces/dashboard';

const DashboardLayout = ({ children, title = 'Dashboard', token, role }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Head>
        <title>{`ITCA Hub | ${title}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/itca-logo.png" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="admin-itca relative flex h-dvh overflow-hidden bg-[#F5F8FA] text-[#0A1628]">
        <a
          href="#dashboard-content"
          className="sr-only z-[60] rounded-full bg-[#0A1628] px-5 py-3 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} role={role} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader
            token={token}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main
            id="dashboard-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 min-[968px]:p-8 xl:p-10"
          >
            <div className="mx-auto w-full max-w-[1500px]">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};
export default DashboardLayout;
