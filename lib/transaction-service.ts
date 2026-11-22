import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"

export type TransactionType = "income" | "expense"

export interface Transaction {
  id?: string
  userId: string
  amount: number
  type: TransactionType
  category: string
  note?: string
  date: Date | Timestamp
  createdAt?: any
}

export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  try {
    // Add createdAt field with server timestamp
    const transactionWithTimestamp = {
      ...transaction,
      date: Timestamp.fromDate(transaction.date as Date),
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "transactions"), transactionWithTimestamp)
    return { id: docRef.id, ...transaction }
  } catch (error) {
    console.error("Error adding transaction:", error)
    // Provide more helpful error message
    if (error instanceof Error && error.message.includes("permission")) {
      throw new Error("Permission denied. Please make sure you're logged in and have the correct permissions.")
    }
    throw error
  }
}

export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  try {
    const transactionRef = doc(db, "transactions", id)
    if (transaction.date instanceof Date) {
      transaction.date = Timestamp.fromDate(transaction.date)
    }

    // Add updatedAt field with server timestamp
    const updates = {
      ...transaction,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(transactionRef, updates)
    return { id, ...transaction }
  } catch (error) {
    console.error("Error updating transaction:", error)
    if (error instanceof Error && error.message.includes("permission")) {
      throw new Error("Permission denied. Please make sure you're logged in and have the correct permissions.")
    }
    throw error
  }
}

export const deleteTransaction = async (id: string) => {
  try {
    const transactionRef = doc(db, "transactions", id)
    await deleteDoc(transactionRef)
    return id
  } catch (error) {
    console.error("Error deleting transaction:", error)
    if (error instanceof Error && error.message.includes("permission")) {
      throw new Error("Permission denied. Please make sure you're logged in and have the correct permissions.")
    }
    throw error
  }
}

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    // Modified query to only filter by userId without orderBy
    const q = query(collection(db, "transactions"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const transactions = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Transaction
    })

    // Sort the transactions by date in memory (descending order)
    return transactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA // Descending order (newest first)
    })
  } catch (error) {
    console.error("Error getting transactions:", error)
    throw error
  }
}

export const getTransactionsByMonth = async (userId: string, month: number, year: number): Promise<Transaction[]> => {
  try {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    // Get all user transactions first
    const allTransactions = await getUserTransactions(userId)

    // Filter by date range in memory
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date as Date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  } catch (error) {
    console.error("Error getting transactions by month:", error)
    throw error
  }
}

export const calculateSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = t.category
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  return {
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory,
  }
}
