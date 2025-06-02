import React, { useState } from 'react';
import { FaSave, FaUndo, FaCog, FaPalette, FaShieldAlt, FaEnvelope, FaCreditCard } from 'react-icons/fa';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
    enableDarkMode: boolean;
    fontFamily: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    maxLoginAttempts: number;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    notificationTypes: {
      membership: boolean;
      events: boolean;
      announcements: boolean;
      system: boolean;
    };
  };
  payment: {
    currency: string;
    enableOnlinePayment: boolean;
    paymentMethods: {
      card: boolean;
      bankTransfer: boolean;
      cash: boolean;
    };
    taxRate: number;
  };
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'NITP Abuja Chapter',
    siteDescription: 'Official website of the Nigerian Institute of Town Planners, Abuja Chapter',
    contactEmail: 'info@nitpabuja.org',
    contactPhone: '+234 801 234 5678',
    address: '123 Planning Street, Abuja, Nigeria',
    timezone: 'Africa/Lagos'
  },
  appearance: {
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
    enableDarkMode: true,
    fontFamily: 'Inter'
  },
  security: {
    enableTwoFactor: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5
  },
  notifications: {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    notificationTypes: {
      membership: true,
      events: true,
      announcements: true,
      system: true
    }
  },
  payment: {
    currency: 'NGN',
    enableOnlinePayment: true,
    paymentMethods: {
      card: true,
      bankTransfer: true,
      cash: true
    },
    taxRate: 7.5
  }
};

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'security' | 'notifications' | 'payment'>('general');
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
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

  const handleReset = () => {
    setSettings(defaultSettings);
    setIsDirty(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Site Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Configure website settings, appearance, and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaCog />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`${
              activeTab === 'appearance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaPalette />
            <span>Appearance</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaShieldAlt />
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
            <FaEnvelope />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <FaCreditCard />
            <span>Payment</span>
          </button>
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site Description
                </label>
                <input
                  type="text"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={settings.general.contactPhone}
                  onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  value={settings.general.address}
                  onChange={(e) => handleChange('general', 'address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                >
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="UTC">UTC</option>
                  {/* Add more timezone options */}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Appearance Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Color
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                    className="h-8 w-8 rounded-md border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Secondary Color
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
                    className="h-8 w-8 rounded-md border border-gray-300"
                  />
                  <input
                    type="text"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) => handleChange('appearance', 'secondaryColor', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Logo
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <img
                    src={settings.appearance.logo}
                    alt="Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <input
                    type="text"
                    value={settings.appearance.logo}
                    onChange={(e) => handleChange('appearance', 'logo', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Favicon
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <img
                    src={settings.appearance.favicon}
                    alt="Favicon"
                    className="h-8 w-8 object-contain"
                  />
                  <input
                    type="text"
                    value={settings.appearance.favicon}
                    onChange={(e) => handleChange('appearance', 'favicon', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Family
                </label>
                <select
                  value={settings.appearance.fontFamily}
                  onChange={(e) => handleChange('appearance', 'fontFamily', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  {/* Add more font options */}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.appearance.enableDarkMode}
                  onChange={(e) => handleChange('appearance', 'enableDarkMode', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Dark Mode
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => handleChange('security', 'enableTwoFactor', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notification Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.enableSMSNotifications}
                  onChange={(e) => handleChange('notifications', 'enableSMSNotifications', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable SMS Notifications
                </label>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Types
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notificationTypes.membership}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...settings.notifications.notificationTypes,
                        membership: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Membership Updates
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notificationTypes.events}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...settings.notifications.notificationTypes,
                        events: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Events
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notificationTypes.announcements}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...settings.notifications.notificationTypes,
                        announcements: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Announcements
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notificationTypes.system}
                      onChange={(e) => handleChange('notifications', 'notificationTypes', {
                        ...settings.notifications.notificationTypes,
                        system: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      System Updates
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency
                </label>
                <select
                  value={settings.payment.currency}
                  onChange={(e) => handleChange('payment', 'currency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  {/* Add more currency options */}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payment.enableOnlinePayment}
                  onChange={(e) => handleChange('payment', 'enableOnlinePayment', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Online Payments
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.payment.taxRate}
                  onChange={(e) => handleChange('payment', 'taxRate', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Methods
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.payment.paymentMethods.card}
                      onChange={(e) => handleChange('payment', 'paymentMethods', {
                        ...settings.payment.paymentMethods,
                        card: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.payment.paymentMethods.bankTransfer}
                      onChange={(e) => handleChange('payment', 'paymentMethods', {
                        ...settings.payment.paymentMethods,
                        bankTransfer: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Bank Transfer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.payment.paymentMethods.cash}
                      onChange={(e) => handleChange('payment', 'paymentMethods', {
                        ...settings.payment.paymentMethods,
                        cash: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Cash
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center space-x-2"
        >
          <FaUndo />
          <span>Reset</span>
        </button>
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

export default SiteSettings; 