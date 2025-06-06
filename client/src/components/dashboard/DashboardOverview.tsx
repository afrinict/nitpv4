import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  IdCard, 
  CreditCard, 
  Coins, 
  FileText,
} from "lucide-react";
import { Link } from "wouter";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ExtendedUser } from '../../types/user';

export interface MemberSummary {
  status: string;
  expiryDate?: string;
  type: string;
  credits: number;
  activeApplications: number;
}

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const extendedUser = user as ExtendedUser;

  const userInfo = {
    name: `${extendedUser?.firstName || ''} ${extendedUser?.lastName || ''}`.trim(),
    email: extendedUser?.email || '',
    status: extendedUser?.member?.status || "ACTIVE",
    membershipType: extendedUser?.member?.type || "PROFESSIONAL",
    credits: extendedUser?.member?.credits || 2400,
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'text-success';
      case 'EXPIRED':
        return 'text-danger';
      case 'PENDING':
        return 'text-warning';
      case 'SUSPENDED':
        return 'text-danger';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome, {userInfo.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Membership Status</h3>
          <p className="text-blue-600 dark:text-blue-200">{userInfo.status}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Membership Type</h3>
          <p className="text-green-600 dark:text-green-200">{userInfo.membershipType}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Available Credits</h3>
          <p className="text-purple-600 dark:text-purple-200">{userInfo.credits}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
