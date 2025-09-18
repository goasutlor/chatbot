import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.email }
    })

    return NextResponse.json(preferences || {
      mode: 'auto',
      selectedLLM: null,
      openaiApiKey: '',
      geminiApiKey: '',
      claudeApiKey: '',
      perplexityApiKey: ''
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mode, selectedLLM, openaiApiKey, geminiApiKey, claudeApiKey, perplexityApiKey } = await request.json()

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.email },
      update: {
        mode,
        selectedLLM,
        openaiApiKey,
        geminiApiKey,
        claudeApiKey,
        perplexityApiKey,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.email,
        mode,
        selectedLLM,
        openaiApiKey,
        geminiApiKey,
        claudeApiKey,
        perplexityApiKey
      }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error saving preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
