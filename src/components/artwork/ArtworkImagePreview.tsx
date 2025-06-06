
import { Image as ImageIcon } from 'lucide-react';
import { FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface ArtworkImagePreviewProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

const ArtworkImagePreview = ({ imageUrl, onImageUrlChange }: ArtworkImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const [fileUploadUrl, setFileUploadUrl] = useState<string>('');

  useEffect(() => {
    if (imageUrl && imageUrl !== previewUrl) {
      try {
        if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
          const img = new Image();
          img.onload = () => setPreviewUrl(imageUrl);
          img.onerror = () => {
            console.error('Failed to load image');
            toast({
              title: "Image Error",
              description: "Failed to load image from the provided URL",
              variant: "destructive"
            });
          };
          img.src = imageUrl;
        }
      } catch (e) {
        console.log('Invalid URL format');
      }
    }
  }, [imageUrl, previewUrl]);

  const handleQuickUpload = () => {
    if (fileUploadUrl) {
      try {
        if (fileUploadUrl.startsWith('http') || fileUploadUrl.startsWith('https')) {
          onImageUrlChange(fileUploadUrl);
          setFileUploadUrl('');
          toast({
            title: "Image URL Added",
            description: "Image URL has been added to the form"
          });
        } else {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        console.error('Invalid URL format');
        toast({
          title: "Invalid URL",
          description: "Please enter a valid image URL starting with http:// or https://",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="border rounded-md p-4 bg-gray-50">
          {previewUrl ? (
            <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x800?text=Image+Not+Found';
                }}
              />
            </div>
          ) : (
            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-md">
              <ImageIcon className="w-12 h-12 text-gray-400" />
              <span className="sr-only">Image preview</span>
            </div>
          )}
        </div>
      </div>

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
            onClick={handleQuickUpload}
          >
            Upload
          </Button>
        </div>
        <FormDescription className="text-xs mt-1">
          Enter an image URL and click Upload to preview
        </FormDescription>
      </div>
    </div>
  );
};

export default ArtworkImagePreview;
