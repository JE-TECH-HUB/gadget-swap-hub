
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Edit, Trash2, MessageSquare, ShoppingCart } from "lucide-react";
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
}

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
  currentUserId?: string;
}

export const ProductCard = ({ product, isLoggedIn, currentUserId = "current-user" }: ProductCardProps) => {
  const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
  const isOwner = currentUserId === product.owner_id;

  const handleBuy = () => {
    // Will integrate with Supabase to update product status
    console.log("Buying product:", product.id);
  };

  const handleEdit = () => {
    // Will integrate with edit functionality
    console.log("Editing product:", product.id);
  };

  const handleDelete = () => {
    // Will integrate with Supabase to delete product
    console.log("Deleting product:", product.id);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <AspectRatio ratio={4/3}>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <div className="absolute top-2 right-2">
            <Badge variant={product.status === "available" ? "default" : "secondary"}>
              {product.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-primary">${product.price}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          {isLoggedIn ? (
            <div className="flex gap-2 w-full">
              {isOwner ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
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
            <Button className="w-full" disabled>
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
