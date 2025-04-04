"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Check, Loader2, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "@/types/interface"

interface PricingTableProps {
  plans: PricingPlan[]
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Helper function to format price
const formatPrice = (price: string, currency: string) => {
   console.log(price)
  const numericPrice = Number.parseFloat(price)

  if (numericPrice === 0) return "Free"

  // Format based on currency
  if (currency === "NGN") {
    return `₦${numericPrice.toLocaleString()}`
  }

  return `${numericPrice.toLocaleString()} ${currency}`
}

// Helper function to sort plans in logical order
const sortPlans = (plans: PricingPlan[]) => {
  const planOrder = {
    "Free Plan": 1,
    "Starter Plan": 2,
    "Business Plan": 3,
    "Premium Plan": 4,
  }

  return [...plans].sort((a, b) => {
    return (planOrder[a.name as keyof typeof planOrder] || 999) - (planOrder[b.name as keyof typeof planOrder] || 999)
  })
}

// Helper function to format feature values for display
const formatFeatureValue = (key: string, value: any): string => {
  if (value === "unlimited") return "Unlimited"
  if (key === "contact_limit") return `${value.toLocaleString()} contacts`
  if (key === "send_to_limit") return value === "unlimited" ? "Unlimited recipients" : `${value} recipients per send`
  if (key === "templates_available") return value === "unlimited" ? "Unlimited templates" : `${value} templates`
  if (key === "campaigns") return value === "unlimited" ? "Unlimited campaigns" : `${value} campaigns`
  if (key === "reporting" || key === "analytics") {
    return value === "full" ? "Full access" : "Basic access"
  }

  return value.toString()
}

// Helper function to get human-readable feature names
const getFeatureName = (key: string): string => {
  const featureNames: Record<string, string> = {
    contact_limit: "Contact List",
    send_to_limit: "Recipients",
    templates_available: "Templates",
    campaigns: "Campaigns",
    reporting: "Reporting",
    analytics: "Analytics",
  }

  return featureNames[key] || key.replace(/_/g, " ")
}

export function PricingTable({ plans: rawPlans }: PricingTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState("")
  const [dialogType, setDialogType] = useState<"success" | "error">("success")

  // Sort plans in logical order
  const plans = sortPlans(rawPlans)

  // Find the recommended plan (Business Plan)
  const recommendedPlan = plans.find((plan) => plan.name === "Business Plan")
  const recommendedPlanId = recommendedPlan?.id

  const subscribeToPlan = async (planId: string) => {
    setLoading(planId)
    try {
      const response = await axios.post(`/api/user/pricing/subscribe?planId=${planId}`)
      const data = response.data

      if (data.status === "success") {
        window.location.href = data.data.payment_link
      } else {
        setDialogType("error")
        setDialogMessage("Failed to subscribe. Please try again.")
        setDialogOpen(true)
      }
    } catch (error: any) {
      setDialogType("error")
      setDialogMessage(error.response?.data?.message || "An error occurred. Please try again.")
      setDialogOpen(true)
    } finally {
      setLoading(null)
    }
  }

  // Extract all unique feature keys from all plans
  const allFeatureKeys = new Set<string>()
  plans.forEach((plan) => {
    try {
      const featuresObj = JSON.parse(plan.features)
      Object.keys(featuresObj).forEach((key) => allFeatureKeys.add(key))
    } catch (error) {
      // Handle parsing error
    }
  })

  // Order feature keys in a logical way
  const orderedFeatureKeys = [
    "contact_limit",
    "send_to_limit",
    "templates_available",
    "campaigns",
    "reporting",
    "analytics",
    ...Array.from(allFeatureKeys).filter(
      (key) =>
        !["contact_limit", "send_to_limit", "templates_available", "campaigns", "reporting", "analytics"].includes(key),
    ),
  ]

  return (
    <>
      <motion.div className="w-full max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        {/* Mobile view - stacked cards */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {plans.map((plan) => {
            let featuresObj: Record<string, any> = {}
            try {
              featuresObj = JSON.parse(plan.features)
            } catch (error) {
              // Handle parsing error
            }

            const isRecommended = plan.id === recommendedPlanId
            const priceDisplay = formatPrice(plan.price, plan.currency)

            return (
              <div
                key={plan.id}
                className={cn(
                  "rounded-xl border bg-white shadow-sm overflow-hidden",
                  isRecommended && "border-primary shadow-md",
                )}
              >
                {isRecommended && (
                  <div className="bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
                    RECOMMENDED
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{priceDisplay}</span>
                      {Number.parseFloat(plan.price) > 0 && (
                        <span className="ml-1 text-sm text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {typeof plan.description === "string" ? plan.description : plan.description[0]}
                    </p>
                  </div>

                  <Button
                    className={cn(
                      "w-full",
                      isRecommended
                        ? "bg-primary hover:bg-primary/90"
                        : Number.parseFloat(plan.price) === 0
                          ? "bg-secondary hover:bg-secondary/90"
                          : "border-primary/20 bg-white text-primary hover:bg-primary/5",
                    )}
                    variant={isRecommended ? "default" : Number.parseFloat(plan.price) === 0 ? "secondary" : "outline"}
                    onClick={() => subscribeToPlan(plan.id)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : Number.parseFloat(plan.price) === 0 ? (
                      "Get Started"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>

                  <div className="mt-6 space-y-4">
                    <p className="text-sm font-medium">What's included:</p>
                    {orderedFeatureKeys.map((key) => {
                      if (!featuresObj.hasOwnProperty(key)) return null

                      return (
                        <div key={key} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">
                            <span className="font-medium">{getFeatureName(key)}:</span>{" "}
                            {formatFeatureValue(key, featuresObj[key])}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop view - comparison table */}
        <div className="hidden md:block overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Header row with plan names and prices */}
          <div className="grid grid-cols-5 border-b">
            <div className="p-6 bg-muted/30">
              <h3 className="text-lg font-semibold">Choose your plan</h3>
              <p className="text-sm text-muted-foreground mt-1">Select the perfect plan for your needs</p>
            </div>

            {plans.map((plan, index) => {
              const isRecommended = plan.id === recommendedPlanId
              const priceDisplay = formatPrice(plan.price, plan.currency)

              return (
                <div
                  key={plan.id}
                  className={cn("p-6 flex flex-col border-l", isRecommended && "bg-primary/5 relative")}
                >
                  {isRecommended && (
                    <Badge className="absolute top-2 right-2" variant="default">
                      Recommended
                    </Badge>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-bold">{priceDisplay}</span>
                    {Number.parseFloat(plan.price) > 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {typeof plan.description === "string" ? plan.description : plan.description[0]}
                  </p>
                  <Button
                    className={cn(
                      "w-full mt-4",
                      isRecommended
                        ? "bg-primary hover:bg-primary/90"
                        : Number.parseFloat(plan.price) === 0
                          ? "bg-secondary hover:bg-secondary/90"
                          : "border-primary/20 bg-white text-primary hover:bg-primary/5",
                    )}
                    variant={isRecommended ? "default" : Number.parseFloat(plan.price) === 0 ? "secondary" : "outline"}
                    onClick={() => subscribeToPlan(plan.id)}
                    disabled={loading === plan.id}
                    size="sm"
                  >
                    {loading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : Number.parseFloat(plan.price) === 0 ? (
                      "Get Started"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Feature rows */}
          {orderedFeatureKeys.map((key) => (
            <div key={key} className="grid grid-cols-5 border-b last:border-b-0">
              <div className="p-4 bg-muted/30 flex items-center">
                <span className="text-sm font-medium">{getFeatureName(key)}</span>
              </div>

              {plans.map((plan) => {
                let featuresObj: Record<string, any> = {}
                try {
                  featuresObj = JSON.parse(plan.features)
                } catch (error) {
                  // Handle parsing error
                }

                const isRecommended = plan.id === recommendedPlanId
                const hasFeature = featuresObj.hasOwnProperty(key)

                return (
                  <div
                    key={`${plan.id}-${key}`}
                    className={cn("p-4 border-l flex items-center", isRecommended && "bg-primary/5")}
                  >
                    {hasFeature ? (
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{formatFeatureValue(key, featuresObj[key])}</span>
                      </div>
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-lg shadow-lg">
          <DialogHeader className="flex flex-col items-center space-y-4">
            {dialogType === "success" ? (
              <CheckCircle className="h-14 w-14 text-green-500" />
            ) : (
              <XCircle className="h-14 w-14 text-red-500" />
            )}
            <DialogTitle className="text-lg font-semibold">
              {dialogType === "success" ? "Subscription Successful" : "Subscription Failed"}
            </DialogTitle>
            <DialogDescription className="text-sm text-center leading-relaxed">{dialogMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              className={cn(
                "w-full",
                dialogType === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700",
              )}
              onClick={() => setDialogOpen(false)}
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

