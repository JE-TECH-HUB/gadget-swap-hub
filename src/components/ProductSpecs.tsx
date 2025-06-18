
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Laptop, Tablet, Tv, Headphones } from "lucide-react";

interface ProductSpecsProps {
  category: string;
  status: string;
  location?: string;
  createdAt: string;
}

export const ProductSpecs = ({ category, status, location, createdAt }: ProductSpecsProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'smartphones': return Smartphone;
      case 'laptops': return Laptop;
      case 'tablets': return Tablet;
      case 'tvs': return Tv;
      case 'accessories': return Headphones;
      default: return Smartphone;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-red-100 text-red-800 border-red-200";
      case "swapped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const CategoryIcon = getCategoryIcon(category);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CategoryIcon className="h-5 w-5" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <div className="mt-1">
              <Badge variant="outline" className="capitalize">
                {category}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge className={`capitalize ${getStatusColor(status)}`}>
                {status}
              </Badge>
            </div>
          </div>
          {location && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="mt-1 text-sm">{location}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Listed</label>
            <p className="mt-1 text-sm">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
