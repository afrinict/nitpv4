import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { format, differenceInDays } from 'date-fns';
import { FiCheckCircle, FiAlertCircle, FiClock, FiDownload, FiInfo } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface MemberStatus {
  status: 'Active' | 'Expired' | 'Pending';
  expiryDate: string;
}

interface Transaction {
  id: string;
  amount: number;
  paymentDate: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  type: string;
  features: string[];
}

const Subscription = () => {
  const [memberStatus, setMemberStatus] = useState<MemberStatus>({
    status: 'Active',
    expiryDate: '2024-12-31'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 50000,
      paymentDate: '2024-01-15',
      status: 'Success'
    },
    {
      id: '2',
      amount: 50000,
      paymentDate: '2023-01-15',
      status: 'Success'
    }
  ]);

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: '1',
      name: 'Fellow',
      price: 100000,
      type: 'Fellow (FNITP)',
      features: ['Full access to all resources', 'Priority support', 'Voting rights']
    },
    {
      id: '2',
      name: 'Professional',
      price: 75000,
      type: 'Professional Member (MNITP)',
      features: ['Full access to all resources', 'Standard support']
    },
    {
      id: '3',
      name: 'Associate',
      price: 50000,
      type: 'Associate Member',
      features: ['Limited access to resources', 'Basic support']
    },
    {
      id: '4',
      name: 'Student',
      price: 25000,
      type: 'Student Member',
      features: ['Limited access to resources', 'Basic support']
    }
  ];

  useEffect(() => {
    // Simulate loading member status
    setTimeout(() => {
      setMemberStatus({
        status: 'Active',
        expiryDate: '2024-12-31'
      });
    }, 1000);

    // Simulate loading transactions
    setTimeout(() => {
      setTransactions([
        {
          id: '1',
          amount: 50000,
          paymentDate: '2024-01-15',
          status: 'Success'
        },
        {
          id: '2',
          amount: 50000,
          paymentDate: '2023-01-15',
          status: 'Success'
        }
      ]);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const handleRenew = () => {
    // Implement renewal logic
    console.log('Renew membership');
  };

  const formatPaymentDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Membership Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(memberStatus.status)}
                  <span className="font-medium">{memberStatus.status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">{formatPaymentDate(memberStatus.expiryDate)}</p>
              </div>
            </div>
            <Button onClick={handleRenew} className="mt-4">
              Renew Membership
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">₦{transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{formatPaymentDate(transaction.paymentDate)}</p>
                  </div>
                  <Badge variant={transaction.status === 'Success' ? 'success' : 'secondary'}>
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Subscription Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.id}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <p className="text-2xl font-bold">₦{tier.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{tier.type}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4">Select Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscription;