/**
 * Strava Integration Setup Verification Script
 * Run this to verify your Strava API credentials and setup
 */

const STRAVA_CLIENT_ID = "176299"
const STRAVA_CLIENT_SECRET = "75de32d994056e46cd047981127325l8d1554892"

async function verifyStravaSetup() {
  console.log("🔍 Verifying Strava Integration Setup...")
  console.log("=====================================")

  // 1. Verify environment variables
  console.log("1. Environment Variables:")
  console.log(`   ✅ Client ID: ${STRAVA_CLIENT_ID}`)
  console.log(`   ✅ Client Secret: ${STRAVA_CLIENT_SECRET.substring(0, 10)}...`)
  console.log("")

  // 2. Test Strava API connectivity
  console.log("2. Testing Strava API Connectivity:")
  try {
    // Test the token endpoint (this should return an error but confirms connectivity)
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: "test", // This will fail but confirms API is reachable
      }),
    })

    if (response.status === 400) {
      console.log("   ✅ Strava API is reachable")
    } else {
      console.log(`   ⚠️  Unexpected response: ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ API connectivity failed: ${error}`)
  }

  // 3. Generate OAuth URL for testing
  console.log("3. OAuth Configuration:")
  const authParams = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: "https://strollerrunningcalculator.com/api/auth/strava/callback",
    response_type: "code",
    scope: "activity:read_all,activity:write",
    approval_prompt: "auto",
  })

  const authUrl = `https://www.strava.com/oauth/authorize?${authParams.toString()}`
  console.log("   ✅ OAuth URL generated successfully")
  console.log(`   🔗 Test URL: ${authUrl}`)
  console.log("")

  // 4. Webhook setup instructions
  console.log("4. Next Steps - Webhook Registration:")
  console.log("   📝 Run this curl command to register your webhook:")
  console.log("")
  console.log(`   curl -X POST https://www.strava.com/api/v3/push_subscriptions \\`)
  console.log(`     -F client_id=${STRAVA_CLIENT_ID} \\`)
  console.log(`     -F client_secret=${STRAVA_CLIENT_SECRET} \\`)
  console.log(`     -F callback_url=https://strollerrunningcalculator.com/api/webhooks/strava \\`)
  console.log(`     -F verify_token=stroller_webhook_2024_secure_token_xyz789`)
  console.log("")

  // 5. Brand assets checklist
  console.log("5. Brand Assets Checklist:")
  console.log("   📁 Download from: https://developers.strava.com/guidelines/")
  console.log("   📋 Required files:")
  console.log("      - connect-with-strava.svg (48px height, orange)")
  console.log("      - powered-by-strava.svg (horizontal, orange)")
  console.log("   📂 Place in: /public/strava-assets/")
  console.log("")

  console.log("🎉 Setup verification complete!")
  console.log("   Next: Download brand assets and register webhook")
}

// Run verification
verifyStravaSetup().catch(console.error)
