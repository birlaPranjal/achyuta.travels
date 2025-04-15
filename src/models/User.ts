import mongoose, { Schema, Document } from 'mongoose';
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
  password: string;
  image?: string;
  role: string;
  profile?: Profile;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    image: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profile: {
      bio: String,
      travelPreferences: {
        accommodationType: [String],
        budget: {
          type: String,
          default: 'mid-range',
        },
        travelStyle: [String],
        interests: [String],
        dietaryRestrictions: [String],
      },
      faqs: [{
        question: String,
        answer: String,
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error instanceof Error ? error : new Error('Failed to hash password'));
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 