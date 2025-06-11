
import { useMutation } from '@tanstack/react-query';
import { db } from '@/lib/database';
import { Order } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useOrders = () => {
  const createOrderMutation = useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'createdAt'>) => {
      const result = await db.query(`
        INSERT INTO orders (artwork_id, name, email, phone, message)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [
        order.artworkId,
        order.name,
        order.email,
        order.phone,
        order.message
      ]);
      
      return result.rows[0];
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
