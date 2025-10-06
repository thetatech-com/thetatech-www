import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserX, UserCheck, X } from 'lucide-react';
import { Profile } from '@/types';

// Define a more specific type for an invitation
interface FriendInvitation {
  id: string;
  user: Profile;
}

const Friends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const fetchFriendsData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: sentRequestsData, error: sentRequestsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'pending');
      if (sentRequestsError) throw sentRequestsError;
      const sentRequestIds = sentRequestsData.map(r => r.friend_id);
      setSentRequests(sentRequestIds);

      const { data: connectionsData, error: connectionsError } = await supabase
        .from('friends')
        .select('friend:friend_id!inner(*)')
        .eq('user_id', user.id)
        .eq('status', 'accepted');
      if (connectionsError) throw connectionsError;
      const currentConnections = connectionsData.map(c => c.friend) as Profile[];
      setConnections(currentConnections);

      const { data: invitationsData, error: invitationsError } = await supabase
        .from('friends')
        .select('id, user:user_id!inner(*)')
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData as FriendInvitation[]);

      const friendIds = currentConnections.map(c => c.id);
      const invitationUserIds = invitationsData.map(i => i.user.id);
      
      const excludeIds = [...new Set([user.id, ...friendIds, ...invitationUserIds, ...sentRequestIds])];

      const { data: suggestedProfiles, error: suggestionsError } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(10);

      if (suggestionsError) throw suggestionsError;
      setSuggestions(suggestedProfiles as Profile[]);

    } catch (error: any) {
      toast({ title: 'Error fetching network data', description: error.message, variant: 'destructive' });
    }
  }, [user, toast]);

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]);

  const handleInvitation = async (invitation: FriendInvitation, accept: boolean) => {
    if (!user) return;
    if (accept) {
      // Create a bidirectional relationship
      const { error: updateError } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      const { error: insertError } = await supabase
        .from('friends')
        .insert({ user_id: user.id, friend_id: invitation.user.id, status: 'accepted' });

      if (updateError || insertError) {
        toast({ title: 'Error accepting invitation', description: updateError?.message || insertError?.message, variant: 'destructive' });
      } else {
        setInvitations(prev => prev.filter(i => i.id !== invitation.id));
        setConnections(prev => [...prev, invitation.user]);
        setSuggestions(prev => prev.filter(s => s.id !== invitation.user.id));
        toast({ title: 'Invitation accepted', description: `You are now connected with ${invitation.user.username}.` });
      }
    } else {
      // Decline the invitation
      const { error } = await supabase.from('friends').delete().eq('id', invitation.id);
      if (error) {
        toast({ title: 'Error declining invitation', description: error.message, variant: 'destructive' });
      } else {
        setInvitations(prev => prev.filter(i => i.id !== invitation.id));
        toast({ title: 'Invitation declined' });
      }
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;
    const { error } = await supabase.from('friends').insert({ user_id: user.id, friend_id: friendId, status: 'pending' });
    if (error) {
      toast({ title: 'Error sending request', description: error.message, variant: 'destructive' });
    } else {
      setSentRequests(prev => [...prev, friendId]);
      toast({ title: 'Friend request sent' });
    }
  };
  
  const handleUnfriend = async (friendId: string) => {
    if (!user) return;
    const { error } = await supabase.from('friends').delete().or(`(user_id.eq.${user.id},and(friend_id.eq.${friendId})),(user_id.eq.${friendId},and(friend_id.eq.${user.id}))`);
    if (error) {
      toast({ title: 'Error Unfriending', description: error.message, variant: 'destructive' });
    } else {
      setConnections(prev => prev.filter(c => c.id !== friendId));
      toast({ title: 'Connection removed' });
      fetchFriendsData(); // Refresh suggestions
    }
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage My Network</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle>Invitations ({invitations.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {invitations.map(invitation => (
                <div key={invitation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar><AvatarImage src={invitation.user.avatar_url} /><AvatarFallback>{invitation.user.username?.charAt(0)}</AvatarFallback></Avatar>
                    <span>{invitation.user.username} sent you a connection request.</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleInvitation(invitation, false)}>Ignore</Button>
                    <Button size="sm" onClick={() => handleInvitation(invitation, true)}>Accept</Button>
                  </div>
                </div>
              ))}
              {invitations.length === 0 && <p className="text-muted-foreground">No new invitations.</p>}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader><CardTitle>People you may know</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {suggestions.map(suggestion => (
                <Card key={suggestion.id} className="text-center p-4">
                  <div className="flex justify-end"><X className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => handleDismissSuggestion(suggestion.id)} /></div>
                  <Avatar className="mx-auto mb-2 h-16 w-16"><AvatarImage src={suggestion.avatar_url} /><AvatarFallback>{suggestion.username?.charAt(0)}</AvatarFallback></Avatar>
                  <span className="font-semibold block">{suggestion.username}</span>
                  {sentRequests.includes(suggestion.id) ? (
                      <Button variant="outline" size="sm" className="mt-2" disabled>Request Sent</Button>
                  ) : (
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => sendFriendRequest(suggestion.id)}>Connect</Button>
                  )}
                </Card>
              ))}
              {suggestions.length === 0 && <p className="text-muted-foreground col-span-full">No new suggestions right now.</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Connections ({connections.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {connections.map(connection => (
                <div key={connection.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar><AvatarImage src={connection.avatar_url} /><AvatarFallback>{connection.username?.charAt(0)}</AvatarFallback></Avatar>
                    <span className="font-semibold">{connection.username}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleUnfriend(connection.id)} className="text-destructive">
                        <UserX className="mr-2 h-4 w-4"/>Unfriend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              {connections.length === 0 && <p className="text-muted-foreground">You have no connections yet.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Friends;
