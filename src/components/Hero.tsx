
import { useArtwork } from '@/context/ArtworkContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { getFeaturedArtworks } = useArtwork();
  const featuredArtworks = getFeaturedArtworks();
  const heroArtwork = featuredArtworks[0];

  return (
    <section className="relative overflow-hidden bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="px-6 py-12 md:py-24 md:px-12 lg:px-16 order-2 md:order-1">
            <h1 className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl tracking-tight animate-fade-in">
              Original Art for Your Space
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-md animate-fade-in">
              Discover unique paintings created with passion and bring the beauty of art into your home or office.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in">
              <Button asChild size="lg" className="font-serif">
                <Link to="/gallery">Explore Gallery</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-serif bg-white">
                <Link to="/contact">Request Commission</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[50vh] md:h-[70vh] w-full order-1 md:order-2">
            {heroArtwork ? (
              <img 
                src={heroArtwork.imageUrl} 
                alt={heroArtwork.title} 
                className="object-cover object-center h-full w-full animate-fade-in"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center animate-fade-in">
                <p className="text-gray-500">Featured artwork coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
