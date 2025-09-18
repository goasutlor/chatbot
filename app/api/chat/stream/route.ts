import { NextRequest } from 'next/server'
import { llmService } from '@/lib/llm-services'

export async function POST(request: NextRequest) {
  try {
    const { message, provider, apiKey } = await request.json()

    if (!message || !provider) {
      return new Response('Missing message or provider', { status: 400 })
    }

    const stream = await llmService.generateStreamResponse(message, provider, apiKey)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Stream error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
