import mongoose, { Schema, Document, Model } from 'mongoose';

interface Location {
  name: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
}

interface Itinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  accommodation?: string;
}

interface PriceDetail {
  amount: number;
  currency: string;
  description?: string;
  inclusions?: string[];
  exclusions?: string[];
}

export interface ITrip extends Document {
  title: string;
  slug: string;
  description: string;
  duration: number;
  startDate?: Date;
  endDate?: Date;
  maxGroupSize: number;
  difficulty: string;
  locations: Location[];
  itinerary: Itinerary[];
  includedServices: string[];
  excludedServices: string[];
  price: PriceDetail;
  discount?: number;
  coverImage: string;
  gallery: string[];
  featured: boolean;
  trending: boolean;
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  images: [String],
});

const ItinerarySchema = new Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activities: {
    type: [String],
    default: [],
  },
  meals: {
    breakfast: {
      type: Boolean,
      default: false,
    },
    lunch: {
      type: Boolean,
      default: false,
    },
    dinner: {
      type: Boolean,
      default: false,
    },
  },
  accommodation: String,
});

const PriceDetailSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  description: String,
  inclusions: [String],
  exclusions: [String],
});

const TripSchema = new Schema<ITrip>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a trip description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide trip duration'],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'difficult'],
      default: 'moderate',
    },
    locations: {
      type: [LocationSchema],
      required: true,
    },
    itinerary: {
      type: [ItinerarySchema],
      default: [],
    },
    includedServices: {
      type: [String],
      default: [],
    },
    excludedServices: {
      type: [String],
      default: [],
    },
    price: {
      type: PriceDetailSchema,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
TripSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default Trip; 