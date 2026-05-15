"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface StravaConnectButtonProps {
  onClick: () => void
  isConnecting?: boolean
  className?: string
}

/**
 * Official Strava "Connect with Strava" button component
 * COMPLIANCE: Uses official Strava button assets as required by brand guidelines
 * - Button height: 48px @1x (as specified)
 * - Orange version (as required for dark backgrounds)
 * - No modifications to official button design
 */
export default function StravaConnectButton({
  onClick,
  isConnecting = false,
  className = "",
}: StravaConnectButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isConnecting}
      className={`h-12 px-0 bg-transparent hover:bg-transparent border-none shadow-none ${className}`}
      style={{ height: "48px" }} // Exact height requirement
    >
      {isConnecting ? (
        <div className="flex items-center justify-center h-12 px-6 bg-[#FC5200] rounded-md">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          <span className="text-white font-semibold">Connecting...</span>
        </div>
      ) : (
        <Image
          src="/strava-assets/connect-with-strava.svg"
          alt="Connect with Strava"
          width={200}
          height={48}
          className="cursor-pointer"
          priority
        />
      )}
    </Button>
  )
}
