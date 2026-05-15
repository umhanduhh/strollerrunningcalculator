/**
 * Strava Webhook Registration Script
 * Run this after deploying your app to register the webhook with Strava
 */

const STRAVA_CLIENT_ID = "176299"
const STRAVA_CLIENT_SECRET = "75de32d994056e46cd047981127325l8d1554892"
const WEBHOOK_VERIFY_TOKEN = "stroller_webhook_2024_secure_token_xyz789"
const CALLBACK_URL = "https://strollerrunningcalculator.com/api/webhooks/strava"

async function registerWebhook() {
  console.log("🔗 Registering Strava Webhook...")
  console.log("=====================================")

  try {
    // Register the webhook
    const formData = new FormData()
    formData.append("client_id", STRAVA_CLIENT_ID)
    formData.append("client_secret", STRAVA_CLIENT_SECRET)
    formData.append("callback_url", CALLBACK_URL)
    formData.append("verify_token", WEBHOOK_VERIFY_TOKEN)

    console.log("📡 Sending registration request to Strava...")
    console.log(`   Callback URL: ${CALLBACK_URL}`)
    console.log(`   Client ID: ${STRAVA_CLIENT_ID}`)

    const response = await fetch("https://www.strava.com/api/v3/push_subscriptions", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Webhook registered successfully!")
      console.log("   Subscription ID:", result.id)
      console.log("   Callback URL:", result.callback_url)
      console.log("")

      // Verify the registration
      console.log("🔍 Verifying webhook registration...")
      await verifyWebhook()
    } else {
      const error = await response.text()
      console.log("❌ Webhook registration failed:")
      console.log("   Status:", response.status)
      console.log("   Error:", error)

      if (response.status === 409) {
        console.log("   Note: This usually means a webhook is already registered.")
        console.log("   Check existing webhooks with the verify command below.")
      }
    }
  } catch (error) {
    console.log("❌ Registration error:", error)
  }

  console.log("")
  console.log("📋 Manual Commands (if needed):")
  console.log("================================")
  console.log("Register webhook:")
  console.log(`curl -X POST https://www.strava.com/api/v3/push_subscriptions \\`)
  console.log(`  -F client_id=${STRAVA_CLIENT_ID} \\`)
  console.log(`  -F client_secret=${STRAVA_CLIENT_SECRET} \\`)
  console.log(`  -F callback_url=${CALLBACK_URL} \\`)
  console.log(`  -F verify_token=${WEBHOOK_VERIFY_TOKEN}`)
  console.log("")
  console.log("Check existing webhooks:")
  console.log(`curl -G https://www.strava.com/api/v3/push_subscriptions \\`)
  console.log(`  -d client_id=${STRAVA_CLIENT_ID} \\`)
  console.log(`  -d client_secret=${STRAVA_CLIENT_SECRET}`)
}

async function verifyWebhook() {
  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/push_subscriptions?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`,
    )

    if (response.ok) {
      const subscriptions = await response.json()
      console.log("📋 Current webhook subscriptions:")

      if (subscriptions.length === 0) {
        console.log("   No webhooks registered")
      } else {
        subscriptions.forEach((sub: any, index: number) => {
          console.log(`   ${index + 1}. ID: ${sub.id}`)
          console.log(`      URL: ${sub.callback_url}`)
          console.log(`      Created: ${sub.created_at}`)
        })
      }
    } else {
      console.log("❌ Failed to verify webhooks:", response.status)
    }
  } catch (error) {
    console.log("❌ Verification error:", error)
  }
}

// Run the registration
registerWebhook().catch(console.error)
