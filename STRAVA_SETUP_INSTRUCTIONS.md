# Strava Integration Setup Instructions

## 1. Register Your App with Strava

1. Go to https://www.strava.com/settings/api
2. Create a new application with these settings:
   - Application Name: "Stroller Running Calculator"
   - Category: "Training"
   - Club: Leave blank
   - Website: Your app's URL
   - Authorization Callback Domain: Your domain (e.g., "strollerrunningcalculator.com")
   - Description: "Calculate equivalent distances for stroller running activities"

3. Note your Client ID and Client Secret

## 2. Download Official Brand Assets

1. Visit https://developers.strava.com/guidelines/
2. Download the following assets:
   - "Connect with Strava" button (orange, 48px height)
   - "Powered by Strava" logo (horizontal, orange)
   - Save as SVG format for web use

3. Place assets in `/public/strava-assets/` directory:
   \`\`\`
   /public/strava-assets/
   ├── connect-with-strava.svg
   ├── powered-by-strava.svg
   └── README.md
   \`\`\`

## 3. Environment Variables

Add to your `.env.local`:

\`\`\`env
# Strava API Configuration
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
WEBHOOK_VERIFY_TOKEN=your_random_webhook_token_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Database (already configured)
DATABASE_URL=your_supabase_connection_string
\`\`\`

## 4. Database Setup

Run the Strava tables creation script:
\`\`\`sql
-- Run scripts/create-strava-tables.sql in your Supabase dashboard
\`\`\`

## 5. Webhook Registration

1. Make your webhook endpoint publicly accessible: `https://your-domain.com/api/webhooks/strava`

2. Register webhook with Strava:
\`\`\`bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=YOUR_CLIENT_ID \
  -F client_secret=YOUR_CLIENT_SECRET \
  -F callback_url=https://your-domain.com/api/webhooks/strava \
  -F verify_token=YOUR_WEBHOOK_VERIFY_TOKEN
\`\`\`

3. Verify webhook is registered:
\`\`\`bash
curl -G https://www.strava.com/api/v3/push_subscriptions \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET
\`\`\`

## 6. Brand Guidelines Compliance Checklist

### Required Elements:
- [ ] Official "Connect with Strava" button (48px height, orange)
- [ ] "Powered by Strava" logo on every page
- [ ] "View on Strava" links for all activity data
- [ ] Proper attribution text in footer
- [ ] Orange color (#FC5200) for Strava links

### Prohibited:
- [ ] No modifications to Strava logos
- [ ] No animations of Strava assets
- [ ] No implying app is developed by Strava
- [ ] Strava name not larger than surrounding text

### Legal Compliance:
- [ ] Terms of service mention Strava integration
- [ ] Privacy policy covers Strava data usage
- [ ] Proper "Compatible with Strava" language

## 7. Testing

1. Connect a test Strava account
2. Post an activity with hashtag: #twohandpush, #onehandpush, or #pushandchase
3. Verify webhook processes the activity
4. Check that description is updated with equivalent distance
5. Run compliance checker in development mode

## 8. Rate Limits

Strava API limits:
- 100 requests per 15 minutes
- 1000 requests per day
- Implement proper error handling and retry logic

## 9. Monitoring

Set up logging for:
- Webhook events received
- Activities processed successfully
- API errors and rate limit hits
- Token refresh operations

## 10. Legal Requirements

Update your Terms of Service and Privacy Policy to include:
- Strava data usage disclosure
- User consent for activity processing
- Data retention policies
- Right to disconnect Strava account

## Support

For Strava API issues:
- Documentation: https://developers.strava.com/docs/
- Support: https://communityhub.strava.com/t5/developer-discussions/bd-p/developers

For brand guideline questions:
- Guidelines: https://developers.strava.com/guidelines/
- Contact Strava developer support
