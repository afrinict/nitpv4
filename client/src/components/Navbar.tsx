import React from 'react';
import { Link } from 'wouter';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="NITP Logo" className="h-16 w-auto" />
          <span className="ml-4 text-xl font-semibold text-gray-800 dark:text-gray-200 hidden md:block">
            Nigerian Institute of Town Planners
            <span className="block text-sm text-gray-600 dark:text-gray-400">Abuja Chapter</span>
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
            About Us
          </Link>
          <Link href="/events" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
            Events
          </Link>
          <Link href="/executives" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
            Executives
          </Link>
          <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark font-medium transition-colors">
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 