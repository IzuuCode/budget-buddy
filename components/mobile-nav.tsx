"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, PieChart, Plus, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: <PieChart className="h-5 w-5" />,
      active: pathname === "/transactions",
    },
    {
      href: "/transactions/new",
      label: "Add",
      icon: <Plus className="h-5 w-5" />,
      active: pathname === "/transactions/new",
    },
    {
      href: "/settings",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-4">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant="ghost"
            className={`flex flex-col items-center justify-center ${
              route.active ? "text-primary" : "text-muted-foreground"
            }`}
            asChild
          >
            <Link href={route.href}>
              {route.icon}
              <span className="text-xs mt-1">{route.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
