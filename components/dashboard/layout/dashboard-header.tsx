import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import router from 'next/router';
import { UserAuth } from '@/types';
import { motion } from 'framer-motion';
import { BASE_URL } from '@/utils/url';
import { useState, useEffect, useCallback } from 'react';
import { DashboardHeaderProps } from '@/types/interfaces/dashboard';
import { Menu, User, LogOut, HelpCircle, Crown } from 'lucide-react';

const DashboardHeader = ({ sidebarOpen, token, setSidebarOpen }: DashboardHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserAuth | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(data.data);
    } catch {}
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-trigger')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = () => {
    router.push('/api/logout');
  };

  const fullName = userData?.firstName + ' ' + userData?.lastName;
  const email = userData?.schoolEmail;
  const profilePictureUrl = userData?.profilePictureUrl;

  return (
    <header className="sticky z-20 flex h-16 items-center justify-between bg-white rounded-br-4xl rounded-bl-4xl px-4 transition-shadow duration-200 min-[968px]:px-6">
      {/*==================== Mobile menu button ====================*/}
      <div className="flex items-center space-x-4">
        <button
          title="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none max-[967px]:block hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/*==================== Decorative Elements  ====================*/}
        <div className="absolute inset-0 pointer-events-none">
          {/*==================== Top Left - Tech Circuit Pattern ====================*/}
          <div className="absolute top-3 left-15 max-[990px]:left-25">
            <div className="w-8 h-8 rounded-full bg-blue-500/25"></div>
            <div className="absolute top-4 right-5 w-6 h-6 rounded-full bg-amber-500/25"></div>
            <div className="absolute top-6 right-11 w-4 h-4 rounded-full bg-blue-500/20"></div>
          </div>
          {/*==================== End of Top Left - Tech Circuit Pattern ====================*/}
        </div>
        {/*==================== End of Decorative Elements ====================*/}
      </div>
      {/*==================== End of Mobile menu button ====================*/}

      {/*==================== Right: Notifications and user menu ====================*/}
      <div className="flex items-center space-x-4">
        {/*==================== Notifications ====================*/}
        {/* <div className="relative"> */}
        {/* <button
            className="notification-trigger rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              3
            </span>
          </button> */}

        {/*==================== Notification Dropdown ====================*/}
        {/* {isNotificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="notification-menu absolute right-0 top-full mt-2 w-72 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
            >
              <div className="px-4 py-2">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="block border-l-4 border-transparent px-4 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          New course material available
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Web Development: Lecture notes uploaded
                        </p>
                        <p className="mt-1 text-xs text-gray-400">10 min ago</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <a
                  href="#"
                  className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all notifications
                </a>
              </div>
            </motion.div>
          )} */}
        {/*==================== End of Notification Dropdown ====================*/}
        {/* </div> */}
        {/*==================== End of Notifications ====================*/}

        {/*==================== User Menu ====================*/}
        {userData && (
          <div className="relative max-[990px]:px-0 pr-3">
            <button
              className="profile-trigger flex items-center space-x-2 rounded-full focus:outline-none cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">
                {profilePictureUrl ? (
                  <Image
                    width={36}
                    height={36}
                    alt="profile-image"
                    src={profilePictureUrl}
                    className="w-full h-full object-cover"
                  />
                ) : userData.role === 'admin' ? (
                  <Crown className="w-5 h-5 text-blue-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 min-[968px]:block">
                {fullName}
              </span>
            </button>

            {/*==================== Dropdown ====================*/}
            {isProfileOpen && (
              <motion.div
                exit={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 10 }}
                className="profile-menu absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
              >
                {/*==================== Dropdown Info ====================*/}
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>
                {/*==================== End of Dropdown Info ====================*/}

                {/*==================== Dropdown Links ====================*/}
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                    Help
                  </Link>
                </div>
                {/*==================== End of Dropdown Links ====================*/}

                {/*==================== Logout Button ====================*/}
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
                {/*==================== End of Logout Button ====================*/}
              </motion.div>
            )}
            {/*==================== End of Dropdown ====================*/}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
