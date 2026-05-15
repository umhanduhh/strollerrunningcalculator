"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StrollerCalculator from "./stroller-calculator"
import StravaIntegrationPanel from "./strava/strava-integration-panel"

export default function StrollerCalculatorApp() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Black and White Design */}
      <div className="header-gradient">
        <div className="container mx-auto px-4 text-center">
          <img src="/logo.png" alt="Stroller Running Calculator" className="header-logo mx-auto" />
          <h1 className="font-bold tracking-tight">Calculate Your Extra Miles</h1>
          <p className="mb-6 max-w-2xl mx-auto">
            Discover how much harder you're really working when pushing a stroller and get the credit you deserve
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation Tabs - Reordered */}
        <Tabs defaultValue="strava" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strava">Sync with Strava</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="research">About Research</TabsTrigger>
            <TabsTrigger value="resources">Resources for Runners</TabsTrigger>
          </TabsList>

          <TabsContent value="strava" className="mt-0">
            <div className="calculator-card">
              <StravaIntegrationPanel />
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-0">
            <div className="calculator-card">
              <StrollerCalculator />
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-0">
            <div className="calculator-card">
              <div className="space-y-6 p-6">
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About the Research</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      This calculator is based on research by Alcantara & Wall-Scheffler (2017) published in PLOS One:
                      "Stroller running: Energetic and kinematic changes across pushing methods."
                    </p>
                    <p>
                      The study found that running while pushing a stroller increases energy expenditure compared to
                      running without a stroller. The amount of extra effort depends on:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>The pushing method used (two-handed, one-handed, or push-and-chase)</li>
                      <li>The combined weight of the stroller and child</li>
                      <li>The running pace/speed</li>
                      <li>The runner's physical characteristics (weight, gender)</li>
                    </ul>
                    <p>The calculator extends these findings with additional factors:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Elevation gain (hills significantly increase effort when pushing a stroller)</li>
                      <li>Runner's weight (affects relative energy expenditure)</li>
                      <li>Runner's gender (metabolic differences observed in the research)</li>
                    </ul>
                    <p>
                      The study found that female runners experienced slightly higher relative increases in energy
                      expenditure when pushing strollers compared to male runners, which is accounted for in our
                      calculations.
                    </p>
                    <p>
                      The calculator uses formulas derived from this research to estimate the "extra miles" you
                      effectively run when pushing a stroller.
                    </p>
                    <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                      Note: This calculator provides estimates based on research findings. Individual results may vary
                      based on factors like terrain, wind, and personal biomechanics.
                    </p>
                  </div>
                </div>

                {/* Research Citation Footer */}
                <div className="border-t border-gray-200 pt-4 mt-6 flex justify-between text-xs text-gray-500">
                  <p>Based on Alcantara & Wall-Scheffler (2017)</p>
                  <p>PLOS One, 12(7):e0180575</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-0">
            <div className="calculator-card">
              <div className="space-y-6 p-6">
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Resources for Runners</h3>
                  <div className="space-y-6">
                    {/* StrollerStats.com Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            <a
                              href="https://strollerstats.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              StrollerStats.com
                            </a>
                          </h4>
                          <p className="text-gray-700 mb-3">
                            Add <span className="font-semibold text-purple-600">#strollerstats</span> to the description
                            of any Strava walk or run and we'll track your stroller miles (or kilometers) automatically.
                          </p>
                          <a
                            href="https://strollerstats.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                          >
                            Visit StrollerStats.com
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Another Mother Runner resource card */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            <a
                              href="https://anothermotherrunner.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700 transition-colors"
                            >
                              Another Mother Runner
                            </a>
                          </h4>
                          <p className="text-gray-700 mb-3">
                            Inspiring women with expert-led training programs, lively podcasts, friendly advice, and,
                            most importantly, each other.
                          </p>
                          <a
                            href="https://anothermotherrunner.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                          >
                            Visit Another Mother Runner
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Strava Attribution - Required on all pages */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center">
            <img
              src="/strava-assets/powered-by-strava-white.svg"
              alt="Powered by Strava"
              width={180}
              height={18}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">Compatible with Strava. Not developed by or sponsored by Strava.</p>
        </div>

        {/* Footer */}
        <footer className="mt-12 calculator-card">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/strollerrunningcalculator?igsh=cml2NDZzMTVycm5t&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-semibold"
              >
                {/* Instagram Icon */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 23 4.19c-1.59.12-3.22.91-4.66 3.24a4.48 4.48 0 0 0 4.66 3.25"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="22" y1="22" x2="16.65" y2="17.65"></line>
                </svg>
                Follow us on Instagram
              </a>
              <span className="hidden sm:block text-gray-300">•</span>
              <a
                href="mailto:strollerrunningcalculator@gmail.com"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                strollerrunningcalculator@gmail.com
              </a>
            </div>

            {/* Legal Links on separate line */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </a>
              <span className="hidden sm:block text-gray-300">•</span>
              <a href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </a>
            </div>

            <p className="text-gray-500 text-sm">Tag us on Instagram so we can keep celebrating your achievements!</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
