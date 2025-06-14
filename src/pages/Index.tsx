
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
  location?: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Nigerian-focused mock data with local context
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "iPhone 14 Pro Max",
      description: "Brand new, imported from Dubai. 256GB storage, dual SIM support",
      price: 850000,
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      status: "available" as const,
      owner_id: "user1",
      created_at: new Date().toISOString(),
      category: "smartphones",
      location: "Lagos, VI"
    },
    {
      id: "2",
      name: "MacBook Air M2",
      description: "Perfect for students and professionals. Used for 6 months, excellent condition",
      price: 1200000,
      image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      status: "available" as const,
      owner_id: "user2",
      created_at: new Date().toISOString(),
      category: "laptops",
      location: "Abuja, Wuse"
    },
    {
      id: "3",
      name: "Samsung Galaxy Watch 5",
      description: "Health tracking, GPS enabled. Great for fitness enthusiasts",
      price: 180000,
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      status: "sold" as const,
      owner_id: "user3",
      created_at: new Date().toISOString(),
      category: "accessories",
      location: "Port Harcourt"
    },
    {
      id: "4",
      name: "iPad Pro 12.9\" M2",
      description: "Latest model with Apple Pencil included. Perfect for digital art and work",
      price: 950000,
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      status: "available" as const,
      owner_id: "user4",
      created_at: new Date().toISOString(),
      category: "tablets",
      location: "Kano"
    },
    {
      id: "5",
      name: "Samsung Galaxy S23 Ultra",
      description: "Flagship Android phone, 1TB storage, S Pen included. Excellent camera",
      price: 750000,
      image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      status: "available" as const,
      owner_id: "user5",
      created_at: new Date().toISOString(),
      category: "smartphones",
      location: "Ibadan"
    },
    {
      id: "6",
      name: "HP Pavilion Gaming Laptop",
      description: "Intel i5, 16GB RAM, GTX graphics. Perfect for gaming and work",
      price: 650000,
      image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      status: "available" as const,
      owner_id: "user6",
      created_at: new Date().toISOString(),
      category: "laptops",
      location: "Enugu"
    },
    {
      id: "7",
      name: "LG 55\" Smart TV",
      description: "4K Ultra HD, WebOS, Netflix built-in. Perfect for Nigerian movies and sports",
      price: 420000,
      image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      status: "available" as const,
      owner_id: "user7",
      created_at: new Date().toISOString(),
      category: "tvs",
      location: "Kaduna"
    },
    {
      id: "8",
      name: "AirPods Pro 2nd Gen",
      description: "Active noise cancellation, wireless charging. Original Apple product",
      price: 220000,
      image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
      status: "available" as const,
      owner_id: "user8",
      created_at: new Date().toISOString(),
      category: "accessories",
      location: "Jos"
    },
    {
      id: "9",
      name: "Tecno Phantom X2 Pro",
      description: "Nigerian favorite! Excellent camera, long battery life, dual SIM",
      price: 350000,
      image_url: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
      status: "swapped" as const,
      owner_id: "user9",
      created_at: new Date().toISOString(),
      category: "smartphones",
      location: "Calabar"
    },
    {
      id: "10",
      name: "Samsung Galaxy Tab A8",
      description: "Android tablet perfect for entertainment and light work. Kids friendly",
      price: 280000,
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      status: "available" as const,
      owner_id: "user10",
      created_at: new Date().toISOString(),
      category: "tablets",
      location: "Warri"
    },
    {
      id: "11",
      name: "Infinix InBook X1 Pro",
      description: "Affordable laptop with great performance. Perfect for students",
      price: 380000,
      image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
      status: "available" as const,
      owner_id: "user11",
      created_at: new Date().toISOString(),
      category: "laptops",
      location: "Benin City"
    },
    {
      id: "12",
      name: "Sony 43\" Smart TV",
      description: "Android TV with Google Play Store. Stream Nollywood movies easily",
      price: 350000,
      image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      status: "available" as const,
      owner_id: "user12",
      created_at: new Date().toISOString(),
      category: "tvs",
      location: "Ilorin"
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
              <h1 className="text-2xl font-bold text-primary">Naija-Gadgets</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>•</span>
                <span>Nigeria's #1 Electronics Marketplace</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Item
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    My Items
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
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Naija-Gadgets Marketplace
          </h2>
          <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Buy, sell, and swap electronics across Nigeria with confidence
          </p>
          <p className="text-lg text-green-700 mb-8 font-medium">
            🇳🇬 From Lagos to Abuja, Kano to Port Harcourt - We Connect Nigeria!
          </p>
          
          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search gadgets across Nigeria..."
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
                Filter by Category
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
              {filteredProducts.length} items found across Nigeria
              {selectedCategory !== "all" && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
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
