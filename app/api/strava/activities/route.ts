import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Get processed activities for the current user
 * COMPLIANCE: All returned data includes proper Strava attribution
 */
export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from authentication
    // For now, we'll return recent processed activities
    const { data: activities, error } = await supabase
      .from("processed_activities")
      .select("*")
      .order("processed_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
    }

    return NextResponse.json(activities || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
