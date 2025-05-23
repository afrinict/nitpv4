import React from "react";
import { Link } from "wouter";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 max-w-xl">
        <h1 className="text-6xl font-bold text-blue-700 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;