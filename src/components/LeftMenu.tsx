import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { User, Users, Flag, Bookmark } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const LeftMenu = () => {
  const { user } = useAuth()

  const menuItems = [
    { to: user ? `/profile/${user.id}` : '/auth', icon: <User className="h-5 w-5" />, label: 'Profile' },
    { to: '/friends', icon: <Users className="h-5 w-5" />, label: 'Friends' },
    { to: '/pages', icon: <Flag className="h-5 w-5" />, label: 'Pages' },
    { to: '/saved', icon: <Bookmark className="h-5 w-5" />, label: 'Saved' },
  ]

  return (
    <Card className="sticky top-20 border-border/40 bg-card/50 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {user && (
              <Link to={`/profile/${user.id}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2"
                >
                  <Avatar className="h-8 w-8">
                    {/* Placeholder for user avatar */}
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  </Avatar>
                  <span className="font-semibold">Your Profile</span>
                </Button>
              </Link>
            )}
            {menuItems.map((item) => (
              <Link key={item.label} to={item.to}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-2"
                >
                  <div className="rounded-full bg-muted p-2">{item.icon}</div>
                  <span className="font-semibold">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LeftMenu
