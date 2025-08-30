import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, provider, apiKey } = await request.json()

    if (!text || !provider || !apiKey) {
      return NextResponse.json({ 
        isCorrect: false, 
        error: 'Missing required fields' 
      })
    }

    let result
    
    switch (provider) {
      case 'openai':
        result = await validateWithOpenAI(text, apiKey)
        break
      case 'gemini':
        result = await validateWithGemini(text, apiKey)
        break
      case 'claude':
        result = await validateWithClaude(text, apiKey)
        break
      case 'llama':
        result = await validateWithLLaMA(text, apiKey)
        break
      default:
        return NextResponse.json({ isCorrect: false, error: 'Unsupported provider' })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ 
      isCorrect: false, 
      error: 'Validation failed' 
    })
  }
}

async function validateWithOpenAI(text: string, apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a content validator. Analyze the given text for factual accuracy, grammar, and clarity. Respond with JSON format: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}'
          },
          {
            role: 'user', 
            content: `Please validate this text: "${text}"`
          }
        ],
        temperature: 0.1
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    
    try {
      return JSON.parse(content)
    } catch {
      return {
        isCorrect: false,
        correctedText: content,
        errors: ['Unable to parse validation response'],
        confidence: 0.5
      }
    }
  } catch (error) {
    throw new Error('OpenAI validation failed')
  }
}

async function validateWithGemini(text: string, apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Validate this text for accuracy and correctness. Respond in JSON format: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}. Text to validate: "${text}"`
          }]
        }]
      })
    })

    const data = await response.json()
    const content = data.candidates[0].content.parts[0].text
    
    try {
      return JSON.parse(content)
    } catch {
      return {
        isCorrect: false,
        correctedText: content,
        errors: ['Unable to parse validation response'],
        confidence: 0.5
      }
    }
  } catch (error) {
    throw new Error('Gemini validation failed')
  }
}

async function validateWithClaude(text: string, apiKey: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Validate this text for accuracy and correctness. Respond in JSON format: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}. Text: "${text}"`
        }]
      })
    })

    const data = await response.json()
    const content = data.content[0].text
    
    try {
      return JSON.parse(content)
    } catch {
      return {
        isCorrect: false,
        correctedText: content,
        errors: ['Unable to parse validation response'],
        confidence: 0.5
      }
    }
  } catch (error) {
    throw new Error('Claude validation failed')
  }
}

async function validateWithLLaMA(text: string, apiKey: string) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `Validate this text for accuracy: "${text}". Respond in JSON: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}`
      })
    })

    const data = await response.json()
    const content = data[0]?.generated_text || ''
    
    try {
      const jsonMatch = content.match(/\{.*\}/s)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        isCorrect: false,
        correctedText: content,
        errors: ['Unable to parse validation response'],
        confidence: 0.5
      }
    } catch {
      return {
        isCorrect: false,
        correctedText: content,
        errors: ['Unable to parse validation response'],
        confidence: 0.5
      }
    }
  } catch (error) {
    throw new Error('LLaMA validation failed')
  }
}