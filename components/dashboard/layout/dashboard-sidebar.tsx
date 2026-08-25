import {
  X,
  Users,
  FileText,
  Calendar,
  User2Icon,
  HelpCircle,
  LayoutDashboardIcon,
  ScanLine,
  WalletCards,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NavItem } from '@/types';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebarProps } from '@/types/interfaces/dashboard';

const adminNavItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/admin',
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Newsletter',
    href: '/admin/newsletter',
    icon: <Mail className="h-5 w-5" />,
  },
  {
    name: 'Events',
    href: '/admin/events',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: 'Ticket Scanner',
    href: '/admin/ticket-scanner',
    icon: <ScanLine className="h-5 w-5" />,
  },
  {
    name: 'Semester Dues',
    href: '/admin/dues',
    icon: <WalletCards className="h-5 w-5" />,
  },
  {
    name: 'Resources',
    href: '/admin/resources',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    href: '/admin/profile',
    icon: <User2Icon className="h-5 w-5" />,
  },
  {
    name: 'Help',
    href: '/admin/help',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

const Sidebar = ({ open, setOpen }: DashboardSidebarProps) => {
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return router.pathname === href;
    }
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 z-50 w-60 transform overflow-hidden max-[968px]:bg-white lg:bg-white transition-transform ease-in-out duration-700 
                    ${open ? 'translate-x-0' : '-translate-x-full'} 
                    min-[968px]:translate-x-0 min-[968px]:static min-[968px]:z-0`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-sm bg-blue-500/25"></div>
            <div className="absolute top-4 right-4 w-6 h-6 rounded-sm bg-amber-500/25"></div>
            <div className="absolute top-8 right-7 w-4 h-4 rounded-xs bg-blue-500/20"></div>
          </div>
        </div>

        <div className="relative h-full z-10 flex flex-col">
          <div className="justify-between items-center p-4 max-[967px]:flex hidden">
            <Link href="/" className="flex items-center">
              <Image
                priority
                width={120}
                height={40}
                alt="ITCA Logo"
                className="h-auto"
                src="/itca-logo.png"
              />
            </Link>
            <button
              title="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-amber-50 hover:text-amber-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden min-[968px]:flex items-center p-4 border-b border-gray-100">
            <Link href="/admin" className="flex items-center">
              <Image
                priority
                width={150}
                height={150}
                alt="ITCA Logo"
                src="/itca-logo.png"
                className="mr-2 h-auto"
              />
            </Link>
          </div>

          <div className="px-2 py-4 flex-1 overflow-y-auto">
            <div className="space-y-3">
              {adminNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-lg font-medium  ${
                    isActive(item.href)
                      ? 'bg-linear-to-r from-amber-100/70 to-blue-100/70 text-blue-700 border-none rounded-lg'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-blue-700'
                  }`}
                >
                  <span
                    className={`mr-3 ${isActive(item.href) ? 'text-amber-500' : 'text-gray-500'}`}
                  >
                    {item.icon}
                  </span>
                  <span className={`${isActive(item.href) ? 'font-bold' : 'font-normal'}`}>
                    {item.name}
                  </span>
                  {isActive(item.href) && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-gray-600/30 backdrop-blur-sm bg-opacity-75 max-[967px]:block hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
