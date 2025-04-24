
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="page-container py-16 text-center">
      <h1 className="font-serif text-6xl">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Oops! The page you're looking for cannot be found.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Return to Gallery</Link>
      </Button>
    </div>
  );
};

export default NotFound;
