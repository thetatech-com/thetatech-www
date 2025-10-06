import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreatePost from '@/components/CreatePost';
import LeftMenu from '@/components/LeftMenu';
import Stories from '@/components/Stories';
import RightMenu from '@/components/RightMenu';
import PostCard from '@/components/PostCard';
import { Post, Group } from '@/types';

const Social = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [feedType, setFeedType] = useState('latest');

  const fetchPosts = useCallback(async () => {
    let query = supabase.from('social_posts').select('*, profiles(*), social_likes(*)');
    if (feedType === 'latest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('likes', { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
      toast({ title: 'Error fetching posts', description: error.message, variant: 'destructive' });
    } else {
      setPosts(data as any);
    }
  }, [feedType, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const currentlyLiked = post.social_likes.some(l => l.user_id === user.id);
    const originalLikes = post.likes;

    // Optimistic update
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + (currentlyLiked ? -1 : 1), social_likes: currentlyLiked ? p.social_likes.filter(l => l.user_id !== user.id) : [...p.social_likes, { user_id: user.id, post_id: postId }] } as any : p));

    if (currentlyLiked) {
      const { error } = await supabase.from('social_likes').delete().match({ user_id: user.id, post_id: postId });
      if (error) {
        toast({ title: 'Error unliking post', description: error.message, variant: 'destructive' });
        // Revert optimistic update
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: originalLikes, social_likes: post.social_likes } : p));
      }
    } else {
      const { error } = await supabase.from('social_likes').insert({ user_id: user.id, post_id: postId });
      if (error) {
        toast({ title: 'Error liking post', description: error.message, variant: 'destructive' });
        // Revert optimistic update
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: originalLikes, social_likes: post.social_likes } : p));
      }
    }
    // This is not great, but for now it will force a refresh of the likes count until we can get RPC calls working
    fetchPosts();

  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1"><LeftMenu /></div>
          <div className="lg:col-span-2">
            <Stories />
            {user && <CreatePost onPostCreated={handlePostCreated} />}
            <div className="my-4 flex justify-center">
              <div className="flex rounded-full bg-muted p-1 text-sm">
                <button className={`rounded-full px-4 py-1.5 ${feedType === 'latest' ? 'bg-background text-foreground' : 'text-muted-foreground'}`} onClick={() => setFeedType('latest')}>Latest</button>
                <button className={`rounded-full px-4 py-1.5 ${feedType === 'popular' ? 'bg-background text-foreground' : 'text-muted-foreground'}`} onClick={() => setFeedType('popular')}>Popular</button>
              </div>
            </div>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} handleLike={handleLike} currentUserId={user?.id} />
              ))}
            </div>
          </div>
          {user && <div className="lg:col-span-1"><RightMenu /></div>}
        </div>
      </div>
    </div>
  );
};

export default Social;
