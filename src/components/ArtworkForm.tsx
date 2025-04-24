
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Artwork, Category } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Image, Upload } from 'lucide-react';

// Create a schema for new artwork (all fields required)
const newArtworkSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  dimensions: z.string().min(2, 'Dimensions are required'),
  medium: z.string().min(2, 'Medium is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(artwork?.imageUrl || null);
  const [fileUploadUrl, setFileUploadUrl] = useState<string>('');
  
  // Determine if this is an update or creation form
  const isUpdate = !!artwork;
  
  // Use the appropriate schema based on whether we're creating or updating
  const formSchema = isUpdate ? updateArtworkSchema : newArtworkSchema;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: artwork?.title || '',
      description: artwork?.description || '',
      imageUrl: artwork?.imageUrl || '',
      dimensions: artwork?.dimensions || '',
      medium: artwork?.medium || '',
      price: artwork?.price || 0,
      available: artwork?.available ?? true,
      featured: artwork?.featured ?? false,
      category: (artwork?.category as Category) || 'landscape',
    },
  });

  // Effect to validate and update preview when imageUrl changes
  useEffect(() => {
    const imageUrl = form.watch('imageUrl');
    if (imageUrl && imageUrl !== previewUrl) {
      // Check if it's a valid URL before setting preview
      try {
        new URL(imageUrl);
        const img = new Image();
        img.onload = () => setPreviewUrl(imageUrl);
        img.onerror = () => console.error('Failed to load image');
        img.src = imageUrl;
      } catch (e) {
        console.log('Invalid URL format');
      }
    }
  }, [form.watch('imageUrl'), previewUrl]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    // Preview is now handled by the useEffect
  };
  
  // Helper function to handle image upload
  const simulateFileUpload = () => {
    if (fileUploadUrl) {
      try {
        // Validate URL
        new URL(fileUploadUrl);
        form.setValue('imageUrl', fileUploadUrl);
        // Preview will be updated by the useEffect
        setFileUploadUrl('');
      } catch (e) {
        console.error('Invalid URL format');
        form.setError('imageUrl', { 
          type: 'manual', 
          message: 'Please enter a valid image URL' 
        });
      }
    }
  };

  const handleFormSubmit = (data: any) => {
    if (isUpdate) {
      // For updates, pass data as is (partial)
      (onSubmit as UpdateArtworkSubmitHandler)(data);
    } else {
      // For new artwork, ensure all required fields are present
      (onSubmit as NewArtworkSubmitHandler)(data as Omit<Artwork, 'id' | 'createdAt'>);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 overflow-y-auto max-h-[70vh] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Image Preview */}
            <div className="mb-6">
              <div className="border rounded-md p-4 bg-gray-50">
                {previewUrl ? (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Handle image load errors
                        console.error('Image failed to load');
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x800?text=Image+Not+Found';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-md">
                    <Image className="w-12 h-12 text-gray-400" />
                    <span className="sr-only">Image preview</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Upload Option */}
            <div className="mb-6">
              <FormLabel>Quick Image Upload</FormLabel>
              <div className="flex mt-2">
                <Input 
                  placeholder="Paste image URL here" 
                  value={fileUploadUrl}
                  onChange={(e) => setFileUploadUrl(e.target.value)}
                  className="flex-1 mr-2"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={simulateFileUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <FormDescription className="text-xs mt-1">
                Enter an image URL and click Upload to preview
              </FormDescription>
            </div>
            
            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input 
                        {...field}
                        placeholder="https://example.com/image.jpg" 
                        onChange={handleImageUrlChange} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Enter a valid URL for your artwork image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Title */}
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
            
            {/* Category */}
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
          </div>
          
          <div className="space-y-6">
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe your artwork..." 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Medium */}
            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Oil on canvas" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Dimensions */}
            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='24" x 36"' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              {/* Available */}
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                      <FormDescription className="text-xs">
                        Mark as available for purchase
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription className="text-xs">
                        Show on homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {artwork ? 'Update Artwork' : 'Add Artwork'}
        </Button>
      </form>
    </Form>
  );
};

export default ArtworkForm;
