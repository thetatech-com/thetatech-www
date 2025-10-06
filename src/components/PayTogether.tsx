import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { GroupBuy, GroupBuyParticipant } from '@/types'
import {
  Users,
  Plus,
  ShoppingCart,
  DollarSign,
  Clock,
  UserPlus,
  Share2,
  Package,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const PayTogether = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroupBuy, setNewGroupBuy] = useState({
    title: '',
    description: '',
    target_price: '',
    min_participants: '',
    product_image: '',
    end_date: '',
  })

  const fetchGroupBuys = useCallback(async () => {
    const { data, error } = await supabase
      .from('group_buys')
      .select(
        `
        *,
        creator:profiles(username, avatar_url),
        participants:group_buy_participants(*, user:profiles(username, avatar_url))
      `,
      )
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Error fetching group buys', description: error.message, variant: 'destructive' })
    } else {
      setGroupBuys(data as GroupBuy[])
    }
  }, [toast])

  useEffect(() => {
    fetchGroupBuys()
  }, [fetchGroupBuys])

  const handleJoinGroupBuy = async (groupBuyId: string) => {
    if (!user) return toast({ title: 'Authentication required', description: 'You must be logged in to join a group buy.', variant: 'destructive' })

    const { error } = await supabase.from('group_buy_participants').insert({ user_id: user.id, group_buy_id: groupBuyId })

    if (error) {
      toast({ title: 'Error joining group buy', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Successfully joined!', description: 'You are now part of this group buy.' })
      fetchGroupBuys()
    }
  }

  const handleCreateGroupBuy = async () => {
    if (!user) return toast({ title: 'Authentication required', variant: 'destructive' })

    const { error } = await supabase.from('group_buys').insert({
      ...newGroupBuy,
      creator_id: user.id,
      target_price: Number(newGroupBuy.target_price),
      min_participants: Number(newGroupBuy.min_participants),
    })

    if (error) {
      toast({ title: 'Error creating group buy', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Group buy created!', description: 'Your group buy is now live.' })
      setShowCreateForm(false)
      setNewGroupBuy({ title: '', description: '', target_price: '', min_participants: '', product_image: '', end_date: '' })
      fetchGroupBuys()
    }
  }
  
  const handleShare = (groupBuyId: string) => {
    const url = `${window.location.origin}/pay-together#${groupBuyId}`
    navigator.clipboard.writeText(url)
    toast({ title: 'Link Copied!', description: 'Group buy link copied to clipboard.' })
  }

  const GroupBuyCard = ({ groupBuy }: { groupBuy: GroupBuy }) => {
    const isGoalReached = (groupBuy.participants?.length || 0) >= groupBuy.min_participants
    const progressPercentage = Math.min(((groupBuy.participants?.length || 0) / groupBuy.min_participants) * 100, 100)
    const priceReduction = groupBuy.target_price ? (((groupBuy.current_price - groupBuy.target_price) / groupBuy.current_price) * 100).toFixed(0) : '0'

    return (
        <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg">{groupBuy.title}</CardTitle>
                    <Button variant="outline" size="icon" onClick={() => handleShare(groupBuy.id)}><Share2 className="h-4 w-4" /></Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">{groupBuy.description}</p>
                <div className="rounded-lg bg-primary/5 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-primary">${isGoalReached ? groupBuy.target_price : groupBuy.current_price}</span>
                            {!isGoalReached && <span className="ml-2 text-sm text-muted-foreground line-through">${groupBuy.current_price}</span>}
                        </div>
                        <Badge variant="secondary" className="text-green-600">-{priceReduction}%</Badge>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{groupBuy.participants?.length || 0} / {groupBuy.min_participants} people</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted"><div className={`h-2 rounded-full ${isGoalReached ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${progressPercentage}%` }}/></div>
                </div>
                <Button className="w-full gap-2" onClick={() => handleJoinGroupBuy(groupBuy.id)} disabled={!user || groupBuy.participants.some(p => p.user_id === user?.id)}>
                    {groupBuy.participants.some(p => p.user_id === user?.id) ? 'Already Joined' : (isGoalReached ? 'Buy Now' : 'Join Group Buy')}
                </Button>
            </CardContent>
        </Card>
    )
}


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">Pay Together</h1>
          <p className="text-muted-foreground">Join group purchases to get better prices on tech products</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2"><Plus className="h-4 w-4" />Start Group Buy</Button>
      </div>

      {showCreateForm && (
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader><CardTitle>Start a New Group Buy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Product Title" value={newGroupBuy.title} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, title: e.target.value })} />
            <Textarea placeholder="Description" value={newGroupBuy.description} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, description: e.target.value })} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input type="number" placeholder="Target Price" value={newGroupBuy.target_price} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, target_price: e.target.value })} />
                <Input type="number" placeholder="Min Participants" value={newGroupBuy.min_participants} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, min_participants: e.target.value })} />
            </div>
            <Input placeholder="Product Image URL" value={newGroupBuy.product_image} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, product_image: e.target.value })} />
            <Input type="datetime-local" placeholder="End Date" value={newGroupBuy.end_date} onChange={(e) => setNewGroupBuy({ ...newGroupBuy, end_date: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={handleCreateGroupBuy}>Create Group Buy</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupBuys.map((groupBuy) => <GroupBuyCard key={groupBuy.id} groupBuy={groupBuy} />)}
      </div>
    </div>
  )
}

export default PayTogether
