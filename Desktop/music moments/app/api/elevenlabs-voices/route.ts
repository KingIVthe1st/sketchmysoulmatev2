import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}