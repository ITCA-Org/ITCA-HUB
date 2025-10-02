import {
  X,
  User,
  Users,
  FileText,
  Calendar,
  User2Icon,
  HelpCircle,
  LayoutDashboardIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { NavItem } from '@/types';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebarProps } from '@/types/interfaces/dashboard';

const Sidebar = ({ open, setOpen }: DashboardSidebarProps) => {
  const router = useRouter();
  const isAdminRef = useRef(false);

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
      name: 'Events',
      href: '/admin/events',
      icon: <Calendar className="h-5 w-5" />,
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

  const studentNavItems: NavItem[] = [
    {
      name: 'Resources',
      href: '/student/resources',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Events',
      href: '/student/events',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: 'Profile',
      href: '/student/profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      name: 'Help',
      href: '/student/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const getNavItems = () => {
    isAdminRef.current = router.pathname.startsWith('/admin');
    return isAdminRef.current ? adminNavItems : studentNavItems;
  };

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/student') {
      return router.pathname === href;
    }
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/*==================== Sidebar ====================*/}
      <div
        className={`fixed inset-y-0 z-50 w-60 transform overflow-hidden max-[968px]:bg-white lg:bg-white transition-transform ease-in-out duration-700 
                    ${open ? 'translate-x-0' : '-translate-x-full'} 
                    min-[968px]:translate-x-0 min-[968px]:static min-[968px]:z-0`}
      >
        {/*==================== Decorative Elements  ====================*/}
        <div className="absolute inset-0 pointer-events-none">
          {/*==================== Top Right - Tech Circuit Pattern ====================*/}
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-sm bg-blue-500/25"></div>
            <div className="absolute top-4 right-4 w-6 h-6 rounded-sm bg-amber-500/25"></div>
            <div className="absolute top-8 right-7 w-4 h-4 rounded-xs bg-blue-500/20"></div>
          </div>
          {/*==================== End of Top Right - Tech Circuit Pattern ====================*/}
        </div>
        {/*==================== End of Decorative Elements ====================*/}

        {/*==================== Sidebar Content Container ====================*/}
        <div className="relative h-full z-10 flex flex-col">
          {/*==================== Mobile close button ====================*/}
          <div className="justify-between items-center p-4 max-[967px]:flex hidden">
            <Link href="/" className="flex items-center">
              <Image
                priority
                width={120}
                height={40}
                alt="ITCA Logo"
                className="h-auto"
                src="/images/logo.jpg"
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
          {/*==================== End of Mobile close button ====================*/}

          {/*==================== Desktop logo ====================*/}
          <div className="hidden min-[968px]:flex items-center p-4 border-b border-gray-100">
            <Link
              href={router.pathname.startsWith('/admin') ? '/admin' : '/student'}
              className="flex items-center"
            >
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
          {/*==================== End of Desktop logo ====================*/}

          {/*==================== Navigation Items ====================*/}
          <div className="px-2 py-4 flex-1 overflow-y-auto">
            <div className="space-y-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-lg font-medium  ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-amber-100/70 to-blue-100/70 text-blue-700 border-none rounded-lg'
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
          {/*==================== End of Navigation Items ====================*/}
        </div>
        {/*==================== End of Sidebar Content Container ====================*/}
      </div>
      {/*==================== End of Sidebar ====================*/}

      {/*==================== Mobile sidebar backdrop ====================*/}
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
      {/*==================== End of Mobile sidebar backdrop ====================*/}
    </>
  );
};

export default Sidebar;
