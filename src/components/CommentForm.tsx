import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [text, setText] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  if (!user) {
    return <p>Please log in to comment.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button type="submit" className="self-end">
        Comment
      </Button>
    </form>
  );
};

export default CommentForm;
