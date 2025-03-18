
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Emma Wilson',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: "My trip to Japan was absolutely flawless. The attention to detail from Wanderlux was exceptional. Every hotel, every tour guide, and every experience was carefully selected. I couldn't have asked for a better vacation!",
    trip: 'Japan Cultural Tour'
  },
  {
    id: 2,
    name: 'James Rodriguez',
    location: 'Toronto, Canada',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: "The safari adventure exceeded all my expectations. Our guide was incredibly knowledgeable, and we were able to see the Big Five! The luxury tented camps were a perfect balance of comfort and authentic experience.",
    trip: 'Tanzania Safari Adventure'
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    rating: 4,
    text: "Island hopping in Greece was a dream come true. The personalized itinerary allowed us to experience both popular spots and hidden gems. Our family created memories that will last a lifetime!",
    trip: 'Greek Islands Explorer'
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };
  
  return (
    <section className="section-padding bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="heading-lg mb-4">What Our <span className="text-orange-500">Travelers</span> Say</h2>
            <p className="text-gray-600 mb-8">
              Real experiences from real travelers. Hear what people have to say about their unforgettable journeys with Wanderlux.
            </p>
            
            <div className="relative mt-12">
              <div className="absolute -top-10 -left-6 text-orange-500/20">
                <Quote className="h-24 w-24" />
              </div>
              
              <div className="relative z-10 glass-card p-8 md:p-10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < testimonials[activeIndex].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl text-gray-800 italic mb-6">
                  "{testimonials[activeIndex].text}"
                </blockquote>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonials[activeIndex].name}</div>
                      <div className="text-sm text-gray-500">{testimonials[activeIndex].location}</div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-right">
                    <div className="text-sm text-gray-500">Trip:</div>
                    <div className="font-medium text-orange-500">{testimonials[activeIndex].trip}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6 justify-end">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 bg-white rounded-full shadow-soft hover:shadow-hover flex items-center justify-center transition-all duration-300 border border-gray-100"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 bg-orange-500 text-white rounded-full shadow-soft hover:shadow-hover flex items-center justify-center transition-all duration-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative z-10 transform translate-x-12 translate-y-8 rotate-6 animate-float">
              <img 
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Travel experience"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="absolute top-20 -left-4 z-20 transform -rotate-3 animate-float" style={{ animationDelay: '0.5s' }}>
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Travel experience"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="absolute bottom-0 right-0 z-0 transform -rotate-6 animate-float" style={{ animationDelay: '1s' }}>
              <img 
                src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Travel experience"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
