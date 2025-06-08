
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, LogIn, LogOut } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AuthDialog } from "@/components/AuthDialog";

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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be managed by Supabase auth

  // Mock data for demonstration - will be replaced with Supabase data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 14 Pro",
      description: "Excellent condition, barely used",
      price: 999,
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      status: "available" as const,
      owner_id: "user1",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      name: "MacBook Air M2",
      description: "Perfect for students and professionals",
      price: 1299,
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      status: "available" as const,
      owner_id: "user2",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      name: "Samsung Galaxy Watch",
      description: "Smart watch with fitness tracking",
      price: 299,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      status: "sold" as const,
      owner_id: "user3",
      created_at: new Date().toISOString()
    }
  ];

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">JE-Gadgets</h1>
            
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    My Products
                  </Button>
                  <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsAuthDialogOpen(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Buy, Sell & Swap Gadgets</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Find amazing deals on electronics and tech gadgets
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search gadgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Available Gadgets</h3>
          <p className="text-muted-foreground">{filteredProducts.length} items found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No gadgets found matching your search.</p>
          </div>
        )}
      </section>

      {/* Add Product Dialog */}
      <AddProductDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    </div>
  );
};

export default Index;
