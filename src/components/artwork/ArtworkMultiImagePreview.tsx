
import { ImageIcon, Upload, X, Plus } from 'lucide-react';
import { FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';

interface ArtworkMultiImagePreviewProps {
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
}

const ArtworkMultiImagePreview = ({ imageUrls, onImageUrlsChange }: ArtworkMultiImagePreviewProps) => {
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: `${file.name} is not an image file`,
            variant: "destructive"
          });
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: `${file.name} is larger than 5MB`,
            variant: "destructive"
          });
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const newUrls = validFiles.map(file => URL.createObjectURL(file));
        onImageUrlsChange([...imageUrls, ...newUrls]);
        toast({
          title: "Images Uploaded",
          description: `${validFiles.length} image(s) uploaded successfully`
        });
      }
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl) {
      try {
        if (newImageUrl.startsWith('http') || newImageUrl.startsWith('https')) {
          onImageUrlsChange([...imageUrls, newImageUrl]);
          setNewImageUrl('');
          toast({
            title: "Image URL Added",
            description: "Image URL has been added successfully"
          });
        } else {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid image URL starting with http:// or https://",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImageUrlsChange(newUrls);
    toast({
      title: "Image Removed",
      description: "Image has been removed from the artwork"
    });
  };

  return (
    <div>
      <div className="mb-6">
        <FormLabel className="text-base font-medium">Artwork Images</FormLabel>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 border">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x400?text=Image+Not+Found';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {imageUrls.length < 5 && (
            <div className="aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
              </div>
            </div>
          )}
        </div>
        {imageUrls.length === 0 && (
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500">No images uploaded</span>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <FormLabel>Upload Images from Device</FormLabel>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={imageUrls.length >= 5}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Images from Device
          </Button>
        </div>
        <FormDescription className="text-xs mt-1">
          Select up to 5 image files from your device (max 5MB each)
        </FormDescription>
      </div>

      <div className="mb-6">
        <FormLabel>Or Add Image URL</FormLabel>
        <div className="flex mt-2">
          <Input 
            placeholder="Paste image URL here" 
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 mr-2"
            disabled={imageUrls.length >= 5}
          />
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleAddImageUrl}
            disabled={imageUrls.length >= 5}
          >
            Add URL
          </Button>
        </div>
        <FormDescription className="text-xs mt-1">
          Enter an image URL and click Add URL to add it ({imageUrls.length}/5 images)
        </FormDescription>
      </div>
    </div>
  );
};

export default ArtworkMultiImagePreview;
