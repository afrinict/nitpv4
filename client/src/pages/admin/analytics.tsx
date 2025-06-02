import React, { useState } from 'react';
import { FaUsers, FaFileAlt, FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaChartBar, FaChartPie, FaDownload } from 'react-icons/fa';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalApplications: number;
    pendingApplications: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  userStats: {
    newUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    userGrowth: number;
  };
  applicationStats: {
    sarApplications: number;
    eiarApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    revenueGrowth: number;
  };
}

const mockData: AnalyticsData = {
  overview: {
    totalUsers: 1250,
    activeUsers: 980,
    totalApplications: 450,
    pendingApplications: 75,
    totalRevenue: 2500000,
    monthlyRevenue: 250000
  },
  userStats: {
    newUsers: 150,
    activeUsers: 980,
    inactiveUsers: 270,
    userGrowth: 12.5
  },
  applicationStats: {
    sarApplications: 250,
    eiarApplications: 200,
    approvedApplications: 300,
    rejectedApplications: 75,
    pendingApplications: 75
  },
  revenueStats: {
    totalRevenue: 2500000,
    monthlyRevenue: 250000,
    yearlyRevenue: 3000000,
    revenueGrowth: 8.5
  }
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [data] = useState<AnalyticsData>(mockData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Monitor website performance, user engagement, and business metrics
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Year
          </button>
        </div>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center space-x-2">
          <FaDownload />
          <span>Export Report</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users:</span>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{data.overview.activeUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalApplications}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FaFileAlt className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending:</span>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{data.overview.pendingApplications}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.overview.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <FaMoneyBillWave className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue:</span>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(data.overview.monthlyRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">New Users</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.userStats.newUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.userStats.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Inactive Users</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.userStats.inactiveUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">User Growth</span>
              <span className={`text-sm font-medium ${
                data.userStats.userGrowth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatPercentage(data.userStats.userGrowth)}
              </span>
            </div>
          </div>
          <div className="mt-6 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <FaChartLine className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Application Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Application Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">SAR Applications</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.applicationStats.sarApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">EIAR Applications</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.applicationStats.eiarApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Approved Applications</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.applicationStats.approvedApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rejected Applications</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.applicationStats.rejectedApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending Applications</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{data.applicationStats.pendingApplications}</span>
            </div>
          </div>
          <div className="mt-6 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <FaChartBar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Revenue Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Revenue Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(data.revenueStats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(data.revenueStats.monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Yearly Revenue</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(data.revenueStats.yearlyRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</span>
              <span className={`text-sm font-medium ${
                data.revenueStats.revenueGrowth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatPercentage(data.revenueStats.revenueGrowth)}
              </span>
            </div>
          </div>
          <div className="mt-6 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <FaChartPie className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activity Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FaUsers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New User Registration</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">John Doe registered as a new member</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <FaFileAlt className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Application Approved</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">SAR application #1234 was approved</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FaMoneyBillWave className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Received</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Annual membership fee received from Jane Smith</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <FaCalendarAlt className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Event Created</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">New workshop "Urban Planning Basics" scheduled</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">8 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 