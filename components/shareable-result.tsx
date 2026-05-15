interface ShareableResultProps {
  distance: number
  pace: string
  elevationGain: number
  extraMiles: number
  equivalentDistance: number | null
  pushingMethod: string
}

export default function ShareableResult({
  distance,
  pace,
  elevationGain,
  extraMiles,
  equivalentDistance,
  pushingMethod,
}: ShareableResultProps) {
  // Format pushing method for display
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

  return (
    <div className="w-full aspect-[9/16] bg-gradient-to-b from-[#49205e] to-[#805ba5] rounded-3xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#bc5190] p-6 text-center">
        <h1 className="text-3xl font-bold text-[#d9e254] drop-shadow-md">Stroller Run</h1>
        <p className="text-[#d9e254]/90 text-lg">Push it, push it real good.</p>
      </div>

      {/* Run Details */}
      <div className="bg-[#49205e]/80 p-6 rounded-t-3xl flex-1 flex flex-col">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[#d9e254] text-lg">Distance:</span>
            <span className="text-[#d9e254] text-xl font-bold">{distance} miles</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#d9e254] text-lg">Pace:</span>
            <span className="text-[#d9e254] text-xl font-bold">{pace} min/mile</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#d9e254] text-lg">Elevation:</span>
            <span className="text-[#d9e254] text-xl font-bold">{elevationGain} ft</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#d9e254] text-lg">Method:</span>
            <span className="text-[#d9e254] text-xl font-bold">{formatPushingMethod(pushingMethod)}</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#bc5190] p-4 rounded-2xl mb-4">
          <h2 className="text-2xl font-bold text-[#d9e254] text-center mb-2">Results</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#d9e254] text-lg">Extra miles:</span>
              <span className="text-[#d9e254] text-2xl font-bold">{extraMiles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#d9e254] text-lg">Equivalent to:</span>
              <span className="text-[#d9e254] text-2xl font-bold">{equivalentDistance} miles</span>
            </div>
          </div>
        </div>

        <p className="text-[#d9e254] text-center text-lg">
          Pushing a stroller made my {distance} mile run feel like {equivalentDistance} miles!
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <p className="text-[#d9e254]/80 text-sm">Calculate your stroller running effort at</p>
          <p className="text-[#d9e254] font-bold">StrollerRunningCalculator.com</p>
        </div>
      </div>
    </div>
  )
}
