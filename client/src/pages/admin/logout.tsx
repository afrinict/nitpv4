import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';

const Logout = () => {
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoggingOut(true);
        // Clear any auth tokens
        localStorage.removeItem('token');
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setLocation('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('Logout failed:', error);
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FaSignOutAlt className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Logging Out
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLoggingOut ? (
              <span className="flex items-center justify-center space-x-2">
                <FaSpinner className="animate-spin h-5 w-5" />
                <span>Logging you out...</span>
              </span>
            ) : (
              'You have been successfully logged out.'
            )}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Redirecting to login page in {countdown} seconds...
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setLocation('/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout; 