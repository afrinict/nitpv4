import React from 'react';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatShortDate } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

const NewsSection: React.FC = () => {
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
  const placeholderNews: NewsItem[] = [
    {
      id: '1',
      title: 'NITP Annual Conference 2024',
      description: 'Join us for the biggest urban planning event of the year.',
      date: '2024-03-15',
      imageUrl: '/images/conference.jpg'
    },
    {
      id: '2',
      title: 'New Professional Development Program',
      description: 'Enhance your skills with our latest training modules.',
      date: '2024-02-28',
      imageUrl: '/images/training.jpg'
    },
    {
      id: '3',
      title: 'Urban Planning Awards 2024',
      description: 'Nominations now open for outstanding urban planning projects.',
      date: '2024-02-15',
      imageUrl: '/images/awards.jpg'
    }
  ];

  const displayNews = news && news.length > 0 ? news.slice(0, 3) : placeholderNews;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Latest News & Updates
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Stay informed about the latest developments in urban planning
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayNews.map((item: NewsItem) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                  >
                    Read more →
                  </a>
                </div>
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
};

export default NewsSection;
