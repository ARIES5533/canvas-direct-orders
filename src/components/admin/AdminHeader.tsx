
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArtworkForm from "@/components/ArtworkForm";
import { Artwork } from "@/lib/types";
import { useState } from "react";

interface AdminHeaderProps {
  onLogout: () => void;
  onAddArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => void;
}

const AdminHeader = ({ onLogout, onAddArtwork }: AdminHeaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddArtwork = (artwork: Omit<Artwork, 'id' | 'createdAt'>) => {
    onAddArtwork(artwork);
    setDialogOpen(false);
  };
  
  return (
    <div className="flex justify-between items-center mb-8 p-4">
      <h1 className="font-serif text-2xl">Admin Dashboard</h1>
      <div className="space-x-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Artwork</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Artwork</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new artwork to your gallery.
              </DialogDescription>
            </DialogHeader>
            <ArtworkForm onSubmit={handleAddArtwork} />
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={onLogout} className="bg-white">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
