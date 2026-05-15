-- Add user profile fields to strava_users table for personalized calculations

ALTER TABLE strava_users
ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stroller_name TEXT,
ADD COLUMN IF NOT EXISTS stroller_weight DECIMAL(5,1),
-- Removed child_gender column as it's no longer needed
ADD COLUMN IF NOT EXISTS child_weight DECIMAL(5,1);

-- Create index for querying users who haven't completed setup
CREATE INDEX IF NOT EXISTS idx_strava_users_setup_completed ON strava_users(setup_completed);
