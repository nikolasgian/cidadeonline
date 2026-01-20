import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface UserProfile extends User {
  tipo?: 'cidadao' | 'gestor' | 'admin'
  nome?: string
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se já existe uma sessão
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error('Erro ao obter usuário:', error)
      } else {
        setUser(user as UserProfile)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Buscar perfil adicional do usuário
          const { data: profile } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single()

          const userProfile: UserProfile = {
            ...session.user,
            tipo: profile?.tipo || 'cidadao',
            nome: profile?.nome || session.user.email?.split('@')[0] || 'Usuário'
          }

          setUser(userProfile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isGestor: user?.tipo === 'gestor' || user?.tipo === 'admin',
    isAdmin: user?.tipo === 'admin'
  }
}