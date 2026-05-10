import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routes/user.js'
import generateRouter from './routes/generate.js'
import checkoutRouter from './routes/checkout.js'
import webhookRouter from './routes/webhook.js'

const app = express()
const PORT = process.env.PORT || 3001

// Stripe webhook must receive raw body — mount before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookRouter)

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/generate', generateRouter)
app.use('/api/create-checkout-session', checkoutRouter)

app.get('/health', (_req, res) => res.json({ ok: true }))

async function start() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGODB_URI is not set')

  await mongoose.connect(mongoUri)
  console.log('Connected to MongoDB')

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
