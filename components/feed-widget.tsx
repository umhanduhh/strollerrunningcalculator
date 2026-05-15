"use client"

import { Button } from "@/components/ui/button"

interface FeedWidgetProps {
  id: string
  distance: number
  extraMiles: number
  equivalentDistance: number
  location: string
  name?: string
  timestamp: Date
  pushingMethod: string
  reactions: {
    muscle: number
    heart: number
    applause: number
  }
  userReactions: {
    muscle: boolean
    heart: boolean
    applause: boolean
  }
  onReaction: (entryId: string, reactionType: "muscle" | "heart" | "applause") => void
}

export default function FeedWidget({
  id,
  distance,
  extraMiles,
  equivalentDistance,
  location,
  name,
  timestamp,
  pushingMethod,
  reactions,
  userReactions,
  onReaction,
}: FeedWidgetProps) {
  const formatPushingMethod = (method: string) => {
    switch (method) {
      case "two-handed":
        return "Two-handed Push"
      case "one-handed":
        return "One-handed Push"
      case "push-and-chase":
        return "Push & Chase"
      default:
        return method
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const reactionButtons = [
    { type: "muscle" as const, emoji: "💪", label: "Strong!" },
    { type: "heart" as const, emoji: "❤️", label: "Love it!" },
    { type: "applause" as const, emoji: "👏", label: "Amazing!" },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🏃</span>
          </div>
          <div>
            {name && <p className="text-gray-900 font-medium">{name}</p>}
            <p className="text-gray-600 text-sm">{location}</p>
            <p className="text-gray-500 text-xs">{formatTimeAgo(timestamp)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-purple-600 font-bold text-xl">+{extraMiles}</p>
          <p className="text-gray-500 text-xs">bonus miles</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-100">
        <p className="text-gray-800">
          <span className="font-semibold">{distance} mile</span> stroller run felt like{" "}
          <span className="font-semibold text-purple-600">{equivalentDistance} miles!</span>
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
          {formatPushingMethod(pushingMethod)}
        </span>
      </div>

      {/* Reaction buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-100">
        <div className="flex gap-2">
          {reactionButtons.map(({ type, emoji, label }) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 px-3 py-2 h-auto text-xs rounded-full transition-all duration-200 ${
                userReactions[type]
                  ? "bg-purple-100 text-purple-600 border border-purple-200 cursor-default"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 cursor-pointer"
              }`}
              onClick={() => !userReactions[type] && onReaction(id, type)}
              title={userReactions[type] ? `You reacted with ${label}` : `React with ${label}`}
              disabled={userReactions[type]}
            >
              <span className="text-sm">{emoji}</span>
              {reactions[type] > 0 && <span className="font-medium">{reactions[type]}</span>}
            </Button>
          ))}
        </div>
        <div className="text-xs text-gray-400">
          {reactions.muscle + reactions.heart + reactions.applause > 0 && (
            <span>
              {reactions.muscle + reactions.heart + reactions.applause} reaction
              {reactions.muscle + reactions.heart + reactions.applause !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
