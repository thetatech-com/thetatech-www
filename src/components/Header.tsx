import {
  Menu,
  Wrench,
  ShoppingBag,
  Settings,
  LogOut,
  User,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AnimatedLogo from './AnimatedLogo';

const Header = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass bg-glass backdrop-blur-glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <AnimatedLogo />
            <span className="text-xl font-bold text-foreground">TETHA</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Button asChild variant="gradient" className="h-auto">
              <Link to="/repair" className="flex items-center gap-2 px-6 py-3">
                <Wrench className="h-4 w-4" />
                Book Repair
              </Link>
            </Button>
            <Button asChild variant="store" className="h-auto">
              <Link to="/store" className="flex items-center gap-2 px-6 py-3">
                <ShoppingBag className="h-4 w-4" />
                Browse Store
              </Link>
            </Button>
            <Button asChild variant="gradient" className="h-auto">
              <Link
                to="/build-pc"
                className="flex items-center gap-2 px-6 py-3"
              >
                <Settings className="h-4 w-4" />
                Build PC
              </Link>
            </Button>
            <Button asChild variant="social" className="h-auto">
              <Link to="/social" className="flex items-center gap-2 px-6 py-3">
                <Users className="h-4 w-4" />
                TETOO
              </Link>
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/seller/dashboard">
                  <Button variant="ghost" className="hidden md:flex">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-foreground" />
                  {cart.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="gradient">
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
