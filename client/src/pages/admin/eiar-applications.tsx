import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaDownload, FaFileAlt } from 'react-icons/fa';

interface EIARApplication {
  id: number;
  applicantName: string;
  membershipId: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  type: 'new' | 'renewal';
  documents: string[];
  lastUpdated: string;
  projectTitle: string;
  projectLocation: string;
}

const mockApplications: EIARApplication[] = [
  {
    id: 1,
    applicantName: 'John Doe',
    membershipId: 'TP-A32123456',
    submissionDate: '2024-03-20T10:30:00',
    status: 'pending',
    type: 'new',
    documents: ['eiar_report.pdf', 'project_plan.pdf', 'site_photos.pdf'],
    lastUpdated: '2024-03-20T10:30:00',
    projectTitle: 'Urban Development Project - Phase 1',
    projectLocation: 'Abuja Central District'
  },
  {
    id: 2,
    applicantName: 'Jane Smith',
    membershipId: 'TP-A32765432',
    submissionDate: '2024-03-19T15:45:00',
    status: 'under_review',
    type: 'renewal',
    documents: ['eiar_report.pdf', 'monitoring_data.pdf'],
    lastUpdated: '2024-03-19T16:30:00',
    projectTitle: 'Residential Complex Development',
    projectLocation: 'Garki District'
  },
  {
    id: 3,
    applicantName: 'Robert Johnson',
    membershipId: 'TP-A32987654',
    submissionDate: '2024-03-18T09:20:00',
    status: 'approved',
    type: 'new',
    documents: ['eiar_report.pdf', 'environmental_assessment.pdf'],
    lastUpdated: '2024-03-18T11:15:00',
    projectTitle: 'Commercial Plaza Construction',
    projectLocation: 'Wuse District'
  }
];

const EIARApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<EIARApplication | null>(null);

  const filteredApplications = mockApplications.filter(application => {
    const matchesSearch = 
      application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.projectLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesType = typeFilter === 'all' || application.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'renewal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EIAR Applications</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage and process Environmental Impact Assessment Report (EIAR) applications from members
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="new">New Application</option>
          <option value="renewal">Renewal</option>
        </select>
        <button className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center space-x-2">
          <FaFilter />
          <span>More Filters</span>
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-medium">
                          {application.applicantName.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.applicantName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.membershipId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {application.projectTitle}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {application.projectLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(application.type)}`}>
                      {application.type.charAt(0).toUpperCase() + application.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {application.documents.map((doc, index) => (
                        <button
                          key={index}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
                        >
                          <FaFileAlt className="text-xs" />
                          <span className="text-xs">{doc}</span>
                          <FaDownload className="text-xs" />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {/* Handle approve */}}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Approve Application"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => {/* Handle reject */}}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Reject Application"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredApplications.length} of {mockApplications.length} applications
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EIARApplications; 