import { Router, Request, Response } from 'express'
import { User } from '../models/User.js'
import { requireAuth, AuthRequest } from '../middleware/requireAuth.js'

const router = Router()

// POST /api/user/sync — upsert user on every sign-in
router.post('/sync', async (req: Request, res: Response) => {
  const { clerkId, email } = req.body as { clerkId?: string; email?: string }
  if (!clerkId || !email) {
    res.status(400).json({ error: 'clerkId and email are required' })
    return
  }

  const user = await User.findOneAndUpdate(
    { clerkId },
    { $setOnInsert: { clerkId, email, plan: 'free', generationCount: 0 } },
    { upsert: true, new: true },
  )

  res.json({ user })
})

// GET /api/user/:clerkId — fetch plan + generationCount
router.get('/:clerkId', requireAuth, async (req: AuthRequest, res: Response) => {
  const { clerkId } = req.params

  // Ensure the token owner matches the requested resource
  if (req.clerkId !== clerkId) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  const user = await User.findOne({ clerkId })
  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({ plan: user.plan, generationCount: user.generationCount })
})

export default router
