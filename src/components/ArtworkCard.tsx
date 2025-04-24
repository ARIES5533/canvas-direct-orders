
import { Artwork } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const { id, title, imageUrl, price, category, available, medium } = artwork;
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/artwork/${id}`} className="group artwork-card animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gray-100">
        <img 
          src={imageError ? 'https://placehold.co/600x800?text=Image+Not+Found' : imageUrl} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        {!available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-medium text-lg">Sold</span>
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
        <p className="font-medium mt-2">${price.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default ArtworkCard;
