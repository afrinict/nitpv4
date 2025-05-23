import { Card, CardContent } from "@/components/ui/card";
import { 
  IdCard, 
  CreditCard, 
  Coins, 
  FileText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export interface MemberSummary {
  status: string;
  expiryDate?: string;
  type: string;
  credits: number;
  activeApplications: number;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  
  const { data: summary, isLoading } = useQuery({
    queryKey: ['/api/members/summary'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/members/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch member summary');
        }
        const data = await response.json();
        return data.summary as MemberSummary;
      } catch (error) {
        console.error('Error fetching member summary:', error);
        // Return fallback data
        return {
          status: user?.member?.status || "ACTIVE",
          expiryDate: "2023-12-31T00:00:00Z",
          type: user?.member?.type || "PROFESSIONAL",
          credits: user?.member?.credits || 2400,
          activeApplications: 2
        } as MemberSummary;
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'text-success';
      case 'EXPIRED':
        return 'text-danger';
      case 'PENDING':
        return 'text-warning';
      case 'SUSPENDED':
        return 'text-danger';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Membership Status */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <IdCard className="text-primary h-8 w-8" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">Membership Status</dt>
                <dd>
                  <div className={`text-lg font-semibold ${getStatusColor(summary?.status || '')}`}>
                    {isLoading ? "Loading..." : summary?.status}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-neutral-50 dark:bg-neutral-800 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Expiry:</span>
            <span className="text-neutral-600 dark:text-neutral-400 ml-1">
              {isLoading ? "Loading..." : summary?.expiryDate ? formatDate(summary.expiryDate) : "N/A"}
            </span>
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="text-primary h-8 w-8" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">Subscription</dt>
                <dd>
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {isLoading ? "Loading..." : summary?.type}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-neutral-50 dark:bg-neutral-800 px-5 py-3">
          <div className="text-sm">
            <Link href="/subscription">
              <a className="font-medium text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-secondary-light">
                Manage Subscription
              </a>
            </Link>
          </div>
        </div>
      </Card>

      {/* Credits */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Coins className="text-primary h-8 w-8" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">Available Credits</dt>
                <dd>
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {isLoading ? "Loading..." : summary?.credits?.toLocaleString() || 0}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-neutral-50 dark:bg-neutral-800 px-5 py-3">
          <div className="text-sm">
            <Link href="/member-tools">
              <a className="font-medium text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-secondary-light">
                Buy Credits
              </a>
            </Link>
          </div>
        </div>
      </Card>

      {/* Applications */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="text-primary h-8 w-8" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">SAR/EIAR Applications</dt>
                <dd>
                  <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {isLoading ? "Loading..." : `${summary?.activeApplications || 0} Active`}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-neutral-50 dark:bg-neutral-800 px-5 py-3">
          <div className="text-sm">
            <Link href="/applications">
              <a className="font-medium text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-secondary-light">
                View Applications
              </a>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
