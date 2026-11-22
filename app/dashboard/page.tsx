"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserTransactions, calculateSummary, type Transaction } from "@/lib/transaction-service"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchTransactions = async () => {
    if (user) {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserTransactions(user.uid)
        setTransactions(data)
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

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const summary = calculateSummary(transactions)

  // Prepare data for charts
  const pieChartData = Object.entries(summary.expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Group transactions by month for the bar chart
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date as Date)
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`

      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        acc[monthYear].income += transaction.amount
      } else {
        acc[monthYear].expense += transaction.amount
      }

      return acc
    },
    {} as Record<string, { income: number; expense: number }>,
  )

  const barChartData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      Income: data.income,
      Expense: data.expense,
    }))
    .slice(-6) // Last 6 months

  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Balance Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-[120px]" />
                  ) : (
                    <div className="text-2xl font-bold">LKR {summary.balance.toFixed(2)}</div>
                  )}
                </CardContent>
              </Card>

              {/* Income Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-[120px]" />
                  ) : (
                    <div className="text-2xl font-bold text-emerald-500">LKR {summary.totalIncome.toFixed(2)}</div>
                  )}
                </CardContent>
              </Card>

              {/* Expenses Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <ArrowDownIcon className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-[120px]" />
                  ) : (
                    <div className="text-2xl font-bold text-rose-500">LKR {summary.totalExpenses.toFixed(2)}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `LKR ${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="Income" fill="#10b981" />
                      <Bar dataKey="Expense" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Expenses by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center">
                    <Skeleton className="h-[300px] w-[300px] rounded-full" />
                  </div>
                ) : pieChartData.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `LKR ${Number(value).toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {pieChartData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">
                            {entry.name}: LKR {entry.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
