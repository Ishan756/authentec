import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
  const { provider, apiKey } = await request.json()

  if (!provider || !apiKey) {
      return NextResponse.json({ valid: false, error: 'Missing provider or API key' })
    }

    let isValid = false

    switch (provider) {
      case 'gemini':
        isValid = await validateGemini(apiKey)
        break
      case 'claude':
        isValid = await validateClaude(apiKey)
        break
      default:
        return NextResponse.json({ valid: false, error: 'Unsupported provider' })
    }

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Validation failed' })
  }
}

async function validateGemini(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    return response.ok
  } catch {
    return false
  }
}

async function validateClaude(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    return response.ok
  } catch {
    return false
  }
}