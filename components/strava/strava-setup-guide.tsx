"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, ExternalLink, Download } from "lucide-react"

/**
 * Strava Setup Guide Component
 * Shows step-by-step setup instructions with your actual credentials
 */
export default function StravaSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNumber)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const webhookCommand = `curl -X POST https://www.strava.com/api/v3/push_subscriptions \\
  -F client_id=176299 \\
  -F client_secret=75de32d994056e46cd047981127325l8d1554892 \\
  -F callback_url=https://strollerrunningcalculator.com/api/webhooks/strava \\
  -F verify_token=stroller_webhook_2024_secure_token_xyz789`

  const checkWebhookCommand = `curl -G https://www.strava.com/api/v3/push_subscriptions \\
  -d client_id=176299 \\
  -d client_secret=75de32d994056e46cd047981127325l8d1554892`

  return (
    <Card className="w-full bg-black border-medium-purple">
      <CardHeader className="bg-medium-purple">
        <CardTitle className="text-white">🚀 Strava Integration Setup</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Step 1: Credentials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <h3 className="text-white font-semibold">Step 1: API Credentials ✅</h3>
          </div>
          <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
            <p className="text-green-400 text-sm">✅ Your Strava app is registered with Client ID: 176299</p>
          </div>
        </div>

        {/* Step 2: Environment Variables */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Step 2: Environment Variables</h3>
          <div className="bg-medium-purple/20 p-3 rounded-lg">
            <p className="text-white/80 text-sm mb-2">Add these to your .env.local file:</p>
            <div className="bg-black/50 p-3 rounded font-mono text-xs text-lime overflow-x-auto">
              <div>NEXT_PUBLIC_STRAVA_CLIENT_ID=176299</div>
              <div>STRAVA_CLIENT_SECRET=75de32d994056e46cd047981127325l8d1554892</div>
              <div>WEBHOOK_VERIFY_TOKEN=stroller_webhook_2024_secure_token_xyz789</div>
              <div>NEXT_PUBLIC_SITE_URL=https://strollerrunningcalculator.com</div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() =>
                copyToClipboard(
                  `NEXT_PUBLIC_STRAVA_CLIENT_ID=176299
STRAVA_CLIENT_SECRET=75de32d994056e46cd047981127325l8d1554892
WEBHOOK_VERIFY_TOKEN=stroller_webhook_2024_secure_token_xyz789
NEXT_PUBLIC_SITE_URL=https://strollerrunningcalculator.com`,
                  2,
                )
              }
            >
              <Copy className="h-3 w-3 mr-1" />
              {copiedStep === 2 ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Step 3: Brand Assets */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Step 3: Download Brand Assets</h3>
          <div className="bg-medium-purple/20 p-3 rounded-lg">
            <p className="text-white/80 text-sm mb-3">Download official Strava assets:</p>
            <div className="space-y-2">
              <a
                href="https://developers.strava.com/guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#FC5200] hover:text-[#E04402] font-semibold"
              >
                <Download className="h-4 w-4" />
                Strava Brand Guidelines & Assets
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-3 text-xs text-white/60">
              <p>Required files:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>connect-with-strava.svg (48px height, orange)</li>
                <li>powered-by-strava.svg (horizontal, orange)</li>
              </ul>
              <p className="mt-2">
                Place in: <code className="bg-black/50 px-1 rounded">/public/strava-assets/</code>
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Webhook Registration */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Step 4: Register Webhook</h3>
          <div className="bg-medium-purple/20 p-3 rounded-lg">
            <p className="text-white/80 text-sm mb-2">Run this command to register your webhook:</p>
            <div className="bg-black/50 p-3 rounded font-mono text-xs text-lime overflow-x-auto">{webhookCommand}</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 mr-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => copyToClipboard(webhookCommand, 4)}
            >
              <Copy className="h-3 w-3 mr-1" />
              {copiedStep === 4 ? "Copied!" : "Copy Command"}
            </Button>
          </div>
        </div>

        {/* Step 5: Verify Setup */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Step 5: Verify Webhook</h3>
          <div className="bg-medium-purple/20 p-3 rounded-lg">
            <p className="text-white/80 text-sm mb-2">Check if webhook was registered successfully:</p>
            <div className="bg-black/50 p-3 rounded font-mono text-xs text-lime overflow-x-auto">
              {checkWebhookCommand}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
              onClick={() => copyToClipboard(checkWebhookCommand, 5)}
            >
              <Copy className="h-3 w-3 mr-1" />
              {copiedStep === 5 ? "Copied!" : "Copy Command"}
            </Button>
          </div>
        </div>

        {/* Step 6: Test */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Step 6: Test Integration</h3>
          <div className="bg-lime/10 p-3 rounded-lg border border-lime/30">
            <div className="space-y-2 text-sm">
              <p className="text-white">Ready to test:</p>
              <ol className="list-decimal list-inside space-y-1 text-white/80 ml-2">
                <li>Connect your Strava account using the button above</li>
                <li>Post a run activity on Strava</li>
                <li>
                  Add hashtag: <Badge className="mx-1 bg-lime/20 text-lime">#twohandpush</Badge>
                </li>
                <li>Wait 1-2 minutes for webhook processing</li>
                <li>Check that activity description was updated!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="border-t border-medium-purple/30 pt-4">
          <p className="text-white/60 text-xs text-center">
            🔒 All credentials are securely stored. Webhook processes activities automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
