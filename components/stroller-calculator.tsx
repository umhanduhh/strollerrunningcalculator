"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Mountain, Share2, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import ShareableResult from "./shareable-result"
import html2canvas from "html2canvas"
import { track } from "@vercel/analytics"

type StrollerCalculatorProps = {}

export default function StrollerCalculator() {
  // State for calculator inputs
  const [distance, setDistance] = useState<number>(3)
  const [pushingMethod, setPushingMethod] = useState<string>("two-handed")
  const [strollerWeight, setStrollerWeight] = useState<number>(15)
  const [childWeight, setChildWeight] = useState<number>(25)
  const [pace, setPace] = useState<number>(10)
  const [elevationGain, setElevationGain] = useState<number>(0)
  const [runnerWeight, setRunnerWeight] = useState<number>(150)
  const [runnerGender, setRunnerGender] = useState<string>("female")
  const [result, setResult] = useState<number | null>(null)
  const [equivalentDistance, setEquivalentDistance] = useState<number | null>(null)
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null)
  const [showShareable, setShowShareable] = useState<boolean>(false)
  const shareableRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [selectedStroller, setSelectedStroller] = useState<string>("other")

  // Stroller models with their weights
  const strollerModels = {
    "bob-wayfinder": { name: "BOB Wayfinder", weight: 31 },
    "thule-urbanglide": { name: "Thule UrbanGlide", weight: 26 },
    "bumbleride-speed": { name: "Bumbleride Speed", weight: 26 },
    "uppababy-ridge": { name: "UPPAbaby Ridge", weight: 29 },
    "bob-revolution-flex-duallie": { name: "BOB Revolution Flex 3.0 Duallie", weight: 34 },
    "thule-urbanglide-2-double": { name: "Thule Urban Glide 2 Double", weight: 32 },
    other: { name: "Other", weight: strollerWeight },
  }

  // Handle input change for text fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    min: number,
    max: number,
  ) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      // Clamp the value between min and max
      const clampedValue = Math.min(Math.max(value, min), max)
      setter(clampedValue)
    }
  }

  // Handle stroller selection
  const handleStrollerSelection = (strollerId: string) => {
    setSelectedStroller(strollerId)
    if (strollerId !== "other") {
      setStrollerWeight(strollerModels[strollerId].weight)
    }
  }

  // Calculate the extra miles based on the research
  const calculateExtraMiles = () => {
    // Energy expenditure multipliers based on the paper
    // These are approximations based on the research findings
    const methodMultipliers = {
      "two-handed": 1.11, // Two-handed pushing increases energy expenditure by ~11%
      "one-handed": 1.08, // One-handed pushing increases energy expenditure by ~8%
      "push-and-chase": 1.18, // Push and chase method increases energy expenditure by ~18%
    }

    // Calculate total weight (stroller + child)
    const totalWeight = strollerWeight + childWeight

    // Weight factor - additional 0.5% per pound of total weight over 15 pounds
    const weightFactor = totalWeight > 15 ? 1 + (totalWeight - 15) * 0.005 : 1

    // Convert pace (minutes/mile) to speed (mph)
    const speed = 60 / pace

    // Speed factor - higher speeds have greater impact
    const speedFactor = 1 + (speed - 5) * 0.02

    // Calculate elevation gain per mile (for the calculation)
    const elevationGainPerMile = distance > 0 ? elevationGain / distance : 0

    // Elevation factor - each 100 ft/mile adds approximately 2% effort
    // This is especially impactful with a stroller
    const elevationFactor = 1 + (elevationGainPerMile / 100) * 0.025

    // Gender factor - based on research showing differences in energy expenditure
    // The paper showed women had slightly higher relative increases when pushing strollers
    const genderFactor = runnerGender === "female" ? 1.03 : 1.0

    // Runner weight factor - heavier runners experience relatively less additional burden
    // from the stroller as a percentage of their total energy expenditure
    // This is a simplified model based on physics principles
    const runnerWeightFactor = Math.max(0.9, Math.min(1.1, 150 / runnerWeight))

    // Calculate the total multiplier
    const totalMultiplier =
      methodMultipliers[pushingMethod] *
      weightFactor *
      speedFactor *
      elevationFactor *
      genderFactor *
      runnerWeightFactor

    // Calculate the equivalent distance
    const calculatedEquivalentDistance = distance * totalMultiplier

    // Calculate the extra miles
    const extraMiles = calculatedEquivalentDistance - distance

    // Calculate estimated calories burned
    // Base calorie burn per mile varies by gender and weight
    const baseCaloriesPerMile = runnerGender === "female" ? 0.63 * runnerWeight : 0.68 * runnerWeight

    // Adjust for pace - faster paces burn more calories per mile
    const paceAdjustment = 1 + (10 - pace) * 0.03

    // Calculate calories for equivalent distance
    const estimatedCalories = baseCaloriesPerMile * calculatedEquivalentDistance * paceAdjustment

    setResult(Number.parseFloat(extraMiles.toFixed(2)))
    setEquivalentDistance(Number.parseFloat(calculatedEquivalentDistance.toFixed(2)))
    setCaloriesBurned(Math.round(estimatedCalories))

    // Track calculator usage
    track("Calculator Used", {
      distance: distance,
      pushingMethod: pushingMethod,
      strollerWeight: strollerWeight,
      childWeight: childWeight,
      totalWeight: totalWeight,
      pace: pace,
      elevationGain: elevationGain,
      runnerWeight: runnerWeight,
      runnerGender: runnerGender,
      extraMiles: Number.parseFloat(extraMiles.toFixed(2)),
      equivalentDistance: Number.parseFloat(calculatedEquivalentDistance.toFixed(2)),
      selectedStroller: selectedStroller,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      hour: new Date().getHours(),
      dayOfWeek: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      month: new Date().toLocaleDateString("en-US", { month: "long" }),
      year: new Date().getFullYear(),
    })
  }

  // Format pace to display as minutes:seconds
  const formatPace = (paceValue: number) => {
    const minutes = Math.floor(paceValue)
    const seconds = Math.round((paceValue % 1) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate total weight
  const totalWeight = strollerWeight + childWeight

  // Get elevation difficulty description based on total elevation and distance
  const getElevationDescription = (gain: number, dist: number) => {
    if (gain === 0) return "Flat"

    // Calculate feet per mile for description purposes
    const feetPerMile = dist > 0 ? gain / dist : 0

    if (feetPerMile < 50) return "Gentle"
    if (feetPerMile < 100) return "Moderate"
    if (feetPerMile < 200) return "Hilly"
    if (feetPerMile < 300) return "Very hilly"
    return "Mountainous"
  }

  // Calculate max elevation based on distance (to set slider max)
  const maxElevation = Math.max(1000, Math.round(distance * 500))

  // Handle sharing of results
  const handleShare = async () => {
    if (!shareableRef.current || !result || !equivalentDistance) return

    try {
      // Generate image from the shareable result component
      const canvas = await html2canvas(shareableRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            throw new Error("Could not create image blob")
          }
        }, "image/png")
      })

      // Create file from blob
      const file = new File([blob], "stroller-run-results.png", { type: "image/png" })

      // Create share data
      const shareData = {
        title: "Stroller Running Calculator Results",
        text: `My ${distance} mile stroller run felt like ${equivalentDistance} miles! Calculate your stroller running effort at StrollerRunningCalculator.com`,
        files: [file],
      }

      // Check if Web Share API is supported and can share files
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        setShowShareable(false)
      } else {
        // Fallback for browsers that don't support sharing files
        const shareDataWithoutFiles = {
          title: "Stroller Running Calculator Results",
          text: `My ${distance} mile stroller run felt like ${equivalentDistance} miles! Calculate your stroller running effort at StrollerRunningCalculator.com`,
          url: "https://strollerrunningcalculator.com",
        }

        if (navigator.share) {
          await navigator.share(shareDataWithoutFiles)
          setShowShareable(false)
        } else {
          // Fallback for browsers without Web Share API
          // Create a download link
          const image = canvas.toDataURL("image/png")
          const link = document.createElement("a")
          link.href = image
          link.download = "stroller-run-results.png"
          link.click()
        }
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Handle download as fallback
  const handleDownload = async () => {
    if (!shareableRef.current) return

    try {
      const canvas = await html2canvas(shareableRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = "stroller-run-results.png"
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Runner Information Section */}
        <div className="section-header">
          <h3>Runner Information</h3>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="runner-weight" className="form-label">
                  Runner Weight (lbs)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="runner-weight-input"
                    type="number"
                    value={runnerWeight}
                    onChange={(e) => handleInputChange(e, setRunnerWeight, 100, 275)}
                    className="form-input form-input-compact"
                    min={100}
                    max={275}
                  />
                  <span className="text-sm text-gray-500">lbs</span>
                </div>
              </div>
              <input
                type="range"
                id="runner-weight"
                min={100}
                max={275}
                step={1}
                value={runnerWeight}
                onChange={(e) => setRunnerWeight(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="runner-gender" className="form-label">
                Runner Gender
              </Label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="female"
                    name="runner-gender"
                    value="female"
                    checked={runnerGender === "female"}
                    onChange={(e) => setRunnerGender(e.target.value)}
                    className="radio-input"
                  />
                  <Label htmlFor="female" className="cursor-pointer text-gray-700">
                    Female
                  </Label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="male"
                    name="runner-gender"
                    value="male"
                    checked={runnerGender === "male"}
                    onChange={(e) => setRunnerGender(e.target.value)}
                    className="radio-input"
                  />
                  <Label htmlFor="male" className="cursor-pointer text-gray-700">
                    Male
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Run Details Section */}
        <div className="section-header">
          <h3>Run Details</h3>
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="distance" className="form-label">
                  Distance (miles)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="distance-input"
                    type="number"
                    value={distance}
                    onChange={(e) => handleInputChange(e, setDistance, 0.1, 26.2)}
                    className="form-input form-input-compact"
                    min={0.1}
                    max={26.2}
                    step={0.1}
                  />
                  <span className="text-sm text-gray-500">miles</span>
                </div>
              </div>
              <input
                type="range"
                id="distance"
                min={0.1}
                max={26.2}
                step={0.1}
                value={distance}
                onChange={(e) => {
                  setDistance(Number(e.target.value))
                  if (elevationGain > Number(e.target.value) * 1000) {
                    setElevationGain(Math.round(Number(e.target.value) * 500))
                  }
                }}
                className="range-slider"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="pace" className="form-label">
                  Pace (min/mile)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pace-input"
                    type="text"
                    value={formatPace(pace)}
                    onChange={(e) => {
                      const [minutes, seconds] = e.target.value.split(":")
                      const min = Number.parseInt(minutes)
                      const sec = Number.parseInt(seconds || "0")
                      if (!isNaN(min) && !isNaN(sec)) {
                        const newPace = min + sec / 60
                        if (newPace >= 5 && newPace <= 15) {
                          setPace(newPace)
                        }
                      }
                    }}
                    className="form-input form-input-compact"
                  />
                  <span className="text-sm text-gray-500">min/mile</span>
                </div>
              </div>
              <input
                type="range"
                id="pace"
                min={5}
                max={15}
                step={0.1}
                value={pace}
                onChange={(e) => setPace(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="pushing-method" className="form-label">
              Pushing Method
            </Label>
            <Select value={pushingMethod} onValueChange={setPushingMethod}>
              <SelectTrigger className="border-gray-300 focus:border-[#6B46C1] focus:ring-[#6B46C1]">
                <SelectValue placeholder="Select pushing method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two-handed">Two-handed Push</SelectItem>
                <SelectItem value="one-handed">One-handed Push</SelectItem>
                <SelectItem value="push-and-chase">Push and Chase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="elevation-gain" className="form-label">
                  Total Elevation Gain (ft)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Mountain className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total climbing over the entire run</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="elevation-gain-input"
                  type="number"
                  value={elevationGain}
                  onChange={(e) => handleInputChange(e, setElevationGain, 0, maxElevation)}
                  className="form-input form-input-compact"
                  min={0}
                  max={maxElevation}
                  step={10}
                />
                <span className="text-sm text-gray-500">ft</span>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-xs text-gray-500">
                {getElevationDescription(elevationGain, distance)}
                {distance > 0 && <span className="ml-1">~{Math.round(elevationGain / distance)} ft/mile</span>}
              </span>
            </div>
            <input
              type="range"
              id="elevation-gain"
              min={0}
              max={maxElevation}
              step={10}
              value={elevationGain}
              onChange={(e) => setElevationGain(Number(e.target.value))}
              className="range-slider"
            />
          </div>
        </div>

        {/* Stroller & Child Section */}
        <div className="section-header">
          <h3>Stroller & Child Details</h3>
        </div>
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="stroller-model" className="form-label">
              Stroller Model
            </Label>
            <Select value={selectedStroller} onValueChange={handleStrollerSelection}>
              <SelectTrigger className="border-gray-300 focus:border-[#6B46C1] focus:ring-[#6B46C1]">
                <SelectValue placeholder="Select your stroller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="bob-wayfinder">BOB Wayfinder (31 lbs)</SelectItem>
                <SelectItem value="thule-urbanglide">Thule UrbanGlide (26 lbs)</SelectItem>
                <SelectItem value="bumbleride-speed">Bumbleride Speed (26 lbs)</SelectItem>
                <SelectItem value="uppababy-ridge">UPPAbaby Ridge (29 lbs)</SelectItem>
                <SelectItem value="bob-revolution-flex-duallie">
                  BOB Revolution Flex 3.0 Duallie (34 lbs) 👶👶
                </SelectItem>
                <SelectItem value="thule-urbanglide-2-double">Thule Urban Glide 2 Double (32 lbs) 👶👶</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="stroller-weight" className="form-label">
                  Stroller Weight (lbs)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="stroller-weight-input"
                    type="number"
                    value={strollerWeight}
                    onChange={(e) => {
                      handleInputChange(e, setStrollerWeight, 5, 40)
                      setSelectedStroller("other")
                    }}
                    className="form-input form-input-compact"
                    min={5}
                    max={40}
                    disabled={selectedStroller !== "other"}
                  />
                  <span className="text-sm text-gray-500">lbs</span>
                </div>
              </div>
              <input
                type="range"
                id="stroller-weight"
                min={5}
                max={40}
                step={1}
                value={strollerWeight}
                onChange={(e) => {
                  setStrollerWeight(Number(e.target.value))
                  setSelectedStroller("other")
                }}
                className="range-slider"
                disabled={selectedStroller !== "other"}
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="child-weight" className="form-label">
                  Child Weight (lbs)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="child-weight-input"
                    type="number"
                    value={childWeight}
                    onChange={(e) => handleInputChange(e, setChildWeight, 5, 120)}
                    className="form-input form-input-compact"
                    min={5}
                    max={120}
                  />
                  <span className="text-sm text-gray-500">lbs</span>
                </div>
              </div>
              <input
                type="range"
                id="child-weight"
                min={5}
                max={120}
                step={1}
                value={childWeight}
                onChange={(e) => setChildWeight(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between text-gray-900 font-semibold">
              <span>Total Weight:</span>
              <span className="text-[#6B46C1]">{totalWeight} lbs</span>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center pt-6">
          <Button onClick={calculateExtraMiles} className="btn-primary px-8 py-3 text-lg">
            Calculate Extra Miles
          </Button>
        </div>

        {/* Results Section */}
        {result !== null && equivalentDistance !== null && (
          <div className="results-card">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Your Results</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+{result}</div>
                  <div className="text-gray-700 font-medium">Extra Miles</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{equivalentDistance}</div>
                  <div className="text-gray-700 font-medium">Equivalent Distance</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{caloriesBurned}</div>
                  <div className="text-gray-700 font-medium">Calories Burned</div>
                </div>
              </div>
              <p className="text-gray-700 text-lg">
                Your {distance} mile stroller run felt like <strong>{equivalentDistance} miles</strong>!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => setShowShareable(true)} className="btn-primary">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showShareable && result !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-sm w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
              onClick={() => setShowShareable(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            <div ref={shareableRef}>
              <ShareableResult
                distance={distance}
                pace={formatPace(pace)}
                elevationGain={elevationGain}
                extraMiles={result}
                equivalentDistance={equivalentDistance}
                pushingMethod={pushingMethod}
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share Results
              </button>

              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
                onClick={handleDownload}
              >
                Download Image
              </Button>
            </div>
            <p className="text-center text-white/70 text-sm mt-2">Share your results or download as an image!</p>
          </div>
        </div>
      )}
    </>
  )
}
