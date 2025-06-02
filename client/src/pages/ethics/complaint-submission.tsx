import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload, FaFile, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ComplaintFormData {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  otherRelationship?: string;
  subject: string;
  nature: string[];
  otherNature?: string;
  accusedParty: string;
  incidentDate: string;
  incidentEndDate?: string;
  description: string;
  declaration: boolean;
}

const ComplaintSubmission = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [showOtherRelationship, setShowOtherRelationship] = useState(false);
  const [showOtherNature, setShowOtherNature] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ComplaintFormData>({
    defaultValues: {
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
      relationship: user ? 'member' : '',
    }
  });

  const relationship = watch('relationship');
  const nature = watch('nature');

  useEffect(() => {
    setShowOtherRelationship(relationship === 'other');
  }, [relationship]);

  useEffect(() => {
    setShowOtherNature(nature?.includes('other'));
  }, [nature]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (files.length + newFiles.length > 5) {
        alert('You can only upload up to 5 files');
        return;
      }
      // Check file size (5MB limit)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert('Some files exceed the 5MB size limit');
        return;
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'nature') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });
      files.forEach(file => formData.append('documents', file));

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const result = await response.json();
      setComplaintId(result.complaintId);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                Complaint Submitted Successfully
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your complaint has been received and assigned the following ID:
              </p>
              <p className="text-xl font-mono bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
                {complaintId}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Please keep this ID for future reference. You will receive an email confirmation shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Submit a Complaint
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Complainant Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Complainant Details
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name {!user && '(Optional)'}
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: user ? 'Name is required' : false })}
                    disabled={!!user}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    disabled={!!user}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., +234 801 234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Relationship to Case
                  </label>
                  <select
                    {...register('relationship', { required: 'Relationship is required' })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select relationship</option>
                    <option value="general_public">General Public</option>
                    <option value="member">NITP Member</option>
                    <option value="colleague">Colleague</option>
                    <option value="client">Client</option>
                    <option value="employer">Employer</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.relationship && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.relationship.message}</p>
                  )}
                </div>

                {showOtherRelationship && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Please specify relationship
                    </label>
                    <input
                      type="text"
                      {...register('otherRelationship', { required: showOtherRelationship ? 'Please specify relationship' : false })}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.otherRelationship && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.otherRelationship.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Complaint Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Complaint Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject of Complaint
                  </label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Unethical Practice by a Registered Planner"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nature of Complaint
                  </label>
                  <div className="mt-2 space-y-2">
                    {[
                      'Professional Misconduct',
                      'Ethical Breach',
                      'Unlicensed Practice',
                      'Malpractice/Negligence',
                      'Administrative Grievance',
                      'Violation of Code of Ethics',
                      'Other',
                    ].map((nature) => (
                      <label key={nature} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          value={nature}
                          {...register('nature', { required: 'Please select at least one nature' })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{nature}</span>
                      </label>
                    ))}
                  </div>
                  {errors.nature && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nature.message}</p>
                  )}
                </div>

                {showOtherNature && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Please specify nature
                    </label>
                    <input
                      type="text"
                      {...register('otherNature', { required: showOtherNature ? 'Please specify nature' : false })}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    {errors.otherNature && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.otherNature.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Accused Party (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('accusedParty')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Name of individual or organization, if known"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Incident
                    </label>
                    <input
                      type="date"
                      {...register('incidentDate')}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date (if applicable)
                    </label>
                    <input
                      type="date"
                      {...register('incidentEndDate')}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Detailed Description
                  </label>
                  <textarea
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 100,
                        message: 'Description must be at least 100 characters long'
                      }
                    })}
                    rows={6}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Provide a detailed account of the incident, including specific dates, times, locations, individuals involved, and how NITP's principles/rules were allegedly violated. Be as specific as possible."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supporting Documents (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload files</span>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, JPG, PNG, DOC up to 5 files (5MB each)
                      </p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
                        >
                          <div className="flex items-center">
                            <FaFile className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      {...register('declaration', {
                        required: 'You must acknowledge the declaration',
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                      Declaration
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      I certify that the information provided in this complaint is true and accurate to the best of my knowledge and belief. 
                      I understand that false statements may lead to appropriate action.
                    </p>
                  </div>
                </div>
                {errors.declaration && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.declaration.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintSubmission; 