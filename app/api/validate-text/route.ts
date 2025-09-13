import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
  const { text, provider } = await request.json()

  if (!text || !provider) {
      return NextResponse.json({ 
        isCorrect: false, 
    error: 'Missing required fields' 
      })
    }

    let result
    
    switch (provider) {
      case 'gemini':
    result = await validateWithGemini(text)
        break
      case 'claude':
    result = await validateWithClaude(text)
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
async function validateWithGemini(text: string) {
  try {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a validation engine. Output ONLY raw JSON. NO prose, NO markdown fences, NO explanation. Schema: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}. Rules: 1) Only include items in errors if the factual information is wrong. 2) Ignore grammar/spelling issues. 3) If no factual issues, set errors to an empty array and isCorrect true. 4) confidence is a float 0..1. Text: "${text}"`
          }]
        }]
      })
    })

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') || ''

    const cleaned = sanitizeAndExtractJSON(content)
    const parsed = attemptJSONParse(cleaned)
    if (parsed.ok) {
      const result = ensureValidationShape(parsed.value)
      return result
    }
    // Fallback minimal object when still failing
    return {
      isCorrect: false,
      correctedText: cleaned || content,
      errors: ['Unable to parse validation response'],
      confidence: 0.5
    }
  } catch (error) {
    throw new Error('Gemini validation failed')
  }
}
async function validateWithClaude(text: string) {
  try {
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
            content: `You are a validation engine. Output ONLY raw JSON. NO prose, NO markdown fences, NO explanation. Schema: {"isCorrect": boolean, "correctedText": string, "errors": string[], "confidence": number}. Rules: 1) Only include items in errors if the factual information is wrong. 2) Ignore grammar/spelling issues. 3) If no factual issues, set errors to empty array and isCorrect true. 4) confidence is a float 0..1. Text: "${text}"`
          }
        ]
      })
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''
    const cleaned = sanitizeAndExtractJSON(content)
    const parsed = attemptJSONParse(cleaned)
    if (parsed.ok) return ensureValidationShape(parsed.value)
    return {
      isCorrect: false,
      correctedText: cleaned || content,
      errors: ['Unable to parse validation response'],
      confidence: 0.5
    }
  } catch (error) {
    throw new Error('Claude validation failed')
  }
}

// --- Helpers for resilient JSON parsing --- //
function sanitizeAndExtractJSON(raw: string): string {
  if (!raw) return ''
  let txt = raw.trim()
  // Remove markdown fences
  txt = txt.replace(/```(?:json)?/gi, ' ').trim()
  // If raw contains explanation before JSON, attempt to isolate first JSON object
  const firstBrace = txt.indexOf('{')
  const lastBrace = txt.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    txt = txt.slice(firstBrace, lastBrace + 1)
  }
  // Remove trailing commas before closing } or ]
  txt = txt.replace(/,\s*(\}|\])/g, '$1')
  // Replace single quotes if it seems JSON-like but invalid
  if (!attemptJSONParse(txt).ok) {
    const approxJson = txt
      .replace(/'(.*?)'/g, '"$1"')
      .replace(/“|”/g, '"')
      .replace(/‘|’/g, '"')
  
    if (attemptJSONParse(approxJson).ok) return approxJson
  }
  return txt
}

function attemptJSONParse(str: string): { ok: true, value: any } | { ok: false } {
  try {
    if (!str) return { ok: false }
    const val = JSON.parse(str)
    return { ok: true, value: val }
  } catch {
    return { ok: false }
  }
}

function ensureValidationShape(obj: any) {
  return {
    isCorrect: typeof obj.isCorrect === 'boolean' ? obj.isCorrect : (Array.isArray(obj.errors) ? obj.errors.length === 0 : false),
    correctedText: typeof obj.correctedText === 'string' ? obj.correctedText : '',
    errors: Array.isArray(obj.errors) ? obj.errors : [],
    confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.75
  }
}