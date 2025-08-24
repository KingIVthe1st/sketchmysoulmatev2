import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    
    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Checking status for song: ${songId}`)
    
    // Get stored request (in production, this would be from a database)
    ;(global as any).songRequests = (global as any).songRequests || new Map()
    const songData = (global as any).songRequests.get(songId)
    
    if (!songData) {
      console.log(`❌ Song not found: ${songId}`)
      return NextResponse.json(
        { error: 'Song not found - it may have expired' },
        { status: 404 }
      )
    }
    
    // Check if song is completed
    if (songData.status === 'completed') {
      console.log(`✅ Song completed: ${songId}`)
      return NextResponse.json({
        status: 'completed',
        audioUrl: songData.audioUrl || null,
        audioData: songData.audioData || null,
        lyrics: songData.lyrics || null,
        voiceId: songData.selectedVoiceId,
        voiceCategory: songData.selectedVoiceCategory,
        voiceName: songData.voiceName || null
      })
    }
    
    // Check if processing has timed out (more than 30 seconds)
    const processingTime = Date.now() - songData.submittedAt
    if (processingTime > 30000) {
      console.log(`⏰ Song timed out: ${songId}`)
      return NextResponse.json({
        status: 'error',
        error: 'Song generation timed out. Please try again.'
      })
    }
    
    // Still processing
    console.log(`⏳ Song still processing: ${songId} (${Math.round(processingTime / 1000)}s)`)
    return NextResponse.json({
      status: 'processing',
      processingTime: processingTime
    })

  } catch (error: any) {
    console.error('❌ Error checking song status:', error)
    return NextResponse.json(
      { error: 'Failed to check song status' },
      { status: 500 }
    )
  }
}