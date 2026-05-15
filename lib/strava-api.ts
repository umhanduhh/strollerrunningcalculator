// Strava API integration with full brand compliance
// Rate limits: 100 requests per 15 minutes, 1000 per day

const STRAVA_BASE_URL = "https://www.strava.com/api/v3"
const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize"
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token"

export interface StravaTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: StravaAthlete
}

export interface StravaAthlete {
  id: number
  firstname: string
  lastname: string
  profile: string
  city?: string
  state?: string
  country?: string
}

export interface StravaActivity {
  id: number
  name: string
  type: string
  start_date_local: string
  elapsed_time: number
  distance: number
  description?: string
  moving_time: number
  total_elevation_gain: number
  average_speed: number
}

export interface AthleteProfile {
  athlete_gender?: string
  athlete_weight?: number
  stroller_name?: string
  stroller_weight?: number
  child_weight?: number
}

/**
 * Generate Strava OAuth authorization URL
 * COMPLIANCE: Uses official authorization endpoint
 * FIXED: Using exact domain that matches Strava app registration
 */
export function getStravaAuthUrl(): string {
  const clientId = "176299"

  // Must match exactly what's registered in Strava: strollerrunningcalculator.com
  const redirectUri = "https://strollerrunningcalculator.com/api/auth/strava/callback"

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "activity:read_all,activity:write",
    approval_prompt: "auto",
  })

  console.log("OAuth URL being generated:", `${STRAVA_AUTH_URL}?${params.toString()}`)
  console.log("Redirect URI:", redirectUri)

  return `${STRAVA_AUTH_URL}?${params.toString()}`
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<StravaTokens | null> {
  const clientId = "176299"
  const clientSecret = "b5a5af318b5dff01bb069ee0e50c8c265503f7b7"

  try {
    console.log("Token exchange with:", { clientId, code })

    const response = await fetch(STRAVA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Token exchange failed:", response.status, error)
      throw new Error(`Failed to exchange code for tokens: ${error}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Token exchange error:", error)
    return null
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens | null> {
  const clientId = "176299"
  const clientSecret = "b5a5af318b5dff01bb069ee0e50c8c265503f7b7"

  try {
    const response = await fetch(STRAVA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    return await response.json()
  } catch (error) {
    console.error("Token refresh error:", error)
    return null
  }
}

/**
 * Get activity details from Strava
 */
export async function getStravaActivity(accessToken: string, activityId: number): Promise<StravaActivity | null> {
  try {
    const response = await fetch(`${STRAVA_BASE_URL}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get activity")
    }

    return await response.json()
  } catch (error) {
    console.error("Get activity error:", error)
    return null
  }
}

/**
 * Update activity description on Strava
 */
export async function updateStravaActivity(
  accessToken: string,
  activityId: number,
  description: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${STRAVA_BASE_URL}/activities/${activityId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    })

    return response.ok
  } catch (error) {
    console.error("Update activity error:", error)
    return false
  }
}

/**
 * Calculate stroller running equivalent distance with personalized athlete data
 * Uses the same comprehensive logic as the main calculator
 * Falls back to average values when profile data is not available
 */
export function calculateStrollerEquivalent(
  distance: number,
  hashtag: string,
  pace?: number,
  elevationGain?: number,
  profile?: AthleteProfile,
): { extraMiles: number; equivalentDistance: number } {
  // Method multipliers based on hashtag
  const methodMultipliers = {
    "#twohandpush": 1.11, // Two-handed pushing increases energy expenditure by ~11%
    "#onehandpush": 1.08, // One-handed pushing increases energy expenditure by ~8%
    "#pushandchase": 1.18, // Push and chase method increases energy expenditure by ~18%
  }

  const baseMultiplier = methodMultipliers[hashtag as keyof typeof methodMultipliers] || 1.11

  // Use profile data or fall back to averages
  const runnerWeight = profile?.athlete_weight || 150 // Average runner weight
  const runnerGender = profile?.athlete_gender || "female" // Default to female (more conservative estimate)
  const strollerWeight = profile?.stroller_weight || 26 // Average stroller weight
  const childWeight = profile?.child_weight || 25 // Average child weight

  // Calculate total weight (stroller + child)
  const totalWeight = strollerWeight + childWeight

  // Weight factor - additional 0.5% per pound of total weight over 15 pounds
  const weightFactor = totalWeight > 15 ? 1 + (totalWeight - 15) * 0.005 : 1

  // Speed factor (if pace is available)
  let speedFactor = 1
  if (pace) {
    const speed = 60 / pace // Convert pace to speed (mph)
    speedFactor = 1 + (speed - 5) * 0.02
  }

  // Elevation factor (if elevation gain is available)
  let elevationFactor = 1
  if (elevationGain && distance > 0) {
    const elevationGainPerMile = elevationGain / distance
    elevationFactor = 1 + (elevationGainPerMile / 100) * 0.025
  }

  // Gender factor - based on research showing differences in energy expenditure
  // Women had slightly higher relative increases when pushing strollers
  const genderFactor = runnerGender === "female" ? 1.03 : 1.0

  // Runner weight factor - heavier runners experience relatively less additional burden
  // from the stroller as a percentage of their total energy expenditure
  const runnerWeightFactor = Math.max(0.9, Math.min(1.1, 150 / runnerWeight))

  // Calculate the total multiplier
  const totalMultiplier =
    baseMultiplier * weightFactor * speedFactor * elevationFactor * genderFactor * runnerWeightFactor

  const equivalentDistance = distance * totalMultiplier
  const extraMiles = equivalentDistance - distance

  return {
    extraMiles: Number.parseFloat(extraMiles.toFixed(2)),
    equivalentDistance: Number.parseFloat(equivalentDistance.toFixed(2)),
  }
}

/**
 * Parse hashtags from activity description
 */
export function parseStrollerHashtags(description: string): string | null {
  const hashtags = ["#twohandpush", "#onehandpush", "#pushandchase"]
  const lowerDescription = description.toLowerCase()

  return hashtags.find((tag) => lowerDescription.includes(tag)) || null
}
