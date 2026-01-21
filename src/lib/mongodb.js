import mongoose from "mongoose";

// Read MongoDB connection string from environment variables
// This keeps sensitive data out of the source code
const MONGODB_URI = process.env.MONGODB_URI;

// If the connection string is missing, stop the app with a clear error
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Use a global cache to prevent multiple MongoDB connections
// This is important in Next.js because files can be reloaded multiple times
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB using a singleton pattern
// Ensures that only one connection is created and reused
async function dbConnect() {
  // If a connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    };

    // Create the MongoDB connection and store the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Await the connection promise and cache the active connection
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the connection function so it can be reused across the app
export default dbConnect;