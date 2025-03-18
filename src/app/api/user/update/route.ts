import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';


export async function PUT(req: NextRequest) {
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

    const { name, email, image, bio, travelPreferences, faqs } = await req.json();

    // Find the user by ID
    const userId = token.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image;
    
    // Update or create profile fields
    if (!user.profile) {
      user.profile = {};
    }
    
    if (bio) user.profile.bio = bio;
    if (travelPreferences) user.profile.travelPreferences = travelPreferences;
    if (faqs) user.profile.faqs = faqs;

    await user.save();

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          profile: user.profile
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the profile' },
      { status: 500 }
    );
  }
} 