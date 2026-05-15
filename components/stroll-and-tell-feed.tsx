import FeedWidget from "./feed-widget"
import type { FeedEntryWithReactions } from "@/lib/feed-service"

interface StrollAndTellFeedProps {
  entries: FeedEntryWithReactions[]
  onReaction: (entryId: string, reactionType: "muscle" | "heart" | "applause") => void
  loading?: boolean
}

export default function StrollAndTellFeed({ entries, onReaction, loading = false }: StrollAndTellFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-8 min-h-[600px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Feed</h2>
          <p className="text-gray-600">Loading amazing stroller running stories...</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-h-[600px]">
      <div className="text-center mb-8">
        <div className="section-header justify-center border-b-0 pb-0">
          <h2 className="text-2xl font-bold">Community Feed</h2>
        </div>
        <p className="text-gray-600 mb-2">See how stroller runners around the world are crushing their bonus miles!</p>
        <p className="text-gray-500 text-sm">Show some love with 💪 ❤️ 👏</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏃‍♀️👶</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories yet!</h3>
          <p className="text-gray-600">Be the first to share your stroller running achievement.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {entries.map((entry) => (
            <FeedWidget
              key={entry.id}
              id={entry.id}
              distance={entry.distance}
              extraMiles={entry.extraMiles}
              equivalentDistance={entry.equivalentDistance}
              location={entry.location}
              name={entry.name}
              timestamp={entry.timestamp}
              pushingMethod={entry.pushingMethod}
              reactions={entry.reactions}
              userReactions={entry.userReactions}
              onReaction={onReaction}
            />
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-gray-500 text-sm">
            🎉 Amazing work, stroller running community! Keep those bonus miles coming!
          </p>
        </div>
      )}
    </div>
  )
}
