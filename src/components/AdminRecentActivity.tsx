import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, MessageSquare, User } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  type: 'product' | 'swap_request' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export const AdminRecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { getProducts, getSwapRequests } = useSupabase();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const [products, swapRequestsData] = await Promise.all([
          getProducts(),
          getSwapRequests()
        ]);

        const productActivities: Activity[] = products
          .slice(0, 3)
          .map(product => ({
            id: product.id,
            type: 'product' as const,
            title: `New Product: ${product.name}`,
            description: `Added to ${product.category}`,
            timestamp: product.created_at,
            status: product.status
          }));

        // Fix: Handle the object structure returned by getSwapRequests
        const allSwapRequests = [...swapRequestsData.received, ...swapRequestsData.sent];
        const swapActivities: Activity[] = allSwapRequests
          .slice(0, 3)
          .map(request => ({
            id: request.id,
            type: 'swap_request' as const,
            title: 'New Swap Request',
            description: request.message.substring(0, 50) + '...',
            timestamp: request.created_at,
            status: request.status
          }));

        const allActivities = [...productActivities, ...swapActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [getProducts, getSwapRequests]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product': return Package;
      case 'swap_request': return MessageSquare;
      default: return User;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    {activity.status && (
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
