"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StravaOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  athleteId: string
  athleteName: string
}

export default function StravaOnboardingModal({ isOpen, onClose, athleteId, athleteName }: StravaOnboardingModalProps) {
  const [athleteGender, setAthleteGender] = useState("female")
  const [athleteWeight, setAthleteWeight] = useState("")
  const [selectedStroller, setSelectedStroller] = useState("other")
  const [strollerWeight, setStrollerWeight] = useState("")
  const [childWeight, setChildWeight] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Stroller models matching the calculator
  const strollerModels = {
    "bob-wayfinder": { name: "BOB Wayfinder", weight: 31 },
    "thule-urbanglide": { name: "Thule UrbanGlide", weight: 26 },
    "bumbleride-speed": { name: "Bumbleride Speed", weight: 26 },
    "uppababy-ridge": { name: "UPPAbaby Ridge", weight: 29 },
    "bob-revolution-flex-duallie": { name: "BOB Revolution Flex 3.0 Duallie", weight: 34 },
    "thule-urbanglide-2-double": { name: "Thule Urban Glide 2 Double", weight: 32 },
    other: { name: "Other", weight: strollerWeight ? Number.parseFloat(strollerWeight) : null },
  }

  // Handle stroller selection
  const handleStrollerSelection = (strollerId: string) => {
    setSelectedStroller(strollerId)
    if (strollerId !== "other") {
      setStrollerWeight(strollerModels[strollerId].weight.toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log("[v0] Submitting onboarding form", { athleteId })

    try {
      const response = await fetch("/api/strava/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId,
          athleteGender: athleteGender || null,
          athleteWeight: athleteWeight ? Number.parseFloat(athleteWeight) : null,
          strollerName: selectedStroller !== "other" ? strollerModels[selectedStroller].name : null,
          strollerWeight: strollerWeight ? Number.parseFloat(strollerWeight) : null,
          childWeight: childWeight ? Number.parseFloat(childWeight) : null,
          setupCompleted: true,
        }),
      })

      console.log("[v0] Profile update response status:", response.status)

      if (response.ok) {
        console.log("[v0] Profile updated successfully, closing modal")
        onClose()
      } else {
        const errorText = await response.text()
        console.error("[v0] Failed to update profile:", response.status, errorText)
        onClose()
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    setIsSubmitting(true)

    console.log("[v0] Skipping onboarding setup")

    try {
      await fetch("/api/strava/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteId,
          setupCompleted: true,
        }),
      })
      console.log("[v0] Setup skipped, closing modal")
      onClose()
    } catch (error) {
      console.error("[v0] Error skipping setup:", error)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome, {athleteName}!</DialogTitle>
          <DialogDescription className="text-base">
            Let's personalize your stroller running calculations. This helps us give you more accurate bonus miles based
            on your specific setup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Athlete Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Your Information</h3>

            <div className="space-y-2">
              <Label htmlFor="athlete-gender">Gender</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="gender-female"
                    name="athlete-gender"
                    value="female"
                    checked={athleteGender === "female"}
                    onChange={(e) => setAthleteGender(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="gender-female" className="cursor-pointer font-normal">
                    Female
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="gender-male"
                    name="athlete-gender"
                    value="male"
                    checked={athleteGender === "male"}
                    onChange={(e) => setAthleteGender(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="gender-male" className="cursor-pointer font-normal">
                    Male
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="athlete-weight">Your Weight (lbs, Optional)</Label>
              <Input
                id="athlete-weight"
                type="number"
                step="0.1"
                min="100"
                max="275"
                placeholder="e.g., 150"
                value={athleteWeight}
                onChange={(e) => setAthleteWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Stroller Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Stroller Information</h3>

            <div className="space-y-2">
              <Label htmlFor="stroller-model">Stroller Model</Label>
              <Select value={selectedStroller} onValueChange={handleStrollerSelection}>
                <SelectTrigger className="border-gray-300 focus:border-purple-600 focus:ring-purple-600">
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

            {selectedStroller === "other" && (
              <div className="space-y-2">
                <Label htmlFor="stroller-weight">Stroller Weight (lbs, Optional)</Label>
                <Input
                  id="stroller-weight"
                  type="number"
                  step="0.1"
                  min="5"
                  max="40"
                  placeholder="e.g., 25"
                  value={strollerWeight}
                  onChange={(e) => setStrollerWeight(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Child Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Child Information</h3>

            <div className="space-y-2">
              <Label htmlFor="child-weight">Child's Weight (lbs, Optional)</Label>
              <Input
                id="child-weight"
                type="number"
                step="0.1"
                min="5"
                max="120"
                placeholder="e.g., 30"
                value={childWeight}
                onChange={(e) => setChildWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Why we ask:</strong> This information helps us calculate more accurate bonus miles based on the
              research. If you skip this, we'll estimate your bonus miles using average values.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Skip for Now
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
