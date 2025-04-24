
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useArtwork } from "@/context/ArtworkContext";
import AdminHeader from "@/components/admin/AdminHeader";
import ArtworkTable from "@/components/admin/ArtworkTable";

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
    <div className="page-container">
      <AdminHeader onLogout={handleLogout} onAddArtwork={addArtwork} />
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-serif text-xl">Artwork Management</h2>
        </div>
        <ArtworkTable
          artworks={artworks}
          onUpdate={updateArtwork}
          onDelete={deleteArtwork}
        />
      </div>
    </div>
  );
};

export default AdminPage;
