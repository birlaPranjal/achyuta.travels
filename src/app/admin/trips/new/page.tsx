'use client';

import React from 'react';
import TripForm from '@/components/admin/TripForm';

export default function NewTrip() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Trip</h1>
      <TripForm />
    </div>
  );
} 