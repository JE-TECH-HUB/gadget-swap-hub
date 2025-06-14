
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, MessageSquare, MapPin, Clock, User, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { useSupabase } from "@/hooks/useSupabase";
import { SwapRequestDialog } from "@/components/SwapRequestDialog";
import { toast } from "sonner";

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const { user, getProducts } = useSupabase();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const products = await getProducts();
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error("Product not found");
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error("Error loading product");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProducts, navigate]);

  const categoryColors: Record<string, string> = {
    smartphones: "bg-blue-100 text-blue-800",
    laptops: "bg-green-100 text-green-800",
    tablets: "bg-purple-100 text-purple-800",
    tvs: "bg-orange-100 text-orange-800",
    accessories: "bg-pink-100 text-pink-800"
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleBuy = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    console.log("Adding to cart:", product?.id);
    toast.success("Item added to cart!");
  };

  const handleSwap = () => {
    if (!user) {
      toast.error("Please login to request a swap");
      return;
    }
    setIsSwapDialogOpen(true);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    toast.success("Added to wishlist!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.owner_id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Link to="/cart">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[product.category] || "bg-gray-100 text-gray-800"}>
                  {product.category}
                </Badge>
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-4xl font-bold text-green-600 mb-4">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(product.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Owner</span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {user ? (
                isOwner ? (
                  <div className="flex-1">
                    <Button disabled className="w-full">
                      This is your product
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleBuy}
                      disabled={product.status !== "available"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleSwap}
                      disabled={product.status !== "available"}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Swap
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
                      <Heart className="h-4 w-4" />
                    </Button>
                  </>
                )
              ) : (
                <Button className="flex-1" onClick={() => navigate('/auth')}>
                  Login to Buy or Swap
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Swap Request Dialog */}
      {product && (
        <SwapRequestDialog
          open={isSwapDialogOpen}
          onOpenChange={setIsSwapDialogOpen}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductDetail;
