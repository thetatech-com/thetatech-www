import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentProps {
  comment: {
    user: {
      avatar_url: string;
      username: string;
    };
    text: string;
    created_at: string;
  };
}

const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={comment.user.avatar_url} />
        <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{comment.user.username}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;
