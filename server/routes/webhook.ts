import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { stripe } from '../lib/stripe.js'
import { User } from '../models/User.js'

const router = Router()

// This route uses express.raw() — applied in index.ts before mounting
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']
  if (!sig) {
    res.status(400).json({ error: 'Missing stripe-signature' })
    return
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    res.status(400).json({ error: 'Invalid signature' })
    return
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkId = session.metadata?.clerkId
      if (clerkId && session.subscription) {
        await User.updateOne(
          { clerkId },
          { plan: 'pro', stripeSubscriptionId: session.subscription as string },
        )
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await User.updateOne(
        { stripeSubscriptionId: subscription.id },
        { plan: 'free', stripeSubscriptionId: null },
      )
      break
    }

    default:
      // Unhandled event types are silently ignored
      break
  }

  res.json({ received: true })
})

export default router
