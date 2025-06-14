
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminUsersTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            User management functionality will be implemented here.
            <br />
            This will show all registered users and allow role management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
