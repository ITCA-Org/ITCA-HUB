import { useState, useRef } from 'react';
import {
  X,
  Eye,
  Save,
  Lock,
  User,
  Crown,
  Edit3,
  Camera,
  Shield,
  EyeOff,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import Image from 'next/image';
import useProfile from '@/hooks/profile/use-profile';
import { ProfileComponentProps } from '@/types/interfaces/profile';
import { NetworkError } from '@/components/dashboard/error-messages';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import UserProfileSkeleton from '@/components/dashboard/skeletons/user-profile';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

const ProfileComponent = ({ role, userData }: ProfileComponentProps) => {
  const {
    error,
    profile,
    isLoading,
    updateProfile,
    changePassword,
    refetchProfile,
    uploadImageOnly,
    isUploadingImage,
    isUpdatingProfile,
    isChangingPassword,
  } = useProfile({ token: userData.token });

  const [isChangingPasswordMode, setIsChangingPasswordMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      profilePictureUrl: profile?.profilePictureUrl || '',
    });
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);

      if (typeof window !== 'undefined' && window.clearDashboardHeaderCache) {
        window.clearDashboardHeaderCache();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPasswordMode(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImageOnly(file);
      if (imageUrl) {
        setProfileForm((prev) => ({
          ...prev,
          profilePictureUrl: imageUrl,
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**===========================
   * Format last login helper
   ===========================*/
  const formatLastLogin = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout
      title={role === 'admin' ? 'Admin Profile' : 'My Profile'}
      token={userData.token}
    >
      {/*==================== Page Header ====================*/}
      <DashboardPageHeader
        title="My"
        subtitle="Profile"
        description={
          role === 'admin'
            ? 'Manage your administrator account settings and personal information'
            : 'Manage your account settings and personal information'
        }
      />
      {/*==================== End of Page Header ====================*/}

      {isLoading ? (
        <UserProfileSkeleton />
      ) : error ? (
        <NetworkError
          onRetry={refetchProfile}
          title="Unable to load profile"
          retryButtonText="Reload Profile"
          description="Please check your internet connection and try again."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/*==================== Profile Information Card ====================*/}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-500 flex items-center">
                  {role === 'admin' ? (
                    <>
                      <Crown className="h-5 w-5 text-blue-500 mr-2" />
                      Administrator Profile
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5 text-blue-500 mr-2" />
                      Profile Information
                    </>
                  )}
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={handleProfileEdit}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                /*==================== Display Mode ====================*/
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:flex items-center space-x-4 border-b pt-2 pb-4">
                    <div className="relative">
                      {profile?.profilePictureUrl ? (
                        <Image
                          width={192}
                          height={192}
                          alt="Profile"
                          src={profile.profilePictureUrl}
                          className="w-48 h-48 rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                          {role === 'admin' ? (
                            <Crown className="w-8 h-8 text-blue-500" />
                          ) : (
                            <User className="w-8 h-8 text-blue-500" />
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-500">
                        {profile?.firstName} {profile?.lastName}
                      </h3>
                      <p className="text-gray-500">{profile?.schoolEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        FIRST NAME
                      </label>
                      <p className="text-gray-500 font-normal">{profile?.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">
                        LAST NAME
                      </label>
                      <p className="text-gray-500 font-normal">{profile?.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">EMAIL</label>
                      <p className="text-gray-500 font-normal">{profile?.schoolEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">ROLE</label>
                      {role === 'admin' ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
                          <Crown className="w-4 h-4 mr-1" />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          Student
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /*==================== End of Display Mode ====================*/

                /*==================== Edit Mode ====================*/
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:flex items-center space-x-4">
                    <div className="relative">
                      {profileForm.profilePictureUrl || profile?.profilePictureUrl ? (
                        <Image
                          width={192}
                          height={192}
                          alt="Profile"
                          src={profileForm.profilePictureUrl || profile?.profilePictureUrl || ''}
                          className="w-48 h-48 rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                          {role === 'admin' ? (
                            <Crown className="w-8 h-8 text-blue-500" />
                          ) : (
                            <User className="w-8 h-8 text-blue-500" />
                          )}
                        </div>
                      )}
                      <button
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-500 mb-1">Profile Picture</h3>
                      <p className="text-md text-gray-600">
                        Click the camera icon to upload a new photo
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-500 mb-1"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, firstName: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-500 mb-1"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, lastName: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileSave}
                      disabled={isUpdatingProfile}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
                /*==================== End of Edit Mode ====================*/
              )}
            </div>

            {/*==================== Password Change Card ====================*/}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex gap-4 flex-col md:flex-row md:flex md:items-center md:justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-500 flex items-center">
                  <Lock className="h-5 w-5 text-blue-500 mr-2" />
                  Password & Security
                </h2>
                {!isChangingPasswordMode && (
                  <button
                    onClick={() => setIsChangingPasswordMode(true)}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                )}
              </div>

              {!isChangingPasswordMode ? (
                <div>
                  <p className="text-md text-gray-600 mb-4">
                    Keep your account secure by using a strong password.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Password Requirements:</strong> At least 6 characters with uppercase,
                      lowercase, number, and special character.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-500 mb-1"
                    >
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-500 mb-1"
                    >
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        value={passwordForm.newPassword}
                        type={showPasswords.new ? 'text' : 'password'}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-500 mb-1"
                    >
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        type={showPasswords.confirm ? 'text' : 'password'}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setIsChangingPasswordMode(false);
                        setPasswordForm({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setShowPasswords({ current: false, new: false, confirm: false });
                      }}
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      disabled={
                        isChangingPassword ||
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        passwordForm.newPassword !== passwordForm.confirmPassword
                      }
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/*==================== End of Profile Information Card ====================*/}

          {/*==================== Account Summary Card ====================*/}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-500 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                Account Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">MEMBER SINCE</label>
                  <p className="text-gray-500 font-normal">
                    {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">LAST LOGIN</label>
                  <p className="text-gray-500 font-normal">
                    {profile?.lastLoggedIn ? formatLastLogin(profile.lastLoggedIn) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">EMAIL STATUS</label>
                  <div className="flex items-center">
                    {profile?.isEmailVerified ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*==================== End of Account Summary Card ====================*/}
        </div>
      )}

      {/*==================== Hidden File Input ====================*/}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      {/*==================== End of Hidden File Input ====================*/}
    </DashboardLayout>
  );
};

export default ProfileComponent;
