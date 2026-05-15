import { NextResponse } from "next/server"

/**
 * Debug endpoint to check environment variables
 * REMOVE THIS AFTER DEBUGGING!
 */
export async function GET() {
  return NextResponse.json({
    hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN,
    tokenLength: process.env.WEBHOOK_VERIFY_TOKEN?.length || 0,
    tokenPreview: process.env.WEBHOOK_VERIFY_TOKEN?.substring(0, 10) + "...",
    expectedToken: "stroller_webhook_2024_secure_token_xyz789",
    tokensMatch: process.env.WEBHOOK_VERIFY_TOKEN === "stroller_webhook_2024_secure_token_xyz789",
    allEnvVars: {
      hasStravaClientId: !!process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      hasStravaSecret: !!process.env.STRAVA_CLIENT_SECRET,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    },
  })
}
