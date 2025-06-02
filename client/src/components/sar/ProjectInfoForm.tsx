import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectInfoFormProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData?: any;
  applicantType: 'individual' | 'corporate';
}

interface ProjectInfoForm {
  projectTitle: string;
  projectLocation: string;
  latitude?: string;
  longitude?: string;
  landSize: string;
  landSizeUnit: 'sqm' | 'hectares';
  projectDescription: string;
  // Individual specific fields
  fullName?: string;
  membershipId?: string;
  phoneNumber?: string;
  email?: string;
  // Corporate specific fields
  companyName?: string;
  registrationNumber?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
  contactPersonEmail?: string;
}

const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  onNext,
  onPrevious,
  initialData,
  applicantType,
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectInfoForm>({
    defaultValues: {
      ...initialData,
      // Pre-fill individual fields if user is logged in
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      membershipId: user?.membershipId || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: ProjectInfoForm) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Project & {applicantType === 'individual' ? 'Applicant' : 'Corporate Contact'} Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please provide the details of your project and contact information. Fields marked with * are required.
        </p>
      </div>

      {/* Project Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title *
            </label>
            <input
              type="text"
              {...register('projectTitle', { required: 'Project title is required' })}
              placeholder="e.g., Proposed Residential Development at Asokoro Extension"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.projectTitle && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectTitle.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Location / Site Address *
            </label>
            <textarea
              {...register('projectLocation', { required: 'Project location is required' })}
              rows={3}
              placeholder="Detailed site address, including street, plot number, district, FCT"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.projectLocation && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectLocation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Latitude
            </label>
            <input
              type="text"
              {...register('latitude')}
              placeholder="e.g., 9.0765"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Longitude
            </label>
            <input
              type="text"
              {...register('longitude')}
              placeholder="e.g., 7.3986"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size of Land/Plot *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                {...register('landSize', { required: 'Land size is required' })}
                className="flex-1 block w-full border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                {...register('landSizeUnit', { required: 'Unit is required' })}
                className="border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="sqm">sqm</option>
                <option value="hectares">hectares</option>
              </select>
            </div>
            {errors.landSize && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.landSize.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Brief Project Description *
            </label>
            <textarea
              {...register('projectDescription', {
                required: 'Project description is required',
                minLength: {
                  value: 200,
                  message: 'Description must be at least 200 characters',
                },
                maxLength: {
                  value: 500,
                  message: 'Description must not exceed 500 characters',
                },
              })}
              rows={4}
              placeholder="Provide a concise description of the proposed project, its purpose, and scope"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.projectDescription && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectDescription.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Applicant Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {applicantType === 'individual' ? 'Applicant Information' : 'Corporate Contact Information'}
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {applicantType === 'individual' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  disabled
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Membership ID
                </label>
                <input
                  type="text"
                  {...register('membershipId')}
                  disabled
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+234|0)[789][01]\d{8}$/,
                      message: 'Please enter a valid Nigerian phone number',
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
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
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company/Organization Name *
                </label>
                <input
                  type="text"
                  {...register('companyName', { required: 'Company name is required' })}
                  placeholder="e.g., ABC Development Ltd."
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Registration Number (RC No.) *
                </label>
                <input
                  type="text"
                  {...register('registrationNumber', { required: 'Registration number is required' })}
                  placeholder="e.g., RC 123456"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.registrationNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Person's Full Name *
                </label>
                <input
                  type="text"
                  {...register('contactPersonName', { required: 'Contact person name is required' })}
                  placeholder="Name of primary contact for this application"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.contactPersonName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPersonName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Person's Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('contactPersonPhone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+234|0)[789][01]\d{8}$/,
                      message: 'Please enter a valid Nigerian phone number',
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.contactPersonPhone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPersonPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Person's Email *
                </label>
                <input
                  type="email"
                  {...register('contactPersonEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.contactPersonEmail && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPersonEmail.message}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Previous
        </button>
        <div className="space-x-4">
          <button
            type="button"
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProjectInfoForm; 