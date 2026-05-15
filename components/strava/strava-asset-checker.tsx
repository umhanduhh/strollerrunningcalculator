"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Download, ExternalLink } from "lucide-react"

/**
 * Strava Asset Checker Component
 * Helps users verify they have the correct brand assets
 */
export default function StravaAssetChecker() {
  const [assetStatus, setAssetStatus] = useState({
    connectButton: false,
    poweredByLogo: false,
    loading: true,
  })

  useEffect(() => {
    checkAssets()
  }, [])

  const checkAssets = async () => {
    try {
      // Check if connect button exists
      const connectResponse = await fetch("/strava-assets/connect-with-strava.svg")
      const connectExists = connectResponse.ok

      // Check if powered by logo exists
      const poweredResponse = await fetch("/strava-assets/powered-by-strava.svg")
      const poweredExists = poweredResponse.ok

      setAssetStatus({
        connectButton: connectExists,
        poweredByLogo: poweredExists,
        loading: false,
      })
    } catch (error) {
      console.error("Error checking assets:", error)
      setAssetStatus({
        connectButton: false,
        poweredByLogo: false,
        loading: false,
      })
    }
  }

  const getStatusIcon = (exists: boolean) => {
    return exists ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-red-400" />
  }

  if (assetStatus.loading) {
    return (
      <Card className="w-full bg-black border-medium-purple">
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-black border-medium-purple">
      <CardHeader className="bg-medium-purple">
        <CardTitle className="text-white">🎨 Strava Brand Assets Status</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-medium-purple/20 rounded-lg">
            {getStatusIcon(assetStatus.connectButton)}
            <div className="flex-1">
              <h4 className="font-semibold text-white">Connect with Strava Button</h4>
              <p className="text-white/70 text-sm">
                {assetStatus.connectButton
                  ? "✅ Found: connect-with-strava.svg"
                  : "❌ Missing: connect-with-strava.svg"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-medium-purple/20 rounded-lg">
            {getStatusIcon(assetStatus.poweredByLogo)}
            <div className="flex-1">
              <h4 className="font-semibold text-white">Powered by Strava Logo</h4>
              <p className="text-white/70 text-sm">
                {assetStatus.poweredByLogo ? "✅ Found: powered-by-strava.svg" : "❌ Missing: powered-by-strava.svg"}
              </p>
            </div>
          </div>
        </div>

        {(!assetStatus.connectButton || !assetStatus.poweredByLogo) && (
          <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-400">Action Required: Download Correct Assets</h4>

                <div className="text-white/80 text-sm space-y-2">
                  <p>
                    <strong>Issue:</strong> You downloaded the WHITE "Connect with Strava" button, but you need the
                    ORANGE version for your dark theme.
                  </p>

                  <div className="space-y-1">
                    <p>
                      <strong>What you need:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>"Connect with Strava" button - ORANGE version (48px height)</li>
                      <li>"Powered by Strava" logo - horizontal, orange</li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <p>
                      <strong>How to fix:</strong>
                    </p>
                    <ol className="list-decimal list-inside ml-4 space-y-1">
                      <li>Go back to Strava brand guidelines</li>
                      <li>Download the ORANGE "Connect with Strava" button</li>
                      <li>Download the "Powered by Strava" horizontal logo</li>
                      <li>Rename them to: connect-with-strava.svg and powered-by-strava.svg</li>
                      <li>Place in /public/strava-assets/ folder</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href="https://developers.strava.com/guidelines/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FC5200] hover:bg-[#E04402] text-white px-4 py-2 rounded-md font-semibold text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download Correct Assets
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Button
                    onClick={checkAssets}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Re-check Assets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {assetStatus.connectButton && assetStatus.poweredByLogo && (
          <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-green-400">All Assets Ready! 🎉</h4>
            </div>
            <p className="text-white/80 text-sm mt-2">Your Strava integration is properly branded and ready to use.</p>
          </div>
        )}

        <div className="border-t border-medium-purple/30 pt-4">
          <h4 className="font-semibold text-white mb-2">File Structure Should Be:</h4>
          <div className="bg-black/50 p-3 rounded font-mono text-xs text-lime">
            <div>/public/strava-assets/</div>
            <div>├── connect-with-strava.svg</div>
            <div>├── powered-by-strava.svg</div>
            <div>└── README.md</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
