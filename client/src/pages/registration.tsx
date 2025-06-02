import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountDetails from '../components/registration/AccountDetails';
import VerificationStep from '../components/registration/VerificationStep';
import ProfessionalDetails from '../components/registration/ProfessionalDetails';
import DocumentUpload from '../components/registration/DocumentUpload';

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [membershipCategory, setMembershipCategory] = useState<string>('full'); // Default to full member

  const steps: RegistrationStep[] = [
    {
      id: 1,
      title: 'Account Details',
      description: 'Enter your account information',
      isCompleted: !!formData.accountDetails,
    },
    {
      id: 2,
      title: 'Contact Verification',
      description: 'Verify your email and phone',
      isCompleted: !!formData.verification,
    },
    {
      id: 3,
      title: 'Professional Details',
      description: 'Enter your professional information',
      isCompleted: !!formData.professionalDetails,
    },
    {
      id: 4,
      title: 'Document Upload',
      description: 'Upload required documents',
      isCompleted: !!formData.documents,
    },
  ];

  const handleAccountDetailsSubmit = (data: any) => {
    setFormData((prev: any) => ({ ...prev, accountDetails: data }));
    setCurrentStep(2);
  };

  const handleVerificationSubmit = (data: any) => {
    setFormData((prev: any) => ({ ...prev, verification: data }));
    setCurrentStep(3);
  };

  const handleProfessionalDetailsSubmit = (data: any) => {
    setFormData((prev: any) => ({ ...prev, professionalDetails: data }));
    setCurrentStep(4);
  };

  const handleDocumentUpload = (data: any) => {
    setFormData((prev: any) => ({ ...prev, documents: data }));
    // Submit the complete registration
    handleRegistrationSubmit();
  };

  const handleRegistrationSubmit = async () => {
    try {
      // TODO: Implement API call to submit registration
      const finalData = {
        ...formData,
        membershipCategory,
        userId: user?.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // After successful submission
      navigate('/registration-success');
    } catch (error) {
      console.error('Error submitting registration:', error);
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
          <AccountDetails
            onNext={handleAccountDetailsSubmit}
            onPrevious={handlePrevious}
            initialData={formData.accountDetails}
          />
        );
      case 2:
        return (
          <VerificationStep
            onNext={handleVerificationSubmit}
            onPrevious={handlePrevious}
            initialData={formData.verification}
            email={formData.accountDetails?.email}
            phone={formData.accountDetails?.phoneNumber}
          />
        );
      case 3:
        return (
          <ProfessionalDetails
            onNext={handleProfessionalDetailsSubmit}
            onPrevious={handlePrevious}
            initialData={formData.professionalDetails}
            membershipCategory={membershipCategory}
          />
        );
      case 4:
        return (
          <DocumentUpload
            onNext={handleDocumentUpload}
            onPrevious={handlePrevious}
            initialData={formData.documents}
            membershipCategory={membershipCategory}
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

export default Registration; 