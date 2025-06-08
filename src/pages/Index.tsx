
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, LogIn, LogOut, Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { CategoryFilter } from "@/components/CategoryFilter";

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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Expanded mock data with various categories
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 14 Pro",
      description: "Excellent condition, barely used, 256GB storage",
      price: 999,
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      status: "available" as const,
      owner_id: "user1",
      created_at: new Date().toISOString(),
      category: "smartphones"
    },
    {
      id: "2",
      name: "MacBook Air M2",
      description: "Perfect for students and professionals, 16GB RAM",
      price: 1299,
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      status: "available" as const,
      owner_id: "user2",
      created_at: new Date().toISOString(),
      category: "laptops"
    },
    {
      id: "3",
      name: "Samsung Galaxy Watch 5",
      description: "Smart watch with fitness tracking, GPS enabled",
      price: 299,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      status: "sold" as const,
      owner_id: "user3",
      created_at: new Date().toISOString(),
      category: "accessories"
    },
    {
      id: "4",
      name: "iPad Pro 12.9\"",
      description: "Latest model with M2 chip, 512GB, Wi-Fi + Cellular",
      price: 1399,
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      status: "available" as const,
      owner_id: "user4",
      created_at: new Date().toISOString(),
      category: "tablets"
    },
    {
      id: "5",
      name: "Samsung Galaxy S23 Ultra",
      description: "Flagship Android phone, 1TB storage, S Pen included",
      price: 1199,
      image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      status: "available" as const,
      owner_id: "user5",
      created_at: new Date().toISOString(),
      category: "smartphones"
    },
    {
      id: "6",
      name: "Dell XPS 13",
      description: "Ultra-portable laptop, Intel i7, 16GB RAM, 1TB SSD",
      price: 1099,
      image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      status: "available" as const,
      owner_id: "user6",
      created_at: new Date().toISOString(),
      category: "laptops"
    },
    {
      id: "7",
      name: "Sony 65\" OLED TV",
      description: "4K HDR OLED smart TV, perfect picture quality",
      price: 1799,
      image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      status: "available" as const,
      owner_id: "user7",
      created_at: new Date().toISOString(),
      category: "tvs"
    },
    {
      id: "8",
      name: "AirPods Pro 2",
      description: "Active noise cancellation, wireless charging case",
      price: 249,
      image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
      status: "available" as const,
      owner_id: "user8",
      created_at: new Date().toISOString(),
      category: "accessories"
    },
    {
      id: "9",
      name: "Google Pixel 7 Pro",
      description: "Android flagship with amazing camera, 256GB",
      price: 799,
      image_url: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
      status: "swapped" as const,
      owner_id: "user9",
      created_at: new Date().toISOString(),
      category: "smartphones"
    },
    {
      id: "10",
      name: "Samsung Galaxy Tab S8",
      description: "Android tablet with S Pen, great for productivity",
      price: 699,
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      status: "available" as const,
      owner_id: "user10",
      created_at: new Date().toISOString(),
      category: "tablets"
    },
    {
      id: "11",
      name: "Gaming Laptop ASUS ROG",
      description: "High-performance gaming laptop, RTX 4070, 32GB RAM",
      price: 2299,
      image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      status: "available" as const,
      owner_id: "user11",
      created_at: new Date().toISOString(),
      category: "laptops"
    },
    {
      id: "12",
      name: "LG 55\" Smart TV",
      description: "4K UHD Smart TV with webOS, HDR support",
      price: 599,
      image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      status: "available" as const,
      owner_id: "user12",
      created_at: new Date().toISOString(),
      category: "tvs"
    }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">JE-Gadgets</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>•</span>
                <span>Buy, Sell & Swap Electronics</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    My Products
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsAuthDialogOpen(true)} size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            JE-Gadgets Marketplace
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing deals on the latest electronics and tech gadgets. Buy, sell, or swap with confidence.
          </p>
          
          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search gadgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {showFilters && (
              <div className="animate-fade-in">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-semibold mb-2">Available Gadgets</h3>
            <p className="text-muted-foreground">
              {filteredProducts.length} items found
              {selectedCategory !== "all" && (
                <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedCategory}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-semibold mb-2">No gadgets found</h4>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
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
        onAuthSuccess={() => setIsLoggedIn(true)}
      />
    </div>
  );
};

export default Index;
