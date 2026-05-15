import { type NextRequest, NextResponse } from "next/server"
import { exchangeCodeForTokens } from "@/lib/strava-api"
import { supabase } from "@/lib/supabase"

/**
 * Handle Strava OAuth callback
 * Stores user tokens securely in database
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/?strava_error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?strava_error=no_code", request.url))
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    if (!tokens) {
      return NextResponse.redirect(new URL("/?strava_error=token_exchange_failed", request.url))
    }

    const { data: existingUser } = await supabase
      .from("strava_users")
      .select("setup_completed")
      .eq("strava_user_id", tokens.athlete.id)
      .single()

    // Store tokens in database
    const { error: dbError } = await supabase.from("strava_users").upsert({
      strava_user_id: tokens.athlete.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(tokens.expires_at * 1000).toISOString(),
      athlete_data: tokens.athlete,
      setup_completed: existingUser?.setup_completed ?? false,
      updated_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.redirect(new URL("/?strava_error=database_error", request.url))
    }

    // Redirect back to app with success
    const params = new URLSearchParams({
      strava_success: "true",
      athlete_name: `${tokens.athlete.firstname} ${tokens.athlete.lastname}`,
      athlete_id: tokens.athlete.id.toString(),
    })

    return NextResponse.redirect(new URL(`/?${params.toString()}`, request.url))
  } catch (error) {
    console.error("Strava callback error:", error)
    return NextResponse.redirect(new URL("/?strava_error=callback_failed", request.url))
  }
}
