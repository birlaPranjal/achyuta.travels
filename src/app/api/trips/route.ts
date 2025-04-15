import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { adminMiddleware } from '@/middleware/adminMiddleware';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ITrip } from '@/models/Trip';

interface Location {
  name: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  meals?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  accommodation?: string;
}

// GET all trips
export async function GET() {
  try {
    await dbConnect();
    
    const trips = await Trip.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// Create a new trip (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await adminMiddleware(req);
    if (adminCheck) return adminCheck;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await dbConnect();
    
    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'duration',
      'maxGroupSize',
      'locations',
      'price',
      'coverImage'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure locations array has required name field
    if (!body.locations.every((loc: Location) => loc.name)) {
      return NextResponse.json(
        { error: 'All locations must have a name' },
        { status: 400 }
      );
    }

    // Ensure itinerary items have required fields if present
    if (body.itinerary?.length > 0) {
      const invalidItinerary = body.itinerary.some((item: ItineraryItem) => !item.title || !item.description);
      if (invalidItinerary) {
        return NextResponse.json(
          { error: 'All itinerary items must have title and description' },
          { status: 400 }
        );
      }
    }

    const trip = await Trip.create({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      _id: trip._id,
      message: 'Trip created successfully'
    });
  } catch (error: unknown) {
    console.error('Error creating trip:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create trip';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
