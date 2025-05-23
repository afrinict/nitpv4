import React from "react";

const MemberTools = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Professional Tools</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Access premium professional tools using your credits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Land Use Analysis Tool</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Analyze and optimize land use patterns for urban planning projects.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">120 credits/use</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Access
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Zoning Compliance Checker</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Verify project compliance with local zoning regulations and standards.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">90 credits/use</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Access
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Environmental Impact Calculator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Calculate the environmental impact of urban development projects.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">150 credits/use</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTools;