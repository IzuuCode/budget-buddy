"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Github, Linkedin, MessageSquare, ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <AppShell>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">About Me</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/isuru.jpg" alt="Profile" />
              <AvatarFallback>YN</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <CardTitle className="text-2xl">Your Name</CardTitle>
              <CardDescription>Full Stack Developer</CardDescription>
              <div className="flex justify-center space-x-4 pt-2 sm:justify-start">
                <Link
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="https://wa.me/yourphonenumber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">WhatsApp</span>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">About</h3>
              <p className="mt-2 text-muted-foreground">
                I am a passionate Full Stack Developer with expertise in React, Next.js, and Firebase. I created
                BudgetBuddy to help people manage their personal finances effectively and gain better control over their
                spending habits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">React</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Next.js</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Firebase</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">TypeScript</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">Tailwind CSS</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">UI/UX Design</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Contact</h3>
              <p className="mt-2 text-muted-foreground">
                Feel free to reach out to me for any questions, feedback, or collaboration opportunities.
              </p>
              <p className="mt-1 text-muted-foreground">Email: isurujayanada2002@gmail.com</p>
              <p className="mt-1 text-muted-foreground">Mobile: +94 71 579 5099</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
