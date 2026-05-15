"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (location: { city: string; state: string; country: string; name?: string }) => void
}

export default function LocationModal({ isOpen, onClose, onSubmit }: LocationModalProps) {
  console.log("=== LOCATION MODAL RENDER ===")
  console.log("isOpen:", isOpen)
  console.log("onClose exists:", !!onClose)
  console.log("onSubmit exists:", !!onSubmit)

  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("USA")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("=== LOCATION MODAL FORM SUBMITTED ===")
    console.log("Event:", e)
    console.log("Form element:", e.target)
    console.log("Raw form values:")
    console.log("- city:", `"${city}"`)
    console.log("- state:", `"${state}"`)
    console.log("- country:", `"${country}"`)
    console.log("- name:", `"${name}"`)
    console.log("- name.trim():", `"${name.trim()}"`)
    console.log("- name.trim() || undefined:", name.trim() || undefined)

    // Check validation
    const cityValid = city.trim().length > 0
    const stateValid = state.trim().length > 0
    const countryValid = country.trim().length > 0

    console.log("Validation check:")
    console.log("- cityValid:", cityValid)
    console.log("- stateValid:", stateValid)
    console.log("- countryValid:", countryValid)

    if (cityValid && stateValid && countryValid) {
      const submissionData = {
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        name: name.trim() || undefined,
      }
      console.log("Final submission data:", JSON.stringify(submissionData, null, 2))
      console.log("Calling onSubmit with data...")

      try {
        onSubmit(submissionData)
        console.log("onSubmit called successfully")

        // Reset form
        setCity("")
        setState("")
        setCountry("USA")
        setName("")
        onClose()
        console.log("Form reset and modal closed")
      } catch (error) {
        console.error("Error calling onSubmit:", error)
      }
    } else {
      console.log("Form validation failed - not submitting")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="calculator-card w-full max-w-md relative border border-medium-purple">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-gray-500 hover:bg-purple-50 hover:text-purple-600"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="section-header">
          <h2 className="text-xl font-bold">Share Your Location</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Let other stroller runners know where you're crushing those bonus miles!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <Label htmlFor="name" className="form-label">
              Name (optional)
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                console.log("Name input changed to:", `"${e.target.value}"`)
                setName(e.target.value)
              }}
              placeholder="Your first name"
              className="form-input"
            />
            <p className="text-gray-500 text-xs mt-1">Share your name to connect with the community!</p>
          </div>

          <div className="form-group">
            <Label htmlFor="city" className="form-label">
              City
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="San Francisco"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="state" className="form-label">
              State/Province
            </Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="California"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <Label htmlFor="country" className="form-label">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
              className="form-input"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary flex-1">
              Share to Feed
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
