
import { Link } from "react-router-dom";
import { useArtwork } from "@/context/ArtworkContext";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import ArtworkCard from "@/components/ArtworkCard";

const HomePage = () => {
  const { getFeaturedArtworks, artworks } = useArtwork();
  const featuredArtworks = getFeaturedArtworks();

  return (
    <div>
      <Hero />
      
      <section className="page-container py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl">Featured Artworks</h2>
          <p className="mt-4 text-gray-600">
            Discover highlighted pieces from the collection, each one created with passion and attention to detail.
          </p>
        </div>
        
        <div className="artwork-grid">
          {featuredArtworks.slice(0, 3).map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="font-serif bg-white">
            <Link to="/gallery">View All Artworks</Link>
          </Button>
        </div>
      </section>
      
      <section className="bg-gray-50 py-16">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Commission a Custom Piece</h2>
              <p className="mt-4 text-gray-600">
                Looking for something special? Request a custom artwork that perfectly suits your space and preferences.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                  <span>Discuss your ideas and vision</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                  <span>Receive sketches and concept proposals</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                  <span>Get regular updates during the creation process</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-black mr-2"></span>
                  <span>Receive your unique, custom artwork</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild className="font-serif">
                  <Link to="/contact">Request Commission</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96 rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f"
                alt="Artist working on a painting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
