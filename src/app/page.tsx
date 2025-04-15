"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import HeroSection from '../components/home/HeroSection';
import Navbar from '../components/common/Navbar';
import PopularDestinations from '../components/home/PopularDestinations';
import TrendingTrips from '../components/home/TrendingTrips';
import Testimonials from '../components/home/Testimonials';
import Footer from '../components/common/Footer';
import { ArrowRight, Globe, Briefcase, HeartHandshake, Award, Search, MapPin, Calendar, Users, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import SearchBar from '../components/ui/SearchBar';
import Image from 'next/image';

type Trip = {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  images: string[];
  itinerary: string[];
  included: string[];
  excluded: string[];
};

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const categories: Category[] = [
  {
    id: 'adventure',
    name: 'Adventure Trips',
    icon: '🏔️',
    description: 'Thrilling experiences for adrenaline seekers'
  },
  {
    id: 'cultural',
    name: 'Cultural Tours',
    icon: '🏛️',
    description: 'Immerse yourself in local traditions and heritage'
  },
  {
    id: 'nature',
    name: 'Nature & Wildlife',
    icon: '🌿',
    description: 'Explore pristine landscapes and diverse wildlife'
  },
  {
    id: 'beach',
    name: 'Beach Getaways',
    icon: '🏖️',
    description: 'Relax and unwind by the sea'
  }
];

const HomePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) throw new Error('Failed to fetch trips');
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trips. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesCategory = selectedCategory === 'all' || trip.category === selectedCategory;
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookNow = (tripId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to book a trip.',
        variant: 'destructive',
      });
      router.push('/auth/signin');
      return;
    }
    router.push(`/trips/${tripId}/checkout`);
  };

  // Apply scroll animations
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (elementPosition.top < windowHeight * 0.8) {
          element.classList.add('animate-slide-up');
          element.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      
      <PopularDestinations />
      
      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </div>
            <h2 className="heading-lg mb-4">Travel with <span className="text-orange-500">Confidence</span> and Style</h2>
            <p className="text-gray-600">
              We&apos;re committed to creating exceptional travel experiences that combine luxury, adventure, and authenticity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-soft scroll-animate opacity-0">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Expertise</h3>
              <p className="text-gray-600">
                Our team of seasoned travel experts brings deep knowledge of destinations worldwide.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-soft scroll-animate opacity-0">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tailored Experiences</h3>
              <p className="text-gray-600">
                Every itinerary is crafted to match your preferences, interests, and travel style.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-soft scroll-animate opacity-0">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Enjoy peace of mind with our dedicated support team available around the clock.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-soft scroll-animate opacity-0">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                We promise competitive pricing without compromising on quality or experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <TrendingTrips />
      
      {/* Newsletter Section */}
      <section className="py-20 bg-cover bg-center relative">
        <div className="absolute inset-0 bg-orange-500 opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center', 
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Travel Community
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Subscribe to our newsletter and get exclusive deals, travel tips, and inspiration delivered to your inbox.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-5 py-3 rounded-full text-gray-700 focus:outline-none"
              />
              <Button variant="gradient" className="shadow-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Ready to Start Your Next Adventure?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                From pristine beaches to majestic mountains, vibrant cities to serene countryside, 
                we have the perfect destination waiting for you.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="gradient"
                  className="bg-white text-orange-500 hover:shadow-lg"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Plan Your Trip
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  Contact an Expert
                </Button>
              </div>
            </div>
            
            <div className="lg:pl-10 scroll-animate opacity-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Find Your Perfect Trip</h3>
                <SearchBar variant="minimal" className="bg-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all ${
                  selectedCategory === category.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Trips</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip) => (
                <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={trip.images[0] || '/placeholder.jpg'}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{trip.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Max {trip.maxParticipants}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        ${trip.price}
                      </div>
                      <button
                        onClick={() => handleBookNow(trip._id)}
                        className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
