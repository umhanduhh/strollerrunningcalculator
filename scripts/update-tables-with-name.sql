-- Add name column to feed_entries table
ALTER TABLE feed_entries ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing entries to have some sample names (optional)
UPDATE feed_entries SET name = 'Sarah' WHERE location = 'Portland, Oregon, USA';
UPDATE feed_entries SET name = 'Mike' WHERE location = 'Austin, Texas, USA';
UPDATE feed_entries SET name = 'Jessica' WHERE location = 'Vancouver, BC, Canada';
