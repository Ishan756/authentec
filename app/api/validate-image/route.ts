import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const providers = JSON.parse(formData.get('providers') as string)
    const apiKeys = JSON.parse(formData.get('apiKeys') as string)

    if (!image || !providers || !apiKeys) {
      return NextResponse.json({ 
        results: [],
        error: 'Missing required data' 
      })
    }

    const imageBuffer = await image.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    const promises = providers.map(async (provider: string) => {
      try {
        let result
        switch (provider) {
          case 'openai':
            result = await validateImageWithOpenAI(base64Image, apiKeys.openai)
            break
          case 'gemini':
            result = await validateImageWithGemini(base64Image, apiKeys.gemini)
            break
          case 'claude':
            result = await validateImageWithClaude(base64Image, apiKeys.claude)
            break
          case 'llama':
            result = await validateImageWithLLaMA(base64Image, apiKeys.llama)
            break
          default:
            throw new Error('Unsupported provider')
        }
        return { provider, ...result }
      } catch (error) {
        return {
          provider,
          isCorrect: false,
          error: `${provider} validation failed`
        }
      }
    })

    const results = await Promise.all(promises)
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ 
      results: [],
      error: 'Image validation failed' 
    })
  }
}

async function validateImageWithOpenAI(base64Image: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image for content accuracy. Describe what you see and identify any potential issues or inaccuracies. Respond in JSON format: {"isCorrect": boolean, "interpretation": string, "correctedInterpretation": string, "issues": string[], "confidence": number}'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })
  })

  const data = await response.json()
  const content = data.choices[0].message.content
  
  try {
    return JSON.parse(content)
  } catch {
    return {
      isCorrect: true,
      interpretation: content,
      confidence: 0.8
    }
  }
}

async function validateImageWithGemini(base64Image: string, apiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: 'Analyze this image for content accuracy. Respond in JSON format: {"isCorrect": boolean, "interpretation": string, "correctedInterpretation": string, "issues": string[], "confidence": number}'
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    })
  })

  const data = await response.json()
  const content = data.candidates[0].content.parts[0].text
  
  try {
    return JSON.parse(content)
  } catch {
    return {
      isCorrect: true,
      interpretation: content,
      confidence: 0.8
    }
  }
}

async function validateImageWithClaude(base64Image: string, apiKey: string) {
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
        content: [
          {
            type: 'text',
            text: 'Analyze this image for content accuracy. Respond in JSON format: {"isCorrect": boolean, "interpretation": string, "correctedInterpretation": string, "issues": string[], "confidence": number}'
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }]
    })
  })

  const data = await response.json()
  const content = data.content[0].text
  
  try {
    return JSON.parse(content)
  } catch {
    return {
      isCorrect: true,
      interpretation: content,
      confidence: 0.8
    }
  }
}

async function validateImageWithLLaMA(base64Image: string, apiKey: string) {
  // Note: Most LLaMA models don't support vision directly
  // This is a placeholder implementation
  return {
    isCorrect: true,
    interpretation: 'LLaMA text-only model cannot analyze images directly',
    issues: ['Vision analysis not supported by this model'],
    confidence: 0.1
  }
}