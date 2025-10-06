import {
  MessageSquare,
  Bell,
  Home,
  PlaySquare,
  Users,
  Gamepad2,
  Smartphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const SocialHeader = () => {
  const { user } = useAuth()
  const location = useLocation()

  const navLinks = [
    { to: '/social', icon: <Home className="h-6 w-6" />, label: 'Home' },
    { to: '/watch', icon: <PlaySquare className="h-6 w-6" />, label: 'Watch' },
    { to: '/groups', icon: <Users className="h-6 w-6" />, label: 'Groups' },
    { to: '/gaming', icon: <Gamepad2 className="h-6 w-6" />, label: 'Gaming' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass bg-glass backdrop-blur-glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-xl font-bold text-transparent">
              AKOE
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                <Button
                  variant={
                    location.pathname === link.to ? 'secondary' : 'ghost'
                  }
                  size="icon"
                  className="h-12 w-24 flex-col"
                >
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/messages">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MessageSquare className="h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-6 w-6" />
                  </Button>
                </Link>
                <Link to={`/profile/${user.id}`}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {/* Placeholder for user avatar */}
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  </Button>
                </Link>
              </div>
            ) : (
              <Button asChild variant="gradient">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SocialHeader
