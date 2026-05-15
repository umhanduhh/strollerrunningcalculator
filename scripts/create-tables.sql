-- Create the feed_entries table
CREATE TABLE IF NOT EXISTS feed_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  distance DECIMAL(4,1) NOT NULL,
  extra_miles DECIMAL(4,2) NOT NULL,
  equivalent_distance DECIMAL(4,2) NOT NULL,
  location TEXT NOT NULL,
  pushing_method TEXT NOT NULL CHECK (pushing_method IN ('two-handed', 'one-handed', 'push-and-chase')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID REFERENCES feed_entries(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Simple user identifier (could be IP or session ID)
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('muscle', 'heart', 'applause')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entry_id, user_id, reaction_type) -- Prevent duplicate reactions
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feed_entries_created_at ON feed_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_entry_id ON reactions(entry_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);

-- Insert some sample data
INSERT INTO feed_entries (distance, extra_miles, equivalent_distance, location, pushing_method, created_at) VALUES
(5.0, 0.8, 5.8, 'Portland, Oregon, USA', 'two-handed', NOW() - INTERVAL '2 hours'),
(3.1, 0.6, 3.7, 'Austin, Texas, USA', 'push-and-chase', NOW() - INTERVAL '5 hours'),
(10.0, 1.4, 11.4, 'Vancouver, BC, Canada', 'one-handed', NOW() - INTERVAL '1 day');

-- Insert some sample reactions
INSERT INTO reactions (entry_id, user_id, reaction_type) 
SELECT 
  fe.id,
  'sample_user_' || generate_series(1, 12),
  'muscle'
FROM feed_entries fe 
WHERE fe.location = 'Portland, Oregon, USA';

INSERT INTO reactions (entry_id, user_id, reaction_type) 
SELECT 
  fe.id,
  'sample_user_' || generate_series(1, 8),
  'heart'
FROM feed_entries fe 
WHERE fe.location = 'Portland, Oregon, USA';

INSERT INTO reactions (entry_id, user_id, reaction_type) 
SELECT 
  fe.id,
  'sample_user_' || generate_series(1, 15),
  'applause'
FROM feed_entries fe 
WHERE fe.location = 'Portland, Oregon, USA';
