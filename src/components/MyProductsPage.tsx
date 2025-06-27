
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Eye, Plus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { AddProductDialog } from "./AddProductDialog";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: "available" | "sold" | "swapped";
  category: string;
  location?: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export const MyProductsPage = () => {
  const navigate = useNavigate();
  const { user, getProducts, updateProduct, deleteProduct } = useSupabase();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMyProducts();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      // Filter products owned by current user
      const userProducts = allProducts.filter(product => product.owner_id === user?.id);
      setMyProducts(userProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Error loading your products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setActionLoading(productId);
    try {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success("Product deleted successfully");
        setMyProducts(myProducts.filter(p => p.id !== productId));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error deleting product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: "available" | "sold" | "swapped") => {
    setActionLoading(productId);
    try {
      const updatedProduct = await updateProduct(productId, { status: newStatus });
      if (updatedProduct) {
        toast.success(`Product marked as ${newStatus}`);
        setMyProducts(myProducts.map(p => 
          p.id === productId ? { ...p, status: newStatus } : p
        ));
      } else {
        toast.error("Failed to update product status");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error updating product status");
    } finally {
      setActionLoading(null);
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
        return "bg-red-100 text-red-800";
      case "swapped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Products</h1>
                <p className="text-muted-foreground">Manage your listed items</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{myProducts.length} items</Badge>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : myProducts.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-3">No products yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start selling your electronics by adding your first product to the marketplace.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}
                    >
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <CardTitle className="mb-2 line-clamp-1">{product.name}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description || "No description provided"}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                    {product.location && (
                      <p className="text-sm text-muted-foreground">{product.location}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={actionLoading === product.id}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    
                    {product.status === "available" && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(product.id, "sold")}
                          disabled={actionLoading === product.id}
                          className="flex-1"
                        >
                          Mark as Sold
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(product.id, "swapped")}
                          disabled={actionLoading === product.id}
                          className="flex-1"
                        >
                          Mark as Swapped
                        </Button>
                      </div>
                    )}
                    
                    {product.status !== "available" && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(product.id, "available")}
                        disabled={actionLoading === product.id}
                        className="w-full"
                      >
                        Mark as Available
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddProductDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};
