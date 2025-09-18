'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { LoginButton } from '@/components/LoginButton'
import { LLMSelector } from '@/components/LLMSelector'
import { ChatInterface } from '@/components/ChatInterface'

export default function Home() {
  const { data: session, status } = useSession()
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Load user preferences on login
  useEffect(() => {
    if (session?.user?.email) {
      loadUserPreferences()
    }
  }, [session])

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const prefs = await response.json()
        setMode(prefs.mode || 'auto')
        setSelectedLLM(prefs.selectedLLM || null)
        setApiKeys({
          chatgpt: prefs.openaiApiKey || '',
          gemini: prefs.geminiApiKey || '',
          claude: prefs.claudeApiKey || '',
          perplexity: prefs.perplexityApiKey || '',
        })
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }

  const saveUserPreferences = async () => {
    if (!session?.user?.email) return

    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          selectedLLM,
          openaiApiKey: apiKeys.chatgpt,
          geminiApiKey: apiKeys.gemini,
          claudeApiKey: apiKeys.claude,
          perplexityApiKey: apiKeys.perplexity,
        }),
      })
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  const handleModeChange = (newMode: 'auto' | 'manual') => {
    setMode(newMode)
    if (newMode === 'auto') {
      setSelectedLLM(null)
    }
  }

  const handleLLMChange = (llm: string | null) => {
    setSelectedLLM(llm)
  }

  const handleApiKeyChange = (provider: string, apiKey: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: apiKey }))
  }

  // Chat History Handlers
  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)
    // TODO: Load chat messages for this chatId
  }

  const handleNewChat = () => {
    setCurrentChatId(null)
    // TODO: Clear current chat messages
  }

  const handleDeleteChat = (chatId: string) => {
    // TODO: Delete chat from database
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }

  const handleRenameChat = (chatId: string, newTitle: string) => {
    // TODO: Update chat title in database
  }

  // Save preferences when they change
  useEffect(() => {
    if (session?.user?.email) {
      saveUserPreferences()
    }
  }, [mode, selectedLLM, apiKeys, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Header */}
        <header className="bg-white border-b border-primary-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-semibold tracking-tight font-sans text-gray-400">KO Chatbot</span>
              <img src="/arrow-logo.svg" alt="Logo" className="ml-2 w-8 h-8" />
            </div>
            <LoginButton />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Chat History Sidebar */}
          <div className="hidden md:block">
            <LLMSelector
              mode={mode}
              selectedLLM={selectedLLM}
              onModeChange={handleModeChange}
              onLLMChange={handleLLMChange}
              onApiKeyChange={handleApiKeyChange}
              apiKeys={apiKeys}
            />
          </div>

          {/* Chat Interface */}
          <div className="flex-1 bg-white">
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded"></div>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 mb-2">Welcome to Ko Chatbot</h2>
              <p className="text-primary-600 mb-6 max-w-md">
                Sign in with your Google account to start chatting with multiple AI models including ChatGPT, Gemini, Claude, and Perplexity.
              </p>
              <div className="space-y-4">
                <LoginButton />
                <div className="text-xs text-primary-500 text-center">
                  Sign in once, access all AI models
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold tracking-tight font-sans text-gray-400">KO Chatbot</span>
            <img src="/arrow-logo.svg" alt="Logo" className="ml-2 w-8 h-8" />
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* AI Model Selector Sidebar */}
        <LLMSelector
          mode={mode}
          selectedLLM={selectedLLM}
          onModeChange={handleModeChange}
          onLLMChange={handleLLMChange}
          onApiKeyChange={handleApiKeyChange}
          apiKeys={apiKeys}
        />

        {/* Chat Interface */}
        <div className="flex-1 bg-white">
          <ChatInterface
            selectedLLM={selectedLLM}
            mode={mode}
            apiKeys={apiKeys}
            onModeChange={handleModeChange}
            onLLMChange={handleLLMChange}
          />
        </div>
      </div>
    </div>
  )
}
