
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, User, LogIn, LogOut, Filter, ShoppingCart, LayoutDashboard } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { AddProductDialog } from "@/components/AddProductDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";

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
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { user, signOut, loading, getProducts } = useSupabase();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Error loading products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [getProducts]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Je-Gadgets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-4">
                <Link to="/" className="text-xl lg:text-2xl font-bold text-primary">Je-Gadgets</Link>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>Nigeria's #1 Electronics Marketplace</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 lg:gap-3">
              {user ? (
                <>
                  <Link to="/cart">
                    <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                      <ShoppingCart className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Cart</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                      <LayoutDashboard className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                  <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="text-xs lg:text-sm">
                    <Plus className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Sell Item</span>
                    <span className="sm:hidden">Sell</span>
                  </Button>
                  <Link to="/my-products">
                    <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                      <User className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">My Items</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs lg:text-sm">
                    <LogOut className="h-4 w-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="sm" className="text-xs lg:text-sm">
                      <LogIn className="h-4 w-4 mr-1 lg:mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Button onClick={() => setIsAuthDialogOpen(true)} variant="outline" size="sm" className="text-xs lg:text-sm">
                    Quick Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Je-Gadgets Marketplace
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Buy, sell, and swap electronics across Nigeria with confidence
          </p>
          <p className="text-base lg:text-lg text-green-700 mb-6 lg:mb-8 font-medium">
            🇳🇬 From Lagos to Abuja, Kano to Port Harcourt - We Connect Nigeria!
          </p>
          
          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full max-w-md">
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
                className="h-12 px-4 lg:px-6 whitespace-nowrap"
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
            <h3 className="text-2xl lg:text-3xl font-semibold mb-2">Available Gadgets</h3>
            {productsLoading ? (
              <p className="text-muted-foreground">Loading products...</p>
            ) : (
              <p className="text-muted-foreground">
                {filteredProducts.length} items found across Nigeria
                {selectedCategory !== "all" && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {selectedCategory}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}

        {!productsLoading && filteredProducts.length === 0 && (
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

      {/* Footer */}
      <Footer />

      {/* Add Product Dialog */}
      <AddProductDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onAuthSuccess={() => {}}
      />
    </div>
  );
};

export default Index;
