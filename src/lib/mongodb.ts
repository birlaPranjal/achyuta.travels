import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://birlapranjal460:Z4Y9t8i55R5UWiR@egniter.0ocfq.mongodb.net/?retryWrites=true&w=majority&appName=egniter';

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

export default dbConnect;
