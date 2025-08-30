"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiKeyManager } from '@/components/api-key-manager'
import { ValidationTabs } from '@/components/validation-tabs'
import { Header } from '@/components/header'

export type ApiKeys = {
  openai: string
  gemini: string
  claude: string
  llama: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    gemini: '',
    claude: '',
    llama: ''
  })
  const [keysConfigured, setKeysConfigured] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
  }, [session, status, router])

  useEffect(() => {
    const hasKeys = Object.values(apiKeys).some(key => key.trim() !== '')
    setKeysConfigured(hasKeys)
  }, [apiKeys])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={session.user} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            AI Content Validator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Configure your AI provider keys and start validating content with powerful language models
          </p>
        </div>

        <ApiKeyManager 
          apiKeys={apiKeys} 
          setApiKeys={setApiKeys} 
        />

        {keysConfigured && (
          <ValidationTabs apiKeys={apiKeys} />
        )}

        {!keysConfigured && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Please configure at least one API key to start validating content
            </p>
          </div>
        )}
      </main>
    </div>
  )
}