import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/requireAuth.js'
import { User } from '../models/User.js'
import { stripe } from '../lib/stripe.js'

const router = Router()

// Must be set in Stripe Dashboard — the Pro subscription price ID
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { clerkId, email } = req.body as { clerkId?: string; email?: string }

  if (!clerkId || !email) {
    res.status(400).json({ error: 'clerkId and email are required' })
    return
  }

  if (req.clerkId !== clerkId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  const user = await User.findOne({ clerkId })
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  // Find or create Stripe customer
  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email })
    customerId = customer.id
    await User.updateOne({ clerkId }, { stripeCustomerId: customerId })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/generate?upgrade=success`,
    cancel_url: `${process.env.FRONTEND_URL}/generate`,
    metadata: { clerkId },
  })

  res.json({ url: session.url })
})

export default router
