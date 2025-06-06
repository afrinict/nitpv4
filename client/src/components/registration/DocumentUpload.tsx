import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FileUpload from '../shared/FileUpload';

type DocumentFieldName = 
  | 'passportPhoto'
  | 'identificationDocument'
  | 'academicCertificates'
  | 'professionalLicense'
  | 'studentId'
  | 'recommendationLetter'
  | 'businessRegistration'
  | 'taxClearance';

interface DocumentUploadForm {
  passportPhoto: File;
  identificationDocument: File;
  academicCertificates: File[];
  professionalLicense?: File;
  studentId?: File;
  recommendationLetter?: File;
  businessRegistration?: File;
  taxClearance?: File;
}

interface DocumentUploadProps {
  onSubmit: (data: DocumentUploadForm) => void;
  isStudent?: boolean;
  isProfessional?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onSubmit,
  isStudent = false,
  isProfessional = false
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<DocumentUploadForm>();
  const [uploadedFiles, setUploadedFiles] = useState<Record<DocumentFieldName, File | File[]>>({} as Record<DocumentFieldName, File | File[]>);

  const handleFileSelect = (field: DocumentFieldName) => (file: File | File[]) => {
    setUploadedFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const documentFields: Array<{
    name: DocumentFieldName;
    label: string;
    accept: string;
    required: boolean;
    multiple?: boolean;
  }> = [
    {
      name: 'passportPhoto',
      label: 'Passport Photograph',
      accept: 'image/*',
      required: true
    },
    {
      name: 'identificationDocument',
      label: 'Identification Document',
      accept: 'application/pdf,image/*',
      required: true
    },
    {
      name: 'academicCertificates',
      label: 'Academic Certificates',
      accept: 'application/pdf,image/*',
      required: true,
      multiple: true
    }
  ];

  if (isProfessional) {
    documentFields.push(
      {
        name: 'professionalLicense',
        label: 'Professional License',
        accept: 'application/pdf,image/*',
        required: true
      },
      {
        name: 'businessRegistration',
        label: 'Business Registration',
        accept: 'application/pdf,image/*',
        required: true
      },
      {
        name: 'taxClearance',
        label: 'Tax Clearance Certificate',
        accept: 'application/pdf,image/*',
        required: true
      }
    );
  }

  if (isStudent) {
    documentFields.push(
      {
        name: 'studentId',
        label: 'Student ID Card',
        accept: 'image/*',
        required: true
      },
      {
        name: 'recommendationLetter',
        label: 'Recommendation Letter',
        accept: 'application/pdf,image/*',
        required: true
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {documentFields.map(({ name, label, accept, required, multiple }) => (
        <div key={name}>
          <Controller
            name={name}
            control={control}
            rules={{ required: required && 'This field is required' }}
            render={({ field }) => (
              <FileUpload
                label={label}
                accept={accept}
                required={required}
                multiple={multiple}
                onFileSelect={handleFileSelect(name)}
              />
            )}
          />
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors[name]?.message}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit Documents
      </button>
    </form>
  );
};

export default DocumentUpload; 