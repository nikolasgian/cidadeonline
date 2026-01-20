import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos para o TypeScript
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          tipo: 'cidadao' | 'gestor' | 'admin'
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          tipo?: 'cidadao' | 'gestor' | 'admin'
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          tipo?: 'cidadao' | 'gestor' | 'admin'
          criado_em?: string
        }
      }
      protocolos: {
        Row: {
          id: string
          titulo: string
          descricao: string
          status: 'aberto' | 'em_atendimento' | 'concluido' | 'cancelado'
          prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
          usuario_id: string
          secretaria_id: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id: string
          titulo: string
          descricao: string
          status?: 'aberto' | 'em_atendimento' | 'concluido' | 'cancelado'
          prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
          usuario_id: string
          secretaria_id: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          status?: 'aberto' | 'em_atendimento' | 'concluido' | 'cancelado'
          prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
          usuario_id?: string
          secretaria_id?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
    }
  }
}