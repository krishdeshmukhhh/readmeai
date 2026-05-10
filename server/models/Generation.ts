import mongoose from 'mongoose'

const generationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  projectName: { type: String },
  description: { type: String },
  techStack: { type: String },
  templateType: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const Generation = mongoose.model('Generation', generationSchema)
