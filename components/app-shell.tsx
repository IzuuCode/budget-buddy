"use client"

import type React from "react"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { FinancialAdvicePopup } from "@/components/financial-advice-popup"
import ProtectedRoute from "@/components/protected-route"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">BudgetBuddy</h1>
            </div>
            <MainNav />
          </div>
        </header>
        <main className="flex-1 pb-16 md:pb-0">
          <div className="container py-6">{children}</div>
        </main>
        <Footer />
        <MobileNav />
        <FinancialAdvicePopup />
      </div>
    </ProtectedRoute>
  )
}
