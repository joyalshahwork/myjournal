import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
      },
    }
  )
}

// Typed DB helper
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string; email: string; created_at: string; avatar_url: string | null }
        Insert: { id: string; name: string; email: string; avatar_url?: string }
        Update: Partial<{ name: string; avatar_url: string }>
      }
      journal_entries: {
        Row: {
          id: string; user_id: string; entry: string
          gratitude: string; reflection: string
          memory: string; situation: string
          created_at: string; mood: string | null
        }
        Insert: Omit<{ id?: string; user_id: string; entry: string; gratitude: string; reflection: string; memory: string; situation: string; mood?: string }, 'id'>
        Update: Partial<{ entry: string; gratitude: string; reflection: string; memory: string; situation: string; mood: string }>
      }
      expenses: {
        Row: { id: string; user_id: string; category: string; amount: number; note: string | null; created_at: string }
        Insert: { user_id: string; category: string; amount: number; note?: string }
        Update: Partial<{ category: string; amount: number; note: string }>
      }
      streaks: {
        Row: { id: string; user_id: string; current_streak: number; longest_streak: number; last_entry_date: string | null }
        Insert: { user_id: string; current_streak?: number; longest_streak?: number }
        Update: Partial<{ current_streak: number; longest_streak: number; last_entry_date: string }>
      }
      goals: {
        Row: { id: string; user_id: string; goal_title: string; status: string; created_at: string }
        Insert: { user_id: string; goal_title: string; status?: string }
        Update: Partial<{ goal_title: string; status: string }>
      }
    }
  }
}
