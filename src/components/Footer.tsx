
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">Je-Gadgets</h3>
            <p className="text-gray-300 mb-4">
              Nigeria's premier electronics marketplace connecting buyers and sellers across the country.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-green-400">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-green-400">Dashboard</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-green-400">Cart</Link></li>
              <li><Link to="/my-products" className="text-gray-300 hover:text-green-400">My Products</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300 hover:text-green-400 cursor-pointer">Smartphones</span></li>
              <li><span className="text-gray-300 hover:text-green-400 cursor-pointer">Laptops</span></li>
              <li><span className="text-gray-300 hover:text-green-400 cursor-pointer">Tablets</span></li>
              <li><span className="text-gray-300 hover:text-green-400 cursor-pointer">Smart TVs</span></li>
              <li><span className="text-gray-300 hover:text-green-400 cursor-pointer">Accessories</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">support@je-gadgets.ng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">+234 800 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Je-Gadgets. All rights reserved. | Made with ❤️ in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
};
