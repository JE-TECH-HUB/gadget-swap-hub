
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";

interface SwapRequest {
  id: string;
  requester_id: string;
  product_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  product_name: string;
  requester_email: string;
}

export const SwapRequestsPage = () => {
  // Mock data - will be replaced with Supabase data
  const [receivedRequests] = useState<SwapRequest[]>([
    {
      id: "1",
      requester_id: "user2",
      product_id: "1",
      message: "I'd like to swap my MacBook Air for your iPhone",
      status: "pending",
      created_at: new Date().toISOString(),
      product_name: "iPhone 14 Pro",
      requester_email: "user@example.com"
    }
  ]);

  const [sentRequests] = useState<SwapRequest[]>([
    {
      id: "2",
      requester_id: "current-user",
      product_id: "2",
      message: "Interested in swapping for my gaming console",
      status: "pending",
      created_at: new Date().toISOString(),
      product_name: "MacBook Air M2",
      requester_email: "current-user@example.com"
    }
  ]);

  const handleAcceptRequest = (requestId: string) => {
    // Will integrate with Supabase to update request status
    console.log("Accepting request:", requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // Will integrate with Supabase to update request status
    console.log("Rejecting request:", requestId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Swap Requests</h1>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">
            Received ({receivedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.product_name}</CardTitle>
                  <Badge variant={getStatusColor(request.status) as any}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  From: {request.requester_email}
                </p>
              </CardHeader>
              
              <CardContent>
                <p className="mb-4">{request.message}</p>
                
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {receivedRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No swap requests received yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.product_name}</CardTitle>
                  <Badge variant={getStatusColor(request.status) as any}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground">{request.message}</p>
              </CardContent>
            </Card>
          ))}

          {sentRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No swap requests sent yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
