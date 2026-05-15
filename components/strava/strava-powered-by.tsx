"use client"

import Image from "next/image"

interface StravaPoweredByProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * "Powered by Strava" logo component
 * COMPLIANCE: Required on every page of the app per Strava brand guidelines
 * - Horizontal format in orange color
 * - Must be separate from app logo and not more prominent
 * - Uses official SVG assets
 */
export default function StravaPoweredBy({ className = "", size = "md" }: StravaPoweredByProps) {
  const dimensions = {
    sm: { width: 120, height: 24 },
    md: { width: 150, height: 30 },
    lg: { width: 200, height: 40 },
  }

  const { width, height } = dimensions[size]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/strava-assets/powered-by-strava.svg"
        alt="Powered by Strava"
        width={width}
        height={height}
        className="opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  )
}
