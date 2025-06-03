import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileAlt, FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaChartBar, FaChartPie, FaDownload, FaFilter } from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
    userTrend: Array<{ date: string; count: number }>;
  };
  applicationStats: {
    sarApplications: number;
    eiarApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    applicationTrend: Array<{ date: string; sar: number; eiar: number }>;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    revenueGrowth: number;
    revenueByType: Array<{ type: string; amount: number }>;
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
    userGrowth: 12.5,
    userTrend: [
      { date: 'Jan', count: 100 },
      { date: 'Feb', count: 120 },
      { date: 'Mar', count: 150 },
      { date: 'Apr', count: 180 },
      { date: 'May', count: 200 },
      { date: 'Jun', count: 250 }
    ]
  },
  applicationStats: {
    sarApplications: 250,
    eiarApplications: 200,
    approvedApplications: 300,
    rejectedApplications: 75,
    pendingApplications: 75,
    applicationTrend: [
      { date: 'Jan', sar: 20, eiar: 15 },
      { date: 'Feb', sar: 25, eiar: 18 },
      { date: 'Mar', sar: 30, eiar: 22 },
      { date: 'Apr', sar: 35, eiar: 25 },
      { date: 'May', sar: 40, eiar: 30 },
      { date: 'Jun', sar: 45, eiar: 35 }
    ]
  },
  revenueStats: {
    totalRevenue: 2500000,
    monthlyRevenue: 250000,
    yearlyRevenue: 3000000,
    revenueGrowth: 8.5,
    revenueByType: [
      { type: 'Membership', amount: 1200000 },
      { type: 'SAR Applications', amount: 750000 },
      { type: 'EIAR Applications', amount: 550000 }
    ]
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [data] = useState<AnalyticsData>(mockData);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleExport = () => {
    setIsLoading(true);
    // Simulate export delay
    setTimeout(() => {
      setIsLoading(false);
      // Add actual export logic here
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Monitor website performance, user engagement, and business metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <FaDownload />
            <span>{isLoading ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
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

      {/* Charts and Detailed Statistics */}
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
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userStats.userTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
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
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.applicationStats.applicationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sar" fill="#8884d8" />
                <Bar dataKey="eiar" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
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
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueStats.revenueByType}
                  dataKey="amount"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.revenueStats.revenueByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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