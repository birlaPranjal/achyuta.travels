
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../common/Button';

const trips = [
  {
    id: '1',
    title: 'Magical Northern Lights Tour',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Iceland',
    duration: '7 days',
    groupSize: '10 people',
    price: 2499,
    discount: 2899,
    rating: 4.9,
    reviews: 128,
    tag: 'Trending'
  },
  {
    id: '2',
    title: 'Ancient Temples of Southeast Asia',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Cambodia & Thailand',
    duration: '10 days',
    groupSize: '12 people',
    price: 1899,
    discount: 2299,
    rating: 4.7,
    reviews: 94,
    tag: 'Best Seller'
  },
  {
    id: '3',
    title: 'Safari Adventure in the Serengeti',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Tanzania',
    duration: '8 days',
    groupSize: '8 people',
    price: 3299,
    discount: 3899,
    rating: 4.8,
    reviews: 76,
    tag: 'Most Popular'
  },
  {
    id: '4',
    title: 'Mediterranean Coastal Cruise',
    image: 'https://images.unsplash.com/photo-1534445967719-8ae7b972eae9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    location: 'Italy & Greece',
    duration: '12 days',
    groupSize: '24 people',
    price: 2799,
    discount: 3499,
    rating: 4.6,
    reviews: 115,
    tag: 'Luxury'
  }
];

const TrendingTrips = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Trending Now
            </div>
            <h2 className="heading-lg mb-4">Unlock <span className="text-orange-500">Unforgettable</span> Adventures</h2>
            <p className="text-gray-600">
              Curated trips designed by travel experts to create memories that will last a lifetime. Explore our most sought-after experiences.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft}
              className="bg-white shadow-soft hover:shadow-hover w-12 h-12 rounded-full flex items-center justify-center border border-gray-100 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button 
              onClick={scrollRight}
              className="bg-orange-500 text-white shadow-soft hover:shadow-hover w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {trips.map((trip) => (
            <div 
              key={trip.id} 
              className="min-w-[300px] md:min-w-[380px] flex-shrink-0 snap-start"
            >
              <div className="bg-white rounded-xl shadow-card overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-hover">
                <div className="relative">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={trip.image} 
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <div className="bg-orange-gradient text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {trip.tag}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center text-white mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{trip.location}</span>
                    </div>
                    <h3 className="text-xl text-white font-bold">{trip.title}</h3>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="text-sm">{trip.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1 text-orange-500" />
                        <span className="text-sm">{trip.groupSize}</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 text-orange-600 rounded-full px-2 py-1 text-xs font-medium">
                      {trip.rating} ({trip.reviews})
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Starting from</span>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">${trip.price}</span>
                        {trip.discount && (
                          <span className="ml-2 text-sm text-gray-500 line-through">${trip.discount}</span>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTrips;
