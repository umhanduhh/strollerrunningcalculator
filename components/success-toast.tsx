"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessToastProps {
  isVisible: boolean
  message: string
  onClose: () => void
}

export default function SuccessToast({ isVisible, message, onClose }: SuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto-hide after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-purple-50 text-purple-800 px-6 py-3 rounded-lg shadow-lg border border-purple-200 flex items-center gap-3 min-w-[300px]">
        <CheckCircle className="h-5 w-5 text-purple-600" />
        <span className="font-semibold flex-1">{message}</span>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-purple-100 text-purple-600">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
