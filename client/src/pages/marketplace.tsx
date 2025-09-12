import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: category === "all" ? undefined : category, search: searchQuery || undefined }],
  });

  const handleSearch = () => {
    setSearchQuery(search);
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
    { value: "tablets", label: "Tablets" },
    { value: "accessories", label: "Accessories" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Electronics Marketplace</h1>
        <p className="text-muted-foreground mb-6">
          Discover the latest electronics with competitive prices and quality guarantee
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
              data-testid="input-search"
            />
            <Button onClick={handleSearch} data-testid="button-search">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Button
            variant={category === "smartphones" ? "default" : "outline"}
            onClick={() => setCategory("smartphones")}
            className="h-16 flex flex-col"
            data-testid="category-pill-smartphones"
          >
            <span className="text-lg mb-1">📱</span>
            <span className="text-sm">Smartphones</span>
            <span className="text-xs text-muted-foreground">Starting ₹8,999</span>
          </Button>
          
          <Button
            variant={category === "laptops" ? "default" : "outline"}
            onClick={() => setCategory("laptops")}
            className="h-16 flex flex-col"
            data-testid="category-pill-laptops"
          >
            <span className="text-lg mb-1">💻</span>
            <span className="text-sm">Laptops</span>
            <span className="text-xs text-muted-foreground">Starting ₹25,999</span>
          </Button>
          
          <Button
            variant={category === "accessories" ? "default" : "outline"}
            onClick={() => setCategory("accessories")}
            className="h-16 flex flex-col"
            data-testid="category-pill-audio"
          >
            <span className="text-lg mb-1">🎧</span>
            <span className="text-sm">Audio</span>
            <span className="text-xs text-muted-foreground">Starting ₹999</span>
          </Button>
          
          <Button
            variant={category === "accessories" ? "default" : "outline"}
            onClick={() => setCategory("accessories")}
            className="h-16 flex flex-col"
            data-testid="category-pill-accessories"
          >
            <span className="text-lg mb-1">🔌</span>
            <span className="text-sm">Accessories</span>
            <span className="text-xs text-muted-foreground">Starting ₹299</span>
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or browse different categories
          </p>
          <Button 
            onClick={() => {
              setSearch("");
              setSearchQuery("");
              setCategory("all");
            }}
            className="mt-4"
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
