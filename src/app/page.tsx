"use client"
import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import Navbar from '../components/common/Navbar';
import PopularDestinations from '../components/home/PopularDestinations';
import TrendingTrips from '../components/home/TrendingTrips';
import Testimonials from '../components/home/Testimonials';
import Footer from '../components/common/Footer';
import { ArrowRight, Globe, Briefcase, HeartHandshake, Award } from 'lucide-react';
import Button from '../components/common/Button';
import SearchBar from '../components/ui/SearchBar';

const Index = () => {
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
      
      <Footer />
    </div>
  );
};

export default Index;
