
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import Comment from '@/components/Comment';
import CommentForm from '@/components/CommentForm';
import { Video } from '@/types';
import RecommendedVideos from '@/components/RecommendedVideos';

const WatchVideo = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      if (!id) return;

      // Fetch video details
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*, user:profiles(*)')
        .eq('id', id)
        .single();

      if (videoError) {
        console.error(videoError);
        toast({
          title: 'Error fetching video',
          description: videoError.message,
          variant: 'destructive',
        });
      } else {
        setVideo(videoData as unknown as Video);
      }

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*, user:profiles(*)')
        .eq('video_id', id)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error(commentsError);
        toast({
          title: 'Error fetching comments',
          description: commentsError.message,
          variant: 'destructive',
        });
      } else {
        setComments(commentsData as unknown as Comment[]);
      }
    };

    fetchVideoAndComments();
  }, [id, toast]);

  const handleCommentSubmitted = (comment: Comment) => {
    setComments([comment, ...comments]);
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <VideoPlayer videoUrl={video.video_url} />
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={video.user.avatar_url}
                  alt={video.user.full_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{video.user.full_name}</p>
                  <p className="text-muted-foreground text-sm">
                    {`${video.views} views · ${new Date(
                      video.created_at
                    ).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{video.description}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              <CommentForm videoId={video.id} onCommentSubmitted={handleCommentSubmitted} />
              <div className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <RecommendedVideos />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
