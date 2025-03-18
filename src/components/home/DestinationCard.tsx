
import React, { useRef, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  rating: number;
  price: number;
  discount?: number;
  featured?: boolean;
  className?: string;
}

const DestinationCard = ({
  id,
  image,
  title,
  location,
  rating,
  price,
  discount,
  featured = false,
  className,
}: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const moveX = 15 - x * 30;
    const moveY = 15 - y * 30;
    
    const imageEl = cardRef.current.querySelector('.card-image') as HTMLElement;
    if (imageEl) {
      imageEl.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
    }
  };
  
  const resetStyles = () => {
    if (!cardRef.current) return;
    
    const imageEl = cardRef.current.querySelector('.card-image') as HTMLElement;
    if (imageEl) {
      imageEl.style.transform = 'translateX(0) translateY(0)';
    }
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div
      ref={cardRef}
      className={cn(
        'group rounded-xl overflow-hidden shadow-card transition-all duration-500 bg-white',
        'transform hover:-translate-y-2 hover:shadow-lg',
        featured ? 'md:col-span-2 lg:col-span-2' : '',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetStyles();
      }}
    >
      <a href="#" className="block h-full">
        <div className="relative overflow-hidden aspect-[16/10]">
          <div
            className="card-image absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out transform group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <button
            onClick={toggleFavorite}
            className={cn(
              'absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md transition-all duration-300',
              isFavorite ? 'text-red-500' : 'text-white'
            )}
          >
            <Heart className={cn('h-5 w-5', isFavorite ? 'fill-current' : '')} />
          </button>
          
          {discount && (
            <div className="absolute top-4 left-4 bg-orange-gradient text-white text-sm font-medium px-3 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-white/80 text-sm">{location}</p>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-lg font-bold text-orange-500">${price}</span>
              <span className="text-sm text-gray-500">/ person</span>
            </div>
            
            <div className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-300',
              'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              featured ? 'bg-orange-gradient text-white' : 'bg-orange-100 text-orange-600'
            )}>
              Explore Now
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default DestinationCard;
