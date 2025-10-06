import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import {
  Video,
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react'

interface VideoPost {
  id: string
  user_id: string
  content: string
  video_url: string
  likes: number
  comments: number
  shares: number
  is_live?: boolean
  is_selling?: boolean
  product_price?: number
  created_at: string
  profiles?: {
    username: string
    full_name: string
    avatar_url: string
  }
}

const RecommendationFeed = () => {
  const { user } = useAuth()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [videos, setVideos] = useState<VideoPost[]>([])

  // Mock video data simulating TikTok-style content
  const mockVideos: VideoPost[] = [
    {
      id: '1',
      user_id: 'seller1',
      content:
        '🔥 LIVE: iPhone 15 Cases 50% OFF! Swipe up to buy! #iphone #deals #tech',
      video_url: '/placeholder-video.mp4',
      likes: 1234,
      comments: 89,
      shares: 45,
      is_live: true,
      is_selling: true,
      product_price: 24.99,
      created_at: '2024-01-15T10:00:00Z',
      profiles: {
        username: 'techdeals_pro',
        full_name: 'TechDeals Pro',
        avatar_url: '/placeholder-avatar.jpg',
      },
    },
    {
      id: '2',
      user_id: 'creator2',
      content:
        'Phone repair hack that saved me $200! 🔧 Try this at home #repair #diy #akoe',
      video_url: '/placeholder-video2.mp4',
      likes: 2456,
      comments: 234,
      shares: 123,
      created_at: '2024-01-15T09:30:00Z',
      profiles: {
        username: 'repair_master',
        full_name: 'Repair Master',
        avatar_url: '/placeholder-avatar.jpg',
      },
    },
    {
      id: '3',
      user_id: 'group_buyer',
      content:
        'Group buy update! 500 people joined for Galaxy cases 📱 Prices dropping fast!',
      video_url: '/placeholder-video3.mp4',
      likes: 567,
      comments: 67,
      shares: 34,
      created_at: '2024-01-15T08:45:00Z',
      profiles: {
        username: 'group_savings',
        full_name: 'Group Savings',
        avatar_url: '/placeholder-avatar.jpg',
      },
    },
  ]

  useEffect(() => {
    setVideos(mockVideos)
  }, [mockVideos])

  const handleLike = (videoId: string) => {
    setVideos(
      videos.map((video) =>
        video.id === videoId ? { ...video, likes: video.likes + 1 } : video,
      ),
    )
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const currentVideo = videos[currentVideoIndex]

  if (!currentVideo) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <Video className="mx-auto mb-4 h-16 w-16" />
          <p>Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Video Container */}
      <div className="relative h-full w-full">
        {/* Video Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          <div className="flex h-full w-full items-center justify-center bg-gray-900">
            {/* Placeholder for video */}
            <div className="text-center text-white">
              <Play className="mx-auto mb-4 h-24 w-24 opacity-50" />
              <p className="text-lg opacity-75">Video Content</p>
              <p className="text-sm opacity-50">{currentVideo.video_url}</p>
            </div>
          </div>
        </div>

        {/* Top UI */}
        <div className="absolute left-0 right-0 top-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentVideo.is_live && (
                <Badge variant="destructive" className="animate-pulse gap-1">
                  <div className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                  LIVE
                </Badge>
              )}
              <Badge variant="secondary" className="bg-black/50 text-white">
                For You
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="absolute bottom-20 left-4 right-20 z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-white">
                <AvatarImage src={currentVideo.profiles?.avatar_url} />
                <AvatarFallback>
                  {currentVideo.profiles?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">
                  @{currentVideo.profiles?.username}
                </p>
                <p className="text-sm text-white/80">
                  {currentVideo.profiles?.full_name}
                </p>
              </div>
              <Button
                size="sm"
                className="ml-auto bg-white text-black hover:bg-white/90"
              >
                Follow
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-white">
              {currentVideo.content}
            </p>

            {currentVideo.is_selling && currentVideo.product_price && (
              <div className="rounded-lg border border-white/20 bg-black/60 p-3 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-white">
                      ${currentVideo.product_price}
                    </span>
                    <span className="text-sm text-green-400">Limited Time</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute bottom-32 right-4 z-10 space-y-4">
          <div className="flex flex-col items-center space-y-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white/20"
              onClick={() => handleLike(currentVideo.id)}
            >
              <Heart className="h-6 w-6" />
            </Button>
            <span className="text-sm font-medium text-white">
              {currentVideo.likes.toLocaleString()}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white/20"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <span className="text-sm font-medium text-white">
              {currentVideo.comments}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white/20"
            >
              <Share2 className="h-6 w-6" />
            </Button>
            <span className="text-sm font-medium text-white">
              {currentVideo.shares}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationFeed
