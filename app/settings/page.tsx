"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { updateEmail, updatePassword } from "firebase/auth"

export default function SettingsPage() {
  const { user } = useAuth()
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [exportFormat, setExportFormat] = useState("csv")

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setEmailError("")
    setEmailSuccess("")
    setEmailLoading(true)

    try {
      await updateEmail(user, newEmail)
      setEmailSuccess("Email updated successfully")
      setNewEmail("")
    } catch (error: any) {
      setEmailError(error.message || "Failed to update email")
    } finally {
      setEmailLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setPasswordError("")
    setPasswordSuccess("")

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setPasswordLoading(true)

    try {
      await updatePassword(user, newPassword)
      setPasswordSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setPasswordError(error.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Address</CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateEmail}>
                <CardContent className="space-y-4">
                  {emailError && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{emailError}</div>
                  )}
                  {emailSuccess && (
                    <div className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">{emailSuccess}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="current-email">Current Email</Label>
                    <Input id="current-email" value={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">New Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={emailLoading}>
                    {emailLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Email"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdatePassword}>
                <CardContent className="space-y-4">
                  {passwordError && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">{passwordSuccess}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive budget reminders and alerts</p>
                  </div>
                  <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Export your financial data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="csv"
                        name="export-format"
                        value="csv"
                        checked={exportFormat === "csv"}
                        onChange={() => setExportFormat("csv")}
                        className="h-4 w-4 rounded-full border-gray-300"
                      />
                      <Label htmlFor="csv">CSV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="pdf"
                        name="export-format"
                        value="pdf"
                        checked={exportFormat === "pdf"}
                        onChange={() => setExportFormat("pdf")}
                        className="h-4 w-4 rounded-full border-gray-300"
                      />
                      <Label htmlFor="pdf">PDF</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Export Data</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
