import { NextResponse } from "next/server"

/**
 * Test endpoint to verify webhook setup
 * Visit: /api/test/strava-webhook to check if webhook endpoint is accessible
 */
export async function GET() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/strava`

  return NextResponse.json({
    status: "Webhook endpoint accessible",
    webhookUrl,
    timestamp: new Date().toISOString(),
    clientId: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
    hasClientSecret: !!process.env.STRAVA_CLIENT_SECRET,
    hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN,
    instructions: {
      registerWebhook: `curl -X POST https://www.strava.com/api/v3/push_subscriptions -F client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID} -F client_secret=${process.env.STRAVA_CLIENT_SECRET} -F callback_url=${webhookUrl} -F verify_token=${process.env.WEBHOOK_VERIFY_TOKEN}`,
      checkWebhooks: `curl -G https://www.strava.com/api/v3/push_subscriptions -d client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID} -d client_secret=${process.env.STRAVA_CLIENT_SECRET}`,
    },
  })
}
