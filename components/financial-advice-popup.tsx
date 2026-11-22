"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LightbulbIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// List of financial advice tips
const financialTips = [
  "Save at least 20% of your monthly income for emergencies and future goals.",
  "Track all your expenses, even small ones. They add up quickly!",
  "Pay off high-interest debt first to save money in the long run.",
  "Create a budget and stick to it. Review it regularly.",
  "Avoid impulse purchases by waiting 24 hours before buying non-essential items.",
  "Set up automatic transfers to your savings account on payday.",
  "Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "Cook at home instead of eating out to save money on food expenses.",
  "Compare prices before making major purchases to get the best deal.",
  "Invest early and regularly, even small amounts can grow significantly over time.",
  "Build an emergency fund that covers 3-6 months of expenses.",
  "Review your subscriptions regularly and cancel those you don't use.",
  "Use cashback credit cards for regular purchases, but pay the balance in full each month.",
  "Consider buying used items instead of new when appropriate.",
  "Set specific financial goals with deadlines to stay motivated.",
  "Increase your income through side hustles or developing new skills.",
  "Regularly review your insurance policies to ensure adequate coverage at the best rates.",
  "Avoid taking on unnecessary debt for depreciating assets.",
  "Prioritize retirement savings early in your career to benefit from compound interest.",
  "Negotiate bills and services annually to get better rates.",
]

export function FinancialAdvicePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState("")
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Function to show a random tip
    const showRandomTip = () => {
      if (isPaused) return

      const randomIndex = Math.floor(Math.random() * financialTips.length)
      setCurrentTip(financialTips[randomIndex])
      setIsVisible(true)

      // Hide the tip after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    // Show first tip after a short delay
    const initialTimeout = setTimeout(() => {
      showRandomTip()
    }, 3000)

    // Set interval to show tips every 30 seconds
    const interval = setInterval(showRandomTip, 30000)

    // Clean up on unmount
    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [isPaused])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
    if (isVisible && !isPaused) {
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-base font-medium">
                  <LightbulbIcon className="mr-2 h-4 w-4 text-yellow-400" />
                  Financial Tip
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <p className="text-sm text-muted-foreground">{currentTip}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="text-xs" onClick={handlePauseToggle}>
                {isPaused ? "Resume Tips" : "Pause Tips"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
