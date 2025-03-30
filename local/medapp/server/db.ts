import mongoose from 'mongoose';

// MongoDB connection URL with fallback
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/smart_hospital';

// MongoDB connection options
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Create a singleton instance of the database connection
class Database {
  private static instance: Database;
  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Connect to MongoDB
  async connect(): Promise<void> {
    try {
      await mongoose.connect(DATABASE_URL, {
        ...mongooseOptions,
        w: 'majority' as const
      });
      console.log('MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected successfully');
      });

    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Properly close the connection when the application shuts down
  async close(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }

  // Get the mongoose connection instance
  get connection() {
    return mongoose.connection;
  }
}

// Export a singleton instance
export const db = Database.getInstance();