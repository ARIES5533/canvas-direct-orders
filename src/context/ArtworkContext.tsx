
import React, { createContext, useContext } from 'react';
import { ArtworkContextType } from '@/lib/types';
import { useArtworks } from '@/hooks/useArtworks';

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
  const artworkHook = useArtworks();

  const value = {
    artworks: artworkHook.artworks,
    addArtwork: artworkHook.addArtwork,
    updateArtwork: artworkHook.updateArtwork,
    deleteArtwork: artworkHook.deleteArtwork,
    getArtworkById: artworkHook.getArtworkById,
    getFeaturedArtworks: artworkHook.getFeaturedArtworks,
  };

  return <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>;
};
