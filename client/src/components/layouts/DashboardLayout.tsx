import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, User, CreditCard, FileText, GraduationCap,
  Drill, MessageSquare, Users, VoteIcon, Bell, Mail,
  Menu, Search, LogOut
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="h-6 w-6" /> },
    { href: "/profile", label: "My Profile", icon: <User className="h-6 w-6" /> },
    { href: "/subscription", label: "Subscription", icon: <CreditCard className="h-6 w-6" /> },
    { href: "/applications", label: "SAR/EIAR Applications", icon: <FileText className="h-6 w-6" /> },
    { href: "/e-learning", label: "E-Learning", icon: <GraduationCap className="h-6 w-6" /> },
    { href: "/member-tools", label: "Member Tools", icon: <Drill className="h-6 w-6" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="h-6 w-6" /> },
    { href: "/directory", label: "Member Directory", icon: <Users className="h-6 w-6" /> },
    { href: "/elections", label: "Elections", icon: <VoteIcon className="h-6 w-6" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-0 z-40 md:relative md:flex md:flex-shrink-0 transition-all transform",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="bg-primary p-1 rounded">
                <span className="text-white font-accent font-semibold text-xl">NITP</span>
              </div>
              <span className="ml-2 text-primary dark:text-white font-medium text-sm">Nigerian Institute of Town Planners</span>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      location === item.href
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-primary dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
                    )}>
                      <div className="mr-3 h-6 w-6">{item.icon}</div>
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <img 
                    className="inline-block h-10 w-10 rounded-full object-cover" 
                    src={user?.member?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt="Profile" 
                  />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white">
                    {user?.member?.firstName} {user?.member?.lastName}
                  </p>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                    {user?.member?.type} Member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-neutral-800 shadow-sm">
          <button
            type="button"
            className="px-4 border-r border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">Search</label>
                <div className="relative w-full text-neutral-400 dark:text-neutral-500 focus-within:text-neutral-600 dark:focus-within:text-neutral-400">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:placeholder-neutral-400 dark:focus:placeholder-neutral-500 focus:ring-0 focus:border-transparent bg-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white dark:bg-transparent p-1 rounded-full text-neutral-400 dark:text-neutral-300 hover:text-neutral-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              <button
                type="button"
                className="ml-3 bg-white dark:bg-transparent p-1 rounded-full text-neutral-400 dark:text-neutral-300 hover:text-neutral-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">Messages</span>
                <Mail className="h-6 w-6" />
              </button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-3" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
