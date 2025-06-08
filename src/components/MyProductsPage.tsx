
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

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

export const MyProductsPage = () => {
  // Mock data - will be replaced with Supabase data
  const [myProducts] = useState<Product[]>([
    {
      id: "1",
      name: "iPhone 14 Pro",
      description: "Excellent condition, barely used",
      price: 999,
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      status: "available",
      owner_id: "current-user",
      created_at: new Date().toISOString()
    }
  ]);

  const handleEdit = (productId: string) => {
    // Will integrate with edit functionality
    console.log("Editing product:", productId);
  };

  const handleDelete = (productId: string) => {
    // Will integrate with Supabase to delete product
    console.log("Deleting product:", productId);
  };

  const handleMarkAsSold = (productId: string) => {
    // Will integrate with Supabase to update status
    console.log("Marking as sold:", productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Badge variant="outline">{myProducts.length} items</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className="absolute top-2 right-2"
                  variant={product.status === "available" ? "default" : "secondary"}
                >
                  {product.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <p className="text-xl font-bold text-primary mb-4">${product.price}</p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
                {product.status === "available" && (
                  <Button 
                    size="sm"
                    onClick={() => handleMarkAsSold(product.id)}
                  >
                    Mark Sold
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {myProducts.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No products yet</h3>
          <p className="text-muted-foreground">Start by adding your first product!</p>
        </div>
      )}
    </div>
  );
};
