import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const getBadgeText = () => {
    if (product.tags?.includes("best-seller")) return "Best Seller";
    if (product.tags?.includes("editor-choice")) return "Editor's Choice";
    if (product.tags?.includes("trending")) return "Trending";
    if (product.tags?.includes("new-arrival")) return "New Arrival";
    if (product.tags?.includes("deal-of-the-day")) return "Deal of the Day";
    return null;
  };

  const getBadgeVariant = () => {
    if (product.tags?.includes("best-seller")) return "default";
    if (product.tags?.includes("editor-choice")) return "secondary";
    if (product.tags?.includes("trending")) return "outline";
    if (product.tags?.includes("new-arrival")) return "outline";
    return "default";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow touch-feedback" data-testid={`product-card-${product.id}`}>
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`product-image-${product.id}`}
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {getBadgeText() && (
            <Badge variant={getBadgeVariant()} className="text-xs">
              {getBadgeText()}
            </Badge>
          )}
        </div>
        
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            -{discountPercentage}%
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1 capitalize" data-testid={`product-category-${product.id}`}>
          {product.category}
        </div>
        
        <h3 className="font-semibold mb-2 line-clamp-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(parseFloat(product.rating || "0")) ? "fill-current" : ""}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground" data-testid={`product-rating-${product.id}`}>
            ({product.rating}) {product.reviewCount} reviews
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
            ₹{parseFloat(product.price).toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through" data-testid={`product-original-price-${product.id}`}>
              ₹{parseFloat(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>
        
        <Button 
          className="w-full touch-feedback" 
          variant="secondary"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
}
