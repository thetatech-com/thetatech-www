import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useCountdown } from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart } from "lucide-react";
import { useMemo } from "react";

interface DealOfTheDayProps {
  product: Product;
}

export default function DealOfTheDay({ product }: DealOfTheDayProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Set end time to 23:45:12 from now (matching the design) - memoize to prevent re-renders
  const endTime = useMemo(() => {
    const end = new Date();
    end.setHours(end.getHours() + 23);
    end.setMinutes(end.getMinutes() + 45);
    end.setSeconds(end.getSeconds() + 12);
    return end;
  }, []);
  
  const { timeLeft, isExpired } = useCountdown(endTime);

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

  if (isExpired) {
    return null;
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Deal of the Day</h2>
      
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground mb-2">Ends in</div>
            <div 
              className="countdown-timer text-2xl font-bold text-primary" 
              data-testid="countdown-timer"
            >
              {timeLeft.hours.toString().padStart(2, '0')}:
              {timeLeft.minutes.toString().padStart(2, '0')}:
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
          </div>
          
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            data-testid="deal-product-image"
          />
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2" data-testid="deal-product-name">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(parseFloat(product.rating || "0")) ? "fill-current" : ""}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground" data-testid="deal-product-rating">
                ({product.rating})
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl font-bold text-primary" data-testid="deal-product-price">
                ₹{parseFloat(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through" data-testid="deal-product-original-price">
                  ₹{parseFloat(product.originalPrice).toLocaleString()}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-accent text-accent-foreground" data-testid="deal-discount-badge">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            <Button 
              className="w-full touch-feedback" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-testid="button-deal-add-to-cart"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
