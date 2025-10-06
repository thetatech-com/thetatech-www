import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Phone, Clock, Star, CheckCircle, Search, ChevronRight, Award, Shield, 
  Smartphone, Laptop, Tablet, Headphones, Camera, Watch 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RepairServices = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    deviceType: '',
    issueDescription: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { icon: Smartphone, title: 'Mobile Phones', description: 'Screen repair, battery replacement, water damage', price: 'Starting $49' },
    { icon: Laptop, title: 'Laptops', description: 'Hardware repair, software issues, keyboard replacement', price: 'Starting $79' },
    { icon: Tablet, title: 'Tablets', description: 'Touch screen repair, charging port, software update', price: 'Starting $59' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.deviceType || !formData.issueDescription) {
      toast({ title: 'Incomplete Form', description: 'Please fill out all required fields.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('repair_requests').insert({
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        device_type: formData.deviceType,
        issue_description: formData.issueDescription,
        preferred_time: formData.preferredTime,
        status: 'pending'
      });
      if (error) throw error;
      toast({ title: 'Booking Successful', description: 'We will get back to you within 30 minutes.' });
      setFormData({ fullName: '', phone: '', email: '', deviceType: '', issueDescription: '', preferredTime: '' });
    } catch (error: any) {
      toast({ title: 'Submission Error', description: error.message, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Repair Services</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">Professional repair services for all your electronic devices</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="cursor-pointer" onClick={() => handleSelectChange('deviceType', service.title)}>
                  <CardHeader className="text-center">
                    <Icon className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p>{service.description}</p>
                    <p className="font-bold">{service.price}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Book Your Repair</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
                  <Input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
                  <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
                  <Select value={formData.deviceType} onValueChange={(value) => handleSelectChange('deviceType', value)} required>
                    <SelectTrigger><SelectValue placeholder="Select your device" /></SelectTrigger>
                    <SelectContent>
                      {services.map(s => <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Textarea name="issueDescription" placeholder="Describe the problem..." value={formData.issueDescription} onChange={handleInputChange} required />
                  <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
                    <SelectTrigger><SelectValue placeholder="Select preferred time" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9AM-12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Booking...' : 'Book Repair'}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RepairServices;