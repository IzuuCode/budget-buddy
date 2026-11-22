"use client"

import { AppShell } from "@/components/app-shell"
import { TransactionForm } from "@/components/transaction-form"

export default function AddTransactionPage() {
  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Add Transaction</h1>
        <TransactionForm mode="create" />
      </div>
    </AppShell>
  )
}
