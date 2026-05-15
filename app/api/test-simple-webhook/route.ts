import type { NextRequest } from "next/server"

/**
 * Ultra-simple webhook test to isolate the issue
 */
export async function GET(request: NextRequest) {
  console.log("=== SIMPLE WEBHOOK TEST ===")
  console.log("URL:", request.url)
  console.log("Method:", request.method)

  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")

  console.log("Mode:", mode)
  console.log("Token:", token)
  console.log("Challenge:", challenge)

  // Always return the challenge for testing
  if (challenge) {
    console.log("Returning challenge:", challenge)
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  }

  return new Response("No challenge provided", {
    status: 400,
    headers: { "Content-Type": "text/plain" },
  })
}
