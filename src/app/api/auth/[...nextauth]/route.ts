import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { Document, Types } from 'mongoose';

// Define a type that includes _id for the MongoDB document
type UserDocument = Document & {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  role: string;
  profile?: {
    bio?: string;
    travelPreferences?: {
      accommodationType: string[];
      budget: string;
      travelStyle: string[];
      interests: string[];
      dietaryRestrictions: string[];
    };
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email }).exec();
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        // Type assertion to access the comparePassword method
        const userWithMethods = user as unknown as IUser;
        const isPasswordValid = await userWithMethods.comparePassword(credentials.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        // Type assertion for MongoDB document
        const userDoc = user as unknown as UserDocument;
        
        return {
          id: userDoc._id.toString(),
          name: userDoc.name,
          email: userDoc.email,
          image: userDoc.image,
          role: userDoc.role,
          profile: userDoc.profile,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle Google login
      if (account?.provider === 'google' && user?.email) {
        try {
          await dbConnect();
          
          // Check if user already exists
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            // Create a new user if they don't exist
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              role: 'user', // Set default role for new users
            });
          }
          
          // Ensure user has a role
          if (!dbUser.role) {
            dbUser.role = 'user';
            await dbUser.save();
          }
          
          // Copy the database role to the user object
          user.role = dbUser.role;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profile = user.profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profile = token.profile;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 