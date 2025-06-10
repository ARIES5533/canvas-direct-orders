
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, DollarSign } from 'lucide-react';
import { useOffers } from '@/hooks/useOffers';
import { getCurrencySymbol } from '@/lib/currency';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number should be at least 10 digits'),
  offerAmount: z.coerce.number().positive('Offer amount must be positive'),
  currency: z.enum(['USD', 'NGN']),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MakeOfferFormProps {
  artworkId: string;
  artworkTitle: string;
  artworkPrice: number;
  artworkCurrency: 'USD' | 'NGN';
}

const MakeOfferForm = ({ artworkId, artworkTitle, artworkPrice, artworkCurrency }: MakeOfferFormProps) => {
  const { createOffer, isSubmitting } = useOffers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      offerAmount: 0,
      currency: artworkCurrency,
      note: '',
    },
  });

  const sendToWhatsApp = (data: FormValues) => {
    const currencySymbol = getCurrencySymbol(data.currency);
    const whatsappMessage = `Hi! I'd like to make an offer for "${artworkTitle}"\n\nMy Offer: ${currencySymbol}${data.offerAmount.toLocaleString()}\nListed Price: ${getCurrencySymbol(artworkCurrency)}${artworkPrice.toLocaleString()}\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.note ? `Note: ${data.note}` : ''}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    // Replace with your actual WhatsApp number (include country code without + or spaces)
    const phoneNumber = "1234567890"; // Example: "1234567890" for US number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const onSubmit = async (data: FormValues) => {
    createOffer({
      artworkId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      offerAmount: data.offerAmount,
      currency: data.currency,
      note: data.note,
    });
    
    form.reset();
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="offerAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Offer</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="0" 
                    min="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Tell the artist why you love this piece or explain your offer..." 
                  rows={3} 
                />
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
            Send Offer via WhatsApp
          </Button>
          
          <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>
            <DollarSign className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MakeOfferForm;
