import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { format, differenceInDays } from 'date-fns';
import { FiCheckCircle, FiAlertCircle, FiClock, FiDownload, FiInfo } from 'react-icons/fi';

interface MemberStatus {
  status: string;
  type: string;
  id: string;
  enrollmentDate: string;
  expirationDate: string;
  daysRemaining: number;
}

interface Transaction {
  paymentDate: string;
  membershipPeriod: string;
  amount: string;
  status: string;
  method: string;
  receiptUrl: string;
}

interface MembershipFee {
  type: string;
  amount: string;
  description: string;
}

const Subscription = () => {
  const [memberStatus, setMemberStatus] = useState<MemberStatus>({
    status: 'Active',
    type: 'Professional Member - MNITP',
    id: 'TP-A32XXXXXX',
    enrollmentDate: '2023-01-15',
    expirationDate: '2025-12-31',
    daysRemaining: 590
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      paymentDate: '2024-01-15',
      membershipPeriod: 'Jan 2024 - Dec 2024',
      amount: 'NGN 25,000',
      status: 'Completed',
      method: 'Card',
      receiptUrl: '#'
    },
    {
      paymentDate: '2023-01-15',
      membershipPeriod: 'Jan 2023 - Dec 2023',
      amount: 'NGN 25,000',
      status: 'Completed',
      method: 'Bank Transfer',
      receiptUrl: '#'
    }
  ]);

  const membershipFees: MembershipFee[] = [
    {
      type: 'Fellow (FNITP)',
      amount: 'NGN 30,000',
      description: 'Full membership for Fellows'
    },
    {
      type: 'Professional Member (MNITP)',
      amount: 'NGN 25,000',
      description: 'Full membership for Professional Members'
    },
    {
      type: 'Associate Member',
      amount: 'NGN 15,000',
      description: 'Membership for Associate Members'
    },
    {
      type: 'Student Member',
      amount: 'NGN 5,000',
      description: 'Membership for Student Members'
    }
  ];

  useEffect(() => {
    // Simulate fetching member status
    setTimeout(() => {
      const today = new Date();
      const expirationDate = new Date(memberStatus.expirationDate);
      const daysRemaining = differenceInDays(expirationDate, today);
      
      setMemberStatus(prev => ({
        ...prev,
        daysRemaining,
        status: daysRemaining > 0 ? 'Active' : 'Expired'
      }));
    }, 1000);

    // Simulate fetching transactions
    setTimeout(() => {
      setTransactions([
        {
          paymentDate: '2024-01-15',
          membershipPeriod: 'Jan 2024 - Dec 2024',
          amount: 'NGN 25,000',
          status: 'Completed',
          method: 'Card',
          receiptUrl: '#'
        },
        {
          paymentDate: '2023-01-15',
          membershipPeriod: 'Jan 2023 - Dec 2023',
          amount: 'NGN 25,000',
          status: 'Completed',
          method: 'Bank Transfer',
          receiptUrl: '#'
        }
      ]);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'Expired':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case 'Pending Renewal':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'Grace Period':
        return <FiAlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleRenew = () => {
    // TODO: Implement renewal logic
    console.log('Renew membership');
  };

  const formatPaymentDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span className="text-xl">Dashboard</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Profile</span>
          </Link>
          <Link href="/subscription" className="flex items-center space-x-2 p-2 rounded bg-gray-100">
            <span>Subscription</span>
          </Link>
          <Link href="/applications" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Applications</span>
          </Link>
          <Link href="/e-learning" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>E-Learning</span>
          </Link>
          <Link href="/tools" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Tools</span>
          </Link>
          <Link href="/directory" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Directory</span>
          </Link>
          <Link href="/chat" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Chat</span>
          </Link>
          <Link href="/elections" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Elections</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">My Membership Subscription</h1>

          {/* Current Membership Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  {getStatusIcon(memberStatus.status)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{memberStatus.status}</h2>
                  <p className="text-gray-600">{memberStatus.type}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membership ID</span>
                  <span className="font-medium">{memberStatus.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrollment Date</span>
                  <span className="font-medium">{memberStatus.enrollmentDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Renewal Date</span>
                  <span className="font-medium">{memberStatus.expirationDate}</span>
                </div>
                {memberStatus.status === 'Active' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className="font-medium text-green-600">{memberStatus.daysRemaining} days</span>
                  </div>
                )}
              </div>
            </div>
            {memberStatus.status !== 'Active' && (
              <button
                onClick={handleRenew}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Renew Now
              </button>
            )}
          </div>

          {/* Benefits Reminder */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Membership Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Maintain professional standing</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Access to tools & courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Voting rights</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Networking opportunities</span>
              </li>
            </ul>
          </div>

          {/* Membership Fee Structure */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Membership Fee Structure</h3>
            <div className="space-y-4">
              {membershipFees.map((fee, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{fee.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{fee.amount}</span>
                    <FiInfo className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" 
                      title={fee.description}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Renewal History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membership Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPaymentDate(transaction.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.membershipPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={transaction.receiptUrl}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FiDownload className="w-4 h-4 mr-1" />
                          View Receipt
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



const Subscription = () => {
  const [memberStatus, setMemberStatus] = useState<MemberStatus>({
    status: 'Active',
    type: 'Professional Member - MNITP',
    id: 'TP-A32XXXXXX',
    enrollmentDate: '2023-01-15',
    expirationDate: '2025-12-31',
    daysRemaining: 590
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      paymentDate: '2024-01-15',
      membershipPeriod: 'Jan 2024 - Dec 2024',
      amount: 'NGN 25,000',
      status: 'Completed',
      method: 'Card',
      receiptUrl: '#'
    },
    {
      paymentDate: '2023-01-15',
      membershipPeriod: 'Jan 2023 - Dec 2023',
      amount: 'NGN 25,000',
      status: 'Completed',
      method: 'Bank Transfer',
      receiptUrl: '#'
    }
  ]);

  const membershipFees: MembershipFee[] = [
    {
      type: 'Fellow (FNITP)',
      amount: 'NGN 30,000',
      description: 'Full membership for Fellows'
    },
    {
      type: 'Professional Member (MNITP)',
      amount: 'NGN 25,000',
      description: 'Full membership for Professional Members'
    },
    {
      type: 'Associate Member',
      amount: 'NGN 15,000',
      description: 'Membership for Associate Members'
    },
    {
      type: 'Student Member',
      amount: 'NGN 5,000',
      description: 'Membership for Student Members'
    }
  ];

  useEffect(() => {
    // Simulate fetching member status
    setTimeout(() => {
      const today = new Date();
      const expirationDate = new Date(memberStatus.expirationDate);
      const daysRemaining = differenceInDays(expirationDate, today);
      
      setMemberStatus(prev => ({
        ...prev,
        daysRemaining,
        status: daysRemaining > 0 ? 'Active' : 'Expired'
      }));
    }, 1000);

    // Simulate fetching transactions
    setTimeout(() => {
      setTransactions([
        {
          paymentDate: '2024-01-15',
          membershipPeriod: 'Jan 2024 - Dec 2024',
          amount: 'NGN 25,000',
          status: 'Completed',
          method: 'Card',
          receiptUrl: '#'
        },
        {
          paymentDate: '2023-01-15',
          membershipPeriod: 'Jan 2023 - Dec 2023',
          amount: 'NGN 25,000',
          status: 'Completed',
          method: 'Bank Transfer',
          receiptUrl: '#'
        }
      ]);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'Expired':
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case 'Pending Renewal':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      case 'Grace Period':
        return <FiAlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const handleRenew = () => {
    // TODO: Implement renewal logic
    console.log('Renew membership');
  };

  const formatPaymentDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span className="text-xl">Dashboard</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Profile</span>
          </Link>
          <Link href="/subscription" className="flex items-center space-x-2 p-2 rounded bg-gray-100">
            <span>Subscription</span>
          </Link>
          <Link href="/applications" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Applications</span>
          </Link>
          <Link href="/e-learning" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>E-Learning</span>
          </Link>
          <Link href="/tools" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Tools</span>
          </Link>
          <Link href="/directory" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Directory</span>
          </Link>
          <Link href="/chat" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Chat</span>
          </Link>
          <Link href="/elections" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
            <span>Elections</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">My Membership Subscription</h1>

          {/* Current Membership Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  {getStatusIcon(memberStatus.status)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{memberStatus.status}</h2>
                  <p className="text-gray-600">{memberStatus.type}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membership ID</span>
                  <span className="font-medium">{memberStatus.id}</span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Student</h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">₦10,000</span>
                      <span className="text-gray-600 dark:text-gray-400">/year</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Student ID required
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Basic e-learning access
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Limited tool access
                      </li>
                    </ul>
                    <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Downgrade
                    </button>
                  </div>
                </div>

                {/* Associate Plan */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Associate</h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">₦25,000</span>
                      <span className="text-gray-600 dark:text-gray-400">/year</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Associate certification
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Full e-learning access
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        2,500 credits included
                      </li>
                    </ul>
                    <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Downgrade
                    </button>
                  </div>
                </div>

                {/* Professional Plan */}
                <div className="border-2 border-blue-600 dark:border-blue-500 rounded-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs py-1 px-3 rounded-bl-lg">
                    Current Plan
                  </div>
                  <div className="p-6 pt-10">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Professional</h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">₦50,000</span>
                      <span className="text-gray-600 dark:text-gray-400">/year</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Professional certification
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Premium e-learning
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        5,000 credits included
                      </li>
                    </ul>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" disabled>
                      Current Plan
                    </button>
                  </div>
                </div>

                {/* Fellow Plan */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Fellow</h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">₦90,000</span>
                      <span className="text-gray-600 dark:text-gray-400">/year</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Fellow distinction
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        All professional features
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        10,000 credits included
                      </li>
                    </ul>
                    <button className="w-full px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Credits */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Purchase Credits</h2>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Credits are used for accessing premium tools and services. Your current balance: <span className="font-semibold text-gray-800 dark:text-gray-200">5,000 credits</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Exchange rate: 1 Naira = 6 Credits</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Basic Package</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">3,000 credits</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">₦500</p>
                  <button className="w-full px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                    Purchase
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">POPULAR</div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Standard Package</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">6,000 credits</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">₦1,000</p>
                  <button className="w-full px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                    Purchase
                  </button>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Premium Package</h3>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">18,000 credits</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">₦3,000</p>
                  <button className="w-full px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                    Purchase
                  </button>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-700 dark:text-blue-400 font-medium hover:underline">
                  Custom Amount
                </button>
              </div>
            </div>

            {/* Subscription History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Subscription History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">May 15, 2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Professional Membership Renewal</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₦50,000</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Paid</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">May 10, 2024</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Credit Purchase - 6,000 Credits</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₦1,000</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Paid</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">May 15, 2023</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Professional Membership Renewal</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₦50,000</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Paid</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline">Download</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Subscription;