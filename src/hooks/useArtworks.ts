
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/database';
import { Artwork } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useArtworks = () => {
  const queryClient = useQueryClient();

  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const result = await db.query(`
        SELECT id, title, description, image_urls, dimensions, medium, 
               price, currency, available, featured, category, created_at
        FROM artworks 
        ORDER BY created_at DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        imageUrls: row.image_urls || [],
        dimensions: row.dimensions,
        medium: row.medium,
        price: parseFloat(row.price),
        currency: row.currency || 'USD',
        available: row.available,
        featured: row.featured,
        category: row.category,
        createdAt: row.created_at
      })) as Artwork[];
    },
  });

  const addArtworkMutation = useMutation({
    mutationFn: async (artwork: Omit<Artwork, 'id' | 'createdAt'>) => {
      const result = await db.query(`
        INSERT INTO artworks (title, description, image_urls, dimensions, medium, price, currency, available, featured, category)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        artwork.title,
        artwork.description,
        artwork.imageUrls,
        artwork.dimensions,
        artwork.medium,
        artwork.price,
        artwork.currency,
        artwork.available,
        artwork.featured,
        artwork.category
      ]);
      
      return result.rows[0];
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
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (artwork.title !== undefined) {
        updates.push(`title = $${paramIndex++}`);
        values.push(artwork.title);
      }
      if (artwork.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(artwork.description);
      }
      if (artwork.imageUrls !== undefined) {
        updates.push(`image_urls = $${paramIndex++}`);
        values.push(artwork.imageUrls);
      }
      if (artwork.dimensions !== undefined) {
        updates.push(`dimensions = $${paramIndex++}`);
        values.push(artwork.dimensions);
      }
      if (artwork.medium !== undefined) {
        updates.push(`medium = $${paramIndex++}`);
        values.push(artwork.medium);
      }
      if (artwork.price !== undefined) {
        updates.push(`price = $${paramIndex++}`);
        values.push(artwork.price);
      }
      if (artwork.currency !== undefined) {
        updates.push(`currency = $${paramIndex++}`);
        values.push(artwork.currency);
      }
      if (artwork.available !== undefined) {
        updates.push(`available = $${paramIndex++}`);
        values.push(artwork.available);
      }
      if (artwork.featured !== undefined) {
        updates.push(`featured = $${paramIndex++}`);
        values.push(artwork.featured);
      }
      if (artwork.category !== undefined) {
        updates.push(`category = $${paramIndex++}`);
        values.push(artwork.category);
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await db.query(`
        UPDATE artworks 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);
      
      return result.rows[0];
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
      await db.query('DELETE FROM artworks WHERE id = $1', [id]);
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
