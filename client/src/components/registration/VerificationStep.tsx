import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import VerificationService from '../../services/verificationService';

interface VerificationStepProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData?: any;
  email: string;
  phone: string;
}

interface VerificationForm {
  emailOTP: string;
  phoneOTP: string;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  onNext,
  onPrevious,
  initialData,
  email,
  phone,
}) => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<VerificationForm>({
    defaultValues: initialData,
  });

  const verificationService = VerificationService.getInstance();

  useEffect(() => {
    let emailTimer: NodeJS.Timeout;
    let phoneTimer: NodeJS.Timeout;

    if (emailCountdown > 0) {
      emailTimer = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (phoneCountdown > 0) {
      phoneTimer = setInterval(() => {
        setPhoneCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(emailTimer);
      clearInterval(phoneTimer);
    };
  }, [emailCountdown, phoneCountdown]);

  const handleSendEmailOTP = async () => {
    try {
      const response = await verificationService.sendEmailOTP(email);
      if (response.success) {
        setEmailOTPSent(true);
        setEmailCountdown(60);
        setError('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to send email OTP');
    }
  };

  const handleSendPhoneOTP = async () => {
    try {
      const response = await verificationService.sendPhoneOTP(phone);
      if (response.success) {
        setPhoneOTPSent(true);
        setPhoneCountdown(60);
        setError('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to send phone OTP');
    }
  };

  const handleSendWhatsAppOTP = async () => {
    try {
      const response = await verificationService.sendWhatsAppMessage(
        phone,
        'Your NITP registration verification code will be sent shortly.'
      );
      if (response.success) {
        setError('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to send WhatsApp message');
    }
  };

  const onSubmit = async (data: VerificationForm) => {
    setError('');

    try {
      // Verify email OTP
      const emailResponse = await verificationService.verifyEmailOTP(email, data.emailOTP);
      if (!emailResponse.success) {
        setError(emailResponse.message);
        return;
      }
      setEmailVerified(true);

      // Verify phone OTP
      const phoneResponse = await verificationService.verifyPhoneOTP(phone, data.phoneOTP);
      if (!phoneResponse.success) {
        setError(phoneResponse.message);
        return;
      }
      setPhoneVerified(true);

      // If both verifications are successful, proceed
      onNext({
        emailVerified: true,
        phoneVerified: true,
      });
    } catch (error) {
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Verify Your Contact Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please verify your email and phone number to complete the registration process.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Email Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Verification</h3>
          <button
            type="button"
            onClick={handleSendEmailOTP}
            disabled={emailOTPSent && emailCountdown > 0}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 disabled:text-gray-400"
          >
            {emailOTPSent && emailCountdown > 0
              ? `Resend in ${emailCountdown}s`
              : 'Send OTP'}
          </button>
        </div>
        <div>
          <input
            type="text"
            {...register('emailOTP', {
              required: 'Email OTP is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'OTP must be 6 digits',
              },
            })}
            placeholder="Enter 6-digit OTP"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.emailOTP && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.emailOTP.message}</p>
          )}
        </div>
      </div>

      {/* Phone Verification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone Verification</h3>
          <div className="space-x-4">
            <button
              type="button"
              onClick={handleSendWhatsAppOTP}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-500"
            >
              Send via WhatsApp
            </button>
            <button
              type="button"
              onClick={handleSendPhoneOTP}
              disabled={phoneOTPSent && phoneCountdown > 0}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 disabled:text-gray-400"
            >
              {phoneOTPSent && phoneCountdown > 0
                ? `Resend in ${phoneCountdown}s`
                : 'Send OTP'}
            </button>
          </div>
        </div>
        <div>
          <input
            type="text"
            {...register('phoneOTP', {
              required: 'Phone OTP is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'OTP must be 6 digits',
              },
            })}
            placeholder="Enter 6-digit OTP"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.phoneOTP && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneOTP.message}</p>
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
        <button
          type="submit"
          disabled={!emailOTPSent || !phoneOTPSent}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Verify & Continue
        </button>
      </div>
    </form>
  );
};

export default VerificationStep; 