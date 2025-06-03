import React from "react";
import { Link } from "wouter";

const Applications = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">NITP</h1>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Member Portal</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <span className="text-gray-600 dark:text-gray-300">John Doe</span>
            </div>
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/subscription" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Subscription
                  </Link>
                </li>
                <li>
                  <Link href="/applications" className="flex items-center px-4 py-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Applications
                  </Link>
                </li>
                <li>
                  <Link href="/e-learning" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    E-Learning
                  </Link>
                </li>
                <li>
                  <Link href="/member-tools" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tools
                  </Link>
                </li>
                <li>
                  <Link href="/directory" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Directory
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </Link>
                </li>
                <li>
                  <Link href="/elections" className="flex items-center px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Elections
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Applications</h1>
              <div>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                  New Application
                </button>
              </div>
            </div>

            {/* Application Cards */}
            <div className="space-y-6">
              {/* In Progress Application */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-l-4 border-blue-600 dark:border-blue-500">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <div className="inline-block px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium mb-2">
                          In Progress
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Site Analysis Report (SAR)</h2>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Application ID: SAR-2025-0478</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span> May 10, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Location:</span> Asokoro, Abuja
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Type:</span> Residential
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Fee Paid:</span> ₦30,200
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Current Stage:</span> Document Review
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Progress:</span>
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Submitted</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Review</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Approval</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Upload Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed Application */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-l-4 border-green-600 dark:border-green-500">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <div className="inline-block px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium mb-2">
                          Completed
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">EIAR Application</h2>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Application ID: PPA-2025-0312</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span> March 5, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Location:</span> Wuse, Abuja
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Type:</span> Commercial
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Fee Paid:</span> ₦50,200
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Completed:</span> April 20, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Certificate Number:</span> PPA-2025-0312-C
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Progress:</span>
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Submitted</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Review</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Approval</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Download Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rejected Application */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-l-4 border-red-600 dark:border-red-500">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <div className="inline-block px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium mb-2">
                          Documents Required
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Land Use Approval</h2>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Application ID: LUA-2025-0189</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span> February 18, 2025
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Location:</span> Garki, Abuja
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Project Type:</span> Mixed-Use
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Fee Paid:</span> ₦45,200
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Status Updated:</span> March 10, 2025
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 bg-red-50 dark:bg-red-900/10 p-4 rounded-md border border-red-200 dark:border-red-900/50">
                      <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">Additional documents required:</p>
                      <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400 space-y-1">
                        <li>Environmental Impact Assessment Report</li>
                        <li>Updated Land Survey Document</li>
                        <li>Structural Engineer's Certification</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm hover:bg-blue-800">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-red-300 dark:border-red-800 rounded-md text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Upload Required Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Types */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">New Application</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Site Analysis Report (SAR)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Official NITP analysis of the suitability of a site for development based on urban planning principles.
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fee: ₦30,200</span>
                    <Link href="/sar/application" className="text-sm text-blue-700 dark:text-blue-400 font-medium hover:underline">
                      Apply Now
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">EIAR Application</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Professional assessment of potential environmental impacts of development projects and proposed mitigation measures.
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fee: ₦50,200</span>
                    <button className="text-sm text-blue-700 dark:text-blue-400 font-medium hover:underline">
                      Apply Now
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 dark:bg-blue-900/30 h-12 w-12 flex items-center justify-center rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Land Use Approval</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Assessment and approval of land use change applications based on zoning regulations and master plans.
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fee: ₦45,200</span>
                    <button className="text-sm text-blue-700 dark:text-blue-400 font-medium hover:underline">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-700 dark:text-blue-400 font-medium hover:underline">
                  View All Application Types
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Applications;