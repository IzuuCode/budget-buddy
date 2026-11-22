"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserTransactions, deleteTransaction, type Transaction } from "@/lib/transaction-service"
import { ArrowDownIcon, ArrowUpIcon, Edit2Icon, PlusIcon, SearchIcon, Trash2Icon, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTransactions = async () => {
    if (user) {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserTransactions(user.uid)
        setTransactions(data)
        setFilteredTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Failed to load transactions. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user, refreshKey])

  useEffect(() => {
    let result = transactions

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (t) => t.category.toLowerCase().includes(term) || (t.note && t.note.toLowerCase().includes(term)),
      )
    }

    setFilteredTransactions(result)
  }, [transactions, searchTerm, categoryFilter, typeFilter])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id)
        setTransactions((prev) => prev.filter((t) => t.id !== id))
      } catch (error) {
        console.error("Error deleting transaction:", error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Failed to delete transaction. Please try again.")
        }
      }
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Get unique categories
  const categories = ["all", ...new Set(transactions.map((t) => t.category))]

  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/transactions/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Transaction
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage your income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(new Date(transaction.date as Date), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>{transaction.note || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              {transaction.type === "income" ? (
                                <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
                              ) : (
                                <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
                              )}
                              <span className={transaction.type === "income" ? "text-emerald-500" : "text-rose-500"}>
                                LKR {transaction.amount.toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/transactions/edit/${transaction.id}`}>
                                  <Edit2Icon className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => transaction.id && handleDelete(transaction.id)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">No transactions found</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/transactions/new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Transaction
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
