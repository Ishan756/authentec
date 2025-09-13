"use client"

import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome, Bot, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

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
    <div className="min-h-screen bg-background p-0">
      <SiteHeader />
      <div className="w-full max-w-[2400px] mx-auto space-y-20 px-4 lg:px-16 py-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Bot className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            AuthenTec
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Validate and correct content using multiple AI providers
          </p>
        </div>

  <Card className="glass-card hover-glow w-full max-w-[700px] mx-auto">
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center text-sm text-muted-foreground max-w-[1600px] mx-auto pt-4">
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
          <div className="space-y-2 hidden md:block">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p>Accurate Checks</p>
          </div>
          <div className="space-y-2 hidden lg:block">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <p>Scalable API</p>
          </div>
          <div className="space-y-2 hidden lg:block">
            <div className="h-8 w-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Chrome className="h-4 w-4 text-primary" />
            </div>
            <p>Modern UI</p>
          </div>
        </div>
      </div>
    </div>
  )
}