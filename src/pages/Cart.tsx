
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, CreditCard, Package } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Cart = () => {
  const { user } = useSupabase();
  const { cartItems, loading, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart(user);
  const { createOrder, loading: orderLoading } = useOrders(user);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const success = await createOrder(cartItems);
    if (success) {
      await clearCart();
      toast.success("Order placed successfully! Check your dashboard for details.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" className="p-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please login to view your cart</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to add items to cart</p>
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/" className="text-2xl font-bold text-primary">Je-Gadgets</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalItems} items
            </Badge>
          )}
        </div>

        {loading ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your cart...</p>
            </CardContent>
          </Card>
        ) : cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some gadgets to your cart to get started
              </p>
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Items in Cart</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              </div>

              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.product?.image_url || "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"}
                        alt={item.product?.name || "Product"}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{item.product?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product?.category} • {item.product?.location}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={item.product?.status === 'available' ? 'text-green-600' : 'text-red-600'}
                            >
                              {item.product?.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product?.price || 0)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>{formatPrice(totalPrice * 0.02)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(totalPrice + (totalPrice * 0.02))}</span>
                  </div>
                  <Button 
                    onClick={handleCheckout}
                    disabled={orderLoading || cartItems.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {orderLoading ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="text-center text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Secure Checkout</p>
                    <p>Your payment information is protected with 256-bit SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
