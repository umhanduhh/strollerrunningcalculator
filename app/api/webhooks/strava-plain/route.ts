import type { NextRequest } from "next/server"

/**
 * Strava webhook handler - Plain Text Response (Standard)
 */

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()
  console.log(`🔍 [${timestamp}] PLAIN TEXT webhook GET`)
  console.log(`🔍 [${timestamp}] URL: ${request.url}`)

  try {
    const url = new URL(request.url)
    const mode = url.searchParams.get("hub.mode")
    const token = url.searchParams.get("hub.verify_token")
    const challenge = url.searchParams.get("hub.challenge")

    console.log(`🔍 [${timestamp}] mode=${mode}, token=${token}, challenge=${challenge}`)

    const validTokens = [
      "stroller_webhook_2024_secure_token_xyz789",
      "super_fresh_jan_09_2025_v2",
      "fresh_token_2025_jan_09_unique",
    ]

    if (mode === "subscribe") {
      const isValidToken = validTokens.includes(token)

      if (isValidToken && challenge) {
        console.log(`✅ [${timestamp}] Returning plain text challenge: "${challenge}"`)

        return new Response(challenge, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Length": challenge.length.toString(),
          },
        })
      } else {
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
