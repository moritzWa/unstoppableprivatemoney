import mongoose from 'mongoose';
import { Bounty } from '../models/bounty';
import { Organisation } from '../models/organisation';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all collections except users
const deleteCollections = async () => {
  try {
    console.log('Starting database cleanup...');

    // Delete organisations and bounties
    await Promise.all([Organisation.deleteMany({}), Bounty.deleteMany({})]);

    console.log('Database cleanup completed successfully!');
  } catch (error: any) {
    console.error(`Error deleting collections: ${error.message}`);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the delete script
connectDB().then(() => {
  deleteCollections();
});
