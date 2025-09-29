import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import router from 'next/router';
import { UserAuth } from '@/types';
import { motion } from 'framer-motion';
import { BASE_URL } from '@/utils/url';
import { useState, useEffect, useCallback } from 'react';
import { DashboardHeaderProps } from '@/types/interfaces/dashboard';
import ConfirmationModal from '@/components/dashboard/modals/confirmation-modal';
import { Menu, User, LogOut, HelpCircle, Crown, Image as ImageIcon } from 'lucide-react';

declare global {
  interface Window {
    clearDashboardHeaderCache?: () => void;
  }
}

const CACHE_KEY = 'user_profile_display';
const CACHE_DURATION = 10 * 60 * 1000;

interface CachedProfileData {
  role: string;
  firstName: string | undefined;
  lastName: string | undefined;
  schoolEmail: string | undefined;
  profilePictureUrl: string | undefined;
}

const DashboardHeader = ({ sidebarOpen, token, setSidebarOpen }: DashboardHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserAuth | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getCachedProfile = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }, []);

  const setCachedProfile = useCallback((profileData: UserAuth) => {
    try {
      const displayData: CachedProfileData = {
        role: profileData.role,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        schoolEmail: profileData.schoolEmail,
        profilePictureUrl: profileData.profilePictureUrl,
      };
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: displayData,
          timestamp: Date.now(),
        })
      );
    } catch {
      console.warn('Failed to cache profile data');
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = data.data;
      setUserData(profileData);
      setCachedProfile(profileData);
    } catch {
      console.error('Failed to fetch profile');
    }
  }, [token, setCachedProfile]);

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
    const cachedProfile = getCachedProfile();

    if (cachedProfile) {
      setUserData({
        ...cachedProfile,
        token: '',
        userId: '',
      } as UserAuth);
    } else {
      fetchUserProfile();
    }
  }, [getCachedProfile, fetchUserProfile]);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem(CACHE_KEY);
    router.push('/api/logout');
  };

  const clearCachedProfile = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    window.clearDashboardHeaderCache = clearCachedProfile;
    return () => {
      delete window.clearDashboardHeaderCache;
    };
  }, [clearCachedProfile]);

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
                          <MessageSquare className="h-5 w-5 text-blue-500" />
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
                  className="block text-center text-sm font-medium text-blue-500 hover:text-blue-700"
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
              <div className="h-9 w-9 overflow-hidden rounded-full">
                {profilePictureUrl ? (
                  <Image
                    width={36}
                    height={36}
                    alt="profile-image"
                    src={profilePictureUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 via-amber-300 to-blue-500 flex items-center justify-center">
                    {userData?.role === 'admin' ? (
                      <Crown className="w-5 h-5 text-white/80" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-white/80" />
                    )}
                  </div>
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
                    href={userData?.role === 'admin' ? '/admin/profile' : '/student/profile'}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href={userData?.role === 'admin' ? '/admin/help' : '/student/help'}
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

      {/*==================== Logout Confirmation Modal ====================*/}
      <ConfirmationModal
        title="Sign Out"
        variant="danger"
        cancelText="Cancel"
        confirmText="Sign Out"
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        icon={<LogOut className="h-5 w-5" />}
        onClose={() => setShowLogoutModal(false)}
        message="Are you sure you want to sign out? You will need to log in again to access your account."
      />
      {/*==================== End of Logout Confirmation Modal ====================*/}
    </header>
  );
};

export default DashboardHeader;
