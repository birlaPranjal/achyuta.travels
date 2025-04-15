import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/route';

// Admin sidebar component
const AdminSidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/admin" 
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/trips" 
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Manage Trips
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/users" 
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link 
              href="/" 
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Back to Site
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin');
  }
  
  // Check if user has admin role
  if (session.user?.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
} 