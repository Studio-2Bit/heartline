import { Droplet, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">BloodConnect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting blood donors with hospitals to save lives every day.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white text-sm transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-400 hover:text-white text-sm transition">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                contact@bloodconnect.com
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                123 Health St, Medical City
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-red-600 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-red-600 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-700 p-2 rounded-lg hover:bg-red-600 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 BloodConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
