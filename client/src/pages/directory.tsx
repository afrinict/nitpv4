import React from "react";

const Directory = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Member Directory</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="">All Types</option>
              <option value="STUDENT">Student</option>
              <option value="ASSOCIATE">Associate</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="FELLOW">Fellow</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="">All Locations</option>
              <option value="Abuja">Abuja</option>
              <option value="Lagos">Lagos</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Kano">Kano</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Member 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Oluwaseun Adebayo</h3>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Professional</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">TP-A32560894</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> Abuja, Nigeria
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Specialization:</span> Urban Development
              </p>
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Member 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Fatima Ibrahim</h3>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Fellow</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">TP-A32483921</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> Lagos, Nigeria
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Specialization:</span> Environmental Planning
              </p>
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Member 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Emeka Okafor</h3>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Associate</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">TP-A32671038</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> Port Harcourt, Nigeria
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Specialization:</span> Transportation Planning
              </p>
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Member 4 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Amina Bello</h3>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Student</span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">TP-A32780125</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> Kano, Nigeria
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">Specialization:</span> Urban Design
              </p>
              <div className="mt-3 flex justify-end">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Directory;