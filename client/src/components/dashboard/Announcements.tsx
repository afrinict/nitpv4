import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
}

export default function Announcements() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/content/announcements'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/content/announcements');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        return data.announcements as Announcement[];
      } catch (error) {
        console.error('Error fetching announcements:', error);
        // Return fallback data
        return [
          {
            id: 1,
            title: "Annual Conference Registration",
            content: "Registration for the Annual NITP Conference is now open. Early bird pricing ends October 31.",
            category: "CONFERENCE",
            publishedAt: "2023-10-01T00:00:00Z"
          },
          {
            id: 2,
            title: "New E-Learning Courses",
            content: "Five new courses have been added to the E-Learning platform, including GIS for Urban Planning.",
            category: "EDUCATION",
            publishedAt: "2023-09-25T00:00:00Z"
          },
          {
            id: 3,
            title: "Upcoming Elections",
            content: "NITP Abuja Chapter elections will be held on November 15. Nominations open on October 20.",
            category: "ELECTIONS",
            publishedAt: "2023-09-20T00:00:00Z"
          }
        ] as Announcement[];
      }
    }
  });

  const getCategoryLink = (category: string) => {
    switch (category.toUpperCase()) {
      case "CONFERENCE":
        return "/events";
      case "EDUCATION":
        return "/e-learning";
      case "ELECTIONS":
        return "/elections";
      default:
        return "/news";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-white">{announcement.title}</h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{announcement.content}</p>
                <div className="mt-3">
                  <Link href={getCategoryLink(announcement.category)}>
                    <a className="text-sm font-medium text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-secondary-light">
                      {announcement.category === "CONFERENCE" ? "Register Now" : 
                       announcement.category === "EDUCATION" ? "Browse Courses" : 
                       "Learn More"}
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">No announcements to display</p>
          </div>
        )}
        <div className="mt-6">
          <Link href="/announcements">
            <Button className="w-full" variant="outline">
              View all announcements
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
