"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AppShell } from "@/components/app-shell"
import { TransactionForm } from "@/components/transaction-form"
import { Skeleton } from "@/components/ui/skeleton"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Transaction } from "@/lib/transaction-service"

export default function EditTransactionPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransaction = async () => {
      if (user && id) {
        try {
          const docRef = doc(db, "transactions", id as string)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            const data = docSnap.data()
            setTransaction({
              id: docSnap.id,
              ...data,
              date: data.date.toDate(),
            } as Transaction)
          }
        } catch (error) {
          console.error("Error fetching transaction:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTransaction()
  }, [user, id])

  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Edit Transaction</h1>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : transaction ? (
          <TransactionForm transaction={transaction} mode="edit" />
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h2 className="text-lg font-medium">Transaction not found</h2>
            <p className="mt-2 text-muted-foreground">
              The transaction you are looking for does not exist or you do not have permission to view it.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
