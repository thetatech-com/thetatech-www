import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const contacts = [
  {
    id: 1,
    name: 'Alice',
    avatar: 'https://github.com/shadcn.png',
    online: true,
  },
  {
    id: 2,
    name: 'Bob',
    avatar: 'https://github.com/shadcn.png',
    online: false,
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: 'https://github.com/shadcn.png',
    online: true,
  },
]

const groupConversations = [
  { id: 1, name: 'Gaming Group', unread: 3 },
  { id: 2, name: 'Work Project', unread: 0 },
  { id: 3, name: 'Family Chat', unread: 1 },
]

const RightMenu = () => {
  return (
    <Card className="sticky top-20 border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <h2 className="font-semibold">Contacts</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{contact.name}</p>
            </div>
            {contact.online && (
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            )}
          </div>
        ))}
      </CardContent>

      <CardHeader>
        <h2 className="font-semibold">Group Conversations</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {groupConversations.map((group) => (
          <div key={group.id} className="flex items-center justify-between">
            <p className="font-medium">{group.name}</p>
            {group.unread > 0 && (
              <Badge variant="destructive">{group.unread}</Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RightMenu
