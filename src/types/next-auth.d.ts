// This file extends the NextAuth types
import 'next-auth';
import 'next-auth/jwt';

// Define the profile interfaces
interface FAQ {
  question: string;
  answer: string;
}

interface TravelPreference {
  accommodationType: string[];
  budget: string;
  travelStyle: string[];
  interests: string[];
  dietaryRestrictions: string[];
}

interface Profile {
  bio?: string;
  travelPreferences?: TravelPreference;
  faqs?: FAQ[];
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile?: Profile;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    profile?: Profile;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    profile?: Profile;
  }
} 