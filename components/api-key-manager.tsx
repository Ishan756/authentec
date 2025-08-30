"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Key, CheckCircle } from 'lucide-react'
import { ApiKeys } from '@/app/dashboard/page'
import { toast } from 'sonner'

interface ApiKeyManagerProps {
  apiKeys: ApiKeys
  setApiKeys: (keys: ApiKeys) => void
}

const providerInfo = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4 and other OpenAI models',
    placeholder: 'sk-...'
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini Pro and Ultra models',
    placeholder: 'AIza...'
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'Claude 3.5 Sonnet and other models',
    placeholder: 'sk-ant-...'
  },
  llama: {
    name: 'Meta LLaMA',
    description: 'LLaMA 3.1 and other Meta models',
    placeholder: 'hf_...'
  }
}

export function ApiKeyManager({ apiKeys, setApiKeys }: ApiKeyManagerProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [validatingKeys, setValidatingKeys] = useState<Record<string, boolean>>({})

  const toggleVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
    setApiKeys({ ...apiKeys, [provider]: value })
  }

  const validateKey = async (provider: keyof ApiKeys) => {
    if (!apiKeys[provider].trim()) {
      toast.error('Please enter an API key first')
      return
    }

    setValidatingKeys(prev => ({ ...prev, [provider]: true }))
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: apiKeys[provider] })
      })

      const result = await response.json()

      if (result.valid) {
        toast.success(`${providerInfo[provider].name} API key is valid`)
      } else {
        toast.error(`${providerInfo[provider].name} API key is invalid`)
      }
    } catch (error) {
      toast.error('Failed to validate API key')
    } finally {
      setValidatingKeys(prev => ({ ...prev, [provider]: false }))
    }
  }

  const configuredCount = Object.values(apiKeys).filter(key => key.trim() !== '').length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Key className="h-6 w-6" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure your AI provider API keys to start validating content
            </CardDescription>
          </div>
          <Badge variant={configuredCount > 0 ? "default" : "secondary"} className="text-sm">
            {configuredCount > 0 ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                {configuredCount} provider{configuredCount > 1 ? 's' : ''} configured
              </>
            ) : (
              'No providers configured'
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(providerInfo) as Array<keyof ApiKeys>).map((provider) => {
            const info = providerInfo[provider]
            const isConfigured = apiKeys[provider].trim() !== ''
            
            return (
              <div key={provider} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor={provider} className="text-sm font-medium">
                    {info.name}
                    {isConfigured && (
                      <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />
                    )}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">{info.description}</p>
                
                <div className="relative">
                  <Input
                    id={provider}
                    type={showKeys[provider] ? 'text' : 'password'}
                    placeholder={info.placeholder}
                    value={apiKeys[provider]}
                    onChange={(e) => handleKeyChange(provider, e.target.value)}
                    className="pr-20"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleVisibility(provider)}
                    >
                      {showKeys[provider] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {apiKeys[provider].trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => validateKey(provider)}
                    disabled={validatingKeys[provider]}
                    className="w-full"
                  >
                    {validatingKeys[provider] ? 'Validating...' : 'Validate Key'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {configuredCount === 0 && (
          <div className="text-center py-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted">
            <p className="text-muted-foreground text-sm">
              Add at least one API key to start validating content
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}