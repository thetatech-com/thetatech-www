import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { usePWA } from "@/lib/pwa-utils";
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Download,
  Home,
  Store,
  Wrench,
  User,
  LogIn,
  LogOut,
  UserPlus
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const { canInstall, installPWA } = usePWA();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Repairs", href: "/repairs", icon: Wrench },
    { name: "Contact", href: "#contact", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden" 
                  data-testid="button-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          data-testid={`nav-mobile-${item.name.toLowerCase()}`}
                        >
                          <IconComponent className="mr-2 h-4 w-4" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/">
              <h1 className="text-xl font-bold gradient-bg bg-clip-text text-transparent cursor-pointer" data-testid="logo">
                MOBO NYC
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant="ghost"
                  className={location === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                  data-testid={`nav-desktop-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSearchOpen(!searchOpen)}
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    data-testid="cart-item-count"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2"
                    data-testid="button-user-menu"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="w-full cursor-pointer" data-testid="nav-account">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    data-testid="nav-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="button-register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Install PWA */}
            {canInstall && (
              <Button 
                size="sm"
                onClick={installPWA}
                className="hidden lg:inline-flex"
                data-testid="button-install-pwa"
              >
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-4 animate-in slide-in-from-top-2">
            <Input
              placeholder="Search products..."
              className="w-full"
              autoFocus
              onBlur={() => setSearchOpen(false)}
              data-testid="input-header-search"
            />
          </div>
        )}
      </div>
    </header>
  );
}
