import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatShortDate } from "@/lib/utils";

export default function NewsSection() {
  const { data: news, isLoading } = useQuery({
    queryKey: ['/api/content/news'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/content/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        return data.news;
      } catch (error) {
        console.error('Error fetching news:', error);
        return [];
      }
    }
  });

  // Fallback news items
  const placeholderNews = [
    {
      id: 1,
      title: "Annual NITP Conference 2023",
      summary: "Registration is now open for the Annual NITP Conference focusing on sustainable urban development in Nigeria.",
      category: "Event",
      publishedAt: "2023-10-15T00:00:00Z",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
    },
    {
      id: 2,
      title: "New Guidelines for Urban Development",
      summary: "NITP has published new guidelines for sustainable urban development projects in Abuja and surrounding areas.",
      category: "News",
      publishedAt: "2023-09-28T00:00:00Z",
      thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
    },
    {
      id: 3,
      title: "GIS Training for Urban Planners",
      summary: "NITP Abuja is hosting a 3-day workshop on advanced GIS techniques for urban planning professionals.",
      category: "Workshop",
      publishedAt: "2023-09-20T00:00:00Z",
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
    }
  ];

  const displayNews = news && news.length > 0 ? news.slice(0, 3) : placeholderNews;

  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary dark:text-white">Latest News & Announcements</h2>
          <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400">Stay updated with NITP Abuja Chapter</p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayNews.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg overflow-hidden">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">{item.category}</span>
                  <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {formatShortDate(item.publishedAt)}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-neutral-600 dark:text-neutral-300">{item.summary}</p>
                <Link href={`/news/${item.id}`}>
                  <a className="mt-4 inline-flex items-center text-primary dark:text-secondary font-medium">
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/news">
            <Button variant="default">
              View All News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
