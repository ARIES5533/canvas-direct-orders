
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useArtwork } from "@/context/ArtworkContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import ArtworkForm from "@/components/ArtworkForm";
import { Artwork } from "@/lib/types";

const AdminPage = () => {
  const { artworks, addArtwork, updateArtwork, deleteArtwork } = useArtwork();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication (this is just a simple demo)
  useEffect(() => {
    const admin = localStorage.getItem('adminAuthenticated');
    if (admin === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="bg-white">
          Logout
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-serif text-xl">Artwork Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Artwork</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Artwork</DialogTitle>
              </DialogHeader>
              <ArtworkForm onSubmit={addArtwork} />
            </DialogContent>
          </Dialog>
        </div>
        
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
                      <div className="h-16 w-16 bg-gray-100">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{artwork.title}</TableCell>
                    <TableCell className="capitalize">{artwork.category}</TableCell>
                    <TableCell>${artwork.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={artwork.available ? "outline" : "secondary"}
                      >
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
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white"
                            onClick={() => setSelectedArtwork(artwork)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle>Edit Artwork</DialogTitle>
                          </DialogHeader>
                          {selectedArtwork && (
                            <ArtworkForm
                              artwork={selectedArtwork}
                              onSubmit={(data) =>
                                updateArtwork(selectedArtwork.id, data)
                              }
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{artwork.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteArtwork(artwork.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
