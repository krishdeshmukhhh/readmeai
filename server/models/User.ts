import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  generationCount: { type: Number, default: 0 },
  monthlyGenerationCount: { type: Number, default: 0 },
  generationResetMonth: { type: String, default: '' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.model('User', userSchema)
