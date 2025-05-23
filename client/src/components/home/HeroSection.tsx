import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  showRegistrationModal: () => void;
}

export default function HeroSection({ showRegistrationModal }: HeroSectionProps) {
  return (
    <section className="relative bg-primary">
      <div className="absolute inset-0 z-0 opacity-20">
        {/* A panoramic view of Abuja city skyline showing modern architecture and urban planning */}
        <img 
          src="https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
          alt="Abuja cityscape" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Nigerian Institute of Town Planners
          </h1>
          <p className="mt-6 text-xl text-white opacity-90">
            Empowering professionals to create sustainable, resilient, and people-centered urban environments across Nigeria.
          </p>
          <div className="mt-10 flex items-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white hover:bg-neutral-100 text-primary"
              onClick={showRegistrationModal}
            >
              Become a Member
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="ml-4 border-white text-white hover:bg-primary-light"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
