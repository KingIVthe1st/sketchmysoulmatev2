import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const LyricsRequestSchema = z.object({
  prompt: z.string().min(1).max(500)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = LyricsRequestSchema.parse(body)
    
    // Call TopMediai Lyrics API
    const response = await fetch('https://api.topmediai.com/v1/lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MUSIC_API_KEY!
      },
      body: JSON.stringify({ prompt: validatedData.prompt })
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({ 
      lyrics: data.lyrics || data.data?.lyrics || 'No lyrics generated' 
    })
    
  } catch (error) {
    console.error('Lyrics API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate lyrics' },
      { status: 500 }
    )
  }
}
