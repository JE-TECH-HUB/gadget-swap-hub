
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminSwapRequestsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Requests Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Swap requests management functionality will be implemented here.
            <br />
            Admins will be able to view and moderate swap requests between users.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
