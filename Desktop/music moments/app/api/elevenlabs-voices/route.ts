import { NextRequest, NextResponse } from 'next/server'
import { getElevenLabsClient } from '../../lib/elevenlabs-client'

// Mock voices as fallback
const mockVoices = [
  {
    voice_id: 'voice-001',
    name: 'Sarah (Female)',
    category: 'warm',
    labels: { gender: 'female', age: 'young' }
  },
  {
    voice_id: 'voice-002', 
    name: 'Michael (Male)',
    category: 'energetic',
    labels: { gender: 'male', age: 'young' }
  },
  {
    voice_id: 'voice-003',
    name: 'Emma (Female)',
    category: 'romantic',
    labels: { gender: 'female', age: 'middle aged' }
  },
  {
    voice_id: 'voice-004',
    name: 'David (Male)',
    category: 'professional',
    labels: { gender: 'male', age: 'middle aged' }
  },
  {
    voice_id: 'voice-005',
    name: 'Grace (Female)',
    category: 'calm',
    labels: { gender: 'female', age: 'mature' }
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('🎤 Fetching ElevenLabs voices...')
    
    const client = getElevenLabsClient()

    // Try to get voices from ElevenLabs
    const voices = await client.getVoices()
    
    if (voices && voices.length > 0) {
      console.log(`✅ Got ${voices.length} voices from ElevenLabs`)
      return NextResponse.json({
        voices,
        success: true,
        provider: 'elevenlabs'
      })
    } else {
      throw new Error('No voices returned from ElevenLabs')
    }

  } catch (error) {
    console.error('⚠️ ElevenLabs voices API error:', error)
    console.log('🔄 Using mock voices as fallback')

    // Return mock voices as fallback
    return NextResponse.json({
      voices: mockVoices,
      success: true,
      provider: 'mock',
      warning: 'Using mock voices - ElevenLabs API unavailable'
    })
  }
}