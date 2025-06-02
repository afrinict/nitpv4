import React from 'react';
import { useForm } from 'react-hook-form';

interface ProfessionalDetailsProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData?: any;
  membershipCategory: string;
}

interface ProfessionalDetailsForm {
  highestQualification: string;
  institution: string;
  yearOfGraduation: string;
  professionalLicense?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  yearsOfExperience: string;
  currentEmployer?: string;
  currentPosition?: string;
  professionalMemberships: string[];
  otherMemberships?: string;
  researchInterests?: string;
  publications?: string;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({
  onNext,
  onPrevious,
  initialData,
  membershipCategory,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProfessionalDetailsForm>({
    defaultValues: initialData,
  });

  const highestQualification = watch('highestQualification');
  const professionalMemberships = watch('professionalMemberships');

  const onSubmit = (data: ProfessionalDetailsForm) => {
    onNext(data);
  };

  const isFullMember = membershipCategory === 'full';
  const isAssociateMember = membershipCategory === 'associate';
  const isStudentMember = membershipCategory === 'student';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Professional Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please provide your professional qualifications and experience. Fields marked with * are required.
        </p>
      </div>

      {/* Educational Background */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Educational Background</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Highest Qualification *
            </label>
            <select
              {...register('highestQualification', { required: 'Highest qualification is required' })}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select qualification</option>
              <option value="phd">Ph.D.</option>
              <option value="masters">Master's Degree</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="hnd">HND</option>
              <option value="ond">OND</option>
            </select>
            {errors.highestQualification && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.highestQualification.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Institution *
            </label>
            <input
              type="text"
              {...register('institution', { required: 'Institution is required' })}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.institution && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.institution.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year of Graduation *
            </label>
            <input
              type="number"
              {...register('yearOfGraduation', {
                required: 'Year of graduation is required',
                min: { value: 1950, message: 'Year must be after 1950' },
                max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
              })}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.yearOfGraduation && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.yearOfGraduation.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional License (Required for Full Members) */}
      {isFullMember && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Professional License</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                License Type *
              </label>
              <select
                {...register('professionalLicense', { required: 'License type is required' })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select license type</option>
                <option value="town_planner">Town Planner</option>
                <option value="urban_planner">Urban Planner</option>
                <option value="regional_planner">Regional Planner</option>
              </select>
              {errors.professionalLicense && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.professionalLicense.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                License Number *
              </label>
              <input
                type="text"
                {...register('licenseNumber', { required: 'License number is required' })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                License Expiry Date *
              </label>
              <input
                type="date"
                {...register('licenseExpiryDate', { required: 'License expiry date is required' })}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {errors.licenseExpiryDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.licenseExpiryDate.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Professional Experience */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Professional Experience</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Years of Experience *
            </label>
            <input
              type="number"
              {...register('yearsOfExperience', {
                required: 'Years of experience is required',
                min: { value: 0, message: 'Years cannot be negative' },
                max: { value: 50, message: 'Please enter a valid number of years' },
              })}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.yearsOfExperience.message}</p>
            )}
          </div>

          {!isStudentMember && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Employer
                </label>
                <input
                  type="text"
                  {...register('currentEmployer')}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Position
                </label>
                <input
                  type="text"
                  {...register('currentPosition')}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Professional Memberships */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Professional Memberships</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Other Professional Memberships
            </label>
            <div className="mt-2 space-y-2">
              {['NITP National', 'NITP State Chapter', 'NITP Student Chapter', 'Other'].map((membership) => (
                <div key={membership} className="flex items-center">
                  <input
                    type="checkbox"
                    value={membership}
                    {...register('professionalMemberships')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {membership}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {professionalMemberships?.includes('Other') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Please specify other memberships
              </label>
              <textarea
                {...register('otherMemberships')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Research & Publications (Optional) */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Research & Publications</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Research Interests
            </label>
            <textarea
              {...register('researchInterests')}
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="List your research interests or areas of expertise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Publications
            </label>
            <textarea
              {...register('publications')}
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="List your publications, if any"
            />
          </div>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ProfessionalDetails; 