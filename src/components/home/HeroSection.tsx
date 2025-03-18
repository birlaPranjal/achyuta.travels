
import React, { useEffect, useRef } from 'react';
import SearchBar from '../ui/SearchBar';
import Button from '../common/Button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !contentRef.current) return;
      
      const scrollPosition = window.scrollY;
      const opacity = Math.max(1 - scrollPosition / 500, 0.5);
      const translateY = scrollPosition * 0.5;
      
      contentRef.current.style.opacity = String(opacity);
      contentRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to handle scroll to next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('destinations-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div 
      ref={heroRef}
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/50"></div>
      
      <div 
        ref={contentRef} 
        className="container mx-auto px-4 z-10 text-center pt-20 transition-all duration-200"
      >
        <div className="staggered-animation">
          <h1 className="text-white heading-xl text-shadow-lg mb-4 max-w-3xl mx-auto">
            Discover the World's Most <span className="text-orange-400">Breathtaking</span> Destinations
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 text-shadow">
            Unforgettable journeys, expertly crafted for the modern explorer.
            Find your perfect trip with Wanderlux.
          </p>
          
          <div className="max-w-5xl mx-auto mb-12">
            <SearchBar />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button variant="gradient" size="lg">
              Explore Trips
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white/60 hover:border-white hover:bg-white/10">
              Special Offers
            </Button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer z-10"
      >
        <span className="text-sm mb-2">Explore More</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </div>
  );
};

export default HeroSection;
