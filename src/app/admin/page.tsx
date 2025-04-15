import React from 'react';
import Link from 'next/link';

// Stat card component
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl text-blue-500">{icon}</div>
      </div>
    </div>
  );
};

// Action card component
const ActionCard = ({ title, description, link, linkText }: { 
  title: string; 
  description: string; 
  link: string; 
  linkText: string 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        {linkText}
      </Link>
    </div>
  );
};

export default async function AdminDashboard() {
  // Fetch counts from API
  const [tripsResponse, usersResponse] = await Promise.all([
    fetch(`${process.env.NEXTAUTH_URL}/api/trips?limit=0`, { cache: 'no-store' }),
    fetch(`${process.env.NEXTAUTH_URL}/api/admin/users?limit=0`, { cache: 'no-store' })
  ]);
  
  const tripsData = await tripsResponse.json();
  const usersData = await usersResponse.json();
  
  const tripCount = tripsData.pagination?.total || 0;
  const userCount = usersData.pagination?.total || 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Trips" value={tripCount} icon="🧳" />
        <StatCard title="Total Users" value={userCount} icon="👥" />
        <StatCard title="Featured Trips" value="0" icon="⭐" />
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard 
          title="Add New Trip" 
          description="Create a new trip with detailed information, itinerary, and pricing."
          link="/admin/trips/new"
          linkText="Create Trip"
        />
        <ActionCard 
          title="Manage Users" 
          description="View, edit user roles, or manage user accounts."
          link="/admin/users"
          linkText="View Users"
        />
        <ActionCard 
          title="View All Trips" 
          description="Browse, edit, or delete existing trips."
          link="/admin/trips"
          linkText="View Trips"
        />
      </div>
    </div>
  );
} 