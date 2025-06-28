
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, MessageSquare, Plus, Minus } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  status: "available" | "sold" | "swapped";
  owner_id: string;
  category: string;
  location?: string;
}

interface BuySwapDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

export const BuySwapDialog = ({ product, trigger }: BuySwapDialogProps) => {
  const { user, createSwapRequest } = useSupabase();
  const { addToCart } = useCart(user);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'buy' | 'swap'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [swapMessage, setSwapMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuy = async () => {
    if (!user) {
      toast.error('Please login to make a purchase');
      return;
    }

    setLoading(true);
    try {
      const success = await addToCart(product.id, quantity);
      if (success) {
        setIsOpen(false);
        toast.success(`Added ${quantity} item(s) to cart`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!user) {
      toast.error('Please login to make a swap request');
      return;
    }

    if (!swapMessage.trim()) {
      toast.error('Please enter a swap message');
      return;
    }

    setLoading(true);
    try {
      const success = await createSwapRequest(product.id, swapMessage.trim());
      if (success) {
        setIsOpen(false);
        setSwapMessage('');
        toast.success('Swap request sent successfully');
      }
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error('Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Determine mode based on trigger text
      const triggerText = (trigger as any)?.props?.children?.find((child: any) => 
        typeof child === 'string'
      );
      setMode(triggerText === 'Swap' ? 'swap' : 'buy');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'buy' ? (
              <>
                <ShoppingCart className="h-5 w-5" />
                Buy Product
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5" />
                Swap Request
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'buy' 
              ? 'Add this product to your cart'
              : 'Send a swap request to the seller'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-3 p-3 bg-muted rounded-lg">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-green-600 font-medium">{formatPrice(product.price)}</p>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
          </div>

          {mode === 'buy' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(product.price * quantity)}</span>
              </div>

              <Button 
                onClick={handleBuy}
                disabled={loading || product.status !== 'available'}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="swap-message">Swap Message</Label>
                <Textarea
                  id="swap-message"
                  placeholder="Describe what you'd like to swap for this item..."
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleSwap}
                disabled={loading || !swapMessage.trim() || product.status !== 'available'}
                className="w-full"
              >
                {loading ? 'Sending Request...' : 'Send Swap Request'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
