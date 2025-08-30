"use client"

import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome, Bot, Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Bot className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Content Validator
          </h1>
          <p className="text-muted-foreground text-lg">
            Validate and correct content using multiple AI providers
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Sign in with your Google account to access the validation dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => signIn('google')}
              className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 transition-colors"
              size="lg"
            >
              <Chrome className="mr-3 h-5 w-5" />
              Sign in with Google
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <p>Multiple AI Providers</p>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p>Smart Validation</p>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Chrome className="h-4 w-4 text-primary" />
            </div>
            <p>Secure & Fast</p>
          </div>
        </div>
      </div>
    </div>
  )
}