
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useArtwork } from "@/context/ArtworkContext";
import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkTable from "@/components/admin/ArtworkTable";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminPage = () => {
  const { artworks, addArtwork, updateArtwork, deleteArtwork } = useArtwork();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
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
    <div className="page-container max-h-screen flex flex-col">
      <AdminHeader onLogout={handleLogout} onAddArtwork={addArtwork} />
      <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-serif text-xl">Artwork Management</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-220px)]">
          <ArtworkTable
            artworks={artworks}
            onUpdate={updateArtwork}
            onDelete={deleteArtwork}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminPage;
