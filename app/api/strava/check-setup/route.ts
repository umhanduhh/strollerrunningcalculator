import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const athleteId = searchParams.get("athleteId")

  if (!athleteId) {
    return NextResponse.json({ error: "Athlete ID is required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from("strava_users")
      .select("setup_completed, stroller_name, stroller_weight, child_gender, child_weight")
      .eq("strava_user_id", athleteId)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to check setup status" }, { status: 500 })
    }

    return NextResponse.json({
      setupCompleted: data?.setup_completed || false,
      profile: {
        strollerName: data?.stroller_name,
        strollerWeight: data?.stroller_weight,
        childGender: data?.child_gender,
        childWeight: data?.child_weight,
      },
    })
  } catch (error) {
    console.error("Error checking setup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
