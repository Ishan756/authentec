import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
  const providers = JSON.parse(formData.get('providers') as string)

  if (!image || !providers) {
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
          case 'gemini':
            result = await validateImageWithGemini(base64Image)
            break
          case 'claude':
            result = await validateImageWithClaude(base64Image)
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

async function validateImageWithGemini(base64Image: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
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

async function validateImageWithClaude(base64Image: string) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY')
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://localhost',
      'X-Title': 'Authentec'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image for content accuracy. Respond ONLY JSON: {"isCorrect": boolean, "interpretation": string, "correctedInterpretation": string, "issues": string[], "confidence": number}' },
            { type: 'input_image', image_url: `data:image/jpeg;base64,${base64Image}` }
          ]
        }
      ]
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