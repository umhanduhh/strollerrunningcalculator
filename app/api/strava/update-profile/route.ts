import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { athleteId, athleteGender, athleteWeight, strollerName, strollerWeight, childWeight, setupCompleted } = body

    if (!athleteId) {
      return NextResponse.json({ error: "Athlete ID is required" }, { status: 400 })
    }

    // Update user profile in database
    const { error } = await supabase
      .from("strava_users")
      .update({
        athlete_gender: athleteGender,
        athlete_weight: athleteWeight,
        stroller_name: strollerName,
        stroller_weight: strollerWeight,
        child_weight: childWeight,
        setup_completed: setupCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq("strava_user_id", athleteId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
