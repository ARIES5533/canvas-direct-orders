
import { Artwork } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';
import { useState } from 'react';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const { id, title, imageUrls, price, currency, category, available, medium } = artwork;
  const [imageError, setImageError] = useState(false);
  const primaryImage = imageUrls[0] || '';

  return (
    <Link to={`/artwork/${id}`} className="group artwork-card animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
        <img 
          src={imageError ? 'https://placehold.co/600x800?text=Image+Not+Found' : primaryImage} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        {!available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-lg">Sold</span>
          </div>
        )}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            +{imageUrls.length - 1} more
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-start justify-between">
          <h3 className="font-serif font-medium text-lg">{title}</h3>
          <Badge variant="outline" className="font-serif capitalize">
            {category}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mt-1">{medium}</p>
        <p className="font-medium mt-2">{formatPrice(price, currency)}</p>
      </div>
    </Link>
  );
};

export default ArtworkCard;
