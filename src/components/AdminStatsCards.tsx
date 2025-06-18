import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, MessageSquare, TrendingUp } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalProducts: number;
  availableProducts: number;
  totalUsers: number;
  pendingSwaps: number;
}

export const AdminStatsCards = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { getProducts, getSwapRequests, getAllUserRoles } = useSupabase();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, swapRequestsData, userRoles] = await Promise.all([
          getProducts(),
          getSwapRequests(),
          getAllUserRoles()
        ]);

        const availableProducts = products.filter(p => p.status === 'available').length;
        const allSwapRequests = [...swapRequestsData.received, ...swapRequestsData.sent];
        const pendingSwaps = allSwapRequests.filter(r => r.status === 'pending').length;

        setStats({
          totalProducts: products.length,
          availableProducts,
          totalUsers: userRoles.length,
          pendingSwaps
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getProducts, getSwapRequests, getAllUserRoles]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      description: "All marketplace items",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Available Items",
      value: stats?.availableProducts || 0,
      description: "Ready for sale/swap",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: "Registered members",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pending Swaps",
      value: stats?.pendingSwaps || 0,
      description: "Awaiting approval",
      icon: MessageSquare,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
