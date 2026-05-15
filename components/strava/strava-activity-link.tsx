"use client"

import type React from "react"

import { ExternalLink } from "lucide-react"

interface StravaActivityLinkProps {
  activityId: string | number
  children?: React.ReactNode
  className?: string
  showIcon?: boolean
}

/**
 * "View on Strava" link component
 * COMPLIANCE: Required for ALL Strava data displayed per brand guidelines
 * - Uses Strava orange color (#FC5200) or bold styling
 * - Links back to original activity on Strava
 * - Text must be legible and identifiable
 */
export default function StravaActivityLink({
  activityId,
  children = "View on Strava",
  className = "",
  showIcon = true,
}: StravaActivityLinkProps) {
  const stravaUrl = `https://www.strava.com/activities/${activityId}`

  return (
    <a
      href={stravaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 font-bold text-[#FC5200] hover:text-[#E04402] transition-colors underline ${className}`}
    >
      {children}
      {showIcon && <ExternalLink className="h-3 w-3" />}
    </a>
  )
}
