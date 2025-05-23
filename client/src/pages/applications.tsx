import React from "react";
import { useAuth } from "@/hooks/use-auth";

const Applications = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Applications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Apply for Site Analysis Report (SAR) or Ecological Impact Assessment Report (EIAR)
        </p>
        {/* Application content will go here */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="font-medium text-lg mb-2">Site Analysis Report (SAR)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional analysis of site conditions for urban planning and development projects.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <h3 className="font-medium text-lg mb-2">Ecological Impact Assessment Report (EIAR)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive assessment of potential ecological impacts of development projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;