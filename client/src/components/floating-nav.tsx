import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Home, Store, Wrench, ShoppingCart, User } from "lucide-react";

export default function FloatingNav() {
  const [location] = useLocation();
  const { cartItemCount } = useCart();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/marketplace", icon: Store },
    { name: "Repair", href: "/repairs", icon: Wrench },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartItemCount },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 floating-nav border-t border-border lg:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={`h-full w-full flex flex-col items-center justify-center relative touch-feedback ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-floating-${item.name.toLowerCase()}`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.name}</span>
                
                {item.badge && item.badge > 0 && (
                  <span 
                    className="absolute top-1 right-3 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
                    data-testid={`nav-badge-${item.name.toLowerCase()}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
