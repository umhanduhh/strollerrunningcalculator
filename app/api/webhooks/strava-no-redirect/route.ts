import type { NextRequest } from "next/server"

/**
 * Alternative webhook endpoint with enhanced logging
 */

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()

  // Log EVERYTHING
  console.log(`🔍 [${timestamp}] ===== WEBHOOK REQUEST START =====`)
  console.log(`🔍 [${timestamp}] Method: ${request.method}`)
  console.log(`🔍 [${timestamp}] URL: ${request.url}`)
  console.log(`🔍 [${timestamp}] Host: ${request.headers.get("host")}`)
  console.log(`🔍 [${timestamp}] User-Agent: ${request.headers.get("user-agent")}`)
  console.log(`🔍 [${timestamp}] All Headers:`, Object.fromEntries(request.headers.entries()))

  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    console.log(`🔍 [${timestamp}] Parameters:`)
    console.log(`🔍 [${timestamp}]   mode: "${mode}"`)
    console.log(`🔍 [${timestamp}]   token: "${token}"`)
    console.log(`🔍 [${timestamp}]   challenge: "${challenge}"`)

    // Accept multiple tokens
    const validTokens = [
      "super_fresh_jan_09_2025_v2",
      "fresh_token_2025_jan_09_unique",
      "stroller_running_webhook_verify_123",
      process.env.WEBHOOK_VERIFY_TOKEN,
    ]

    console.log(`🔍 [${timestamp}] Valid tokens: ${validTokens.filter(Boolean)}`)

    if (mode === "subscribe") {
      const isValidToken = validTokens.includes(token)
      console.log(`🔍 [${timestamp}] Token validation: ${isValidToken}`)

      if (isValidToken && challenge) {
        console.log(`✅ [${timestamp}] SUCCESS! Returning challenge: "${challenge}"`)

        const response = new Response(challenge, {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        })

        console.log(`✅ [${timestamp}] Response status: 200`)
        console.log(`✅ [${timestamp}] Response body: "${challenge}"`)
        console.log(`🔍 [${timestamp}] ===== WEBHOOK REQUEST END =====`)

        return response
      } else {
        console.log(`❌ [${timestamp}] Invalid token or missing challenge`)
        console.log(`❌ [${timestamp}] Token: "${token}", Challenge: "${challenge}"`)
        return new Response("Forbidden", { status: 403 })
      }
    }

    console.log(`🔍 [${timestamp}] Non-subscribe request, returning ready message`)
    return new Response("Webhook ready", { status: 200 })
  } catch (error) {
    console.error(`❌ [${timestamp}] Error:`, error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString()
  console.log(`📡 [${timestamp}] ===== WEBHOOK POST START =====`)
  console.log(`📡 [${timestamp}] Headers:`, Object.fromEntries(request.headers.entries()))

  try {
    const body = await request.text()
    console.log(`📡 [${timestamp}] Body: ${body}`)
    console.log(`📡 [${timestamp}] ===== WEBHOOK POST END =====`)
    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error(`❌ [${timestamp}] POST error:`, error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
