import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: () => void;
}

const CreateChannelModal = ({ isOpen, onClose, onChannelCreated }: CreateChannelModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [channelName, setChannelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      toast({ title: 'Channel name cannot be empty', variant: 'destructive' });
      return;
    }
    if (!user) {
        toast({ title: 'You must be logged in to create a channel', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('channels')
      .insert([{ user_id: user.id, name: channelName }]);

    setIsLoading(false);

    if (error) {
      console.error('Error creating channel:', error);
      toast({ title: 'Error creating channel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Channel Created!', description: `Your channel "${channelName}" is now live.` });
      onChannelCreated();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Channel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="channel-name" className="text-right">
              Channel Name
            </Label>
            <Input
              id="channel-name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="col-span-3"
              placeholder="Your Channel Name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateChannel} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Channel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
