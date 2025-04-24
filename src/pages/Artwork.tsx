
import { useParams, useNavigate } from "react-router-dom";
import { useArtwork } from "@/context/ArtworkContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import OrderForm from "@/components/OrderForm";
import { useState } from "react";

const ArtworkPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getArtworkById } = useArtwork();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  const artwork = getArtworkById(id!);
  
  if (!artwork) {
    return (
      <div className="page-container text-center py-16">
        <h1 className="font-serif">Artwork Not Found</h1>
        <p className="mt-4 text-gray-600">
          Sorry, the artwork you're looking for doesn't exist.
        </p>
        <Button 
          variant="outline" 
          className="mt-8 bg-white"
          onClick={() => navigate('/gallery')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Button 
        variant="outline" 
        className="mb-8 bg-white"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-gray-50 rounded-md p-2">
          <div className="aspect-[3/4] bg-white flex items-center justify-center">
            <img 
              src={imageError ? 'https://placehold.co/600x800?text=Image+Not+Available' : artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <h1 className="font-serif">{artwork.title}</h1>
            <Badge variant="outline" className="font-serif capitalize">
              {artwork.category}
            </Badge>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-gray-600">{artwork.description}</p>
            
            <div className="pt-4 border-t">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Medium</dt>
                  <dd className="text-gray-600">{artwork.medium}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Dimensions</dt>
                  <dd className="text-gray-600">{artwork.dimensions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Availability</dt>
                  <dd className={artwork.available ? "text-green-600" : "text-red-600"}>
                    {artwork.available ? "Available" : "Sold"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Price</dt>
                  <dd className="text-xl font-medium">${artwork.price.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
            
            <div className="pt-6">
              {artwork.available ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full font-serif">
                      Order This Artwork
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Order "{artwork.title}"</DialogTitle>
                    </DialogHeader>
                    <OrderForm artworkId={artwork.id} artworkTitle={artwork.title} />
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  size="lg"
                  className="w-full font-serif"
                  disabled
                >
                  Sold
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              * Shipping costs will be calculated after order placement. For international orders,
              additional customs fees may apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkPage;
