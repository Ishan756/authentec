"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface TextValidationProps {}

function parseValidationResult(result: any) {
  let parsed = { ...result }

  if (typeof parsed.correctedText === 'string') {
    let text = parsed.correctedText.trim()

    const jsonMatch = text.match(/```json\s*([\s\S]+?)\s*```/)
    if (jsonMatch) text = jsonMatch[1]

    try {

      const nested = JSON.parse(text)

      parsed.correctedText = nested.correctedText ?? text
      parsed.isCorrect = nested.isCorrect ?? parsed.isCorrect
      parsed.errors = nested.errors ?? parsed.errors
      parsed.confidence = nested.confidence ?? parsed.confidence
    } catch {
  
      parsed.correctedText = text
    }
  }

  return parsed
}
export function TextValidation({}: TextValidationProps) {
  const [inputText, setInputText] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['gemini','claude'])
  const [validating, setValidating] = useState(false)
  const [results, setResults] = useState<Array<{
    provider: string
    isCorrect: boolean
    correctedText?: string
    confidence?: number
    errors?: string[]
  }>>([])

  const availableProviders = ['gemini','claude']

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    )
  }

  const handleValidate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to validate')
      return
    }

    if (selectedProviders.length === 0) {
      toast.error('Please select at least one AI provider')
      return
    }

    setValidating(true)
    setResults([])

    try {
      const promises = selectedProviders.map(async (provider) => {
        const response = await fetch('/api/validate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, provider })
        })

        const rawResult = await response.json()
        const result = parseValidationResult(rawResult)
          return { provider, ...result }
        })

      const validationResults = await Promise.all(promises)
      console.log(validationResults);
      setResults(validationResults)
      
      const allCorrect = validationResults.every(r => r.isCorrect)
      if (allCorrect) {
        toast.success('All providers confirmed the text is correct!')
      } else {
        toast.warning('Some providers found issues with the text')
      }
    } catch (error) {
      toast.error('Failed to validate text')
    } finally {
      setValidating(false)
    }
  }

  const getProviderDisplayName = (provider: string) => {
    const names = {
      openai: 'OpenAI',
      gemini: 'Gemini',
      claude: 'Claude',
      llama: 'LLaMA'
    }
    return names[provider as keyof typeof names] || provider
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Text Validation</CardTitle>
          <CardDescription>
            Enter text content to validate for correctness and get AI-powered corrections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text to validate</Label>
            <Textarea
              id="text-input"
              placeholder="Enter the text you want to validate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>Select AI Providers</Label>
            <div className="flex flex-wrap gap-3">
              {availableProviders.map((provider) => (
                <div key={provider} className="flex items-center space-x-2">
                  <Checkbox
                    id={provider}
                    checked={selectedProviders.includes(provider)}
                    onCheckedChange={() => handleProviderToggle(provider)}
                  />
                  <Label htmlFor={provider} className="text-sm cursor-pointer">
                    {getProviderDisplayName(provider)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleValidate}
            disabled={validating || !inputText.trim() || selectedProviders.length === 0}
            className="w-full h-12 text-lg"
          >
            {validating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Validating with {selectedProviders.length} provider{selectedProviders.length > 1 ? 's' : ''}...
              </>
            ) : (
              'Validate Text'
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Validation Results</h3>
          {results.map((result, index) => (
            <Card key={index} className={`border-l-4 ${
              result.isCorrect 
                ? 'border-l-green-500' 
                : 'border-l-red-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {getProviderDisplayName(result.provider)}
                  </CardTitle>
                  <Badge 
                    variant={result.isCorrect ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {result.isCorrect ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Needs Correction
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {!result.isCorrect && result.correctedText && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Suggested Correction:
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{result.correctedText}</p>
                    </div>
                  </div>
                )}
                
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium text-red-600 dark:text-red-400">
                      Issues Found:
                    </Label>
                    <ul className="text-sm space-y-1">
                      {result.errors.map((error, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="w-3 h-3 mt-0.5 text-red-500 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.confidence && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Confidence:</span>
                    <Badge variant="outline">{(result.confidence * 100).toFixed(1)}%</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}