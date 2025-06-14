
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, MessageSquare, MapPin, Clock, User, Heart } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false); // This would come from context in a real app

  // Mock product data - in a real app, this would be fetched based on the ID
  const product = {
    id: "1",
    name: "iPhone 14 Pro Max",
    description: "Brand new, imported from Dubai. 256GB storage, dual SIM support. This premium smartphone offers exceptional performance with the latest A16 Bionic chip, ProRAW photography capabilities, and all-day battery life. Perfect for professionals and tech enthusiasts.",
    price: 850000,
    image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    status: "available" as const,
    owner_id: "user1",
    created_at: new Date().toISOString(),
    category: "smartphones",
    location: "Lagos, VI",
    owner_name: "Adebayo Ogundimu",
    specifications: {
      "Storage": "256GB",
      "RAM": "6GB",
      "Display": "6.7-inch Super Retina XDR",
      "Camera": "48MP Triple Camera System",
      "Battery": "Up to 29 hours video playback",
      "OS": "iOS 16"
    }
  };

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

  const handleBuy = () => {
    console.log("Adding to cart:", product.id);
    // In a real app, this would add to cart and redirect
  };

  const handleSwap = () => {
    console.log("Opening swap dialog for:", product.id);
    // In a real app, this would open the swap dialog
  };

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
              <Link to="/cart">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
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
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[product.category]}>
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
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>2 days ago</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{product.owner_name}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isLoggedIn ? (
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
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button className="flex-1" disabled>
                  Login to Buy or Swap
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
