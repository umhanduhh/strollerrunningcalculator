"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface ComplianceCheck {
  name: string
  description: string
  status: "pass" | "fail" | "warning"
  details?: string
}

/**
 * Strava Brand Guidelines Compliance Checker
 * Validates that all required branding elements are properly implemented
 */
export default function ComplianceChecker() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const runComplianceChecks = () => {
    const results: ComplianceCheck[] = []

    // Check for "Powered by Strava" logo
    const poweredByLogo = document.querySelector('img[alt="Powered by Strava"]')
    results.push({
      name: "Powered by Strava Logo",
      description: "Required on every page of the app",
      status: poweredByLogo ? "pass" : "fail",
      details: poweredByLogo ? "Found on page" : "Missing from page",
    })

    // Check for official Connect button
    const connectButton = document.querySelector('img[alt="Connect with Strava"]')
    results.push({
      name: "Official Connect Button",
      description: 'Must use official "Connect with Strava" button',
      status: connectButton ? "pass" : "warning",
      details: connectButton ? "Official button found" : "Check if using official button assets",
    })

    // Check for "View on Strava" links
    const stravaLinks = document.querySelectorAll('a[href*="strava.com/activities"]')
    results.push({
      name: "View on Strava Links",
      description: "All Strava data must include links back to Strava",
      status: stravaLinks.length > 0 ? "pass" : "warning",
      details: `Found ${stravaLinks.length} Strava activity links`,
    })

    // Check for proper orange color usage
    const orangeElements = document.querySelectorAll('[style*="#FC5200"], .text-\\[\\#FC5200\\]')
    results.push({
      name: "Strava Orange Color",
      description: "Links should use official Strava orange (#FC5200)",
      status: orangeElements.length > 0 ? "pass" : "warning",
      details: `Found ${orangeElements.length} elements using Strava orange`,
    })

    // Check for brand asset files
    const assetChecks = ["connect-with-strava.svg", "powered-by-strava.svg"]

    let assetsFound = 0
    assetChecks.forEach((asset) => {
      const img = document.querySelector(`img[src*="${asset}"]`)
      if (img) assetsFound++
    })

    results.push({
      name: "Brand Assets",
      description: "Official Strava brand assets must be used",
      status: assetsFound === assetChecks.length ? "pass" : "warning",
      details: `${assetsFound}/${assetChecks.length} official assets detected`,
    })

    setChecks(results)
  }

  useEffect(() => {
    if (isVisible) {
      runComplianceChecks()
    }
  }, [isVisible])

  const getStatusIcon = (status: ComplianceCheck["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: ComplianceCheck["status"]) => {
    switch (status) {
      case "pass":
        return "text-green-400"
      case "fail":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsVisible(true)} className="bg-[#FC5200] hover:bg-[#E04402] text-white" size="sm">
          Check Compliance
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-black border-medium-purple">
        <CardHeader className="bg-medium-purple">
          <CardTitle className="text-white">Strava Brand Guidelines Compliance</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-medium-purple/20 rounded-lg">
                {getStatusIcon(check.status)}
                <div className="flex-1">
                  <h4 className={`font-semibold ${getStatusColor(check.status)}`}>{check.name}</h4>
                  <p className="text-white/70 text-sm">{check.description}</p>
                  {check.details && <p className="text-white/60 text-xs mt-1">{check.details}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-medium-purple/30 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Compliance Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {checks.filter((c) => c.status === "pass").length}
                </div>
                <div className="text-xs text-white/70">Passing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {checks.filter((c) => c.status === "warning").length}
                </div>
                <div className="text-xs text-white/70">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {checks.filter((c) => c.status === "fail").length}
                </div>
                <div className="text-xs text-white/70">Failing</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={runComplianceChecks} className="flex-1 bg-lime hover:bg-lime/80 text-black">
              Re-check
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
