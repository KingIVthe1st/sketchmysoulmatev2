import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const MubertGenerateSchema = z.object({
  prompt: z.string().min(10).max(500),
  duration: z.number().min(30).max(180).default(60)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = MubertGenerateSchema.parse(body)
    
    console.log('🎵 Generating music with Mubert:', validatedData)
    
    // Mubert API call - using their text-to-music generation
    const response = await fetch('https://api-b2b.mubert.com/v2/RecordTrack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'RecordTrack',
        params: {
          pat: process.env.MUBERT_PAT || 'demo', // Personal Access Token
          duration: validatedData.duration,
          tags: validatedData.prompt,
          mode: 'track',
          format: 'mp3'
        }
      })
    })
    
    if (!response.ok) {
      console.error('Mubert API error:', response.status, await response.text())
      throw new Error(`Mubert API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Mubert response:', data)
    
    if (data.status === 1 && data.data && data.data.tasks) {
      const task = data.data.tasks[0]
      return NextResponse.json({
        taskId: task.id,
        status: 'processing',
        estimatedTime: validatedData.duration + 10 // Add 10 seconds buffer
      })
    } else {
      throw new Error('Invalid Mubert response structure')
    }
    
  } catch (error: any) {
    console.error('Mubert generate API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    // For now, return demo data for development
    console.log('🧪 Falling back to demo mode for Mubert')
    return NextResponse.json({ 
      taskId: 'mubert-demo-' + Date.now(),
      status: 'processing',
      estimatedTime: 60,
      isDemoMode: true 
    })
  }
}
