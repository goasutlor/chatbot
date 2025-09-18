'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, ChevronDown, Check, Plus, Settings2, Database } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LLMProvider } from '@/lib/llm-services'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  llmModel?: string
  timestamp: Date
}

interface ChatInterfaceProps {
  selectedLLM: string | null
  mode: 'auto' | 'manual'
  apiKeys: Record<string, string>
  onModeChange: (mode: 'auto' | 'manual') => void
  onLLMChange: (llm: string | null) => void
}

const llmProviders = [
  { id: 'auto', name: 'Auto', icon: Settings2, description: 'Let AI choose the best model' },
  { id: 'chatgpt', name: 'ChatGPT', icon: Bot, description: 'OpenAI GPT-4' },
  { id: 'gemini', name: 'Gemini', icon: Bot, description: 'Google Gemini 1.5' },
  { id: 'claude', name: 'Claude', icon: Bot, description: 'Anthropic Claude 3.5' },
  { id: 'perplexity', name: 'Perplexity', icon: Bot, description: 'Perplexity AI' },
  { id: 'local-rag', name: 'Local RAG', icon: Database, description: 'Local knowledge base' },
]

export function ChatInterface({ selectedLLM, mode, apiKeys, onModeChange, onLLMChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Determine which LLM to use
      let llmToUse = selectedLLM
      if (mode === 'auto') {
        // Auto mode: cycle through available LLMs
        const availableLLMs = ['chatgpt', 'gemini', 'claude', 'perplexity']
        llmToUse = availableLLMs[Math.floor(Math.random() * availableLLMs.length)]
      }

      if (!llmToUse) {
        throw new Error('No LLM selected')
      }

      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        llmModel: llmToUse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle Local RAG differently
      if (llmToUse === 'local-rag') {
        // Simulate local RAG response
        const localResponse = `🗄️ **Local RAG Response:**

Based on your local knowledge base, here's what I found about "${userMessage.content}":

This is a simulated response from your Local RAG system. In a real implementation, this would:
- Search through your documents
- Find relevant passages
- Generate context-aware responses
- Use your private data securely

**Features to implement:**
- Document upload & indexing
- Vector search
- Context retrieval
- Local AI processing`

        let currentContent = ''
        const words = localResponse.split(' ')
        
        for (let i = 0; i < words.length; i++) {
          currentContent += words[i] + ' '
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: currentContent.trim() }
                : msg
            )
          )
          await new Promise(resolve => setTimeout(resolve, 50)) // Simulate streaming
        }
        
        setIsLoading(false)
        return
      }

      // Stream response for regular LLMs
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          provider: llmToUse,
          apiKey: apiKeys[llmToUse]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                content += data.content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content }
                      : msg
                  )
                )
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => 
        prev.map(msg => 
          msg.id === (Date.now() + 1).toString()
            ? { ...msg, content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}` }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleModelSelect = (modelId: string) => {
    if (modelId === 'auto') {
      onModeChange('auto')
      onLLMChange(null)
    } else {
      onModeChange('manual')
      onLLMChange(modelId)
    }
    setShowModelMenu(false)
  }

  const getCurrentModel = () => {
    if (mode === 'auto') {
      return llmProviders.find(p => p.id === 'auto')
    }
    return llmProviders.find(p => p.id === selectedLLM) || llmProviders[0]
  }

  const currentModel = getCurrentModel()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-white">
        <div className="flex items-center space-x-4">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center space-x-3 px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 min-w-[180px]"
            >
              <div className="flex items-center space-x-2">
                <currentModel.icon className="w-4 h-4 text-primary-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-primary-900">{currentModel?.name}</div>
                  <div className="text-xs text-primary-500">{currentModel?.description}</div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-primary-600 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showModelMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-primary-200 rounded-xl shadow-lg z-50 animate-slide-up">
                <div className="p-2">
                  <div className="text-xs font-medium text-primary-600 px-3 py-2 mb-1">
                    Ctrl + / to switch models
                  </div>
                  
                  {llmProviders.map((provider) => {
                    const Icon = provider.icon
                    const isSelected = (mode === 'auto' && provider.id === 'auto') || 
                                     (mode === 'manual' && selectedLLM === provider.id)
                    
                    return (
                      <button
                        key={provider.id}
                        onClick={() => handleModelSelect(provider.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-primary-600" />
                          <div>
                            <div className="text-sm font-medium text-primary-900">{provider.name}</div>
                            <div className="text-xs text-primary-500">{provider.description}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-accent-500" />
                        )}
                      </button>
                    )
                  })}
                  
                  <div className="border-t border-primary-200 mt-2 pt-2">
                    <button
                      onClick={() => setShowModelMenu(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-primary-600" />
                      <div className="text-sm font-medium text-primary-900">Add Models</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          disabled={messages.length === 0}
        >
          Clear Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Start a conversation with AI</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <>
                      <Bot className="w-5 h-5 mt-0.5 text-gray-500" />
                      <button
                        className="ml-2 px-2 py-1 text-xs bg-primary-200 text-primary-900 rounded hover:bg-primary-300 transition"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        title="Copy"
                        type="button"
                      >
                        Copy
                      </button>
                    </>
                  )}
                  {message.role === 'user' && (
                    <User className="w-5 h-5 mt-0.5 text-primary-200" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.llmModel && (
                      <div className="text-xs opacity-70 mt-2">
                        Powered by {message.llmModel}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-gray-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your message... (Press Enter to send)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[44px] max-h-32 overflow-y-auto chat-textarea"
            disabled={isLoading}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 128) + 'px'
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
