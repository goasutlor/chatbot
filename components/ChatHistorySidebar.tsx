'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Edit3, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  preview: string
  messageCount: number
}

interface ChatHistorySidebarProps {
  currentChatId?: string
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onRenameChat: (chatId: string, newTitle: string) => void
}

export function ChatHistorySidebar({
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat
}: ChatHistorySidebarProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // Mock data - ในอนาคตจะดึงจาก database
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'React Development Help',
        timestamp: new Date('2024-01-15T10:30:00'),
        preview: 'How to implement state management in React...',
        messageCount: 12
      },
      {
        id: '2',
        title: 'API Integration',
        timestamp: new Date('2024-01-14T15:20:00'),
        preview: 'Help me integrate REST APIs with...',
        messageCount: 8
      },
      {
        id: '3',
        title: 'CSS Grid Layout',
        timestamp: new Date('2024-01-13T09:15:00'),
        preview: 'Need assistance with CSS Grid properties...',
        messageCount: 6
      },
      {
        id: '4',
        title: 'Database Design',
        timestamp: new Date('2024-01-12T14:45:00'),
        preview: 'Question about database normalization...',
        messageCount: 15
      }
    ]
    setChatSessions(mockSessions)
  }, [])

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameChat(editingId, editTitle.trim())
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === editingId 
            ? { ...chat, title: editTitle.trim() }
            : chat
        )
      )
    }
    setEditingId(null)
    setEditTitle('')
  }

  const cancelRename = () => {
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <div className="w-80 bg-white border-r border-primary-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-primary-200">
        <Button
          onClick={onNewChat}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {chatSessions.length === 0 ? (
            <div className="text-center text-primary-500 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary-300" />
              <p className="text-sm">No chat history yet</p>
              <p className="text-xs mt-1">Start a new conversation</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-primary-50 ${
                    currentChatId === session.id 
                      ? 'bg-accent-50 border border-accent-200' 
                      : 'hover:bg-primary-50'
                  }`}
                  onClick={() => onChatSelect(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === session.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={saveRename}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename()
                            if (e.key === 'Escape') cancelRename()
                          }}
                          className="w-full text-sm font-medium bg-white border border-primary-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent-500"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="text-sm font-medium text-primary-900 truncate">
                          {session.title}
                        </h3>
                      )}
                      
                      <p className="text-xs text-primary-500 mt-1 truncate">
                        {session.preview}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-primary-400">
                          {formatTimestamp(session.timestamp)}
                        </span>
                        <span className="text-xs text-primary-400">
                          {session.messageCount} messages
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRename(session.id, session.title)
                          }}
                          className="p-1 hover:bg-primary-100 rounded text-primary-500 hover:text-primary-700"
                          title="Rename chat"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(session.id)
                          }}
                          className="p-1 hover:bg-red-100 rounded text-primary-500 hover:text-red-600"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-primary-200">
        <div className="text-xs text-primary-500 text-center">
          {chatSessions.length} conversation{chatSessions.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
