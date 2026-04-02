import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import * as progress from './progress'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Supabase
  const refreshProfile = async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }

    const profileData = await progress.getProfile(userId)
    setProfile(profileData)
  }

  // Update streak when user logs in
  const updateUserStreak = async (userId) => {
    if (!userId) return
    await progress.updateStreak(userId)
    await refreshProfile(userId)
  }

  // Earn XP helper
  const earnXP = async (amount, activityType = 'general') => {
    if (!user) return
    await progress.addXP(user.id, amount, activityType)
    await refreshProfile(user.id)
  }

  // Initial auth setup
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        refreshProfile(currentUser.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        refreshProfile(currentUser.id)
        updateUserStreak(currentUser.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) => supabase.auth.signUp({ email, password })
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signOut = () => supabase.auth.signOut()
  const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' })

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        refreshProfile: () => user && refreshProfile(user.id),
        earnXP,
        updateStreak: () => user && updateUserStreak(user.id)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>You must be logged in to access this page.</div>
  }

  return children
}
