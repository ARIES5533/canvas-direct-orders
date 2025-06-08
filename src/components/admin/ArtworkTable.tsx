
import { Artwork } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ArtworkActions from "./ArtworkActions";
import { useState } from "react";

interface ArtworkTableProps {
  artworks: Artwork[];
  onUpdate: (id: string, artwork: Partial<Artwork>) => void;
  onDelete: (id: string) => void;
}

const ArtworkTable = ({ artworks, onUpdate, onDelete }: ArtworkTableProps) => {
  // Track image loading errors
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (artworkId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [artworkId]: true
    }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artworks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No artworks found. Add your first artwork to get started.
              </TableCell>
            </TableRow>
          ) : (
            artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell>
                  <div className="h-16 w-16 bg-gray-100 overflow-hidden">
                    <img
                      src={imageErrors[artwork.id] ? 'https://placehold.co/600x800?text=No+Image' : artwork.imageUrls[0] || 'https://placehold.co/600x800?text=No+Image'}
                      alt={artwork.title}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(artwork.id)}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{artwork.title}</TableCell>
                <TableCell className="capitalize">{artwork.category}</TableCell>
                <TableCell>${artwork.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={artwork.available ? "outline" : "secondary"}>
                    {artwork.available ? "Available" : "Sold"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {artwork.featured ? (
                    <Badge variant="default">Featured</Badge>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ArtworkActions
                    artwork={artwork}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ArtworkTable;
