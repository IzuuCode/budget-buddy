"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LightbulbIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// List of financial advice tips for auth pages
const authTips = [
  "Track your expenses regularly to understand your spending habits.",
  "Setting a budget is the first step to financial freedom.",
  "An emergency fund should cover 3-6 months of expenses.",
  "Pay yourself first by automatically saving a portion of your income.",
  "Regularly review your financial goals and adjust as needed.",
  "BudgetBuddy helps you visualize your spending patterns through charts.",
  "Categorizing expenses helps identify areas where you can cut back.",
  "Financial planning is not about limiting spending, but spending wisely.",
  "Small savings add up over time due to compound interest.",
  "Tracking both income and expenses gives you a complete financial picture.",
]

export function AuthAdvicePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState("")

  useEffect(() => {
    // Function to show a random tip
    const showRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * authTips.length)
      setCurrentTip(authTips[randomIndex])
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
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
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
                  BudgetBuddy Tip
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{currentTip}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
