import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

// Define the travel preferences interface
interface TravelPreference {
  accommodationType: string[];
  budget: string;
  travelStyle: string[];
  interests: string[];
  dietaryRestrictions: string[];
}

// Define the profile interface
interface Profile {
  bio?: string;
  travelPreferences?: TravelPreference;
  faqs?: FAQ[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  profile?: Profile;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

// Define the FAQ schema
const FAQSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// Define the travel preferences schema
const TravelPreferenceSchema = new Schema({
  accommodationType: {
    type: [String],
    enum: ['hotel', 'hostel', 'resort', 'homestay', 'apartment', 'luxury'],
    default: [],
  },
  budget: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'ultra-luxury'],
    default: 'mid-range',
  },
  travelStyle: {
    type: [String],
    enum: ['adventure', 'cultural', 'relaxation', 'foodie', 'spiritual', 'wildlife', 'historical'],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
  dietaryRestrictions: {
    type: [String],
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none'],
    default: [],
  },
});

// Define the profile schema
const ProfileSchema = new Schema({
  bio: {
    type: String,
    maxlength: [500, 'Bio should not exceed 500 characters'],
  },
  travelPreferences: {
    type: TravelPreferenceSchema,
    default: {},
  },
  faqs: {
    type: [FAQSchema],
    default: [],
  },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password should be at least 6 characters long'],
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    profile: {
      type: ProfileSchema,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

// Prevent mongoose from creating the model multiple times during hot reloads
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 