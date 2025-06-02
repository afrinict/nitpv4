import React, { useState } from 'react';
import { useLocation } from 'wouter';
import RegistrationFormModal from '@/components/shared/RegistrationFormModal';

export default function Register() {
  const [, setLocation] = useLocation();
  const [registrationType, setRegistrationType] = useState<string>('');

  const handleTypeSelect = (type: string) => {
    setRegistrationType(type);
  };

  const handleClose = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NITP Membership Registration
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose your membership type to get started
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['student', 'associate', 'full'].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="mt-2 block text-sm font-semibold text-gray-900 dark:text-white">
                {type.charAt(0).toUpperCase() + type.slice(1)} Membership
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Click to register as a {type} member
              </p>
            </button>
          ))}
        </div>
      </div>

      <RegistrationFormModal
        isOpen={!!registrationType}
        onClose={handleClose}
        registrationType={registrationType}
      />
    </div>
  );
} 