import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json({ valid: false, error: 'Missing provider or API key' })
    }

    let isValid = false

    switch (provider) {
      case 'openai':
        isValid = await validateOpenAI(apiKey)
        break
      case 'gemini':
        isValid = await validateGemini(apiKey)
        break
      case 'claude':
        isValid = await validateClaude(apiKey)
        break
      case 'llama':
        isValid = await validateLLaMA(apiKey)
        break
      default:
        return NextResponse.json({ valid: false, error: 'Unsupported provider' })
    }

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Validation failed' })
  }
}

async function validateOpenAI(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    })
    return response.ok
  } catch {
    return false
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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    })
    return response.ok || response.status === 400 // 400 means valid key but bad request format
  } catch {
    return false
  }
}

async function validateLLaMA(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    })
    return response.ok
  } catch {
    return false
  }
}