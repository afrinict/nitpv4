import React from "react";

const Elections = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">NITP Elections</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Election: 2025 National Executive Committee</h2>
        <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Status:</span> Voting Open
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Election Period:</span> May 15 - June 15, 2025
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Days Remaining:</span> 23 days
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Cast Your Vote
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Position 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-3">
            <h3 className="font-semibold text-lg">President</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="president" id="candidate1" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="candidate1" className="font-medium">Dr. Oluwaseun Adebayo</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Professor of Urban Planning, 15 years experience
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="president" id="candidate2" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="candidate2" className="font-medium">Prof. Ibrahim Mohammed</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Director, Urban Development Commission, 20 years experience
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Position 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-3">
            <h3 className="font-semibold text-lg">Vice President</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="vp" id="vp1" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="vp1" className="font-medium">Mrs. Fatima Ibrahim</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Head of Planning, Federal Ministry of Housing
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="vp" id="vp2" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="vp2" className="font-medium">Dr. Emeka Okafor</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Senior Urban Planner, Lagos Development Agency
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="vp" id="vp3" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="vp3" className="font-medium">Mrs. Amina Bello</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Principal Consultant, ABC Urban Planning
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Position 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 p-3">
            <h3 className="font-semibold text-lg">General Secretary</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="secretary" id="sec1" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="sec1" className="font-medium">Mr. John Obi</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Planning Consultant, 10 years experience
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
              
              <div className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                <input type="radio" name="secretary" id="sec2" className="mr-3" />
                <div className="flex-1">
                  <label htmlFor="sec2" className="font-medium">Mrs. Blessing Nnamdi</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Associate Professor, University of Abuja
                  </p>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Submit Ballot
        </button>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Previous Election Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Election</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Turnout</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">2023 National Executive Committee</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">June 15, 2023</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">78%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Completed</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline">View Results</button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">2021 National Executive Committee</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">June 15, 2021</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">71%</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Completed</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline">View Results</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Elections;