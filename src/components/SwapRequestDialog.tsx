
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

interface SwapRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const SwapRequestDialog = ({ open, onOpenChange, product }: SwapRequestDialogProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will integrate with Supabase to send swap request
    console.log("Sending swap request for product:", product.id, "with message:", message);
    onOpenChange(false);
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Swap for {product.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">{product.name}</h4>
            <p className="text-sm text-muted-foreground">${product.price}</p>
          </div>
          
          <div>
            <Label htmlFor="swap-message">Your Swap Proposal</Label>
            <Textarea
              id="swap-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you'd like to swap for this item..."
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Swap Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
