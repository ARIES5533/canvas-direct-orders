
import { ImageIcon, Upload } from 'lucide-react';
import { FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';

interface ArtworkImagePreviewProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

const ArtworkImagePreview = ({ imageUrl, onImageUrlChange }: ArtworkImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);
  const [fileUploadUrl, setFileUploadUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageUrl && imageUrl !== previewUrl) {
      try {
        if (imageUrl.startsWith('http') || imageUrl.startsWith('https') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
          const img = new globalThis.Image();
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      onImageUrlChange(objectUrl);
      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded successfully"
      });
    }
  };

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
        <FormLabel>Upload Image from Device</FormLabel>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image from Device
          </Button>
        </div>
        <FormDescription className="text-xs mt-1">
          Select an image file from your device (max 5MB)
        </FormDescription>
      </div>

      <div className="mb-6">
        <FormLabel>Or Add Image URL</FormLabel>
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
            Add URL
          </Button>
        </div>
        <FormDescription className="text-xs mt-1">
          Enter an image URL and click Add URL to preview
        </FormDescription>
      </div>
    </div>
  );
};

export default ArtworkImagePreview;
