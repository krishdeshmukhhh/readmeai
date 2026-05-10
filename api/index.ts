import mongoose from 'mongoose'
import app from '../server/app.js'

// Prevent Vercel from parsing the body — Express handles it (needed for Stripe raw body)
export const config = { api: { bodyParser: false } }

let isConnected = false

async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true
    return
  }
  await mongoose.connect(process.env.MONGODB_URI!)
  isConnected = true
}

export default async function handler(req: any, res: any) {
  await connectDB()
  app(req, res)
}
