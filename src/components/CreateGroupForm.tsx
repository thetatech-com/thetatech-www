import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const CreateGroupForm = ({ onGroupCreated }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateGroup = async () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Group name and description are required.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('social_groups')
        .insert([
          { name, description, is_public: isPublic, creator_id: user.id },
        ])
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Group Created!',
        description: 'Your new group has been created.',
      })
      onGroupCreated(data)
      setName('')
      setDescription('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create group. Please try again.',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Create a New Group</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Group Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="is-public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <label htmlFor="is-public">Public Group</label>
        </div>
        <Button onClick={handleCreateGroup} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default CreateGroupForm
