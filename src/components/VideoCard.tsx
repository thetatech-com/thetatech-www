
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  channel_name: string;
  views: number;
  created_at: string;
  user: {
    avatar_url: string;
  };
}

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <Card className="overflow-hidden">
      <Link to={`/watch/${video.id}`}>
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={video.user.avatar_url} />
            <AvatarFallback>{video.channel_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg leading-tight">
              <Link to={`/watch/${video.id}`}>{video.title}</Link>
            </h3>
            <p className="text-muted-foreground text-sm">
              {video.channel_name}
            </p>
            <p className="text-muted-foreground text-sm">
              {`${video.views} views · ${new Date(
                video.created_at
              ).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
