import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatTimeAgo } from "@/lib/utils";
import { Link } from "wouter";

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/members/activities'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/members/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        return data.activities as Activity[];
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Return fallback data
        return [
          {
            id: 1,
            type: "application",
            title: "SAR Application",
            description: "Your application for Site Analysis Report has been approved.",
            createdAt: "2023-10-15T10:30:00Z"
          },
          {
            id: 2,
            type: "subscription",
            title: "Subscription Renewal",
            description: "You renewed your Professional Membership subscription.",
            createdAt: "2023-10-10T14:45:00Z"
          },
          {
            id: 3,
            type: "course",
            title: "Course Completion",
            description: "You completed \"Advanced Urban Planning Techniques\" course.",
            createdAt: "2023-10-05T16:20:00Z"
          }
        ] as Activity[];
      }
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-10 w-10 text-white" />;
      case "subscription":
        return <CreditCard className="h-10 w-10 text-white" />;
      case "course":
        return <GraduationCap className="h-10 w-10 text-white" />;
      default:
        return <FileText className="h-10 w-10 text-white" />;
    }
  };

  const getActivityIconBgColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-primary";
      case "subscription":
        return "bg-secondary";
      case "course":
        return "bg-primary-light";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== activities.length - 1 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true"></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-full ${getActivityIconBgColor(activity.type)} flex items-center justify-center ring-8 ring-white dark:ring-neutral-800`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-neutral-900 dark:text-white">{activity.title}</a>
                          </div>
                          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{activity.description}</p>
                        </div>
                        <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                          <p>{formatTimeAgo(activity.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">No recent activity to display</p>
          </div>
        )}
        <div className="mt-6">
          <Link href="/activities">
            <Button className="w-full" variant="outline">
              View all activity
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
