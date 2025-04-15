import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/middleware/adminMiddleware';

// GET all users (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await adminMiddleware(req);
    if (adminCheck) return adminCheck;
    
    await dbConnect();
    
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    const role = url.searchParams.get('role');
    
    // Build query based on parameters
    const query: Record<string, any> = {};
    if (role) query.role = role;
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    
    // Get users with pagination
    const users = await User.find(query, {
      password: 0 // Exclude password field
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        pageSize: limit,
        totalPages: Math.ceil(totalUsers / limit),
        hasMore: page * limit < totalUsers,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
} 