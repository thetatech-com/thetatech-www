import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: 'diary' | 'moment' | 'short' | null;
}

const UploadVideoModal = ({ isOpen, onClose, uploadType }: UploadVideoModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (uploadType === 'diary' && file.size > 40 * 1024 * 1024) { // Example: 40MB limit for 40s video
        toast({ title: 'File too large', description: 'Diary entries should be under 40s (approx 40MB).' , variant: 'destructive'});
        return;
    }
    setVideoFile(file);
  }, [uploadType, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/*': [] } });

  const handleUpload = async () => {
    if (!videoFile || !title.trim()) {
      toast({ title: 'Missing required fields', description: 'Please provide a title and a video file.', variant: 'destructive' });
      return;
    }
    if (!user) {
        toast({ title: 'You must be logged in to upload', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);

    const { error: dbError } = await supabase.from('videos').insert([{
        user_id: user.id,
        title,
        description,
        video_url: urlData.publicUrl,
        type: uploadType,
        location: uploadType === 'moment' ? location : undefined,
    }]);

    setIsLoading(false);

    if (dbError) {
        console.error('Error saving video metadata:', dbError);
        toast({ title: 'Database Error', description: dbError.message, variant: 'destructive' });
    } else {
        toast({ title: 'Upload Successful!', description: 'Your video is now live.' });
        onClose();
    }
  };

  const getTitle = () => {
      switch(uploadType) {
          case 'diary': return 'Upload a 40s Diary Entry';
          case 'moment': return 'Upload a Moment';
          case 'short': return 'Upload a Short';
          default: return 'Upload Video';
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-md text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-border'}`}>
                <input {...getInputProps()} />
                {videoFile ? <p>{videoFile.name}</p> : <p>Drag 'n' drop a video file here, or click to select one</p>}
            </div>

            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            {uploadType === 'moment' && (
                 <Input placeholder="Location (e.g., Paris, France)" value={location} onChange={(e) => setLocation(e.target.value)} />
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoModal;
