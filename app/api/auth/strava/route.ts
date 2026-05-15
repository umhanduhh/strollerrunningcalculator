import { type NextRequest, NextResponse } from "next/server"
import { getStravaAuthUrl } from "@/lib/strava-api"

/**
 * Initiate Strava OAuth flow
 * COMPLIANCE: Uses official Strava authorization endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const authUrl = getStravaAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("Strava auth initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate Strava authentication" }, { status: 500 })
  }
}
