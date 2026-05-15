-- Update strava_users table to add athlete information
ALTER TABLE strava_users 
ADD COLUMN IF NOT EXISTS athlete_gender TEXT,
ADD COLUMN IF NOT EXISTS athlete_weight NUMERIC;

-- Add comments
COMMENT ON COLUMN strava_users.athlete_gender IS 'Athlete gender for personalized calculations';
COMMENT ON COLUMN strava_users.athlete_weight IS 'Athlete weight in pounds for personalized calculations';
