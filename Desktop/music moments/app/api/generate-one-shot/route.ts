import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const OneShotRequestSchema = z.object({
  prompt: z.string().min(1),
  lyrics: z.string().optional(),
  title: z.string().optional(),
  instrumental: z.number().default(0)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = OneShotRequestSchema.parse(body)
    
    // Call TopMediai v1 Music API
    const response = await fetch('https://api.topmediai.com/v1/music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MUSIC_API_KEY!
      },
      body: JSON.stringify({
        is_auto: 1,
        prompt: validatedData.prompt,
        lyrics: validatedData.lyrics || '',
        title: validatedData.title || 'MusicMoments Song',
        instrumental: validatedData.instrumental
      })
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      audioUrl: data.audio_url || data.audioUrl,
      coverUrl: data.cover_url || data.coverUrl || data.image_url,
      lyrics: data.lyrics
    })
    
  } catch (error) {
    console.error('One-shot API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate song' },
      { status: 500 }
    )
  }
}
