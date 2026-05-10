import { useEffect, useState, useCallback } from 'react'
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-react'
import { api } from '../lib/api'

interface UserState {
  plan: 'free' | 'pro'
  generationCount: number
  isLoading: boolean
}

export function useUser() {
  const { getToken } = useAuth()
  const { user } = useClerkUser()
  const [state, setState] = useState<UserState>({
    plan: 'free',
    generationCount: 0,
    isLoading: true,
  })

  const fetchUser = useCallback(async () => {
    if (!user) return

    try {
      // Sync user on every call (upserts if needed)
      await api.syncUser(user.id, user.primaryEmailAddress?.emailAddress ?? '')

      const token = await getToken()
      if (!token) return

      const data = await api.getUser(user.id, token)
      setState({ plan: data.plan as 'free' | 'pro', generationCount: data.generationCount, isLoading: false })
    } catch {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [user, getToken])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { ...state, refetch: fetchUser }
}
