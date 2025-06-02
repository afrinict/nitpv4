import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface NavbarProps {
  showLoginModal: () => void;
}

export default function Navbar({ showLoginModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/members", label: "Members" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
    { href: "/ethics", label: "Ethics" },
  ];

  return (
    <nav className="bg-white dark:bg-neutral-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <div className="bg-primary p-1 rounded">
                    <span className="text-white font-accent font-semibold text-xl">NITP</span>
                  </div>
                  <span className="ml-2 text-primary dark:text-white font-medium hidden sm:block">Nigerian Institute of Town Planners</span>
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`px-3 py-2 text-sm font-medium ${
                  location === item.href
                    ? "text-primary dark:text-secondary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-secondary"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {user ? (
              <Link href="/dashboard">
                <Button
                  className="ml-3 inline-flex items-center"
                  variant="default"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  className="ml-3 inline-flex items-center"
                  variant="default"
                  onClick={showLoginModal}
                >
                  Login
                </Button>
                <Link href="/register">
                  <Button
                    className="ml-3 inline-flex items-center"
                    variant="outline"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
            <button
              className="ml-2 sm:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-400 dark:text-neutral-300 hover:text-neutral-500 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`block px-3 py-2 text-base font-medium ${
                  location === item.href
                    ? "text-primary dark:text-secondary"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary dark:hover:text-secondary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
