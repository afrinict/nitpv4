import { useEffect } from "react";
import { useLocation } from "wouter";
import PublicLayout from "@/components/layouts/PublicLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import EthicsSection from "@/components/home/EthicsSection";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      setLocation("/dashboard");
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show home page only if not logged in
  return (
    <PublicLayout>
      <HeroSection showRegistrationModal={() => {
        const registrationModalTrigger = document.querySelector('[data-registration-modal-trigger]') as HTMLButtonElement;
        if (registrationModalTrigger) {
          registrationModalTrigger.click();
        }
      }} />
      <FeaturesSection />
      <NewsSection />
      <EthicsSection />
    </PublicLayout>
  );
}
