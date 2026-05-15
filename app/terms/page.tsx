import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Stroller Running Calculator",
  description: "Terms of Service for Stroller Running Calculator - Legal terms and conditions for using our service",
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#49205e] to-[#805ba5]">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="calculator-card">
          <div className="prose prose-gray max-w-none p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-600 mb-8">
              <strong>Effective Date:</strong> December 9, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Stroller Running Calculator at strollerrunningcalculator.com (the "Service"), you
                agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not
                use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-700 mb-2">Stroller Running Calculator is a web-based tool that:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Calculates equivalent running distances when pushing a stroller</li>
                <li>Provides estimates based on published research (Alcantara & Wall-Scheffler, 2017)</li>
                <li>Offers optional integration with Strava to automatically update activity descriptions</li>
                <li>Helps runners understand the added effort of stroller running</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Service</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Uses</h3>
              <p className="text-gray-700 mb-2">You may use our Service to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Calculate stroller running equivalents for personal use</li>
                <li>Connect your Strava account to automatically update your activity descriptions</li>
                <li>Share your results on social media or with others</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
              <p className="text-gray-700 mb-2">You may not:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to interfere with or disrupt the Service</li>
                <li>Use automated scripts or bots to access the Service</li>
                <li>Reverse engineer or attempt to extract our calculation algorithms</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Strava Integration</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authorization</h3>
              <p className="text-gray-700 mb-2">When you connect your Strava account:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You authorize us to access your Strava activities and profile information</li>
                <li>
                  You authorize us to modify your activity descriptions to include equivalent distance calculations
                </li>
                <li>You can revoke this authorization at any time through your Strava account settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scope of Access</h3>
              <p className="text-gray-700 mb-2">Our Strava integration will:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>
                  Only access activities that contain specific hashtags (#twohandpush, #onehandpush, #pushandchase)
                </li>
                <li>Only modify the description field of your activities</li>
                <li>Only display your own Strava data to you</li>
                <li>Never share your Strava data with other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strava Terms</h3>
              <p className="text-gray-700 mb-4">
                Your use of Strava through our Service is also governed by Strava's Terms of Service and Privacy Policy.
                Any violations of Strava's terms may result in termination of the integration.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accuracy and Disclaimers</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Calculation Accuracy</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Our calculations are based on published research but are estimates only</li>
                <li>Individual results may vary based on fitness level, terrain, stroller type, and other factors</li>
                <li>Results should not be used as the sole basis for training or medical decisions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Medical Disclaimer</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>This Service is for informational purposes only</li>
                <li>Consult with healthcare professionals before beginning any exercise program</li>
                <li>
                  We are not responsible for any injuries or health issues that may result from use of our calculations
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strava Data</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>We cannot guarantee the accuracy or availability of Strava data</li>
                <li>Strava integration depends on third-party services beyond our control</li>
                <li>Activity modifications may not appear immediately due to Strava's systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Content</h3>
              <p className="text-gray-700 mb-4">
                The Service, including its design, functionality, and content, is owned by us and protected by
                copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Research Attribution</h3>
              <p className="text-gray-700 mb-4">
                Our calculations are based on research by Alcantara & Wall-Scheffler (2017), published in PLOS One. We
                provide appropriate academic attribution for this work.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you create or share through our Service, but you grant us permission
                to use it as necessary to provide the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our{" "}
                <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </a>
                , which governs how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <p className="text-gray-700 font-semibold mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</li>
                  <li>
                    WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A
                    PARTICULAR PURPOSE
                  </li>
                  <li>
                    WE ARE NOT LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, PUNITIVE, OR SPECIAL DAMAGES
                  </li>
                  <li>IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED ZERO DOLLARS ($0)</li>
                  <li>WE ARE NOT RESPONSIBLE FOR ANY THIRD-PARTY SERVICES, INCLUDING STRAVA</li>
                  <li>YOU USE THE SERVICE ENTIRELY AT YOUR OWN RISK</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-700 mb-2">
                You agree to defend, indemnify, and hold us harmless from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit or share</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access to the Service at any time, with or without notice, for any
                reason, including violation of these Terms.
              </p>
              <p className="text-gray-700 mb-4">
                You may stop using the Service at any time. If you have connected your Strava account, you should also
                revoke authorization through your Strava settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-2">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Posting updated Terms on our website</li>
                <li>Updating the "Effective Date" above</li>
                <li>Providing additional notice for significant changes</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the United States, without regard to conflict of law principles.
                Any disputes shall be resolved in the courts of the United States.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in
                full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us at:
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acknowledgment</h2>
              <p className="text-gray-700 mb-4">
                By using our Service, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Service and our{" "}
                <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 italic text-center">
                These Terms of Service were last updated on December 9, 2025.
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
