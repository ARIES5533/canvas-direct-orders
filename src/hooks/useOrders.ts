
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useOrders = () => {
  const createOrderMutation = useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          artwork_id: order.artworkId,
          name: order.name,
          email: order.email,
          phone: order.phone,
          message: order.message
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Order Submitted',
        description: 'Your order inquiry has been submitted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit order. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    createOrder: createOrderMutation.mutate,
    isSubmitting: createOrderMutation.isPending,
  };
};
