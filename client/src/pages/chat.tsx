import React from "react";

const Chat = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Member Chat</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row" style={{ height: "calc(100vh - 200px)" }}>
        <div className="w-full lg:w-1/4 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100% - 50px)" }}>
            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 cursor-pointer">
              <h3 className="font-medium text-sm">Urban Planning Forum</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">General discussion about urban planning</p>
            </div>
            
            <div className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <h3 className="font-medium text-sm">NITP Announcements</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Official announcements</p>
            </div>
            
            <div className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <h3 className="font-medium text-sm">Professional Development</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Career growth opportunities</p>
            </div>
            
            <div className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <h3 className="font-medium text-sm">Technical Support</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Help with portal features</p>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-3/4 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-medium">Urban Planning Forum</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">125 members, 5 online</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 flex-shrink-0"></div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-[75%]">
                  <p className="text-sm font-medium">Samuel Njoku</p>
                  <p className="text-sm">Has anyone completed the Sustainable City Design course? Would love to hear your thoughts.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg px-4 py-2 max-w-[75%]">
                  <p className="text-sm">I just finished it last week. Great content on water conservation strategies in urban areas!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:45 AM</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 ml-3 flex-shrink-0"></div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-300 dark:bg-green-800 mr-3 flex-shrink-0"></div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-[75%]">
                  <p className="text-sm font-medium">Aisha Mohammed</p>
                  <p className="text-sm">The module on green infrastructure was particularly insightful for my current project.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">11:15 AM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;