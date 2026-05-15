"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertCircle } from "lucide-react"
import StravaConnectButton from "./strava-connect-button"
import StravaActivityLink from "./strava-activity-link"
import StravaOnboardingModal from "./strava-onboarding-modal"
import { track } from "@vercel/analytics"

interface ProcessedActivity {
  id: string
  activity_id: number
  original_distance: number
  equivalent_distance: number
  extra_miles: number
  hashtag_used: string
  processed_at: string
}

/**
 * Clean Strava integration panel for production
 * COMPLIANCE: Includes all required branding and attribution
 */
export default function StravaIntegrationPanel() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [athleteName, setAthleteName] = useState("")
  const [athleteId, setAthleteId] = useState("")
  const [processedActivities, setProcessedActivities] = useState<ProcessedActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.get("strava_success") === "true") {
      const athleteIdFromUrl = urlParams.get("athlete_id") || ""
      const athleteNameFromUrl = urlParams.get("athlete_name") || ""

      setIsConnected(true)
      setAthleteName(athleteNameFromUrl)
      setAthleteId(athleteIdFromUrl)

      checkSetupStatus(athleteIdFromUrl)

      window.history.replaceState({}, document.title, window.location.pathname)

      track("Strava Connected", {
        athlete_id: athleteIdFromUrl,
        timestamp: new Date().toISOString(),
      })
    }

    if (isConnected) {
      loadProcessedActivities()
    }

    setLoading(false)
  }, [isConnected])

  const loadProcessedActivities = async () => {
    try {
      const response = await fetch("/api/strava/activities")
      if (response.ok) {
        const activities = await response.json()
        setProcessedActivities(activities)
      }
    } catch (error) {
      console.error("Failed to load processed activities:", error)
    }
  }

  const handleConnect = () => {
    setIsConnecting(true)
    track("Strava Connect Attempted", {
      timestamp: new Date().toISOString(),
    })

    window.location.href = "/api/auth/strava"
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAthleteName("")
    setAthleteId("")
    setProcessedActivities([])

    track("Strava Disconnected", {
      timestamp: new Date().toISOString(),
    })
  }

  const checkSetupStatus = async (athleteId: string) => {
    try {
      const response = await fetch(`/api/strava/check-setup?athleteId=${athleteId}`)
      if (response.ok) {
        const data = await response.json()
        if (!data.setupCompleted) {
          setShowOnboarding(true)
        }
      }
    } catch (error) {
      console.error("Failed to check setup status:", error)
    }
  }

  const formatHashtag = (hashtag: string) => {
    const hashtagMap = {
      "#twohandpush": "Two-Hand Push",
      "#onehandpush": "One-Hand Push",
      "#pushandchase": "Push & Chase",
    }
    return hashtagMap[hashtag as keyof typeof hashtagMap] || hashtag
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StravaOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        athleteId={athleteId}
        athleteName={athleteName}
      />

      {!isConnected ? (
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Strava Account</h2>
              <p className="text-gray-600 mb-6">
                Automatically update your stroller running activities with equivalent distance calculations based on the
                extra effort of pushing a stroller.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-100">
              <h4 className="font-semibold text-gray-900 mb-4">How it works:</h4>
              <ol className="text-left text-gray-700 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>Connect your Strava account using the official integration below</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <div>
                    Add hashtags to your stroller runs:{" "}
                    <Badge className="mx-1 bg-purple-600 text-white hover:bg-purple-700">#twohandpush</Badge>
                    <Badge className="mx-1 bg-purple-600 text-white hover:bg-purple-700">#onehandpush</Badge> or{" "}
                    <Badge className="mx-1 bg-purple-600 text-white hover:bg-purple-700">#pushandchase</Badge>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>Your activity description will automatically update with equivalent distance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    4
                  </span>
                  <span>Example: "Pushing a stroller made my 3.1 mile run feel like 3.6 miles!"</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="flex justify-center">
            <StravaConnectButton onClick={handleConnect} isConnecting={isConnecting} />
          </div>

          <div className="text-sm text-gray-500 max-w-md mx-auto bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="mb-2">
              <strong>Privacy:</strong> We only access your activity data to add stroller running calculations.
            </p>
            <p>You can disconnect at any time and we'll stop processing your activities.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Connected as {athleteName}</p>
                <p className="text-sm text-gray-600">Your stroller runs will be automatically processed</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Disconnect
            </Button>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Supported Hashtags
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-purple-600 text-white hover:bg-purple-700">#twohandpush</Badge>
              <Badge className="bg-purple-600 text-white hover:bg-purple-700">#onehandpush</Badge>
              <Badge className="bg-purple-600 text-white hover:bg-purple-700">#pushandchase</Badge>
            </div>
            <p className="text-gray-700 text-sm">Add any of these hashtags to your next stroller run on Strava!</p>
          </div>

          {processedActivities.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recently Processed Activities</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {processedActivities.map((activity) => (
                  <div key={activity.id} className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.original_distance} miles</span>
                          {" → "}
                          <span className="font-medium text-purple-600">{activity.equivalent_distance} miles</span>
                          <span className="text-gray-500 ml-2">(+{activity.extra_miles} miles)</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-white">
                            {formatHashtag(activity.hashtag_used)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.processed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <StravaActivityLink activityId={activity.activity_id} className="text-xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processedActivities.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">No Activities Processed Yet</h4>
              <p className="text-gray-600 text-sm">
                Add a hashtag (#twohandpush, #onehandpush, or #pushandchase) to your next stroller run on Strava!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
