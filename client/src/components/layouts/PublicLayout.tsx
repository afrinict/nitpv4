import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LoginModal from "@/components/shared/LoginModal";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showLoginModal={showLoginModal} />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={hideLoginModal}
        onRegisterClick={() => {
          hideLoginModal();
          window.location.href = '/register';
        }}
      />
    </div>
  );
}
