export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dimensions: string;
  medium: string;
  price: number;
  available: boolean;
  featured: boolean;
  category: string;
  createdAt: string;
}

export interface Order {
  id: string;
  artworkId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export type Category = 'landscape' | 'portrait' | 'abstract' | 'still-life';

export interface ArtworkContextType {
  artworks: Artwork[];
  addArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => void;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  getArtworkById: (id: string) => Artwork | undefined;
  getFeaturedArtworks: () => Artwork[];
}
