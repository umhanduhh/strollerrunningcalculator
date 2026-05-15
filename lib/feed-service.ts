import { supabase, type FeedEntry, type Reaction } from "./supabase"

// Generate a simple user ID based on browser fingerprint
function getUserId(): string {
  if (typeof window === "undefined") return "server-user"

  // Create a simple user identifier based on browser characteristics
  const userAgent = navigator.userAgent
  const language = navigator.language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const screen = `${window.screen.width}x${window.screen.height}`

  // Create a hash-like identifier
  const identifier = `${userAgent}-${language}-${timezone}-${screen}`
  return btoa(identifier).slice(0, 16) // Simple base64 encoding, truncated
}

export async function getFeedEntries() {
  const userId = getUserId()

  console.log("Attempting to fetch feed entries from Supabase...")

  // Get all feed entries
  const { data: entries, error: entriesError } = await supabase
    .from("feed_entries")
    .select("*")
    .order("created_at", { ascending: false })

  if (entriesError) {
    console.error("Error fetching feed entries:", entriesError)
    console.error("Error details:", JSON.stringify(entriesError, null, 2))
    return []
  }

  console.log("Raw entries from database:", entries)

  // Get all reactions
  const { data: reactions, error: reactionsError } = await supabase.from("reactions").select("*")

  if (reactionsError) {
    console.error("Error fetching reactions:", reactionsError)
    return []
  }

  // Combine entries with reaction data
  const processedEntries = entries.map((entry: FeedEntry) => {
    const entryReactions = reactions.filter((r: Reaction) => r.entry_id === entry.id)

    const reactionCounts = {
      muscle: entryReactions.filter((r) => r.reaction_type === "muscle").length,
      heart: entryReactions.filter((r) => r.reaction_type === "heart").length,
      applause: entryReactions.filter((r) => r.reaction_type === "applause").length,
    }

    const userReactions = {
      muscle: entryReactions.some((r) => r.reaction_type === "muscle" && r.user_id === userId),
      heart: entryReactions.some((r) => r.reaction_type === "heart" && r.user_id === userId),
      applause: entryReactions.some((r) => r.reaction_type === "applause" && r.user_id === userId),
    }

    return {
      id: entry.id,
      distance: entry.distance,
      extraMiles: entry.extra_miles,
      equivalentDistance: entry.equivalent_distance,
      location: entry.location,
      name: entry.name, // Make sure we're mapping the name field
      timestamp: new Date(entry.created_at),
      pushingMethod: entry.pushing_method,
      reactions: reactionCounts,
      userReactions,
    }
  })

  console.log("Processed entries:", processedEntries)
  return processedEntries
}

// Updated function signature to explicitly include name
export async function createFeedEntry(data: {
  distance: number
  extraMiles: number
  equivalentDistance: number
  location: string
  name?: string
  pushingMethod: "two-handed" | "one-handed" | "push-and-chase"
}): Promise<string | null> {
  console.log("=== FEED SERVICE DEBUG ===")
  console.log("createFeedEntry received data:", JSON.stringify(data, null, 2))
  console.log("Name value specifically:", data.name)
  console.log("Name type:", typeof data.name)

  // Prepare the data for insertion - be very explicit
  const insertData: any = {
    distance: data.distance,
    extra_miles: data.extraMiles,
    equivalent_distance: data.equivalentDistance,
    location: data.location,
    pushing_method: data.pushingMethod,
  }

  // Only add name if it exists and is not empty
  if (data.name && data.name.trim() !== "") {
    insertData.name = data.name.trim()
    console.log("Adding name to insert data:", insertData.name)
  } else {
    console.log("No name provided or name is empty")
  }

  console.log("Final insert data:", JSON.stringify(insertData, null, 2))

  const { data: entry, error } = await supabase.from("feed_entries").insert(insertData).select().single()

  if (error) {
    console.error("Error creating feed entry:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return null
  }

  console.log("Created entry from Supabase:", JSON.stringify(entry, null, 2))
  return entry.id
}

export async function addReaction(entryId: string, reactionType: "muscle" | "heart" | "applause"): Promise<boolean> {
  const userId = getUserId()

  // Check if user already reacted with this type
  const { data: existingReaction } = await supabase
    .from("reactions")
    .select("id")
    .eq("entry_id", entryId)
    .eq("user_id", userId)
    .eq("reaction_type", reactionType)
    .single()

  if (existingReaction) {
    return false // User already reacted
  }

  const { error } = await supabase.from("reactions").insert({
    entry_id: entryId,
    user_id: userId,
    reaction_type: reactionType,
  })

  if (error) {
    console.error("Error adding reaction:", error)
    return false
  }

  return true
}

export type FeedEntryWithReactions = {
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
}
