import Link from "next/link"
import { Github, Linkedin, MessageSquare } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} BudgetBuddy. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Developed by <span className="font-medium">Isuru Jayanada.</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/IzuuCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/isuru-jayanada-044738265/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://wa.me/+94715795099"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  )
}
