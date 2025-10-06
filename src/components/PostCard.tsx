import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Play, ShoppingCart, DollarSign, CheckCircle, Video } from 'lucide-react';
import { Post } from '@/types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  handleLike: (postId: string) => void;
  currentUserId?: string;
}

const PostCard = ({ post, handleLike, currentUserId }: PostCardProps) => {
  const isLiked = post.social_likes?.some(l => l.user_id === currentUserId);

  const renderContent = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.substring(1);
        return <Link key={index} to={`/profile/${username}`} className="text-primary hover:underline">{part}</Link>;
      }
      return part;
    });
  };

  return (
    <Card className="mb-4 border-border/40 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback>{post.profiles?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{post.profiles?.full_name || 'Unknown User'}</h4>
              {post.profiles?.seller_status === 'approved' && <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3" />Verified Seller</Badge>}
              <span className="text-sm text-muted-foreground">@{post.profiles?.username || 'unknown'}</span>
              {post.is_live && <Badge variant="destructive" className="gap-1"><div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />LIVE</Badge>}
              {post.is_selling && <Badge variant="secondary" className="gap-1"><ShoppingCart className="h-3 w-3" />SELLING</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleTimeString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-3">{renderContent(post.content)}</p>
        {post.image_url && <div className="mb-3"><img src={post.image_url} alt="Post content" className="max-h-96 w-full rounded-lg object-cover" /></div>}
        {post.video_url && (
          <div className="relative mb-3">
            <video src={post.video_url} className="max-h-96 w-full rounded-lg" controls />
            {post.is_live && <div className="absolute left-2 top-2"><Badge variant="destructive" className="gap-1"><Play className="h-3 w-3" />LIVE</Badge></div>}
          </div>
        )}
        {post.is_selling && post.product_price && (
          <div className="mb-3 rounded-lg bg-primary/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">${post.product_price}</span>
              </div>
              <Button size="sm" className="gap-2"><ShoppingCart className="h-4 w-4" />Add to Cart</Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleLike(post.id)}>
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2"><MessageCircle className="h-4 w-4" />{post.comments}</Button>
          <Button variant="ghost" size="sm" className="gap-2"><Share2 className="h-4 w-4" />{post.shares}</Button>
          {post.is_live && <Button variant="ghost" size="sm" className="gap-2"><Video className="h-4 w-4" />Go Live</Button>}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
