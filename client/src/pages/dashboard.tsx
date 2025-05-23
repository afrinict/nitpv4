import { useEffect } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import Announcements from "@/components/dashboard/Announcements";
import ELearningProgress from "@/components/dashboard/ELearningProgress";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Member Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Dashboard Content */}
          <DashboardOverview />

          {/* Recent Activity and Announcement Section */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RecentActivity />
            <Announcements />
          </div>

          {/* E-Learning Progress and Upcoming Events */}
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ELearningProgress />
            </div>
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
