'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, User, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type NavLinkItem = {
  name: string;
  path: string;
  hasDropdown: boolean;
  dropdownItems?: Array<{
    name: string;
    path: string;
  }>;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const navLinks: NavLinkItem[] = [
    { 
      name: 'India', 
      path: '#', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Destinations', path: '/indian-destinations' },
        { name: 'Culture', path: '/indian-culture' },
        { name: 'Cuisine', path: '/indian-cuisine' }
      ]
    },
    { 
      name: 'Itineraries', 
      path: '#', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Golden Triangle', path: '/itinerary/golden-triangle' },
        { name: 'Kerala Explorer', path: '/itinerary/kerala-explorer' }
      ]
    },
    { name: 'Deals', path: '#', hasDropdown: false },
    { name: 'Blog', path: '#', hasDropdown: false },
    { name: 'Contact', path: '#', hasDropdown: false },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-nav py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-heading font-extrabold mr-2 bg-clip-text text-transparent bg-orange-gradient">
            Wanderlux
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link, index) => (
            <div key={index} className="relative group">
              {link.path.startsWith('#') ? (
                <a 
                  href={link.path} 
                  className={cn(
                    'px-3 py-2 text-sm lg:text-base font-medium rounded-md flex items-center transition-colors',
                    isScrolled ? 'text-gray-800 hover:text-orange-500' : 'text-white hover:text-orange-300'
                  )}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </a>
              ) : (
                <Link 
                  href={link.path} 
                  className={cn(
                    'px-3 py-2 text-sm lg:text-base font-medium rounded-md flex items-center transition-colors',
                    isScrolled ? 'text-gray-800 hover:text-orange-500' : 'text-white hover:text-orange-300'
                  )}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>
              )}
              {link.hasDropdown && link.dropdownItems && (
                <div className="absolute left-0 mt-1 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2 px-3 space-y-1">
                    {link.dropdownItems.map((item, idx) => (
                      <Link 
                        key={idx}
                        href={item.path} 
                        className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-orange-50 hover:text-orange-500"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-3">
          <button className={cn(
            'p-2 rounded-full transition-colors',
            isScrolled ? 'text-gray-600 hover:text-orange-500' : 'text-white hover:text-orange-300'
          )}>
            <Search className="h-5 w-5" />
          </button>
          
          {user ? (
            <div className="relative group">
              <button className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                isScrolled ? 'text-gray-800 hover:text-orange-500' : 'text-white hover:text-orange-300'
              )}>
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || 'User'} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-500" />
                  </div>
                )}
                <span className="font-medium">{user.name?.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2 px-3 space-y-1">
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-orange-50 hover:text-orange-500"
                  >
                    My Profile
                  </Link>
                  <Link 
                    href="/bookings" 
                    className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-orange-50 hover:text-orange-500"
                  >
                    My Bookings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-gray-800' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-gray-800' : 'text-white'} />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        'md:hidden bg-white absolute w-full left-0 top-[100%] shadow-lg transform transition-transform duration-300',
        isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      )}>
        <div className="px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 border-b border-gray-100">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">India</p>
            <Link 
              href="/indian-destinations"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
            >
              Destinations
            </Link>
            <Link 
              href="/indian-culture"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
            >
              Culture
            </Link>
            <Link 
              href="/indian-cuisine"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
            >
              Cuisine
            </Link>
          </div>
          
          <div className="py-2 border-b border-gray-100">
            <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Itineraries</p>
            <Link 
              href="/itinerary/golden-triangle"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
            >
              Golden Triangle
            </Link>
            <Link 
              href="/itinerary/kerala-explorer"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
            >
              Kerala Explorer
            </Link>
          </div>
          
          <a 
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
          >
            Deals
          </a>
          <a 
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
          >
            Blog
          </a>
          <a 
            href="#"
            className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-500 rounded-md"
          >
            Contact
          </a>
          
          <div className="pt-4 border-t border-gray-200 mt-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || 'User'} 
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <Link href="/profile">
                  <Button variant="outline" fullWidth>
                    My Profile
                  </Button>
                </Link>
                
                <Button 
                  variant="text" 
                  fullWidth 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 justify-start"
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="gradient" fullWidth>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
