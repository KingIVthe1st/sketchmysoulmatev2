import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    
    if (!songId || songId === '') {
      return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
    }
    
    console.log(`🎵 [AUDIO PROXY] Serving audio for song: ${songId}`)
    
    // Get song request from global storage
    const songRequest = (global as any).songRequests?.get(songId)
    console.log(`📊 [AUDIO PROXY] Song request found:`, songRequest ? 'Yes' : 'No')
    
    if (songRequest) {
      console.log(`📊 [AUDIO PROXY] Audio data available:`, !!songRequest.audioData)
      console.log(`📊 [AUDIO PROXY] Audio URL available:`, !!songRequest.audioUrl)
    }
    
    if (!songRequest) {
      console.error(`❌ [AUDIO PROXY] Song not found in global storage: ${songId}`)
      
      // Try to fetch from status endpoint as fallback
      try {
        console.log(`🔄 [AUDIO PROXY] Attempting to fetch from status endpoint...`)
        const statusResponse = await fetch(`${request.nextUrl.origin}/api/status?songId=${songId}`)
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.audioData) {
            console.log(`✅ [AUDIO PROXY] Found audio data via status endpoint`)
            const audioBuffer = Buffer.from(statusData.audioData, 'base64')
            return new NextResponse(audioBuffer, {
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
                'Cache-Control': 'public, max-age=3600',
                'Accept-Ranges': 'bytes'
              }
            })
          }
        }
      } catch (fallbackError) {
        console.log(`❌ [AUDIO PROXY] Status endpoint fallback failed:`, fallbackError)
      }
      
      return NextResponse.json({ error: 'Song not found or audio not available' }, { status: 404 })
    }
    
    // Handle base64 audio data
    if (songRequest.audioData) {
      console.log(`🎶 [AUDIO PROXY] Serving base64 audio data for: ${songId}`)
      const audioBuffer = Buffer.from(songRequest.audioData, 'base64')
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
          'Accept-Ranges': 'bytes'
        }
      })
    }
    
    // Handle external audio URL
    if (songRequest.audioUrl) {
      console.log(`🔗 [AUDIO PROXY] Proxying external audio URL for: ${songId}`)
      
      try {
        const audioResponse = await fetch(songRequest.audioUrl, {
          headers: {
            'User-Agent': 'SongGram-Proxy/1.0'
          }
        })
        
        if (!audioResponse.ok) {
          throw new Error(`External audio fetch failed: ${audioResponse.status}`)
        }
        
        const audioBuffer = await audioResponse.arrayBuffer()
        
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength.toString(),
            'Cache-Control': 'public, max-age=3600',
            'Accept-Ranges': 'bytes'
          }
        })
        
      } catch (fetchError) {
        console.error(`❌ [AUDIO PROXY] Failed to fetch external audio:`, fetchError)
        return NextResponse.json({ error: 'Failed to load audio from external source' }, { status: 502 })
      }
    }
    
    // No audio data available
    console.error(`❌ [AUDIO PROXY] No audio data available for song: ${songId}`)
    return NextResponse.json({ error: 'No audio data available for this song' }, { status: 404 })
    
  } catch (error: any) {
    console.error('❌ [AUDIO PROXY] Error serving audio:', error)
    return NextResponse.json({ error: 'Audio proxy error' }, { status: 500 })
  }
}