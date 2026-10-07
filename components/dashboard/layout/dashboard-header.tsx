import Link from 'next/link';
import Image from 'next/image';
import router from 'next/router';
import { motion } from 'framer-motion';
import useProfile from '@/hooks/profile/use-profile';
import { useState, useEffect } from 'react';
import { DashboardHeaderProps } from '@/types/interfaces/dashboard';
import ConfirmationModal from '@/components/dashboard/modals/confirmation-modal';
import { Menu, User, LogOut, HelpCircle, Crown, Image as ImageIcon } from 'lucide-react';

const DashboardHeader = ({ sidebarOpen, setSidebarOpen, token }: DashboardHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { profile } = useProfile(token || '');

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

  const handleLogout = () => {
    setShowLogoutModal(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    router.push('/api/logout');
  };

  useEffect(() => {
    if (profile?.profilePictureUrl) {
      setImageError(false);
    }
  }, [profile?.profilePictureUrl]);

  const fullName =
    profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : '';
  const email = profile?.schoolEmail || '';
  const profilePictureUrl = profile?.profilePictureUrl || '';
  const role = profile?.role || '';

  return (
    <header className="relative z-20 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-[#0A1628]/10 bg-white px-4 sm:px-6 min-[968px]:px-10">
      <div className="flex items-center gap-4">
        <button
          aria-label="Open navigation"
          aria-expanded={sidebarOpen}
          aria-controls="admin-navigation"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none max-[967px]:block hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <p className="landing-mono text-[10px] uppercase tracking-[0.16em] text-[#005080]">
            ITCA Hub
          </p>
          <p className="text-sm font-medium text-[#0A1628]">Administration</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="hidden rounded-full border border-[#0A1628]/15 px-4 py-2 text-xs font-medium text-[#005080] hover:bg-[#D4E6F2]/50 sm:inline-flex"
        >
          View website &nearr;
        </Link>

        {profile && (
          <div className="relative max-[990px]:px-0 pr-3">
            <button
              className="profile-trigger flex items-center space-x-2 rounded-full focus:outline-none cursor-pointer"
              aria-label="Account menu"
              aria-expanded={isProfileOpen}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setIsProfileOpen(false);
              }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="h-9 w-9 overflow-hidden rounded-full">
                {profilePictureUrl && !imageError ? (
                  <Image
                    width={36}
                    height={36}
                    alt="profile-image"
                    src={profilePictureUrl}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#005080] flex items-center justify-center">
                    {role === 'admin' ? (
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

            {isProfileOpen && (
              <motion.div
                exit={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 10 }}
                className="profile-menu absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl shadow-[#0A1628]/10"
              >
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href="/admin/help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                    Help
                  </Link>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

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
    </header>
  );
};

export default DashboardHeader;
