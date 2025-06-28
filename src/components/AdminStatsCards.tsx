
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, MessageSquare, TrendingUp } from "lucide-react";
import { useOptimizedData } from "@/hooks/useOptimizedData";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminStatsCards = () => {
  const { data, loading } = useOptimizedData();
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    totalUsers: 0,
    pendingSwaps: 0
  });

  useEffect(() => {
    if (data) {
      const availableProducts = data.products.filter(p => p.status === 'available').length;
      const allSwapRequests = [...data.swapRequests.received, ...data.swapRequests.sent];
      const pendingSwaps = allSwapRequests.filter(r => r.status === 'pending').length;

      setStats({
        totalProducts: data.products.length,
        availableProducts,
        totalUsers: data.users.length,
        pendingSwaps
      });
    }
  }, [data]);

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
      value: stats.totalProducts,
      description: "All marketplace items",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Available Items",
      value: stats.availableProducts,
      description: "Ready for sale/swap",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered members",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Pending Swaps",
      value: stats.pendingSwaps,
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
