import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload, FaCheck, FaTimes } from 'react-icons/fa';

interface DocumentUploadProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData?: any;
  membershipCategory: string;
}

interface DocumentUploadForm {
  passportPhoto: File | null;
  identificationDocument: File | null;
  academicCertificates: File[];
  professionalLicense?: File | null;
  studentId?: File | null;
  recommendationLetter?: File | null;
  businessRegistration?: File | null;
  taxClearance?: File | null;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onNext,
  onPrevious,
  initialData,
  membershipCategory,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DocumentUploadForm>({
    defaultValues: initialData,
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const isFullMember = membershipCategory === 'full';
  const isAssociateMember = membershipCategory === 'associate';
  const isStudentMember = membershipCategory === 'student';
  const isCorporateMember = membershipCategory === 'corporate';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors({
        ...uploadErrors,
        [fieldName]: 'File size must be less than 5MB',
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors({
        ...uploadErrors,
        [fieldName]: 'File must be a JPEG, PNG, or PDF',
      });
      return;
    }

    setUploadedFiles({
      ...uploadedFiles,
      [fieldName]: file,
    });
    setUploadErrors({
      ...uploadErrors,
      [fieldName]: '',
    });
  };

  const onSubmit = (data: DocumentUploadForm) => {
    onNext({ ...data, ...uploadedFiles });
  };

  const renderFileUpload = (
    fieldName: string,
    label: string,
    required: boolean = false,
    multiple: boolean = false
  ) => {
    const file = uploadedFiles[fieldName];
    const error = uploadErrors[fieldName];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && '*'}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FaCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFiles({ ...uploadedFiles, [fieldName]: null });
                    setUploadErrors({ ...uploadErrors, [fieldName]: '' });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor={fieldName}
                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id={fieldName}
                      type="file"
                      className="sr-only"
                      {...register(fieldName, { required: required && 'This field is required' })}
                      onChange={(e) => handleFileUpload(e, fieldName)}
                      multiple={multiple}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, PDF up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        {errors[fieldName] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[fieldName].message}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Document Upload
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please upload the required documents. All documents should be in PDF, JPEG, or PNG format and not exceed 5MB.
        </p>
      </div>

      <div className="space-y-8">
        {/* Passport Photo */}
        {renderFileUpload('passportPhoto', 'Passport Photograph', true)}

        {/* Identification Document */}
        {renderFileUpload('identificationDocument', 'Identification Document (National ID, Driver\'s License, or International Passport)', true)}

        {/* Academic Certificates */}
        {renderFileUpload('academicCertificates', 'Academic Certificates', true, true)}

        {/* Professional License (Full Members) */}
        {isFullMember && renderFileUpload('professionalLicense', 'Professional License', true)}

        {/* Student ID (Student Members) */}
        {isStudentMember && renderFileUpload('studentId', 'Student ID Card', true)}

        {/* Recommendation Letter (Student Members) */}
        {isStudentMember && renderFileUpload('recommendationLetter', 'Letter of Recommendation from Department', true)}

        {/* Business Registration (Corporate Members) */}
        {isCorporateMember && renderFileUpload('businessRegistration', 'Business Registration Document', true)}

        {/* Tax Clearance (Corporate Members) */}
        {isCorporateMember && renderFileUpload('taxClearance', 'Tax Clearance Certificate', true)}
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

export default DocumentUpload; 