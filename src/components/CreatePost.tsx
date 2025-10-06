
import { useState, FC } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Send, Video, ShoppingBag, Image as ImageIcon, AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Post } from '@/types'
import { User } from '@supabase/supabase-js'

interface CreatePostProps {
  onPostCreated: (post: Post) => void
}

const CreatePost: FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [newPost, setNewPost] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0])
      setVideoFile(null) 
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0])
      setImageFile(null)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() && !imageFile && !videoFile) return

    setIsLoading(true)
    let imageUrl = ''
    let videoUrl = ''

    try {
      if (imageFile) {
        const fileName = `${(user as User).id}/${Date.now()}_${imageFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(uploadData.path)
        imageUrl = urlData.publicUrl
      }

      if (videoFile) {
        const fileName = `${(user as User).id}/${Date.now()}_${videoFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, videoFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(uploadData.path)
        videoUrl = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert([{ content: newPost, user_id: (user as User).id, image_url: imageUrl, video_url: videoUrl }])
        .select('*, profiles(*)')
        .single()

      if (error) throw error
      if (data) {
        onPostCreated(data as Post)
      }
      setNewPost('')
      setImageFile(null)
      setVideoFile(null)
      toast({
        title: 'Post shared!',
        description: 'Your post has been shared with the community.',
      })
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to share post. Please try again.',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="rounded-lg border-border/40 bg-card/50 p-4 backdrop-blur">
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What's happening in your tech world? Use @ to mention a user."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          {imageFile && (
            <div className="mt-2 text-sm text-muted-foreground">
              Selected image: {imageFile.name}
            </div>
          )}
          {videoFile && (
            <div className="mt-2 text-sm text-muted-foreground">
              Selected video: {videoFile.name}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImageIcon className="h-4 w-4" />
                  Image
                </label>
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Video className="h-4 w-4" />
                  Video
                </label>
              </Button>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
              />
              <Button variant="outline" size="sm" className="gap-2">
                <AtSign className="h-4 w-4" />
                Mention
              </Button>
              <Link to="/livestream">
                <Button variant="outline" size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Go Live
                </Button>
              </Link>
              <Link to="/seller/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Sell Product
                </Button>
              </Link>
            </div>
            <Button
              onClick={handleCreatePost}
              disabled={(!newPost.trim() && !imageFile && !videoFile) || isLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
