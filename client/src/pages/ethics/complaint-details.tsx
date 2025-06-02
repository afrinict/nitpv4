import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaFile, FaTimes } from 'react-icons/fa';

interface ComplaintDetails {
  id: string;
  subject: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  submittedDate: string;
  lastUpdated: string;
  complainant: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };
  nature: string[];
  accusedParty?: string;
  description: string;
  documents: {
    id: string;
    name: string;
    url: string;
  }[];
  updates: {
    date: string;
    status: string;
    comment: string;
    updatedBy: string;
  }[];
}

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const response = await fetch(`/api/complaints/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch complaint details');
      }
      const data = await response.json();
      setComplaint(data);
    } catch (err) {
      setError('Failed to load complaint details. Please try again later.');
      console.error('Error fetching complaint details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'dismissed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaint details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complaint Details
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  ID: {complaint.id}
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Status */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Status
              </h2>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatDate(complaint.lastUpdated)}
                </div>
              </div>
            </div>

            {/* Complaint Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Complaint Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{complaint.subject}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Nature of Complaint</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {complaint.nature.map((nature) => (
                      <span
                        key={nature}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {nature}
                      </span>
                    ))}
                  </div>
                </div>
                {complaint.accusedParty && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Accused Party</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{complaint.accusedParty}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Complainant Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Complainant Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{complaint.complainant.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{complaint.complainant.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{complaint.complainant.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {complaint.complainant.relationship.replace('_', ' ').toUpperCase()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Supporting Documents */}
            {complaint.documents.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Supporting Documents
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {complaint.documents.map((doc) => (
                      <li key={doc.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <FaFile className="text-gray-400 mr-3" />
                          <span className="text-sm text-gray-900 dark:text-white">{doc.name}</span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaDownload className="mr-2" />
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Status Updates */}
            {complaint.updates.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Status Updates
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {complaint.updates.map((update, index) => (
                        <li key={index}>
                          <div className="relative pb-8">
                            {index !== complaint.updates.length - 1 && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${getStatusColor(update.status)}`}>
                                  <span className="text-xs font-medium">
                                    {update.status.charAt(0).toUpperCase()}
                                  </span>
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    Status changed to{' '}
                                    <span className={`font-medium ${getStatusColor(update.status)}`}>
                                      {update.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {update.comment}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                  <time dateTime={update.date}>{formatDate(update.date)}</time>
                                  <p className="mt-1">by {update.updatedBy}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails; 