import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface DeclarationFormProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData?: any;
  applicantType: 'individual' | 'corporate';
  projectInfo: any;
}

interface DeclarationForm {
  declarationAccepted: boolean;
  electronicSignature: string;
}

const DeclarationForm: React.FC<DeclarationFormProps> = ({
  onNext,
  onPrevious,
  initialData,
  applicantType,
  projectInfo,
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<DeclarationForm>({
    defaultValues: initialData,
  });

  const [signature, setSignature] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureError, setSignatureError] = useState<string>('');

  const onSubmit = (data: DeclarationForm) => {
    if (!signature) {
      setSignatureError('Please provide your electronic signature');
      return;
    }
    onNext({ ...data, electronicSignature: signature });
  };

  const getDeclarationText = () => {
    if (applicantType === 'individual') {
      return `I, ${user?.firstName} ${user?.lastName}, hereby declare that all information and documents submitted in this application are true, accurate, and original to the best of my knowledge and belief. I understand that any false declaration or submission of fraudulent documents may lead to the rejection of my application and disciplinary action by NITP Abuja Chapter.`;
    } else {
      return `I, ${projectInfo.contactPersonName}, representing ${projectInfo.companyName}, hereby declare that all information and documents submitted in this application are true, accurate, and original to the best of my knowledge and belief. I am duly authorized to make this declaration on behalf of the aforementioned corporation/organization. I understand that any false declaration or submission of fraudulent documents may lead to the rejection of this application and disciplinary action by NITP Abuja Chapter.`;
    }
  };

  const handleSignatureStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const handleSignatureMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const handleSignatureEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = e.currentTarget;
    setSignature(canvas.toDataURL());
    setSignatureError('');
  };

  const clearSignature = () => {
    const canvas = document.getElementById('signatureCanvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Declaration & E-Affidavit
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please review and sign the declaration below to complete your application.
        </p>
      </div>

      <div className="space-y-6">
        {/* Declaration Text */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {getDeclarationText()}
          </p>
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              {...register('declarationAccepted', {
                required: 'You must accept the declaration to proceed',
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              I solemnly declare that the information provided is correct and understand the implications of providing false information.
            </label>
            {errors.declarationAccepted && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.declarationAccepted.message}
              </p>
            )}
          </div>
        </div>

        {/* Electronic Signature */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Electronic Signature
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <canvas
              id="signatureCanvas"
              width={500}
              height={200}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-crosshair"
              onMouseDown={handleSignatureStart}
              onMouseMove={handleSignatureMove}
              onMouseUp={handleSignatureEnd}
              onMouseLeave={handleSignatureEnd}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Clear Signature
              </button>
            </div>
          </div>
          {signatureError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{signatureError}</p>
          )}
        </div>

        {/* Date of Declaration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Declaration
          </label>
          <input
            type="text"
            value={new Date().toLocaleDateString()}
            disabled
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          />
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
            Submit Application
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeclarationForm; 