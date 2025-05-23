import React from "react";

const ELearning = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">E-Learning Platform</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Enhance your professional knowledge with our curated courses.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-300 dark:bg-gray-600">
              {/* Course image placeholder */}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Introduction to Urban Planning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Learn the fundamentals of urban planning and development.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">6 modules</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Enroll
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-300 dark:bg-gray-600">
              {/* Course image placeholder */}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Sustainable City Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Explore principles of sustainability in modern urban planning.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">8 modules</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Enroll
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-300 dark:bg-gray-600">
              {/* Course image placeholder */}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Geographic Information Systems</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Master GIS tools for effective urban planning and analysis.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">10 modules</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELearning;