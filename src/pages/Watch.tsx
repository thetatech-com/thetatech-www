import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import LeftMenu from '@/components/LeftMenu';
import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { Video } from '@/types';
import CreateChannelModal from '@/components/CreateChannelModal';
import UploadVideoModal from '@/components/UploadVideoModal';

const Watch = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [hasChannel, setHasChannel] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'diary' | 'moment' | 'short' | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*, user:profiles(*)');

      if (error) {
        console.error(error);
        toast({
          title: 'Error fetching videos',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setVideos(data as unknown as Video[]);
      }
    };

    const checkChannel = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('channels')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasChannel(true);
      }
      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
          console.error('Error checking for channel:', error);
      }
    };

    fetchVideos();
    if (user) {
        checkChannel();
    }
  }, [toast, user]);

  const handleUploadClick = (type: 'diary' | 'moment' | 'short') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <LeftMenu />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Watch</h1>
                <div className="flex gap-4">
                {user && (
                    hasChannel ? (
                        <>
                            <Button onClick={() => handleUploadClick('diary')}>Upload Diary (40s)</Button>
                            <Button onClick={() => handleUploadClick('moment')}>Upload Moment</Button>
                            <Button onClick={() => handleUploadClick('short')}>Upload Short</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsCreateChannelModalOpen(true)}>Create Channel</Button>
                    )
                )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>

        </div>
      </div>
      {user && (
          <>
            <CreateChannelModal
                isOpen={isCreateChannelModalOpen}
                onClose={() => setIsCreateChannelModalOpen(false)}
                onChannelCreated={() => {
                    setHasChannel(true);
                    setIsCreateChannelModalOpen(false);
                }}
            />
            <UploadVideoModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                uploadType={uploadType}
            />
          </>
      )}
    </div>
  );
};

export default Watch;
