import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { monitoringService } from '../../services/monitoringService';

interface VerificationStats {
  failedAttempts: {
    email: number;
    phone: number;
  };
  suspiciousIPs: number;
  rateLimitExceeded: number;
}

interface Alert {
  type: string;
  timestamp: string;
  data: any;
}

const MonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, alertsData] = await Promise.all([
          monitoringService.getVerificationStats(),
          monitoringService.getAlerts(timeRange),
        ]);
        setStats(statsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Monitoring Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={() => setTimeRange('1h')}
            className={`px-4 py-2 rounded ${
              timeRange === '1h' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            1 Hour
          </button>
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-4 py-2 rounded ${
              timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded ${
              timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Failed Verification Attempts</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-bold">{stats.failedAttempts.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-bold">{stats.failedAttempts.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Suspicious Activity</h2>
          <div className="text-3xl font-bold">{stats.suspiciousIPs}</div>
          <div className="text-sm text-gray-500">Suspicious IPs Detected</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Rate Limit Exceeded</h2>
          <div className="text-3xl font-bold">{stats.rateLimitExceeded}</div>
          <div className="text-sm text-gray-500">Rate Limit Violations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Failed Attempts Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.failedAttempts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="email" stroke="#8884d8" />
                <Line type="monotone" dataKey="phone" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4">
                <div className="font-semibold">{alert.type}</div>
                <div className="text-sm text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                <div className="text-sm mt-1">{JSON.stringify(alert.data)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard; 