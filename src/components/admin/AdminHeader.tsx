
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArtworkForm from "@/components/ArtworkForm";
import { Artwork } from "@/lib/types";

interface AdminHeaderProps {
  onLogout: () => void;
  onAddArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => void;
}

const AdminHeader = ({ onLogout, onAddArtwork }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="font-serif">Admin Dashboard</h1>
      <div className="space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Artwork</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Artwork</DialogTitle>
            </DialogHeader>
            <ArtworkForm onSubmit={onAddArtwork} />
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
