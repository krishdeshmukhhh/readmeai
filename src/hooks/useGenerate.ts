import { useState, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { api } from '../lib/api'

interface GenerateInput {
  projectName: string
  description: string
  techStack: string
  templateType: string
  githubUrl?: string
}

export function useGenerate(refetchUser: () => void, onLimitReached: () => void) {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [readmeOutput, setReadmeOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(
    async (input: GenerateInput) => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        const token = await getToken()
        if (!token) throw new Error('Not authenticated')

        const data = await api.generate(
          { clerkId: user.id, ...input },
          token,
        )

        setReadmeOutput(data.readme)
        refetchUser()
      } catch (err) {
        const apiErr = err as Error & { code?: string }
        if (apiErr.code === 'limit_reached') {
          onLimitReached()
        } else {
          setError(apiErr.message || 'Generation failed. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [user, getToken, refetchUser, onLimitReached],
  )

  return { generate, readmeOutput, isLoading, error }
}
