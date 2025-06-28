
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, ShoppingCart, MessageSquare, TrendingUp, Plus, Eye, Edit, Trash2, Clock, User } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { Footer } from "@/components/Footer";
import { AddProductDialog } from "@/components/AddProductDialog";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, getProducts, updateProduct, deleteProduct } = useSupabase();
  const { totalItems } = useCart(user);
  const { getUserOrders, loading: ordersLoading } = useOrders(user);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeSales: 0,
    pendingSwaps: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user's products
      const allProducts = await getProducts();
      const userProducts = allProducts.filter(p => p.owner_id === user.id);
      setMyProducts(userProducts);

      // Fetch user's orders
      const userOrders = await getUserOrders();
      setOrders(userOrders);

      // Calculate stats
      const activeSales = userProducts.filter(p => p.status === 'available').length;
      const totalEarnings = userOrders
        .filter(o => o.payment_status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);

      setStats({
        totalListings: userProducts.length,
        activeSales,
        pendingSwaps: 0, // Will be updated when swap requests are implemented
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const success = await deleteProduct(productId);
    if (success) {
      toast.success('Product deleted successfully');
      fetchDashboardData();
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    const success = await updateProduct(productId, { status: newStatus });
    if (success) {
      toast.success(`Product marked as ${newStatus}`);
      fetchDashboardData();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to access your dashboard</p>
            <Link to="/auth">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <AddProductDialog 
            trigger={
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            }
            onProductAdded={fetchDashboardData}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalListings}</div>
                  <p className="text-xs text-muted-foreground">Your products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Items</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSales}</div>
                  <p className="text-xs text-muted-foreground">Ready for sale</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">Purchase orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</div>
                  <p className="text-xs text-muted-foreground">From completed sales</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList>
                <TabsTrigger value="products">My Products ({myProducts.length})</TabsTrigger>
                <TabsTrigger value="orders">My Orders ({orders.length})</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-4">
                {myProducts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                      <p className="text-muted-foreground mb-4">Start selling by adding your first product</p>
                      <AddProductDialog 
                        trigger={<Button>Add Your First Product</Button>}
                        onProductAdded={fetchDashboardData}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {myProducts.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <p className="text-green-600 font-medium">{formatPrice(product.price)}</p>
                                  <p className="text-sm text-muted-foreground">{product.category} • {product.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(product.status)}>
                                    {product.status}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    <span>{Math.floor(Math.random() * 50) + 10}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(product.id, product.status)}
                              >
                                {product.status === 'available' ? 'Mark Sold' : 'Mark Available'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                {ordersLoading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading orders...</p>
                    </CardContent>
                  </Card>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Your purchase history will appear here</p>
                      <Link to="/">
                        <Button>Start Shopping</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {order.product?.image_url && (
                                <img
                                  src={order.product.image_url}
                                  alt={order.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <h3 className="font-semibold">{order.product?.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {order.quantity} • {order.product?.category}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(order.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">{formatPrice(order.total_amount)}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                Payment: {order.payment_status}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Coming Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Detailed analytics about your sales performance, popular products, and earnings trends will be available here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
