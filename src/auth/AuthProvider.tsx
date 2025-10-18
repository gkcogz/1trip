import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@lib/supabase'

const AuthCtx = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => { listener.subscription.unsubscribe() }
  }, [])

  return <AuthCtx.Provider value={{ user }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
