
import { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { Category } from "@/lib/types";
import ArtworkFilter from "@/components/ArtworkFilter";
import ArtworkCard from "@/components/ArtworkCard";

const GalleryPage = () => {
  const { artworks } = useArtwork();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  
  const filteredArtworks = selectedCategory === 'all' 
    ? artworks
    : artworks.filter(artwork => artwork.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="font-serif">Art Gallery</h1>
        <p className="mt-4 text-gray-600">
          Browse through the collection of original artworks. Each piece is unique and created with passion.
        </p>
      </div>
      
      <ArtworkFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {filteredArtworks.length > 0 ? (
        <div className="artwork-grid">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No artworks found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
