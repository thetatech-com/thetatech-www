import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'wouter';

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');

  useEffect(() => {
    // Get payment status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentStatus = urlParams.get('payment_intent_status');
    
    if (paymentIntentStatus === 'succeeded') {
      setPaymentStatus('succeeded');
    } else if (paymentIntentStatus === 'failed' || paymentIntentStatus === 'canceled') {
      setPaymentStatus('failed');
    } else {
      // Default to success if we reach this page (handles return_url redirect)
      setPaymentStatus('succeeded');
    }
  }, []);

  if (paymentStatus === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Processing Your Order...</CardTitle>
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

  if (paymentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Payment Failed
            </CardTitle>
            <CardDescription>
              There was an issue processing your payment. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your payment could not be processed. No charges have been made to your account.
            </p>
            
            <div className="flex gap-3">
              <Link href="/cart">
                <Button data-testid="button-back-to-cart">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
              
              <Link href="/marketplace">
                <Button variant="outline" data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Thank you for your purchase from MOBO NYC
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your order has been successfully processed and is now being prepared for shipment.
            </p>
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Order confirmation email sent to your registered email</li>
              <li>• Processing time: 1-2 business days</li>
              <li>• Shipping: 3-5 business days</li>
              <li>• Tracking details will be provided once shipped</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full" data-testid="button-home">
                Return to Homepage
              </Button>
            </Link>
            
            <Link href="/marketplace">
              <Button variant="outline" className="w-full" data-testid="button-shop-more">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@mobo-nyc.com" className="text-primary hover:underline">
                support@mobo-nyc.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}