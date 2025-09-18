'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Settings, Bot, Zap, Brain, Search, ChevronDown, ChevronUp } from 'lucide-react'

interface LLMSelectorProps {
  mode: 'auto' | 'manual'
  selectedLLM: string | null
  onModeChange: (mode: 'auto' | 'manual') => void
  onLLMChange: (llm: string | null) => void
  onApiKeyChange: (provider: string, apiKey: string) => void
  apiKeys: Record<string, string>
}

const llmProviders = [
  { id: 'chatgpt', name: 'ChatGPT', icon: Bot, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { id: 'gemini', name: 'Gemini', icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'claude', name: 'Claude', icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'perplexity', name: 'Perplexity', icon: Search, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
]

export function LLMSelector({
  mode,
  selectedLLM,
  onModeChange,
  onLLMChange,
  onApiKeyChange,
  apiKeys
}: LLMSelectorProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-900">AI Models</h3>
          <p className="text-sm text-primary-500 mt-1">Choose your preferred AI assistant</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-primary-600 hover:text-primary-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-primary-700 mb-3">
          Selection Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onModeChange('auto')}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'auto'
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${mode === 'auto' ? 'bg-white' : 'bg-accent-500'}`}></div>
              <span>Auto Select</span>
            </div>
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === 'manual'
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${mode === 'manual' ? 'bg-white' : 'bg-accent-500'}`}></div>
              <span>Manual Select</span>
            </div>
          </button>
        </div>
      </div>

      {/* Manual LLM Selection */}
      {mode === 'manual' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-700 mb-3">
            Choose AI Model
          </label>
          <div className="grid grid-cols-2 gap-3">
            {llmProviders.map((provider) => {
              const Icon = provider.icon
              const isSelected = selectedLLM === provider.id
              return (
                <button
                  key={provider.id}
                  onClick={() => onLLMChange(provider.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? `${provider.bgColor} ${provider.borderColor} border-2 shadow-sm`
                      : 'border-primary-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? provider.bgColor : 'bg-primary-100'}`}>
                      <Icon className={`w-5 h-5 ${provider.color}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`text-2xl font-semibold tracking-tight font-sans ${provider.id === 'gemini' ? 'text-gray-400' : 'text-primary-900'}`}>{provider.name}</span>
                      {isSelected && (
                        <div className="text-xs text-primary-500 mt-1">Selected</div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* API Keys Settings */}
      {showSettings && (
        <div className="space-y-4 pt-6 border-t border-primary-200 animate-slide-up">
          <div>
            <h4 className="text-sm font-medium text-primary-700 mb-4">API Keys</h4>
            <p className="text-xs text-primary-500 mb-4">
              Enter your API keys to use your own credits. Keys are stored securely and only used for your requests.
            </p>
          </div>
          <div className="space-y-4">
            {llmProviders.map((provider) => (
              <div key={provider.id}>
                <label className="block text-xs font-medium text-primary-600 mb-2">
                  {provider.name} API Key
                </label>
                <input
                  type="password"
                  placeholder={`Enter your ${provider.name} API key`}
                  value={apiKeys[provider.id] || ''}
                  onChange={(e) => onApiKeyChange(provider.id, e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
