import React, { useState } from 'react';
import { FaUser, FaLock, FaHistory, FaCamera, FaSave, FaKey, FaBell, FaShieldAlt } from 'react-icons/fa';

interface AdminProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    avatar: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    lastLogin: string;
    loginHistory: Array<{
      date: string;
      ip: string;
      device: string;
      location: string;
    }>;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    notificationTypes: {
      system: boolean;
      security: boolean;
      updates: boolean;
      reports: boolean;
    };
  };
}

const mockProfile: AdminProfile = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@nitpabuja.org',
    phone: '+234 801 234 5678',
    role: 'Administrator',
    department: 'IT Department',
    avatar: '/images/avatar.png'
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2024-02-15',
    lastLogin: '2024-02-20 14:30',
    loginHistory: [
      {
        date: '2024-02-20 14:30',
        ip: '192.168.1.1',
        device: 'Chrome on Windows',
        location: 'Abuja, Nigeria'
      },
      {
        date: '2024-02-19 09:15',
        ip: '192.168.1.1',
        device: 'Chrome on Windows',
        location: 'Abuja, Nigeria'
      },
      {
        date: '2024-02-18 16:45',
        ip: '192.168.1.1',
        device: 'Chrome on Windows',
        location: 'Abuja, Nigeria'
      }
    ]
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    notificationTypes: {
      system: true,
      security: true,
      updates: true,
      reports: false
    }
  }
};

const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfile>(mockProfile);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications'>('personal');
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (section: keyof AdminProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsDirty(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Profile</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your personal information, security settings, and notification preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaUser />
            <span>Personal Information</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaLock />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaBell />
            <span>Notifications</span>
          </button>
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Personal Information */}
        {activeTab === 'personal' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={profile.personalInfo.avatar}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                    <FaCamera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.firstName}
                      onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.lastName}
                      onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.personalInfo.email}
                      onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.personalInfo.phone}
                      onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.role}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.department}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleChange('security', 'twoFactorEnabled', !profile.security.twoFactorEnabled)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      profile.security.twoFactorEnabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    {profile.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaKey className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Change Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last changed on {profile.security.lastPasswordChange}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Login History</h2>
              <div className="space-y-4">
                {profile.security.loginHistory.map((login, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{login.date}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {login.device} • {login.location}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{login.ip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Preferences</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications.email}
                      onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications.sms}
                      onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in the browser</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notifications.push}
                      onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Notification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.notifications.notificationTypes.system}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...profile.notifications.notificationTypes,
                        system: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">System Updates</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.notifications.notificationTypes.security}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...profile.notifications.notificationTypes,
                        security: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Security Alerts</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.notifications.notificationTypes.updates}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...profile.notifications.notificationTypes,
                        updates: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Content Updates</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={profile.notifications.notificationTypes.reports}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...profile.notifications.notificationTypes,
                        reports: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Reports</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center space-x-2 ${
            isDirty
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FaSave />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile; 