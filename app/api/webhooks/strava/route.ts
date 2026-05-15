import type { NextRequest } from "next/server"
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
 * Enhanced Strava webhook handler with detailed logging
 */

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()
  console.log(`🔍 [${timestamp}] ===== WEBHOOK GET START =====`)
  console.log(`🔍 [${timestamp}] URL: ${request.url}`)

  try {
    const url = new URL(request.url)
    const mode = url.searchParams.get("hub.mode")
    const token = url.searchParams.get("hub.verify_token")
    const challenge = url.searchParams.get("hub.challenge")

    console.log(`🔍 [${timestamp}] Parameters: mode=${mode}, token=${token}, challenge=${challenge}`)

    const validTokens = [
      "stroller_webhook_2024_secure_token_xyz789",
      "super_fresh_jan_09_2025_v2",
      "fresh_token_2025_jan_09_unique",
      process.env.WEBHOOK_VERIFY_TOKEN,
    ].filter(Boolean)

    if (mode === "subscribe") {
      const isValidToken = validTokens.includes(token)
      console.log(`🔍 [${timestamp}] Token valid: ${isValidToken}`)

      if (isValidToken && challenge) {
        console.log(`✅ [${timestamp}] SUCCESS! Returning challenge: "${challenge}"`)

        return new Response(challenge, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        })
      } else {
        console.log(`❌ [${timestamp}] Invalid token or missing challenge`)
        return new Response("Forbidden", { status: 403 })
      }
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error(`❌ [${timestamp}] Error:`, error)
    return new Response("Error", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  console.log(`📡 [${timestamp}] ===== WEBHOOK POST START =====`)

  try {
    const body = await request.text()
    console.log(`📡 [${timestamp}] Raw body: ${body}`)

    const webhookData = JSON.parse(body)
    console.log(`📡 [${timestamp}] Parsed webhook data:`, JSON.stringify(webhookData, null, 2))

    // Handle both activity creation AND updates
    if (
      webhookData.object_type === "activity" &&
      (webhookData.aspect_type === "create" || webhookData.aspect_type === "update")
    ) {
      const activityId = webhookData.object_id
      const athleteId = webhookData.owner_id

      console.log(`🏃 [${timestamp}] Processing activity ${activityId} for athlete ${athleteId}`)
      console.log(`🏃 [${timestamp}] Event type: ${webhookData.aspect_type}`)

      console.log(`🔍 [${timestamp}] Looking up user in database...`)
      const { data: user, error: userError } = await supabase
        .from("strava_users")
        .select("*")
        .eq("strava_user_id", athleteId)
        .single()

      if (userError || !user) {
        console.log(`❌ [${timestamp}] User not found: ${athleteId}`)
        console.log(`❌ [${timestamp}] User error:`, userError)
        return new Response("User not found", { status: 404 })
      }

      console.log(`✅ [${timestamp}] User found: ${user.athlete_data?.firstname} ${user.athlete_data?.lastname}`)

      const profile: AthleteProfile = {
        athlete_gender: user.athlete_gender,
        athlete_weight: user.athlete_weight,
        stroller_name: user.stroller_name,
        stroller_weight: user.stroller_weight,
        child_weight: user.child_weight,
      }

      console.log(`👤 [${timestamp}] Athlete profile:`, {
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

      console.log(`🔍 [${timestamp}] Token expires at: ${expiresAt}, Current time: ${now}`)

      if (now >= expiresAt) {
        console.log(`🔄 [${timestamp}] Token expired, refreshing...`)
        const newTokens = await refreshAccessToken(user.refresh_token)

        if (newTokens) {
          accessToken = newTokens.access_token
          console.log(`✅ [${timestamp}] Token refreshed successfully`)

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
          console.log(`❌ [${timestamp}] Failed to refresh token`)
          return new Response("Token refresh failed", { status: 401 })
        }
      } else {
        console.log(`✅ [${timestamp}] Token is still valid`)
      }

      // Get activity details
      console.log(`🔍 [${timestamp}] Fetching activity details from Strava API...`)
      const activity = await getStravaActivity(accessToken, activityId)

      if (!activity) {
        console.log(`❌ [${timestamp}] Failed to get activity details`)
        return new Response("Failed to get activity", { status: 400 })
      }

      console.log(`🏃 [${timestamp}] Activity details:`, {
        id: activity.id,
        name: activity.name,
        type: activity.type,
        distance: activity.distance,
        description: activity.description?.substring(0, 200) + "...",
      })

      // Only process running activities
      if (activity.type !== "Run") {
        console.log(`⏭️ [${timestamp}] Skipping non-running activity: ${activity.type}`)
        return new Response("Not a running activity", { status: 200 })
      }

      // Check for stroller hashtags in description
      const description = activity.description || ""
      console.log(`🔍 [${timestamp}] Full description: "${description}"`)

      const hashtag = parseStrollerHashtags(description)

      if (!hashtag) {
        console.log(`⏭️ [${timestamp}] No stroller hashtags found in description`)
        console.log(`🔍 [${timestamp}] Looking for: #twohandpush, #onehandpush, #pushandchase`)
        return new Response("No stroller hashtags", { status: 200 })
      }

      console.log(`🏷️ [${timestamp}] Found hashtag: ${hashtag}`)

      // Convert distance from meters to miles
      const distanceInMiles = activity.distance * 0.000621371
      console.log(`📏 [${timestamp}] Distance: ${activity.distance}m = ${distanceInMiles.toFixed(2)} miles`)

      // Calculate equivalent distance with personalized data
      const pace = activity.moving_time / 60 / distanceInMiles // pace in min/mile
      const elevationInFeet = activity.total_elevation_gain * 3.28084 // elevation in feet

      console.log(`📊 [${timestamp}] Input data for calculation:`, {
        distanceInMiles,
        hashtag,
        pace: pace.toFixed(2),
        elevationInFeet: elevationInFeet.toFixed(0),
        usingPersonalizedData: user.setup_completed,
      })

      const { extraMiles, equivalentDistance } = calculateStrollerEquivalent(
        distanceInMiles,
        hashtag,
        pace,
        elevationInFeet,
        profile,
      )

      console.log(`📊 [${timestamp}] Calculation results:`, {
        originalDistance: distanceInMiles.toFixed(2),
        extraMiles,
        equivalentDistance,
        hashtag,
        personalizedCalculation: user.setup_completed,
      })

      // Create updated description
      const calculationText = `\n\n🏃‍♀️👶 Pushing a stroller made my ${distanceInMiles.toFixed(1)} mile run feel like ${equivalentDistance} miles! (+${extraMiles} bonus miles)\n\nCalculated with StrollerRunningCalculator.com`

      let newDescription: string

      // Check if description already contains our calculation
      if (description.includes("StrollerRunningCalculator.com")) {
        console.log(`🔄 [${timestamp}] Replacing existing calculation`)
        // Replace existing calculation
        const existingCalcRegex = /\n\n🏃‍♀️👶.*?StrollerRunningCalculator\.com/s
        newDescription = description.replace(existingCalcRegex, calculationText)
      } else {
        console.log(`➕ [${timestamp}] Adding new calculation`)
        // Add new calculation
        newDescription = description + calculationText
      }

      console.log(`📝 [${timestamp}] New description length: ${newDescription.length}`)
      console.log(
        `📝 [${timestamp}] New description preview: "${newDescription.substring(newDescription.length - 200)}"`,
      )

      // Update activity on Strava
      console.log(`🔄 [${timestamp}] Updating activity description on Strava...`)
      const updateSuccess = await updateStravaActivity(accessToken, activityId, newDescription)
      console.log(`📝 [${timestamp}] Strava update result: ${updateSuccess}`)

      if (!updateSuccess) {
        console.log(`❌ [${timestamp}] Failed to update Strava activity description`)
        return new Response("Failed to update activity", { status: 500 })
      }

      // Store in processed activities (upsert to handle both create and update)
      console.log(`💾 [${timestamp}] Storing in database...`)
      const { error: dbError } = await supabase.from("processed_activities").upsert(
        {
          activity_id: activityId,
          strava_user_id: athleteId,
          original_distance: Number.parseFloat(distanceInMiles.toFixed(2)),
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
        console.error(`❌ [${timestamp}] Database error:`, dbError)
      } else {
        console.log(`✅ [${timestamp}] Successfully stored in database`)
      }

      console.log(`🎉 [${timestamp}] Successfully processed activity ${activityId}`)
    } else {
      console.log(`⏭️ [${timestamp}] Ignoring webhook - not an activity create/update event`)
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error(`❌ [${timestamp}] POST error:`, error)
    console.error(`❌ [${timestamp}] Stack trace:`, error.stack)
    return new Response("Internal Server Error", { status: 500 })
  }
}
