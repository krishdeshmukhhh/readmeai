import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/requireAuth.js'
import { User } from '../models/User.js'
import { Generation } from '../models/Generation.js'
import { generateReadme } from '../lib/claude.js'

const router = Router()

const FREE_LIMIT = 3

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { clerkId, projectName, description, techStack, templateType, githubUrl } =
    req.body as {
      clerkId?: string
      projectName?: string
      description?: string
      techStack?: string
      templateType?: string
      githubUrl?: string
    }

  if (!clerkId || !projectName || !description || !techStack || !templateType) {
    res.status(400).json({ error: 'Missing required fields' })
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

  if (user.plan === 'free' && user.generationCount >= FREE_LIMIT) {
    res.status(403).json({ error: 'limit_reached' })
    return
  }

  try {
    const readme = await generateReadme({ projectName, description, techStack, templateType, githubUrl })

    await User.updateOne({ clerkId }, { $inc: { generationCount: 1 } })
    await Generation.create({ userId: clerkId, projectName, description, techStack, templateType })

    res.json({ readme })
  } catch (err) {
    console.error('Claude error:', err)
    res.status(500).json({ error: 'generation_failed' })
  }
})

export default router
