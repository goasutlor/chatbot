import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

export type LLMProvider = 'chatgpt' | 'gemini' | 'claude' | 'perplexity'

export interface LLMResponse {
  content: string
  model: string
  provider: LLMProvider
}

export class LLMService {
  private openai: OpenAI | null = null
  private gemini: GoogleGenerativeAI | null = null
  private claude: Anthropic | null = null

  constructor() {
    // Initialize clients if API keys are available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }

    if (process.env.GOOGLE_AI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })
    }
  }

  async generateResponse(
    message: string,
    provider: LLMProvider,
    userApiKey?: string
  ): Promise<LLMResponse> {
    switch (provider) {
      case 'chatgpt':
        return this.generateChatGPTResponse(message, userApiKey)
      case 'gemini':
        return this.generateGeminiResponse(message, userApiKey)
      case 'claude':
        return this.generateClaudeResponse(message, userApiKey)
      case 'perplexity':
        return this.generatePerplexityResponse(message, userApiKey)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private async generateChatGPTResponse(message: string, userApiKey?: string): Promise<LLMResponse> {
    const client = userApiKey ? new OpenAI({ apiKey: userApiKey }) : this.openai
    
    if (!client) {
      throw new Error('OpenAI API key not provided')
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return {
      content: completion.choices[0]?.message?.content || '',
      model: completion.model,
      provider: 'chatgpt'
    }
  }

  private async generateGeminiResponse(message: string, userApiKey?: string): Promise<LLMResponse> {
    const apiKey = userApiKey || process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Google AI API key not provided')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(message)
    const response = await result.response
    const text = response.text()

    return {
      content: text,
      model: "gemini-1.5-flash",
      provider: 'gemini'
    }
  }

  private async generateClaudeResponse(message: string, userApiKey?: string): Promise<LLMResponse> {
    const client = userApiKey ? new Anthropic({ apiKey: userApiKey }) : this.claude
    
    if (!client) {
      throw new Error('Anthropic API key not provided')
    }

    const message_response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }],
    })

    return {
      content: message_response.content[0].type === 'text' ? message_response.content[0].text : '',
      model: message_response.model,
      provider: 'claude'
    }
  }

  private async generatePerplexityResponse(message: string, userApiKey?: string): Promise<LLMResponse> {
    const apiKey = userApiKey || process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      throw new Error('Perplexity API key not provided')
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model,
      provider: 'perplexity'
    }
  }

  async generateStreamResponse(
    message: string,
    provider: LLMProvider,
    userApiKey?: string
  ): Promise<ReadableStream<Uint8Array>> {
    switch (provider) {
      case 'chatgpt':
        return this.generateChatGPTStreamResponse(message, userApiKey)
      case 'gemini':
        return this.generateGeminiStreamResponse(message, userApiKey)
      case 'claude':
        return this.generateClaudeStreamResponse(message, userApiKey)
      case 'perplexity':
        return this.generatePerplexityStreamResponse(message, userApiKey)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  private async generateChatGPTStreamResponse(message: string, userApiKey?: string): Promise<ReadableStream<Uint8Array>> {
    const client = userApiKey ? new OpenAI({ apiKey: userApiKey }) : this.openai
    
    if (!client) {
      throw new Error('OpenAI API key not provided')
    }

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    })

    const encoder = new TextEncoder()
    
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
          }
        }
        controller.close()
      }
    })
  }

  private async generateGeminiStreamResponse(message: string, userApiKey?: string): Promise<ReadableStream<Uint8Array>> {
    const apiKey = userApiKey || process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Google AI API key not provided')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContentStream(message)
    const encoder = new TextEncoder()
    
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`))
          }
        }
        controller.close()
      }
    })
  }

  private async generateClaudeStreamResponse(message: string, userApiKey?: string): Promise<ReadableStream<Uint8Array>> {
    const client = userApiKey ? new Anthropic({ apiKey: userApiKey }) : this.claude
    
    if (!client) {
      throw new Error('Anthropic API key not provided')
    }

    const stream = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: message }],
      stream: true,
    })

    const encoder = new TextEncoder()
    
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`))
          }
        }
        controller.close()
      }
    })
  }

  private async generatePerplexityStreamResponse(message: string, userApiKey?: string): Promise<ReadableStream<Uint8Array>> {
    const apiKey = userApiKey || process.env.PERPLEXITY_API_KEY
    if (!apiKey) {
      throw new Error('Perplexity API key not provided')
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const encoder = new TextEncoder()
    
    return new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                controller.close()
                return
              }
              
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
        controller.close()
      }
    })
  }
}

export const llmService = new LLMService()
