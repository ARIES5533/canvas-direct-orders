
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Artwork, ArtworkContextType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

// Sample data
const sampleArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Sunset Serenity',
    description: 'A peaceful landscape capturing the golden hues of sunset over a serene lake.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    dimensions: '24" x 36"',
    medium: 'Oil on canvas',
    price: 950,
    available: true,
    featured: true,
    category: 'landscape',
    createdAt: '2023-08-15T12:00:00Z'
  },
  {
    id: '2',
    title: 'Abstract Dreams',
    description: 'Vibrant colors and fluid forms create a dreamlike atmosphere in this abstract piece.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    dimensions: '30" x 40"',
    medium: 'Acrylic on canvas',
    price: 1200,
    available: true,
    featured: true,
    category: 'abstract',
    createdAt: '2023-09-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Portrait of Solitude',
    description: 'A contemplative portrait exploring themes of solitude and introspection.',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
    dimensions: '18" x 24"',
    medium: 'Oil on canvas',
    price: 800,
    available: true,
    featured: false,
    category: 'portrait',
    createdAt: '2023-10-05T09:45:00Z'
  },
  {
    id: '4',
    title: 'Spring Blooms',
    description: 'A vibrant still life featuring spring flowers in full bloom.',
    imageUrl: 'https://images.unsplash.com/photo-1464982326199-86f32f81b211',
    dimensions: '16" x 20"',
    medium: 'Watercolor',
    price: 650,
    available: true,
    featured: false,
    category: 'still-life',
    createdAt: '2023-11-12T16:20:00Z'
  },
  {
    id: '5',
    title: 'Mountain Majesty',
    description: 'Majestic mountains shrouded in morning mist, capturing the grandeur of nature.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    dimensions: '36" x 48"',
    medium: 'Oil on canvas',
    price: 1400,
    available: true,
    featured: true,
    category: 'landscape',
    createdAt: '2024-01-08T11:15:00Z'
  },
  {
    id: '6',
    title: 'Urban Rhythms',
    description: 'An abstract interpretation of city life, with dynamic patterns and energetic colors.',
    imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7',
    dimensions: '24" x 30"',
    medium: 'Mixed media on canvas',
    price: 1100,
    available: true,
    featured: false,
    category: 'abstract',
    createdAt: '2024-02-22T13:40:00Z'
  }
];

// Create the context
const ArtworkContext = createContext<ArtworkContextType | null>(null);

export const useArtwork = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error('useArtwork must be used within an ArtworkProvider');
  }
  return context;
};

export const ArtworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Load sample data on initial render
  useEffect(() => {
    const storedArtworks = localStorage.getItem('artworks');
    if (storedArtworks) {
      setArtworks(JSON.parse(storedArtworks));
    } else {
      setArtworks(sampleArtworks);
      localStorage.setItem('artworks', JSON.stringify(sampleArtworks));
    }
  }, []);

  // Save to localStorage whenever artworks change
  useEffect(() => {
    if (artworks.length > 0) {
      localStorage.setItem('artworks', JSON.stringify(artworks));
    }
  }, [artworks]);

  const addArtwork = (artwork: Omit<Artwork, 'id' | 'createdAt'>) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setArtworks([...artworks, newArtwork]);
    toast({
      title: 'Artwork Added',
      description: `"${newArtwork.title}" has been added to your gallery.`,
    });
  };

  const updateArtwork = (id: string, updatedArtwork: Partial<Artwork>) => {
    setArtworks(
      artworks.map((artwork) => 
        artwork.id === id ? { ...artwork, ...updatedArtwork } : artwork
      )
    );
    
    toast({
      title: 'Artwork Updated',
      description: `"${updatedArtwork.title || 'Artwork'}" has been updated.`,
    });
  };

  const deleteArtwork = (id: string) => {
    const artworkToDelete = artworks.find(artwork => artwork.id === id);
    setArtworks(artworks.filter((artwork) => artwork.id !== id));
    
    toast({
      title: 'Artwork Deleted',
      description: `"${artworkToDelete?.title || 'Artwork'}" has been removed.`,
      variant: 'destructive',
    });
  };

  const getArtworkById = (id: string) => {
    return artworks.find((artwork) => artwork.id === id);
  };

  const getFeaturedArtworks = () => {
    return artworks.filter((artwork) => artwork.featured);
  };

  const value = {
    artworks,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworkById,
    getFeaturedArtworks,
  };

  return <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>;
};
