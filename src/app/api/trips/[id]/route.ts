import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { adminMiddleware } from '@/middleware/adminMiddleware';

// GET a single trip by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    const trip = await Trip.findById(id)
      .populate('createdBy', 'name image')
      .populate('updatedBy', 'name image');
    
    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the trip' },
      { status: 500 }
    );
  }
}

// UPDATE a trip (admin only)
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
    const updateData = await req.json();
    
    // Get admin id from token
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
    
    // Add updatedBy field with admin ID
    updateData.updatedBy = token.id;
    
    const trip = await Trip.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Trip updated successfully', trip },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the trip' },
      { status: 500 }
    );
  }
}

// DELETE a trip (admin only)
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
    const trip = await Trip.findByIdAndDelete(id);
    
    if (!trip) {
      return NextResponse.json(
        { message: 'Trip not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Trip deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the trip' },
      { status: 500 }
    );
  }
} 