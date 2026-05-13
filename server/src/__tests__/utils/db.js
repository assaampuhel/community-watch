import mongoose from 'mongoose';

// Connect to test database before all tests
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/envision-test';
  await mongoose.connect(mongoUri);
};

// Clear database after each test
export const clearDB = async () => {
  await mongoose.connection.dropDatabase();
};

// Close database connection after all tests
export const closeDB = async () => {
  await mongoose.connection.close();
};
