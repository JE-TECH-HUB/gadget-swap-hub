
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Categories", count: 12 },
  { id: "smartphones", label: "Smartphones", count: 3 },
  { id: "laptops", label: "Laptops", count: 3 },
  { id: "tablets", label: "Tablets", count: 2 },
  { id: "tvs", label: "Smart TVs", count: 2 },
  { id: "accessories", label: "Accessories", count: 2 }
];

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-green-200">
      <h4 className="font-semibold mb-4 text-center text-green-800">Filter by Category</h4>
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className={`relative ${
              selectedCategory === category.id 
                ? "bg-green-600 hover:bg-green-700" 
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
            size="sm"
          >
            {category.label}
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-green-100 text-green-800"
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};
