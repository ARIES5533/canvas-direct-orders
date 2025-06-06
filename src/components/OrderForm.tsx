import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { MessageCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number should be at least 10 digits'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  artworkId: string;
  artworkTitle: string;
}

const OrderForm = ({ artworkId, artworkTitle }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in purchasing "${artworkTitle}".`,
    },
  });

  const sendToWhatsApp = (data: FormValues) => {
    const whatsappMessage = `Hi! I'm interested in purchasing "${artworkTitle}"\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\nMessage: ${data.message}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Opening WhatsApp",
      description: "Your message has been prepared. Just hit send in WhatsApp!",
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real application, you would send this data to a server
      console.log('Order submitted:', { ...data, artworkId });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Order inquiry submitted!",
        description: "Thank you for your interest. We'll contact you shortly.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your order couldn't be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Your message" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
          <Button 
            type="button"
            onClick={() => sendToWhatsApp(form.getValues())}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!form.formState.isValid}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send via WhatsApp
          </Button>
          
          <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Order Inquiry'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
