
import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Art Gallery</h3>
            <p className="text-gray-600 max-w-xs">
              Featuring original paintings and commissioned artwork from a passionate artist.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-medium mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@artgallery.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Art Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
