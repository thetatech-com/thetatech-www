import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, ShoppingCart, DollarSign, Clock, UserPlus, Share2, Package } from 'lucide-react';
import { Profile, GroupBuy, GroupBuyParticipant } from '@/types';

const PayTogether = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState({ savings: 2456, buyers: 0, activeDeals: 0 });
  const [newGroupBuy, setNewGroupBuy] = useState({
    title: '',
    description: '',
    target_price: '',
    current_price: '',
    min_participants: '',
    product_image: '',
    end_date: '',
  });

  const fetchGroupBuys = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_buys')
        .select(`
          *,
          creator:profiles(*),
          participants:group_buy_participants(*, user:profiles(*))
        `)
        .eq('status', 'active');

      if (error) throw error;
      setGroupBuys(data as unknown as GroupBuy[]);

      // Fetch stats
      const { count: activeDeals } = await supabase.from('group_buys').select('id', { count: 'exact', head: true }).eq('status', 'active');
      const { count: buyers } = await supabase.from('group_buy_participants').select('user_id', { count: 'exact', head: true });
      setStats(prev => ({ ...prev, activeDeals: activeDeals ?? 0, buyers: buyers ?? 0 }));

    } catch (error: any) {
      toast({ title: 'Error fetching group buys', description: error.message, variant: 'destructive' });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchGroupBuys();
  }, [fetchGroupBuys]);

  const handleJoinGroupBuy = async (groupBuy: GroupBuy) => {
    if (!user) { toast({ title: 'Authentication required', description: 'You must be logged in to join a group buy.', variant: 'destructive' }); return; }
    if (groupBuy.creator.id === user.id) { toast({ title: 'You cannot join your own group buy.', variant: 'destructive' }); return; }
    
    const { error } = await supabase.from('group_buy_participants').insert({ group_buy_id: groupBuy.id, user_id: user.id });

    if (error) {
      toast({ title: 'Error joining group buy', description: error.code === '23505' ? 'You have already joined this group buy.' : error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Successfully joined!', description: `You have joined the group buy for ${groupBuy.title}.` });
      fetchGroupBuys(); // Refresh data
    }
  };

  const handleCreateGroupBuy = async () => {
    if (!user) { toast({ title: 'Authentication required', variant: 'destructive'}); return; }

    // Basic validation
    if (!newGroupBuy.title || !newGroupBuy.target_price || !newGroupBuy.min_participants || !newGroupBuy.end_date || !newGroupBuy.current_price) {
        toast({ title: 'Missing Fields', description: 'Please fill out all required fields.', variant: 'destructive' });
        return;
    }

    const { data, error } = await supabase.from('group_buys').insert({
        ...newGroupBuy,
        creator_id: user.id,
        status: 'active',
        target_price: parseFloat(newGroupBuy.target_price),
        current_price: parseFloat(newGroupBuy.current_price),
        min_participants: parseInt(newGroupBuy.min_participants, 10)
    }).select().single();

    if (error) {
      toast({ title: 'Error creating group buy', description: error.message, variant: 'destructive' });
    } else {
      // Creator auto-joins
      await supabase.from('group_buy_participants').insert({ group_buy_id: data.id, user_id: user.id });

      toast({ title: 'Group buy created!', description: 'Your new group buy is now live.' });
      setShowCreateForm(false);
      setNewGroupBuy({ title: '', description: '', target_price: '', current_price: '', min_participants: '', product_image: '', end_date: '' });
      fetchGroupBuys();
    }
  };

  const GroupBuyCard = ({ groupBuy }: { groupBuy: GroupBuy }) => {
    const currentParticipants = groupBuy.participants.length;
    const isGoalReached = currentParticipants >= groupBuy.min_participants;
    const progressPercentage = Math.min((currentParticipants / groupBuy.min_participants) * 100, 100);
    const priceReduction = (((groupBuy.current_price - groupBuy.target_price) / groupBuy.current_price) * 100).toFixed(0);
    const userHasJoined = user ? groupBuy.participants.some(p => p.user_id === user.id) : false;

    return (
      <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-lg">{groupBuy.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">{groupBuy.description}</p>
            <Button className="w-full gap-2" onClick={() => handleJoinGroupBuy(groupBuy)} disabled={userHasJoined} variant={isGoalReached ? 'default' : 'outline'}>
                {userHasJoined ? 'Already Joined' : (isGoalReached ? `Buy Now - $${groupBuy.target_price}` : 'Join Group Buy')}
            </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Pay Together</h1>
            <Button onClick={() => setShowCreateForm(true)}><Plus className="mr-2 h-4 w-4" />Create</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle>Total Savings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${stats.savings.toLocaleString()}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Active Buyers</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.buyers}</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Active Deals</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.activeDeals}</p></CardContent></Card>
        </div>

        {/* Create Form */}
        {showCreateForm && (
            <Card><CardHeader><CardTitle>Start New Group Buy</CardTitle></CardHeader><CardContent className="space-y-4">
                <Input placeholder="Title" value={newGroupBuy.title} onChange={(e) => setNewGroupBuy({...newGroupBuy, title: e.target.value})} />
                <Textarea placeholder="Description" value={newGroupBuy.description} onChange={(e) => setNewGroupBuy({...newGroupBuy, description: e.target.value})} />
                <Input type="number" placeholder="Current Price" value={newGroupBuy.current_price} onChange={(e) => setNewGroupBuy({...newGroupBuy, current_price: e.target.value})} />
                <Input type="number" placeholder="Target Price" value={newGroupBuy.target_price} onChange={(e) => setNewGroupBuy({...newGroupBuy, target_price: e.target.value})} />
                <Input type="number" placeholder="Minimum Participants" value={newGroupBuy.min_participants} onChange={(e) => setNewGroupBuy({...newGroupBuy, min_participants: e.target.value})} />
                <Input type="date" value={newGroupBuy.end_date} onChange={(e) => setNewGroupBuy({...newGroupBuy, end_date: e.target.value})} />
                <div className="flex gap-2"><Button onClick={handleCreateGroupBuy}>Create</Button><Button variant="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Button></div>
            </CardContent></Card>
        )}

        {/* Grid */}
        {isLoading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupBuys.map((gb) => <GroupBuyCard key={gb.id} groupBuy={gb} />)}
            </div>
        )}
    </div>
  )
}

export default PayTogether;
