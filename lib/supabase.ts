import { createClient } from "@supabase/supabase-js"

// Use provided credentials with fallback to environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://htbtsfuvsgalbggvwukg.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0YnRzZnV2c2dhbGJnZ3Z3dWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjk4MjcsImV4cCI6MjA2Nzg0NTgyN30.J2mPzRBgiuBYBB6XV2gPNA0euLi5Mz0GCY6rlck2p3M"

console.log("Supabase initialization:")
console.log("URL:", supabaseUrl)
console.log("Key exists:", !!supabaseAnonKey)
console.log("Key starts with:", supabaseAnonKey?.substring(0, 20) + "...")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase
  .from("feed_entries")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error("Supabase connection test failed:", error)
    } else {
      console.log("Supabase connection test successful. Row count:", count)
    }
  })

export type FeedEntry = {
  id: string
  distance: number
  extra_miles: number
  equivalent_distance: number
  location: string
  name?: string
  pushing_method: "two-handed" | "one-handed" | "push-and-chase"
  created_at: string
}

export type Reaction = {
  id: string
  entry_id: string
  user_id: string
  reaction_type: "muscle" | "heart" | "applause"
  created_at: string
}

export type FeedEntryWithReactions = FeedEntry & {
  reactions: {
    muscle: number
    heart: number
    applause: number
  }
  userReactions: {
    muscle: boolean
    heart: boolean
    applause: boolean
  }
}
