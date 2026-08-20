import mongoose from 'mongoose';
import { ENV } from './env';
import { User } from '../models/User';
import { seedDatabase } from '../seed/seed';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Database is empty. Running initial seed...');
      await seedDatabase(false);
    }
  } catch (error: any) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn(`[MongoDB] Note: Running without active MongoDB connection. Ensure MongoDB service is running.`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime error: ${err.message}`);
});
