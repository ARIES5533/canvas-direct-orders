
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Artwork, Category } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import ArtworkImageUpload from './artwork/ArtworkImageUpload';
import ArtworkDetailsFields from './artwork/ArtworkDetailsFields';

// Create a schema for new artwork (all fields required)
const newArtworkSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrls: z.array(z.string().url('Please enter valid image URLs')).min(1, 'At least one image is required'),
  dimensions: z.string().min(2, 'Dimensions are required'),
  medium: z.string().min(2, 'Medium is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  currency: z.enum(['USD', 'NGN']),
  available: z.boolean(),
  featured: z.boolean(),
  category: z.enum(['landscape', 'portrait', 'abstract', 'still-life'] as const),
});

// Create a schema for updating artwork (all fields optional)
const updateArtworkSchema = newArtworkSchema.partial();

// Use different types based on whether we're creating or updating
type NewArtworkFormValues = z.infer<typeof newArtworkSchema>;
type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;

// Define two different types of submit handlers
type NewArtworkSubmitHandler = (data: Omit<Artwork, 'id' | 'createdAt'>) => void;
type UpdateArtworkSubmitHandler = (data: Partial<Artwork>) => void;

interface ArtworkFormProps {
  artwork?: Artwork;
  onSubmit: NewArtworkSubmitHandler | UpdateArtworkSubmitHandler;
  isLoading?: boolean;
}

const ArtworkForm = ({ artwork, onSubmit, isLoading = false }: ArtworkFormProps) => {
  const isUpdate = !!artwork;
  const formSchema = isUpdate ? updateArtworkSchema : newArtworkSchema;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: artwork?.title || '',
      description: artwork?.description || '',
      imageUrls: artwork?.imageUrls || [],
      dimensions: artwork?.dimensions || '',
      medium: artwork?.medium || '',
      price: artwork?.price || 0,
      currency: artwork?.currency || 'USD',
      available: artwork?.available ?? true,
      featured: artwork?.featured ?? false,
      category: (artwork?.category as Category) || 'landscape',
    },
  });

  const handleImageUrlsChange = (urls: string[]) => {
    form.setValue('imageUrls', urls);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ScrollArea className="h-[65vh] pr-2">
          <div className="space-y-8 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <ArtworkImageUpload
                          imageUrls={field.value}
                          onImageUrlsChange={handleImageUrlsChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sunset Serenity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="landscape">Landscape</SelectItem>
                          <SelectItem value="portrait">Portrait</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="still-life">Still Life</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="1000" min="0" />
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
              </div>

              <div>
                <ArtworkDetailsFields form={form} />
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {artwork ? 'Update Artwork' : 'Add Artwork'}
        </Button>
      </form>
    </Form>
  );
};

export default ArtworkForm;
