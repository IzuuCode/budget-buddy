"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, PieChart, Plus, Settings, LogOut } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: <PieChart className="mr-2 h-4 w-4" />,
      active: pathname === "/transactions",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
            <Link href={route.href} className="flex items-center">
              {route.icon}
              {route.label}
            </Link>
          </Button>
        ))}
        <Button asChild variant="outline">
          <Link href="/transactions/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
