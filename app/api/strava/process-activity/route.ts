import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import {
  getStravaActivity,
  updateStravaActivity,
  calculateStrollerEquivalent,
  parseStrollerHashtags,
  refreshAccessToken,
  type AthleteProfile,
} from "@/lib/strava-api"

/**
 * Manual activity processing endpoint for testing
 * POST /api/strava/process-activity
 * Body: { activityId: number, athleteId: number }
 */
export async function POST(request: NextRequest) {
  try {
    const { activityId, athleteId } = await request.json()

    if (!activityId || !athleteId) {
      return NextResponse.json({ error: "Missing activityId or athleteId" }, { status: 400 })
    }

    console.log(`🔧 Manual processing: Activity ${activityId} for athlete ${athleteId}`)

    const { data: user, error: userError } = await supabase
      .from("strava_users")
      .select("*")
      .eq("strava_user_id", athleteId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const profile: AthleteProfile = {
      athlete_gender: user.athlete_gender,
      athlete_weight: user.athlete_weight,
      stroller_name: user.stroller_name,
      stroller_weight: user.stroller_weight,
      child_weight: user.child_weight,
    }

    console.log(`👤 Athlete profile:`, {
      hasGender: !!profile.athlete_gender,
      hasWeight: !!profile.athlete_weight,
      hasStroller: !!profile.stroller_weight,
      hasChildWeight: !!profile.child_weight,
      setupCompleted: user.setup_completed,
    })

    // Check if token needs refresh
    let accessToken = user.access_token
    const expiresAt = new Date(user.expires_at)
    const now = new Date()

    if (now >= expiresAt) {
      console.log(`🔄 Token expired, refreshing...`)
      const newTokens = await refreshAccessToken(user.refresh_token)

      if (newTokens) {
        accessToken = newTokens.access_token

        // Update tokens in database
        await supabase
          .from("strava_users")
          .update({
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
            expires_at: new Date(newTokens.expires_at * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("strava_user_id", athleteId)
      } else {
        return NextResponse.json({ error: "Token refresh failed" }, { status: 401 })
      }
    }

    // Get activity details
    const activity = await getStravaActivity(accessToken, activityId)

    if (!activity) {
      return NextResponse.json({ error: "Failed to get activity details" }, { status: 400 })
    }

    // Only process running activities
    if (activity.type !== "Run") {
      return NextResponse.json({ error: "Not a running activity" }, { status: 400 })
    }

    // Check for stroller hashtags in description
    const description = activity.description || ""
    const hashtag = parseStrollerHashtags(description)

    if (!hashtag) {
      return NextResponse.json({ error: "No stroller hashtags found" }, { status: 400 })
    }

    // Convert distance from meters to miles
    const distanceInMiles = activity.distance * 0.000621371

    const { extraMiles, equivalentDistance } = calculateStrollerEquivalent(
      distanceInMiles,
      hashtag,
      activity.moving_time / 60 / distanceInMiles, // pace in min/mile
      activity.total_elevation_gain * 3.28084, // elevation in feet
      profile, // Pass athlete profile for personalized calculation
    )

    // Create updated description
    const calculationText = `\n\n🏃‍♀️👶 Pushing a stroller made my ${distanceInMiles.toFixed(1)} mile run feel like ${equivalentDistance} miles! (+${extraMiles} bonus miles)\n\nCalculated with StrollerRunningCalculator.com`

    let newDescription: string

    // Check if description already contains our calculation
    if (description.includes("StrollerRunningCalculator.com")) {
      // Replace existing calculation
      const existingCalcRegex = /\n\n🏃‍♀️👶.*?StrollerRunningCalculator\.com/s
      newDescription = description.replace(existingCalcRegex, calculationText)
    } else {
      // Add new calculation
      newDescription = description + calculationText
    }

    const updateSuccess = await updateStravaActivity(accessToken, activityId, newDescription)

    if (!updateSuccess) {
      return NextResponse.json({ error: "Failed to update activity description" }, { status: 500 })
    }

    // Store in processed activities
    const { error: dbError } = await supabase.from("processed_activities").upsert(
      {
        activity_id: activityId,
        strava_user_id: athleteId,
        original_distance: distanceInMiles,
        equivalent_distance: equivalentDistance,
        extra_miles: extraMiles,
        hashtag_used: hashtag,
        processed_at: new Date().toISOString(),
      },
      {
        onConflict: "activity_id",
      },
    )

    if (dbError) {
      console.error("Database error:", dbError)
    }

    return NextResponse.json({
      success: true,
      activityId,
      originalDistance: distanceInMiles,
      equivalentDistance,
      extraMiles,
      hashtag,
      descriptionUpdated: updateSuccess,
      personalizedCalculation: user.setup_completed,
    })
  } catch (error) {
    console.error("Manual processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
