import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/klausuren_db'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used to maintain a cached connection across hot reloads in development.
 */
let cached: { conn: typeof mongoose | null } = (global as any).mongoose || { conn: null }

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  const conn = await mongoose.connect(MONGODB_URI)
  cached.conn = conn
  ;(global as any).mongoose = cached
  return conn
}
