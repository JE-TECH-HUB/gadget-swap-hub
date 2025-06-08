
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Edit, Trash2, MessageSquare, ShoppingCart, Clock } from "lucide-react";
import { useState } from "react";
import { SwapRequestDialog } from "./SwapRequestDialog";

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
}

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
  currentUserId?: string;
}

const categoryColors: Record<string, string> = {
  smartphones: "bg-blue-100 text-blue-800",
  laptops: "bg-green-100 text-green-800",
  tablets: "bg-purple-100 text-purple-800",
  tvs: "bg-orange-100 text-orange-800",
  accessories: "bg-pink-100 text-pink-800"
};

export const ProductCard = ({ product, isLoggedIn, currentUserId = "current-user" }: ProductCardProps) => {
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const isOwner = currentUserId === product.owner_id;

  const handleBuy = () => {
    console.log("Buying product:", product.id);
  };

  const handleEdit = () => {
    console.log("Editing product:", product.id);
  };

  const handleDelete = () => {
    console.log("Deleting product:", product.id);
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

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={4/3}>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </AspectRatio>
          <div className="absolute top-3 left-3">
            <Badge className={categoryColors[product.category] || "bg-gray-100 text-gray-800"}>
              {product.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(product.status)}>
              {product.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary">${product.price}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>2 days ago</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {isLoggedIn ? (
            <div className="flex gap-2 w-full">
              {isOwner ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={handleBuy}
                    disabled={product.status !== "available"}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsSwapDialogOpen(true)}
                    disabled={product.status !== "available"}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button className="w-full" disabled size="sm">
              Login to Buy or Swap
            </Button>
          )}
        </CardFooter>
      </Card>

      <SwapRequestDialog
        open={isSwapDialogOpen}
        onOpenChange={setIsSwapDialogOpen}
        product={product}
      />
    </>
  );
};
