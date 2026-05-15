import type { NextRequest } from "next/server"

/**
 * Simple test endpoint to verify webhook functionality
 */
export async function GET(request: NextRequest) {
  console.log("🔍 Test webhook GET request received")
  console.log("URL:", request.url)
  console.log("Headers:", Object.fromEntries(request.headers.entries()))

  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  console.log("Parameters:", { mode, token, challenge })
  console.log("Expected token:", "stroller_webhook_2024_secure_token_xyz789")

  // Simple response for testing
  if (challenge) {
    console.log("✅ Returning challenge:", challenge)
    return new Response(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  return new Response("Test endpoint working", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
