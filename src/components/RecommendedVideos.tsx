import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Video } from '@/types';
import { Link } from 'react-router-dom';

const RecommendedVideos = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*, user:profiles(*)')
        .limit(5); // Limit to 5 recommended videos

      if (error) {
        console.error(error);
        toast({
          title: 'Error fetching recommended videos',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setVideos(data as unknown as Video[]);
      }
    };

    fetchVideos();
  }, [toast]);

  return (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">Recommended Videos</h2>
        {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4">
                <Link to={`/watch/${video.id}`}>
                    <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded-lg"
                    />
                </Link>
                <div>
                    <h3 className="font-semibold leading-tight">
                        <Link to={`/watch/${video.id}`}>{video.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {video.user.full_name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {`${video.views} views`}
                    </p>
                </div>
            </div>
        ))}
    </div>
  );
};

export default RecommendedVideos;
