
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Artwork } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useArtworks = () => {
  const queryClient = useQueryClient();

  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        imageUrls: artwork.image_urls || [],
        dimensions: artwork.dimensions,
        medium: artwork.medium,
        price: artwork.price,
        currency: artwork.currency || 'USD',
        available: artwork.available,
        featured: artwork.featured,
        category: artwork.category,
        createdAt: artwork.created_at
      })) as Artwork[];
    },
  });

  const addArtworkMutation = useMutation({
    mutationFn: async (artwork: Omit<Artwork, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('artworks')
        .insert({
          title: artwork.title,
          description: artwork.description,
          image_urls: artwork.imageUrls,
          dimensions: artwork.dimensions,
          medium: artwork.medium,
          price: artwork.price,
          currency: artwork.currency,
          available: artwork.available,
          featured: artwork.featured,
          category: artwork.category
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Artwork Added',
        description: 'Your artwork has been added successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateArtworkMutation = useMutation({
    mutationFn: async ({ id, ...artwork }: { id: string } & Partial<Artwork>) => {
      const updateData: any = {};
      if (artwork.title !== undefined) updateData.title = artwork.title;
      if (artwork.description !== undefined) updateData.description = artwork.description;
      if (artwork.imageUrls !== undefined) updateData.image_urls = artwork.imageUrls;
      if (artwork.dimensions !== undefined) updateData.dimensions = artwork.dimensions;
      if (artwork.medium !== undefined) updateData.medium = artwork.medium;
      if (artwork.price !== undefined) updateData.price = artwork.price;
      if (artwork.currency !== undefined) updateData.currency = artwork.currency;
      if (artwork.available !== undefined) updateData.available = artwork.available;
      if (artwork.featured !== undefined) updateData.featured = artwork.featured;
      if (artwork.category !== undefined) updateData.category = artwork.category;

      const { data, error } = await supabase
        .from('artworks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Artwork Updated',
        description: 'Your artwork has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteArtworkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Artwork Deleted',
        description: 'Your artwork has been deleted successfully.',
        variant: 'destructive',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    artworks,
    isLoading,
    error,
    addArtwork: addArtworkMutation.mutate,
    updateArtwork: (id: string, artwork: Partial<Artwork>) => 
      updateArtworkMutation.mutate({ id, ...artwork }),
    deleteArtwork: deleteArtworkMutation.mutate,
    getArtworkById: (id: string) => artworks.find(artwork => artwork.id === id),
    getFeaturedArtworks: () => artworks.filter(artwork => artwork.featured),
  };
};
