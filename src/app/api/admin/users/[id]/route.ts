import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/middleware/adminMiddleware';

// GET a single user by ID (admin only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await adminMiddleware(req);
    if (adminCheck) return adminCheck;
    
    await dbConnect();
    
    const id = params.id;
    const user = await User.findById(id, { password: 0 }); // Exclude password
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the user' },
      { status: 500 }
    );
  }
}

// UPDATE a user (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await adminMiddleware(req);
    if (adminCheck) return adminCheck;
    
    await dbConnect();
    
    const id = params.id;
    const { role } = await req.json();
    
    // Find the user and update role
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'User role updated successfully', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the user role' },
      { status: 500 }
    );
  }
}

// DELETE a user (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await adminMiddleware(req);
    if (adminCheck) return adminCheck;
    
    await dbConnect();
    
    const id = params.id;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the user' },
      { status: 500 }
    );
  }
} 