import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDate, getMembershipFee } from "@/lib/utils";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

interface Subscription {
  id: number;
  type: string;
  amount: number;
  startDate: string;
  endDate: string;
  transactionReference: string;
  createdAt: string;
}

export default function Subscription() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

  // Fetch subscription status
  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['/api/subscriptions/status'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/subscriptions/status', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch subscription status');
        }
        const data = await response.json();
        return data.subscription;
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        throw error;
      }
    }
  });

  // Fetch subscription history
  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['/api/subscriptions/history'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/subscriptions/history', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch subscription history');
        }
        const data = await response.json();
        return data.subscriptions as Subscription[];
      } catch (error) {
        console.error('Error fetching subscription history:', error);
        throw error;
      }
    }
  });

  // Renew subscription mutation
  const renewSubscription = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      try {
        const response = await apiRequest('POST', '/api/subscriptions/renew', {});
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to initiate subscription renewal');
        }
        const data = await response.json();
        return data;
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: (data) => {
      if (data.payment?.authorization_url) {
        setPaymentUrl(data.payment.authorization_url);
      } else {
        toast({
          title: "Payment Initiated",
          description: "Your subscription renewal has been initiated.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/subscriptions/status'] });
        queryClient.invalidateQueries({ queryKey: ['/api/subscriptions/history'] });
        setIsRenewDialogOpen(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Renewal Failed",
        description: error.message || "There was an error initiating your subscription renewal.",
        variant: "destructive",
      });
    }
  });

  const handleRenew = () => {
    renewSubscription.mutate();
  };

  const handlePaymentComplete = () => {
    setPaymentUrl(null);
    setIsRenewDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/subscriptions/status'] });
    queryClient.invalidateQueries({ queryKey: ['/api/subscriptions/history'] });
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed. Your subscription will be updated shortly.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">Expired</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading || isSubscriptionLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  const membershipType = user.member?.type;
  const membershipStatus = user.member?.status;
  const membershipFee = getMembershipFee(membershipType || "PROFESSIONAL");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Subscription Management</h1>
        
        <div className="py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Manage your NITP membership subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">Membership Type</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">{membershipType || "Professional"} Member</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 dark:text-neutral-400">Annual Fee:</span>
                      <span className="font-medium">{formatCurrency(membershipFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                      <div>{getStatusBadge(membershipStatus || "ACTIVE")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  {subscription ? (
                    <>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">Current Subscription</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">Valid until {formatDate(subscription.endDate)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Your {membershipType?.toLowerCase() || "professional"} membership subscription is currently active.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-warning mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold">No Active Subscription</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">Your membership has expired or is not active</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          You need an active subscription to access all NITP member services.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {!subscription && (
                <Alert variant="warning" className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Subscription Expired</AlertTitle>
                  <AlertDescription>
                    Your subscription has expired. You won't be able to access SAR/EIAR applications, e-learning resources, or member tools until you renew.
                  </AlertDescription>
                </Alert>
              )}
              
              {subscription && new Date(subscription.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Subscription Expiring Soon</AlertTitle>
                  <AlertDescription>
                    Your subscription will expire on {formatDate(subscription.endDate)}. Renew now to maintain uninterrupted access to all NITP services.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Renew Subscription</Button>
                </DialogTrigger>
                <DialogContent>
                  {paymentUrl ? (
                    <div className="py-6">
                      <div className="text-center mb-4">
                        <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-2" />
                        <h3 className="text-lg font-medium">Payment Ready</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">You'll be redirected to our payment provider to complete your subscription.</p>
                      </div>
                      <div className="flex justify-center gap-4 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setPaymentUrl(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            window.open(paymentUrl, "_blank");
                            handlePaymentComplete();
                          }}
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle>Renew NITP Membership</DialogTitle>
                        <DialogDescription>
                          You are about to renew your {membershipType?.toLowerCase() || "professional"} membership subscription.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <h4 className="font-medium text-neutral-900 dark:text-white">Subscription Details</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Membership Type:</span>
                              <span>{membershipType || "Professional"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Duration:</span>
                              <span>1 Year</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total Amount:</span>
                              <span>{formatCurrency(membershipFee)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                          After payment, your subscription will be extended for one year from the current expiration date or from today if already expired.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsRenewDialogOpen(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRenew}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Proceed to Payment"
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
              <CardDescription>
                View your past subscription payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isHistoryLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : history?.length ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div>
                        <div className="font-medium">{item.type} Membership</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <div className="text-right font-medium">{formatCurrency(item.amount)}</div>
                        <div className="text-right text-sm text-neutral-500 dark:text-neutral-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500 dark:text-neutral-400">No subscription history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
