"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Upload, Loader2, CheckCircle, XCircle, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { ApiKeys } from '@/app/dashboard/page'
import { toast } from 'sonner'

interface ImageValidationProps {
  apiKeys: ApiKeys
}

export function ImageValidation({ apiKeys }: ImageValidationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [validating, setValidating] = useState(false)
  const [results, setResults] = useState<Array<{
    provider: string
    isCorrect: boolean
    interpretation?: string
    correctedInterpretation?: string
    confidence?: number
    issues?: string[]
  }>>([])

  const availableProviders = Object.entries(apiKeys)
    .filter(([_, key]) => key.trim() !== '')
    .map(([provider, _]) => provider)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResults([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    )
  }

  const handleValidate = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to validate')
      return
    }

    if (selectedProviders.length === 0) {
      toast.error('Please select at least one AI provider')
      return
    }

    setValidating(true)
    setResults([])

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('providers', JSON.stringify(selectedProviders))
      formData.append('apiKeys', JSON.stringify(apiKeys))

      const response = await fetch('/api/validate-image', {
        method: 'POST',
        body: formData
      })

      const validationResults = await response.json()
      setResults(validationResults.results || [])
      
      const allCorrect = validationResults.results?.every((r: any) => r.isCorrect)
      if (allCorrect) {
        toast.success('All providers confirmed the image content is accurate!')
      } else {
        toast.warning('Some providers found issues with the image content')
      }
    } catch (error) {
      toast.error('Failed to validate image')
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
          <CardTitle>Image Validation</CardTitle>
          <CardDescription>
            Upload an image to validate its content and get AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Select Image</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile?.name} ({(selectedFile?.size || 0 / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl('')
                    setResults([])
                  }}>
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Drop image here' : 'Upload an image'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to select (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Select AI Providers</Label>
            <div className="flex flex-wrap gap-3">
              {availableProviders.map((provider) => (
                <div key={provider} className="flex items-center space-x-2">
                  <Checkbox
                    id={`img-${provider}`}
                    checked={selectedProviders.includes(provider)}
                    onCheckedChange={() => handleProviderToggle(provider)}
                  />
                  <Label htmlFor={`img-${provider}`} className="text-sm cursor-pointer">
                    {getProviderDisplayName(provider)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleValidate}
            disabled={validating || !selectedFile || selectedProviders.length === 0}
            className="w-full h-12 text-lg"
          >
            {validating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with {selectedProviders.length} provider{selectedProviders.length > 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-5 w-5" />
                Validate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Analysis Results</h3>
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
                        Accurate
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Issues Found
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {result.interpretation && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Content Analysis:</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{result.interpretation}</p>
                    </div>
                  </div>
                )}

                {!result.isCorrect && result.correctedInterpretation && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Corrected Analysis:
                    </Label>
                    <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-md border border-orange-200 dark:border-orange-800">
                      <p className="text-sm">{result.correctedInterpretation}</p>
                    </div>
                  </div>
                )}
                
                {result.issues && result.issues.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium text-red-600 dark:text-red-400">
                      Issues Identified:
                    </Label>
                    <ul className="text-sm space-y-1">
                      {result.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="w-3 h-3 mt-0.5 text-red-500 flex-shrink-0" />
                          {issue}
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