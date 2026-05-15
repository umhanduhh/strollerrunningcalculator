-- Create Strava integration tables

-- Users who have connected their Strava accounts
CREATE TABLE IF NOT EXISTS strava_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strava_user_id BIGINT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  athlete_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities that have been processed by our webhook
CREATE TABLE IF NOT EXISTS processed_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id BIGINT UNIQUE NOT NULL,
  strava_user_id BIGINT REFERENCES strava_users(strava_user_id) ON DELETE CASCADE,
  original_distance DECIMAL(6,2) NOT NULL,
  equivalent_distance DECIMAL(6,2) NOT NULL,
  extra_miles DECIMAL(6,2) NOT NULL,
  hashtag_used TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_strava_users_strava_id ON strava_users(strava_user_id);
CREATE INDEX IF NOT EXISTS idx_processed_activities_activity_id ON processed_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_processed_activities_user_id ON processed_activities(strava_user_id);
CREATE INDEX IF NOT EXISTS idx_processed_activities_processed_at ON processed_activities(processed_at DESC);
