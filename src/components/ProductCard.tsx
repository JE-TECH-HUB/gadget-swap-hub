
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, MessageSquare, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  status: "available" | "sold" | "swapped";
  owner_id: string;
  created_at: string;
  category: string;
  location?: string;
}

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
}

export const ProductCard = ({ product, isLoggedIn }: ProductCardProps) => {
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${product.id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge className={categoryColors[product.category] || "bg-gray-100 text-gray-800"}>
                {product.category}
              </Badge>
              <Badge className={getStatusColor(product.status)}>
                {product.status}
              </Badge>
            </div>
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to wishlist logic
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {truncateText(product.description, 80)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-20">{product.location}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {isLoggedIn ? (
          <>
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={product.status !== "available"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to cart logic
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Buy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              disabled={product.status !== "available"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Open swap dialog logic
              }}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Swap
            </Button>
          </>
        ) : (
          <Link to="/auth" className="w-full">
            <Button size="sm" className="w-full">
              Login to Buy
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
