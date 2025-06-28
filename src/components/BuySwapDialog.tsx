
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShoppingCart, MessageSquare, Package, CreditCard } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  owner_id: string;
  status: string;
}

interface BuySwapDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

export const BuySwapDialog = ({ product, trigger }: BuySwapDialogProps) => {
  const { user, sendSwapRequest } = useSupabase();
  const { addToCart } = useCart(user);
  const { createOrder } = useOrders(user);
  const [open, setOpen] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyNow, setBuyNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please login to purchase");
      return;
    }

    setLoading(true);
    try {
      if (buyNow) {
        // Direct purchase
        const mockCartItem = {
          product_id: product.id,
          quantity,
          product: {
            ...product,
            owner_id: product.owner_id
          }
        };
        
        const success = await createOrder([mockCartItem]);
        if (success) {
          setOpen(false);
          toast.success("Purchase completed! Check your orders in the dashboard.");
        }
      } else {
        // Add to cart
        const success = await addToCart(product.id, quantity);
        if (success) {
          setOpen(false);
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error("Failed to complete purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!user) {
      toast.error("Please login to send swap request");
      return;
    }

    if (!swapMessage.trim()) {
      toast.error("Please enter a swap message");
      return;
    }

    setLoading(true);
    try {
      const success = await sendSwapRequest(product.id, swapMessage);
      if (success) {
        toast.success("Swap request sent!");
        setOpen(false);
        setSwapMessage("");
      }
    } catch (error) {
      console.error('Swap request error:', error);
      toast.error("Failed to send swap request");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isOwner = user?.id === product.owner_id;
  const isUnavailable = product.status !== 'available';

  if (isOwner) {
    return (
      <Button disabled variant="outline" size="sm">
        Your Product
      </Button>
    );
  }

  if (isUnavailable) {
    return (
      <Button disabled variant="outline" size="sm">
        {product.status === 'sold' ? 'Sold' : 'Unavailable'}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>

          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="swap" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Swap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Total:</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setBuyNow(true);
                      handleBuy();
                    }}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : "Buy Now"}
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setBuyNow(false);
                      handleBuy();
                    }}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="swap" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="swap-message">Your swap offer message</Label>
                  <Textarea
                    id="swap-message"
                    placeholder="Describe what you'd like to swap for this item..."
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleSwap}
                  disabled={loading || !swapMessage.trim()}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {loading ? "Sending..." : "Send Swap Request"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
