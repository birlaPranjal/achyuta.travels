import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function adminMiddleware(req: NextRequest) {
  try {
    // Get the session token to verify the user
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user by ID
    const userId = token.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // If user is admin, continue to the route handler
    return null;
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { message: 'An error occurred while verifying admin status' },
      { status: 500 }
    );
  }
} 