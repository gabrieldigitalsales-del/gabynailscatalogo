import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseKey)

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

export function assertSupabaseConfigured() {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY antes de usar o projeto.')
  }
}
