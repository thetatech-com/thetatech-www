import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

const CheckoutForm = ({ onSuccess, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-confirmation',
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred processing your payment",
        variant: "destructive",
      });
    } else {
      // Payment succeeded, handled by return_url
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-payment">
      <div className="rounded-lg border bg-card p-4">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || !elements || isProcessing}
        data-testid="button-pay"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { sessionId, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) {
      setError("No session found");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { sessionId })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setAmount(data.amount);
        setItems(data.items);
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError("Failed to initialize checkout. Please try again.");
      });
  }, [sessionId]);

  const handleSuccess = () => {
    // Clear cart and invalidate queries
    clearCart();
    queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    
    toast({
      title: "Payment Successful!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    
    setLocation('/');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Checkout Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => setLocation('/cart')} data-testid="button-back-to-cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Loading Checkout...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/cart')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Review your items before completing your purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <h3 className="font-medium" data-testid={`text-product-name-${item.productId}`}>
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ₹{parseFloat(item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="font-medium" data-testid={`text-item-total-${item.productId}`}>
                    ₹{item.itemTotal.toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 text-lg font-bold">
                <span>Total</span>
                <span data-testid="text-total-amount">₹{amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              Enter your payment details to complete your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stripePromise ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handleSuccess} amount={amount} />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Payment processing is currently unavailable. Stripe configuration is missing.
                </p>
                <Button onClick={() => setLocation('/cart')} data-testid="button-back-to-cart-stripe">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}