
import React from 'react';
import { ChevronRight } from 'lucide-react';
import DestinationCard from './DestinationCard';
import Button from '../common/Button';

// Sample destination data
const destinations = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Santorini',
    location: 'Greece',
    rating: 4.8,
    price: 899,
    featured: true
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Dubai',
    location: 'United Arab Emirates',
    rating: 4.7,
    price: 1299,
    discount: 15
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Kyoto',
    location: 'Japan',
    rating: 4.9,
    price: 1099
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Cappadocia',
    location: 'Turkey',
    rating: 4.6,
    price: 799,
    discount: 10
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Maui',
    location: 'Hawaii, USA',
    rating: 4.9,
    price: 1499
  }
];

// Category data
const categories = [
  {
    name: 'Beach',
    count: '352 destinations',
    icon: '🏝️',
    color: 'bg-blue-50'
  },
  {
    name: 'Mountain',
    count: '229 destinations',
    icon: '⛰️',
    color: 'bg-green-50'
  },
  {
    name: 'City Break',
    count: '475 destinations',
    icon: '🏙️',
    color: 'bg-purple-50'
  },
  {
    name: 'Cultural',
    count: '184 destinations',
    icon: '🏛️',
    color: 'bg-orange-50'
  }
];

const PopularDestinations = () => {
  return (
    <section id="destinations-section" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
            Popular Destinations
          </div>
          <h2 className="heading-lg mb-4">Explore the World's <span className="text-orange-500">Best Destinations</span></h2>
          <p className="text-gray-600">
            Discover the most beautiful and exciting destinations around the world. From stunning beaches to majestic mountains, we have the perfect trip for you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              id={destination.id}
              image={destination.image}
              title={destination.title}
              location={destination.location}
              rating={destination.rating}
              price={destination.price}
              discount={destination.discount}
              featured={destination.featured}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            icon={<ChevronRight className="h-5 w-5" />}
            iconPosition="right"
          >
            View All Destinations
          </Button>
        </div>
        
        <div className="mt-24">
          <div className="mb-10 flex flex-wrap justify-between items-end">
            <div className="max-w-xl">
              <h3 className="heading-md mb-2">Discover by Categories</h3>
              <p className="text-gray-600">Find your perfect trip based on your preferred travel style and activities</p>
            </div>
            <Button variant="text" icon={<ChevronRight className="h-5 w-5" />} iconPosition="right">
              All Categories
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-soft p-6 transition-all duration-300 hover:shadow-hover cursor-pointer"
              >
                <div className={`rounded-full w-14 h-14 flex items-center justify-center text-2xl mb-4 ${category.color}`}>
                  <span>{category.icon}</span>
                </div>
                <h4 className="text-xl font-bold mb-1">{category.name}</h4>
                <p className="text-gray-500 text-sm">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
