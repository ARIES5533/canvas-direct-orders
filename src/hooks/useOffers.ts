
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Offer } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useOffers = () => {
  const createOfferMutation = useMutation({
    mutationFn: async (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          artwork_id: offer.artworkId,
          name: offer.name,
          email: offer.email,
          phone: offer.phone,
          offer_amount: offer.offerAmount,
          currency: offer.currency,
          note: offer.note
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Offer Submitted',
        description: 'Your offer has been submitted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit offer. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    createOffer: createOfferMutation.mutate,
    isSubmitting: createOfferMutation.isPending,
  };
};
