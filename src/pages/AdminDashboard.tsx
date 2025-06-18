
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Package, MessageSquare, Plus, ArrowLeft, AlertTriangle, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { checkAdminAccess } from "@/utils/adminUtils";
import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { AdminSwapRequestsTable } from "@/components/AdminSwapRequestsTable";
import { AdminProductsTable } from "@/components/AdminProductsTable";
import { AdminStatsCards } from "@/components/AdminStatsCards";
import { AdminRecentActivity } from "@/components/AdminRecentActivity";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabase();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!authLoading) {
        if (!user) {
          toast.error("Please login to access admin dashboard");
          navigate('/auth');
          return;
        }

        console.log('Checking admin access for user:', user.email);
        
        const hasAdminAccess = await checkAdminAccess(user.id);
        setIsAdmin(hasAdminAccess);
        setAccessLoading(false);

        if (!hasAdminAccess) {
          console.log('Access denied: User does not have admin role');
        }
      }
    };

    checkAccess();
  }, [user, authLoading, navigate]);

  // Show loading while checking authentication and access
  if (authLoading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (!user || isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600 text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
              {user ? ' Please contact an administrator.' : ' Please login first.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              {!user && (
                <Button onClick={() => navigate('/auth')}>
                  Login
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="p-2 hover:bg-green-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
                </div>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="hover:bg-green-50">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="add-product" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="swap-requests" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Swaps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <AdminStatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab("add-product")} 
                      className="w-full justify-start bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("products")} 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Products
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("users")} 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("swap-requests")} 
                      variant="outline" 
                      className="w-full justify-start hover:bg-orange-50"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Review Swap Requests
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <AdminRecentActivity />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <AdminProductsTable />
          </TabsContent>

          <TabsContent value="add-product" className="mt-6">
            <AdminProductForm />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersTable />
          </TabsContent>

          <TabsContent value="swap-requests" className="mt-6">
            <AdminSwapRequestsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
