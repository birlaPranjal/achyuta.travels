
import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

const SearchBar = ({ className, variant = 'default' }: SearchBarProps) => {
  const [destination, setDestination] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [travelers, setTravelers] = useState('');
  
  const isMinimal = variant === 'minimal';
  
  return (
    <div className={cn(
      'rounded-2xl z-10',
      isMinimal ? 'bg-white shadow-soft p-2' : 'glass-card p-4 md:p-6',
      className
    )}>
      <div className={cn(
        'grid gap-4',
        isMinimal ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      )}>
        <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
          <MapPin className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <label htmlFor="destination" className="block text-xs text-gray-500 mb-1">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-transparent border-none p-0 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
        </div>
        
        <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
          <Calendar className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <label htmlFor="date-range" className="block text-xs text-gray-500 mb-1">
              Date
            </label>
            <input
              id="date-range"
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Add dates"
              className="w-full bg-transparent border-none p-0 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
        </div>
        
        <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
          <Users className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <label htmlFor="travelers" className="block text-xs text-gray-500 mb-1">
              Travelers
            </label>
            <input
              id="travelers"
              type="text"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="Add guests"
              className="w-full bg-transparent border-none p-0 text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
        </div>
        
        <Button
          variant="gradient"
          fullWidth
          className={cn(
            'h-full flex items-center justify-center',
            isMinimal ? 'rounded-xl' : 'rounded-xl'
          )}
          icon={<Search className="h-5 w-5" />}
        >
          Search
        </Button>
      </div>
      
      {!isMinimal && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors">
            Popular
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors">
            Adventure
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors">
            Beach
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors">
            Mountains
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors">
            City Breaks
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
