'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Save, Plus, Trash2, Edit, User as UserIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

// Define types for our form data
type TravelPreference = {
  accommodationType: string[];
  budget: string;
  travelStyle: string[];
  interests: string[];
  dietaryRestrictions: string[];
};

type FAQ = {
  question: string;
  answer: string;
  id: string; // For UI management
};

type ProfileFormData = {
  name: string;
  email: string;
  bio: string;
  travelPreferences: TravelPreference;
  faqs: FAQ[];
};

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    bio: '',
    travelPreferences: {
      accommodationType: [],
      budget: 'mid-range',
      travelStyle: [],
      interests: [],
      dietaryRestrictions: [],
    },
    faqs: [],
  });
  
  // Options for form selects
  const accommodationOptions = ['hotel', 'hostel', 'resort', 'homestay', 'apartment', 'luxury'];
  const budgetOptions = ['budget', 'mid-range', 'luxury', 'ultra-luxury'];
  const travelStyleOptions = ['adventure', 'cultural', 'relaxation', 'foodie', 'spiritual', 'wildlife', 'historical'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none'];
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);
  
  // Initialize form data from user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        travelPreferences: user.profile?.travelPreferences || {
          accommodationType: [],
          budget: 'mid-range',
          travelStyle: [],
          interests: [],
          dietaryRestrictions: [],
        },
        faqs: (user.profile?.faqs || []).map(faq => ({
          ...faq,
          id: Math.random().toString(36).substring(2, 9),
        })),
      });
      
      if (user.image) {
        setPreviewImage(user.image);
      }
    }
  }, [user]);
  
  // Handle image upload
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to Cloudinary
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setUploadProgress(100);
      
      // Update user data with new image URL
      await updateProfile({ image: data.url });
      
      // Reset upload state after a delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle checkbox changes for travel preferences
  const handleCheckboxChange = (category: keyof TravelPreference, value: string) => {
    setFormData(prev => {
      const currentValues = prev.travelPreferences[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        travelPreferences: {
          ...prev.travelPreferences,
          [category]: newValues,
        },
      };
    });
  };
  
  // Handle select change for budget
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        [name]: value,
      },
    }));
  };
  
  // Handle adding a new FAQ
  const handleAddFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: '',
          answer: '',
          id: Math.random().toString(36).substring(2, 9),
        },
      ],
    }));
  };
  
  // Handle removing an FAQ
  const handleRemoveFAQ = (id: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id),
    }));
  };
  
  // Handle FAQ input changes
  const handleFAQChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      ),
    }));
  };
  
  // Handle adding a new interest
  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !formData.travelPreferences.interests.includes(value)) {
        setFormData(prev => ({
          ...prev,
          travelPreferences: {
            ...prev.travelPreferences,
            interests: [...prev.travelPreferences.interests, value],
          },
        }));
        e.currentTarget.value = '';
      }
    }
  };
  
  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        interests: prev.travelPreferences.interests.filter(i => i !== interest),
      },
    }));
  };
  
  // Update profile
  const updateProfile = async (data: any = {}) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...data,
          faqs: formData.faqs.map(({ id, ...rest }) => rest), // Remove the temporary id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaveStatus('saving');
      await updateProfile();
      setSaveStatus('success');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
          
          {/* Profile header with image */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div 
                  className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={handleImageClick}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-orange-50">
                      <UserIcon className="h-16 w-16 text-orange-300" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white opacity-0 hover:opacity-100" />
                  </div>
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-4/5 bg-white rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-orange-500 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {new Date(user.id.substring(0, 8) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={cn(
                    "py-4 px-6 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'general'
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setActiveTab('general')}
                >
                  General Information
                </button>
                <button
                  className={cn(
                    "py-4 px-6 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'preferences'
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setActiveTab('preferences')}
                >
                  Travel Preferences
                </button>
                <button
                  className={cn(
                    "py-4 px-6 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'faqs'
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setActiveTab('faqs')}
                >
                  Travel FAQs
                </button>
              </nav>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {/* General Information Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us a bit about yourself and your travel experiences..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {formData.bio.length}/500 characters
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Travel Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Accommodation Preferences</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {accommodationOptions.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.travelPreferences.accommodationType.includes(option)}
                              onChange={() => handleCheckboxChange('accommodationType', option)}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Budget Range</h3>
                      <select
                        name="budget"
                        value={formData.travelPreferences.budget}
                        onChange={handleSelectChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                      >
                        {budgetOptions.map(option => (
                          <option key={option} value={option} className="capitalize">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Travel Style</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {travelStyleOptions.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.travelPreferences.travelStyle.includes(option)}
                              onChange={() => handleCheckboxChange('travelStyle', option)}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Interests</h3>
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Type an interest and press Enter"
                          onKeyDown={handleAddInterest}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.travelPreferences.interests.map(interest => (
                          <div 
                            key={interest} 
                            className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            <span>{interest}</span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-2 text-orange-400 hover:text-orange-600"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Dietary Restrictions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {dietaryOptions.map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.travelPreferences.dietaryRestrictions.includes(option)}
                              onChange={() => handleCheckboxChange('dietaryRestrictions', option)}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Your Travel FAQs</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFAQ}
                        icon={<Plus className="h-4 w-4" />}
                      >
                        Add FAQ
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.faqs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No FAQs yet. Add some to help others understand your travel needs.</p>
                        </div>
                      ) : (
                        formData.faqs.map((faq, index) => (
                          <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-sm font-medium text-gray-700">FAQ #{index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveFAQ(faq.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <label htmlFor={`question-${faq.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  id={`question-${faq.id}`}
                                  value={faq.question}
                                  onChange={(e) => handleFAQChange(faq.id, 'question', e.target.value)}
                                  placeholder="e.g., What vaccinations do I need for India?"
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor={`answer-${faq.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                  Answer
                                </label>
                                <textarea
                                  id={`answer-${faq.id}`}
                                  value={faq.answer}
                                  onChange={(e) => handleFAQChange(faq.id, 'answer', e.target.value)}
                                  placeholder="Provide a detailed answer..."
                                  rows={3}
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Form actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saveStatus === 'saving'}
                  icon={
                    saveStatus === 'saving' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : saveStatus === 'success' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )
                  }
                >
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'success' ? 'Saved!' : 
                   saveStatus === 'error' ? 'Try Again' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 