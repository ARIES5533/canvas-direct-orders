
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArtworkImageGalleryProps {
  images: string[];
  title: string;
}

const ArtworkImageGallery = ({ images, title }: ArtworkImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-2">
        <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-md p-2">
      <div className="relative aspect-[3/4] bg-white flex items-center justify-center group">
        <img 
          src={imageError[currentImageIndex] ? 'https://placehold.co/600x800?text=Image+Not+Available' : images[currentImageIndex]} 
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
          onError={() => handleImageError(currentImageIndex)}
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
              }`}
            >
              <img
                src={imageError[index] ? 'https://placehold.co/100x100?text=Error' : image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworkImageGallery;
