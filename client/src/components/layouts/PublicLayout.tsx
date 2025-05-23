import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LoginModal from "@/components/shared/LoginModal";
import RegistrationModal from "@/components/shared/RegistrationModal";
import RegistrationFormModal from "@/components/shared/RegistrationFormModal";
import { useState } from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isRegistrationFormModalOpen, setIsRegistrationFormModalOpen] = useState(false);
  const [registrationType, setRegistrationType] = useState<string>("");

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegistrationModalOpen(false);
    setIsRegistrationFormModalOpen(false);
  };

  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const showRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
    setIsLoginModalOpen(false);
    setIsRegistrationFormModalOpen(false);
  };

  const hideRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const startRegistration = (type: string) => {
    setRegistrationType(type);
    setIsRegistrationModalOpen(false);
    setIsRegistrationFormModalOpen(true);
  };

  const hideRegistrationFormModal = () => {
    setIsRegistrationFormModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        showLoginModal={showLoginModal}
        showRegistrationModal={showRegistrationModal}
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={hideLoginModal}
        onRegisterClick={() => {
          hideLoginModal();
          showRegistrationModal();
        }}
      />
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={hideRegistrationModal}
        onStartRegistration={startRegistration}
        onLoginClick={() => {
          hideRegistrationModal();
          showLoginModal();
        }}
      />
      
      <RegistrationFormModal 
        isOpen={isRegistrationFormModalOpen} 
        onClose={hideRegistrationFormModal}
        registrationType={registrationType}
      />
    </div>
  );
}
