import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-heading font-extrabold mr-2 bg-clip-text text-transparent bg-orange-gradient">
                Wanderlux
              </span>
            </div>
            
            <p className="text-gray-400 mb-6">
              Unforgettable journeys begin with perfect planning. 
              Let us create your dream vacation experience.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faqs" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Travel Insurance
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  1234 Travel Way, Suite 500<br />
                  Adventure City, AC 98765
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@wanderlux.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-800 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Wanderlux. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-orange-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-orange-400 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-orange-400 transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
