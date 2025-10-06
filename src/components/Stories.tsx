import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const stories = [
  { id: 1, username: 'user1', avatar: 'https://github.com/shadcn.png' },
  { id: 2, username: 'user2', avatar: 'https://github.com/shadcn.png' },
  { id: 3, username: 'user3', avatar: 'https://github.com/shadcn.png' },
  { id: 4, username: 'user4', avatar: 'https://github.com/shadcn.png' },
  { id: 5, username: 'user5', avatar: 'https://github.com/shadcn.png' },
]

const Stories = () => {
  return (
    <Card className="mb-4 border-border/40 bg-card/50 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-dashed border-primary"
            >
              <Plus className="h-6 w-6 text-primary" />
            </Button>
            <span className="text-xs font-medium">Create Story</span>
          </div>
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={story.avatar} />
                <AvatarFallback>
                  {story.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {story.username}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Stories
