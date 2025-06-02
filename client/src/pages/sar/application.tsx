import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProjectInfoForm from '../../components/sar/ProjectInfoForm';
import DocumentUploadForm from '../../components/sar/DocumentUploadForm';
import DeclarationForm from '../../components/sar/DeclarationForm';

interface ApplicationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

const SARApplication: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantType, setApplicantType] = useState<'individual' | 'corporate' | null>(null);
  const [formData, setFormData] = useState<any>({});

  const steps: ApplicationStep[] = [
    {
      id: 1,
      title: 'Applicant Type',
      description: 'Select your applicant type',
      isCompleted: !!applicantType,
    },
    {
      id: 2,
      title: 'Project Information',
      description: 'Enter project and applicant details',
      isCompleted: !!formData.projectInfo,
    },
    {
      id: 3,
      title: 'Document Upload',
      description: 'Upload required documents',
      isCompleted: !!formData.documents,
    },
    {
      id: 4,
      title: 'Declaration',
      description: 'Review and sign declaration',
      isCompleted: !!formData.declaration,
    },
  ];

  const handleApplicantTypeSelect = (type: 'individual' | 'corporate') => {
    setApplicantType(type);
    setCurrentStep(2);
  };

  const handleProjectInfoSubmit = (data: any) => {
    setFormData((prev: any) => ({ ...prev, projectInfo: data }));
    setCurrentStep(3);
  };

  const handleDocumentUpload = (data: any) => {
    setFormData((prev: any) => ({ ...prev, documents: data }));
    setCurrentStep(4);
  };

  const handleDeclarationSubmit = async (data: any) => {
    try {
      // TODO: Implement API call to submit the application
      const finalData = {
        ...formData,
        declaration: data,
        applicantType,
        userId: user?.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // After successful submission
      navigate('/sar/application-success');
    } catch (error) {
      console.error('Error submitting application:', error);
      // TODO: Show error message to user
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Select Applicant Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleApplicantTypeSelect('individual')}
                className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Individual Applicant
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Apply as an individual member of NITP Abuja Chapter
                </p>
              </button>
              <button
                onClick={() => handleApplicantTypeSelect('corporate')}
                className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Corporation/Organization Applicant
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Apply on behalf of a registered corporation or organization
                </p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <ProjectInfoForm
            onNext={handleProjectInfoSubmit}
            onPrevious={handlePrevious}
            initialData={formData.projectInfo}
            applicantType={applicantType!}
          />
        );
      case 3:
        return (
          <DocumentUploadForm
            onNext={handleDocumentUpload}
            onPrevious={handlePrevious}
            initialData={formData.documents}
            applicantType={applicantType!}
          />
        );
      case 4:
        return (
          <DeclarationForm
            onNext={handleDeclarationSubmit}
            onPrevious={handlePrevious}
            initialData={formData.declaration}
            applicantType={applicantType!}
            projectInfo={formData.projectInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {step.id < steps.length && (
                  <div className="hidden md:block ml-8 w-16 h-0.5 bg-gray-200 dark:bg-gray-700" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SARApplication; 