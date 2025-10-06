import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Users, Wrench, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: React.ReactNode;
}

const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').limit(10);
      if (error) console.error('Error fetching products:', error);
      else setProducts(data as Product[]);
    };
    fetchProducts();
    
    setMessages([{
      id: '1',
      text: "Hi! I'm AKOE, your electronics assistant. Ask me about our products, services, or repairs!",
      isBot: true,
      timestamp: new Date(),
    }]);
  }, []);

  const getBotResponse = useCallback((userMessage: string): Partial<Message> => {
    const message = userMessage.toLowerCase();

    if (message.includes('repair') || message.includes('service')) {
      return {
        text: "We offer professional repair services with a 6-month warranty and same-day service available. Would you like to book a repair?",
        actions: <Button onClick={() => { navigate('/repair'); setIsOpen(false); }} className="mt-2"><Wrench className="mr-2 h-4 w-4"/>Book Repair</Button>
      };
    }

    if (message.includes('pay together') || message.includes('group buy')) {
        return {
            text: "Interested in saving money with group buys? Our Pay Together feature lets you team up with others for bulk discounts!",
            actions: <Button onClick={() => { navigate('/pay-together'); setIsOpen(false); }} className="mt-2"><ShoppingCart className="mr-2 h-4 w-4"/>Explore Group Buys</Button>
        };
    }

    if (products.length > 0) {
        const mentionedProduct = products.find(p => message.includes(p.name.toLowerCase()));
        if (mentionedProduct) {
            return { text: `Ah, the ${mentionedProduct.name}! It costs $${mentionedProduct.price}. It has a rating of ${mentionedProduct.rating}/5 stars. A great choice!` };
        }
    }

    if (message.includes('price') || message.includes('cost') || message.includes('buy')) {
        return { text: `I can help with that. Which product are you interested in? We have ${products.map(p => p.name).join(', ')}.` };
    }

    return { text: "I can help with product info, repairs, and group buys. How can I assist?" };
  }, [navigate, products]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputValue, isBot: false, timestamp: new Date() };
    const botResponsePayload = getBotResponse(inputValue);
    const botMessage: Message = { id: (Date.now() + 1).toString(), text: botResponsePayload.text || '...', isBot: true, timestamp: new Date(), actions: botResponsePayload.actions };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  }, [inputValue, getBotResponse]);

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg" size="icon"><MessageCircle className="h-6 w-6" /></Button>;
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-96 flex-col shadow-xl">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">AKOE Assistant</h3>
        <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] rounded-lg p-2 text-sm ${message.isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
              {message.text}
              {message.actions}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask a question..." />
          <Button onClick={handleSendMessage} size="icon"><Send className="h-4 w-4" /></Button>
        </div>
        <Button onClick={() => { navigate('/social'); setIsOpen(false); }} variant="outline" className="mt-2 w-full"><Users className="mr-2 h-4 w-4"/>Go to Social</Button>
      </div>
    </Card>
  );
};

export default ChatBot;
