'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Location {
  name: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
}

interface Itinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  accommodation?: string;
}

interface PriceDetail {
  amount: number;
  currency: string;
  description?: string;
  inclusions?: string[];
  exclusions?: string[];
}

interface TripFormData {
  title: string;
  description: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  locations: Location[];
  itinerary: Itinerary[];
  includedServices: string[];
  excludedServices: string[];
  price: PriceDetail;
  discount?: number;
  coverImage: string;
  gallery: string[];
  featured: boolean;
  trending: boolean;
  tags: string[];
  slug: string;
}

interface TripFormProps {
  initialData?: Partial<TripFormData>;
  tripId?: string;
  isEditing?: boolean;
}

const emptyLocation: Location = {
  name: '',
  description: '',
  coordinates: { latitude: 0, longitude: 0 },
  images: []
};

const emptyItinerary: Itinerary = {
  day: 0,
  title: '',
  description: '',
  activities: [],
  meals: {
    breakfast: false,
    lunch: false,
    dinner: false
  },
  accommodation: ''
};

const emptyTrip: TripFormData = {
  title: '',
  description: '',
  duration: 1,
  maxGroupSize: 10,
  difficulty: 'moderate',
  locations: [{ ...emptyLocation }],
  itinerary: [{ ...emptyItinerary }],
  includedServices: [],
  excludedServices: [],
  price: {
    amount: 0,
    currency: 'INR',
    description: '',
    inclusions: [],
    exclusions: []
  },
  discount: 0,
  coverImage: '',
  gallery: [],
  featured: false,
  trending: false,
  tags: [],
  slug: ''
};

const TripForm: React.FC<TripFormProps> = ({ initialData, tripId, isEditing = false }) => {
  const router = useRouter();
  const [trip, setTrip] = useState<TripFormData>(initialData ? { ...emptyTrip, ...initialData } : emptyTrip);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newIncludedService, setNewIncludedService] = useState('');
  const [newExcludedService, setNewExcludedService] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Only validate locations if there are any
    if (trip.locations.length > 0) {
      const invalidLocations = trip.locations.filter(loc => !loc.name.trim());
      if (invalidLocations.length > 0) {
        setError('If locations are added, they must have a name');
        setLoading(false);
        return;
      }
    }

    // Only validate itinerary items if there are any
    if (trip.itinerary.length > 0) {
      const invalidItinerary = trip.itinerary.filter(item => !item.title.trim() || !item.description.trim());
      if (invalidItinerary.length > 0) {
        setError('If itinerary items are added, they must have both title and description');
        setLoading(false);
        return;
      }
    }

    try {
      const url = isEditing ? `/api/trips/${tripId}` : '/api/trips';
      const method = isEditing ? 'PUT' : 'POST';

      // Ensure slug is generated from title if not already set
      const tripData = {
        ...trip,
        slug: trip.slug || trip.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'An error occurred');
      }

      router.push('/admin/trips');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTrip(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof TripFormData],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setTrip(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
        // Generate slug when title changes
        ...(name === 'title' ? {
          slug: value.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        } : {})
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTrip(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !trip.tags.includes(newTag.trim())) {
      setTrip(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    setTrip(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Add location
  const handleAddLocation = () => {
    setTrip(prev => ({
      ...prev,
      locations: [...prev.locations, { ...emptyLocation }]
    }));
  };

  // Update location
  const handleLocationChange = (index: number, field: keyof Location, value: string) => {
    setTrip(prev => {
      const updatedLocations = [...prev.locations];
      if (field === 'coordinates') {
        // Parse coordinates from string like "lat,lng"
        const [lat, lng] = value.split(',').map(Number);
        updatedLocations[index].coordinates = {
          latitude: lat || 0,
          longitude: lng || 0
        };
      } else if (field === 'images') {
        // Parse comma-separated list of images
        updatedLocations[index].images = value.split(',').map(img => img.trim());
      } else {
        (updatedLocations[index] as any)[field] = value;
      }
      return { ...prev, locations: updatedLocations };
    });
  };

  // Remove location
  const handleRemoveLocation = (index: number) => {
    setTrip(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  // Add itinerary day
  const handleAddItineraryDay = () => {
    const newDay = trip.itinerary.length + 1;
    setTrip(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { ...emptyItinerary, day: newDay }]
    }));
  };

  // Update itinerary
  const handleItineraryChange = (index: number, field: keyof Itinerary, value: any) => {
    setTrip(prev => {
      const updatedItinerary = [...prev.itinerary];
      if (field === 'activities') {
        updatedItinerary[index].activities = value.split(',').map((act: string) => act.trim());
      } else if (field === 'meals') {
        const [mealType, isIncluded] = value.split(':');
        updatedItinerary[index].meals = {
          ...updatedItinerary[index].meals,
          [mealType]: isIncluded === 'true'
        };
      } else {
        (updatedItinerary[index] as any)[field] = field === 'day' ? Number(value) : value;
      }
      return { ...prev, itinerary: updatedItinerary };
    });
  };

  // Remove itinerary day
  const handleRemoveItineraryDay = (index: number) => {
    setTrip(prev => {
      const filteredItinerary = prev.itinerary.filter((_, i) => i !== index);
      // Renumber days
      const renumberedItinerary = filteredItinerary.map((day, i) => ({
        ...day,
        day: i + 1
      }));
      return { ...prev, itinerary: renumberedItinerary };
    });
  };

  // Add included service
  const handleAddIncludedService = () => {
    if (newIncludedService.trim() && !trip.includedServices.includes(newIncludedService.trim())) {
      setTrip(prev => ({
        ...prev,
        includedServices: [...prev.includedServices, newIncludedService.trim()]
      }));
      setNewIncludedService('');
    }
  };

  // Remove included service
  const handleRemoveIncludedService = (service: string) => {
    setTrip(prev => ({
      ...prev,
      includedServices: prev.includedServices.filter(s => s !== service)
    }));
  };

  // Add excluded service
  const handleAddExcludedService = () => {
    if (newExcludedService.trim() && !trip.excludedServices.includes(newExcludedService.trim())) {
      setTrip(prev => ({
        ...prev,
        excludedServices: [...prev.excludedServices, newExcludedService.trim()]
      }));
      setNewExcludedService('');
    }
  };

  // Remove excluded service
  const handleRemoveExcludedService = (service: string) => {
    setTrip(prev => ({
      ...prev,
      excludedServices: prev.excludedServices.filter(s => s !== service)
    }));
  };

  // Handle activity addition
  const handleAddActivity = (dayIndex: number) => {
    if (newActivity.trim()) {
      setTrip(prev => {
        const updatedItinerary = [...prev.itinerary];
        updatedItinerary[dayIndex].activities = [
          ...updatedItinerary[dayIndex].activities,
          newActivity.trim()
        ];
        return { ...prev, itinerary: updatedItinerary };
      });
      setNewActivity('');
    }
  };

  // Handle activity removal
  const handleRemoveActivity = (dayIndex: number, activity: string) => {
    setTrip(prev => {
      const updatedItinerary = [...prev.itinerary];
      updatedItinerary[dayIndex].activities = updatedItinerary[dayIndex].activities.filter(
        act => act !== activity
      );
      return { ...prev, itinerary: updatedItinerary };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Trip Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={trip.title}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (days)*
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={trip.duration}
              onChange={handleChange}
              min="1"
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="maxGroupSize" className="block text-sm font-medium text-gray-700 mb-1">
              Max Group Size*
            </label>
            <input
              type="number"
              id="maxGroupSize"
              name="maxGroupSize"
              value={trip.maxGroupSize}
              onChange={handleChange}
              min="1"
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level*
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={trip.difficulty}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={trip.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price.amount" className="block text-sm font-medium text-gray-700 mb-1">
              Price Amount*
            </label>
            <input
              type="number"
              id="price.amount"
              name="price.amount"
              value={trip.price.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="price.currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency*
            </label>
            <select
              id="price.currency"
              name="price.currency"
              value={trip.price.currency}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={trip.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="price.description" className="block text-sm font-medium text-gray-700 mb-1">
              Price Description
            </label>
            <textarea
              id="price.description"
              name="price.description"
              value={trip.price.description}
              onChange={handleChange}
              rows={2}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="E.g., Per person based on double occupancy"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL*
            </label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={trip.coverImage}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Images (comma separated URLs)
            </label>
            <input
              type="text"
              id="gallery"
              name="gallery"
              value={trip.gallery.join(', ')}
              onChange={(e) => setTrip(prev => ({ ...prev, gallery: e.target.value.split(',').map(url => url.trim()) }))}
              className="w-full border-gray-300 rounded-md shadow-sm"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
        </div>
      </div>

      {/* Featured & Trending */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Display Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={trip.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured Trip (shown on homepage)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trending"
              name="trending"
              checked={trip.trending}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="trending" className="ml-2 block text-sm text-gray-700">
              Trending Trip (shown in trending section)
            </label>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Locations (Optional)</h2>
          <button
            type="button"
            onClick={handleAddLocation}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Location
          </button>
        </div>
        
        {trip.locations.length === 0 ? (
          <p className="text-gray-500 text-sm">No locations added yet. Click "Add Location" to add one.</p>
        ) : (
          <div className="space-y-4">
            {trip.locations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Location {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={location.name}
                      onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter location name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={location.description || ''}
                      onChange={(e) => handleLocationChange(index, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter location description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coordinates (latitude,longitude)
                    </label>
                    <input
                      type="text"
                      value={`${location.coordinates?.latitude || ''},${location.coordinates?.longitude || ''}`}
                      onChange={(e) => handleLocationChange(index, 'coordinates', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., 12.9716,77.5946"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Images (comma-separated URLs)
                    </label>
                    <input
                      type="text"
                      value={location.images?.join(',') || ''}
                      onChange={(e) => handleLocationChange(index, 'images', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., https://example.com/image1.jpg,https://example.com/image2.jpg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itinerary Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Itinerary (Optional)</h2>
          <button
            type="button"
            onClick={handleAddItineraryDay}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Day
          </button>
        </div>

        {trip.itinerary.length === 0 ? (
          <p className="text-gray-500 text-sm">No itinerary days added yet. Click "Add Day" to add one.</p>
        ) : (
          <div className="space-y-4">
            {trip.itinerary.map((day, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Day {day.day}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter day title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter day description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Activities (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={day.activities.join(', ')}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Morning hike, Afternoon sightseeing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Accommodation
                    </label>
                    <input
                      type="text"
                      value={day.accommodation || ''}
                      onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter accommodation details"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meals
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals?.breakfast || false}
                          onChange={(e) => handleItineraryChange(index, 'meals', `breakfast:${e.target.checked}`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Breakfast</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals?.lunch || false}
                          onChange={(e) => handleItineraryChange(index, 'meals', `lunch:${e.target.checked}`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Lunch</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals?.dinner || false}
                          onChange={(e) => handleItineraryChange(index, 'meals', `dinner:${e.target.checked}`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Dinner</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
};

export default TripForm; 