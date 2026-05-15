import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Stroller Running Calculator",
  description: "Privacy Policy for Stroller Running Calculator - How we collect, use, and protect your information",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#49205e] to-[#805ba5]">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="calculator-card">
          <div className="prose prose-gray max-w-none p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-600 mb-8">
              <strong>Effective Date:</strong> December 9, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Stroller Running Calculator ("we," "our," or "us"). We respect your privacy and are committed
                to protecting your personal information. This Privacy Policy explains how we collect, use, and protect
                your information when you use our website at strollerrunningcalculator.com (the "Service").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Calculator Input Data:</strong> When you use our stroller running calculator, we may
                  temporarily process the information you enter (distance, pace, stroller type) to perform calculations.
                  This data is not stored permanently on our servers.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strava Integration (When Available)</h3>
              <p className="text-gray-700 mb-2">When you choose to connect your Strava account:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Strava Account Information:</strong> We receive your Strava user ID and basic profile
                  information
                </li>
                <li>
                  <strong>Activity Data:</strong> We access your Strava activities to detect specific hashtags
                  (#twohandpush, #onehandpush, #pushandchase) and modify activity descriptions
                </li>
                <li>
                  <strong>Authentication Tokens:</strong> We store encrypted access and refresh tokens to maintain your
                  Strava connection
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Website Usage:</strong> We may collect standard web analytics data including IP address,
                  browser type, pages visited, and time spent on our site
                </li>
                <li>
                  <strong>Cookies:</strong> We use essential cookies for website functionality and may use analytics
                  cookies with your consent
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-2">We use your information to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Provide stroller running calculations and equivalent distance estimates</li>
                <li>Connect with your Strava account when you authorize the integration</li>
                <li>Automatically update your Strava activity descriptions with calculated equivalent distances</li>
                <li>Improve our website functionality and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information only
                in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Strava Integration:</strong> When you authorize our app, we interact with Strava's API
                  according to their terms and only modify your own activity data
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or to protect our rights and safety
                </li>
                <li>
                  <strong>Service Providers:</strong> With trusted service providers who help operate our website
                  (hosting, analytics) under strict confidentiality agreements
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-2">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Encrypted storage of Strava authentication tokens</li>
                <li>Secure HTTPS connections</li>
                <li>Regular security updates and monitoring</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
              <p className="text-gray-700 mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Access:</strong> Request information about the data we have about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)
                </li>
                <li>
                  <strong>Strava Disconnection:</strong> Revoke Strava access at any time through your Strava account
                  settings
                </li>
                <li>
                  <strong>Cookie Control:</strong> Manage cookie preferences through your browser settings
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  <strong>Calculator Data:</strong> Temporarily processed and not permanently stored
                </li>
                <li>
                  <strong>Strava Integration Data:</strong> Retained while your Strava connection is active; deleted
                  when you disconnect
                </li>
                <li>
                  <strong>Analytics Data:</strong> Retained for up to 24 months for website improvement purposes
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strava</h3>
              <p className="text-gray-700 mb-4">
                When you connect your Strava account, you are also subject to Strava's Privacy Policy and Terms of
                Service. We only access and modify your Strava data as you have authorized.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-700 mb-4">
                We may use web analytics services to understand how our website is used. These services may collect
                anonymous usage data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 13. We do not knowingly collect personal information from
                children under 13. If you believe we have collected information from a child under 13, please contact us
                immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Users</h2>
              <p className="text-gray-700 mb-4">
                Our Service is operated from the United States. If you are accessing our Service from outside the United
                States, please be aware that your information may be transferred to, stored, and processed in the United
                States.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the "Effective Date" above. We encourage you to
                review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:strollerrunningcalculator@gmail.com"
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    strollerrunningcalculator@gmail.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Website:</strong> strollerrunningcalculator.com
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 italic text-center">
                This Privacy Policy was last updated on December 9, 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-lime-300 transition-colors font-semibold"
          >
            ← Back to Calculator
          </a>
        </div>
      </main>
    </div>
  )
}
