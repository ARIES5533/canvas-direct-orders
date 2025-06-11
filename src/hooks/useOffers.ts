
import { useMutation } from '@tanstack/react-query';
import { db } from '@/lib/database';
import { Offer } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useOffers = () => {
  const createOfferMutation = useMutation({
    mutationFn: async (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
      const result = await db.query(`
        INSERT INTO offers (artwork_id, name, email, phone, offer_amount, currency, note)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        offer.artworkId,
        offer.name,
        offer.email,
        offer.phone,
        offer.offerAmount,
        offer.currency,
        offer.note
      ]);
      
      return result.rows[0];
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
