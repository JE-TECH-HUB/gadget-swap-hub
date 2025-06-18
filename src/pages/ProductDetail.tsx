
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, MessageSquare, MapPin, Clock, User, Heart, Share2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { useSupabase } from "@/hooks/useSupabase";
import { SwapRequestDialog } from "@/components/SwapRequestDialog";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductSpecs } from "@/components/ProductSpecs";
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
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist!" : "Added to wishlist!");
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.category} for ${formatPrice(product.price)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
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
  const images = product.image_url ? [product.image_url] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 hover:bg-green-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              {user && (
                <Link to="/cart">
                  <Button variant="outline" size="sm" className="hover:bg-green-50">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-7">
            <ProductImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title and Price */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                      </div>
                    </div>
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
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {user ? (
                    isOwner ? (
                      <Button disabled className="w-full" size="lg">
                        This is your product
                      </Button>
                    ) : (
                      <>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleBuy}
                          disabled={product.status !== "available"}
                          size="lg"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart - {formatPrice(product.price)}
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={handleSwap}
                            disabled={product.status !== "available"}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Swap
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleAddToWishlist}
                            className={isWishlisted ? 'bg-red-50 text-red-600 hover:bg-red-100' : ''}
                          >
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </>
                    )
                  ) : (
                    <Button className="w-full" onClick={() => navigate('/auth')} size="lg">
                      Login to Buy or Swap
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Specs */}
            <ProductSpecs 
              category={product.category}
              status={product.status}
              location={product.location}
              createdAt={product.created_at}
            />
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
