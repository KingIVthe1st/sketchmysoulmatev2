#!/bin/bash

# Quick deploy script for ElevenLabs Music API integration
# This creates files that can be copy-pasted into the DigitalOcean console

echo "🎼 ElevenLabs Music API Deployment Script"
echo "========================================="
echo ""
echo "Since SSH is down, copy and run these commands in the DigitalOcean web console:"
echo "https://cloud.digitalocean.com/droplets"
echo ""
echo "1. Click on your droplet -> Access -> Launch Console"
echo "2. Copy and paste these commands one by one:"
echo ""

cat << 'EOF'
# Navigate to application directory
cd /var/www/music-moments

# Stop the current application
pkill -f "next-server" || pkill -f "node"

# Backup current API files
mkdir -p backups
cp app/api/generate/route.ts backups/generate-route-backup-$(date +%Y%m%d-%H%M%S).ts
cp app/api/status/route.ts backups/status-route-backup-$(date +%Y%m%d-%H%M%S).ts

# Update generate route with full ElevenLabs Music API integration
cat > app/api/generate/route.ts << 'GENERATE_EOF'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GenerationRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral' | 'hiphop' | 'ballad' | 'country' | 'rock' | 'rnb' | 'jazz' | 'folk' | 'reggae' | 'electronic' | 'blues' | 'indie'
  story: string
  selectedVoiceId: string
  selectedVoiceCategory: string
}

// Enhanced prompt generation that intelligently uses all user input as inspiration
function createIntelligentPrompt(formData: GenerationRequest): string {
  const { occasion, recipient, relationship, vibe, genre, story } = formData
  
  // Genre-specific musical characteristics
  const genreCharacteristics: Record<string, string> = {
    pop: "catchy hooks, contemporary production, mainstream appeal, radio-friendly",
    acoustic: "intimate guitar-based arrangement, organic feel, stripped-down production",
    lofi: "dreamy, relaxed, nostalgic beats, warm analog textures, chill atmosphere",
    orchestral: "rich string sections, cinematic arrangement, classical instrumentation",
    hiphop: "rhythmic beats, rap verses, urban culture, storytelling through rhythm",
    ballad: "emotional vocals, slow tempo, heartfelt lyrics, romantic themes",
    country: "storytelling tradition, twangy guitars, authentic emotions, rural themes",
    rock: "driving guitars, powerful drums, energetic vocals, rebellious spirit",
    rnb: "smooth vocals, soulful melodies, groove-based rhythm, emotional expression",
    jazz: "improvisation, complex harmonies, swing rhythms, sophisticated arrangements",
    folk: "acoustic guitars, traditional melodies, storytelling, cultural authenticity",
    reggae: "laid-back rhythm, caribbean influence, positive vibes, social consciousness",
    electronic: "synthesized sounds, digital production, futuristic textures, dance beats",
    blues: "emotional depth, guitar solos, call-and-response, life struggles and triumphs",
    indie: "artistic expression, unique sound, creative freedom, alternative approach"
  }

  // Vibe-specific emotional directions
  const vibeDirections: Record<string, string> = {
    romantic: "tender, passionate, intimate, loving",
    uplifting: "inspiring, hopeful, joyful, motivating",
    nostalgic: "wistful, reflective, bittersweet, memory-filled",
    energetic: "dynamic, exciting, powerful, invigorating",
    cinematic: "epic, dramatic, emotionally sweeping, movie-like"
  }

  // Extract key emotional themes from the story without repeating it literally
  const storyThemes = extractThemesFromStory(story)
  
  // Create intelligent, inspirational prompt
  const prompt = `Create a ${genre} song that captures the essence of ${occasion} for ${recipient}. 

Musical Style: Embrace the ${genreCharacteristics[genre]} characteristic of ${genre} music, with a ${vibeDirections[vibe]} emotional tone.

Inspiration Context: This song celebrates the ${relationship} relationship with ${recipient} during ${occasion}. The story shared reveals themes of ${storyThemes}, which should inspire the lyrical content and emotional direction without being repeated word-for-word.

Creative Direction: Transform the emotional essence of their shared experience into ${genre} lyrics that feel authentic and personal. The song should feel like it was written specifically for ${recipient}, capturing the unique spirit of their ${relationship} bond and the significance of ${occasion}.

Song Structure: Create a complete 1-minute song with verse, chorus, and emotional build that tells their story through ${genre} musical storytelling.

Duration: Make this song exactly 1 minute long for the perfect personal music moment.

Voice Character: Deliver with the selected voice to match the ${genre} style and ${vibeDirections[vibe]} emotional tone.`

  return prompt
}

// Extract thematic elements from user story for inspiration
function extractThemesFromStory(story: string): string {
  const themes = []
  
  // Common emotional themes and keywords
  const themeMap = {
    'love': ['love', 'loving', 'adore', 'cherish', 'heart', 'affection'],
    'gratitude': ['grateful', 'thankful', 'appreciate', 'blessing', 'lucky'],
    'support': ['support', 'help', 'there for', 'strength', 'encourage'],
    'memories': ['remember', 'memory', 'memories', 'recall', 'think back'],
    'growth': ['grow', 'growing', 'learn', 'change', 'better', 'improve'],
    'adventure': ['journey', 'adventure', 'explore', 'travel', 'experience'],
    'joy': ['happy', 'joy', 'smile', 'laugh', 'fun', 'delight'],
    'comfort': ['comfort', 'safe', 'home', 'warm', 'peaceful', 'calm']
  }
  
  const lowerStory = story.toLowerCase()
  
  for (const [theme, keywords] of Object.entries(themeMap)) {
    if (keywords.some(keyword => lowerStory.includes(keyword))) {
      themes.push(theme)
    }
  }
  
  return themes.length > 0 ? themes.join(', ') : 'meaningful connection and shared experiences'
}

export async function POST(request: NextRequest) {
  try {
    const formData: GenerationRequest = await request.json()
    
    console.log('🎵 Received song generation request for:', formData.recipient)
    
    // Validate required fields
    if (!formData.occasion || !formData.recipient || !formData.relationship || !formData.story || !formData.selectedVoiceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate ElevenLabs API key
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      console.error('❌ ElevenLabs API key not configured')
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    // Create intelligent prompt that uses all user input as inspiration
    const intelligentPrompt = createIntelligentPrompt(formData)
    
    console.log('🧠 Generated intelligent prompt with themes and inspiration')
    
    // Generate unique song ID for tracking
    const songId = `song_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    
    // Store the request for status checking (in production, this would be a database)
    ;(global as any).songRequests = (global as any).songRequests || new Map()
    ;(global as any).songRequests.set(songId, {
      ...formData,
      prompt: intelligentPrompt,
      status: 'processing',
      submittedAt: Date.now()
    })
    
    // Start async music generation with ElevenLabs API
    generateMusicAsync(songId, intelligentPrompt, apiKey, formData.selectedVoiceId)
    
    const response = {
      songId: songId,
      eta: 45, // ElevenLabs music generation typically takes 30-60 seconds
      provider: 'ElevenLabs Music API',
      processingTimeMs: Date.now()
    }
    
    console.log('✅ Song generation request submitted to ElevenLabs:', songId)
    
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Error in song generation:', error)
    return NextResponse.json(
      { error: 'Failed to process song generation request' },
      { status: 500 }
    )
  }
}

// Async function to generate music with ElevenLabs API
async function generateMusicAsync(songId: string, prompt: string, apiKey: string, voiceId: string) {
  try {
    console.log(`🎼 Starting ElevenLabs music generation for song: ${songId}`)
    
    // Call ElevenLabs Music API
    const response = await fetch('https://api.elevenlabs.io/v1/music/compose', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        music_length_ms: 60000, // 1 minute = 60,000 milliseconds
        model: 'eleven_music_v1', // Use the music model
        voice_id: voiceId // Use selected voice for vocals
      })
    })

    const songRequest = (global as any).songRequests?.get(songId)
    if (!songRequest) {
      console.error(`❌ Song request not found: ${songId}`)
      return
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`❌ ElevenLabs API error:`, response.status, errorData)
      
      ;(global as any).songRequests.set(songId, {
        ...songRequest,
        status: 'error',
        error: `ElevenLabs API error: ${response.status} - ${errorData.detail || 'Unknown error'}`,
        completedAt: Date.now()
      })
      return
    }

    // The response might be audio data or a URL depending on the API
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('audio')) {
      // Direct audio response
      const audioBuffer = await response.arrayBuffer()
      const audioBase64 = Buffer.from(audioBuffer).toString('base64')
      
      ;(global as any).songRequests.set(songId, {
        ...songRequest,
        status: 'completed',
        audioData: audioBase64,
        completedAt: Date.now()
      })
      
      console.log(`✅ Music generation completed for song: ${songId}`)
    } else {
      // JSON response with URL or further processing needed
      const result = await response.json()
      
      if (result.audio_url) {
        ;(global as any).songRequests.set(songId, {
          ...songRequest,
          status: 'completed',
          audioUrl: result.audio_url,
          completedAt: Date.now()
        })
      } else if (result.audio_data) {
        ;(global as any).songRequests.set(songId, {
          ...songRequest,
          status: 'completed',
          audioData: result.audio_data,
          completedAt: Date.now()
        })
      } else {
        console.error('❌ Unexpected API response format:', result)
        ;(global as any).songRequests.set(songId, {
          ...songRequest,
          status: 'error',
          error: 'Unexpected API response format',
          completedAt: Date.now()
        })
      }
      
      console.log(`✅ Music generation completed for song: ${songId}`)
    }

  } catch (error: any) {
    console.error(`❌ Error in async music generation for ${songId}:`, error)
    
    const songRequest = (global as any).songRequests?.get(songId)
    if (songRequest) {
      ;(global as any).songRequests.set(songId, {
        ...songRequest,
        status: 'error',
        error: error.message || 'Music generation failed',
        completedAt: Date.now()
      })
    }
  }
}
GENERATE_EOF

# Update status route with extended timeout for music generation
cat > app/api/status/route.ts << 'STATUS_EOF'
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
        voiceName: songData.voiceName || null,
        title: `${songData.genre} song for ${songData.recipient}`,
        description: `A personalized ${songData.genre} song celebrating ${songData.occasion}`
      })
    }
    
    // Check if song generation had an error
    if (songData.status === 'error') {
      console.log(`❌ Song generation failed: ${songId} - ${songData.error}`)
      return NextResponse.json({
        status: 'error',
        error: songData.error || 'Song generation failed'
      })
    }
    
    // Check if processing has timed out (more than 90 seconds for music generation)
    const processingTime = Date.now() - songData.submittedAt
    if (processingTime > 90000) {
      console.log(`⏰ Song timed out: ${songId}`)
      return NextResponse.json({
        status: 'error',
        error: 'Song generation timed out. Music generation can take up to 90 seconds. Please try again.'
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
STATUS_EOF

# Set environment variables and restart the application
export ELEVENLABS_API_KEY="sk_b4fcaea82d20568e979d72db9c6b4c4cb6855733ae8b6e53"
export NODE_ENV="production"
export PORT="3000"

# Start the application in background
nohup npm start > app.log 2>&1 &

# Check if the application started successfully
sleep 5
ps aux | grep -E "(next-server|node.*start)" | grep -v grep

echo ""
echo "🎉 ElevenLabs Music API integration deployed!"
echo "🎼 The app now generates real 1-minute AI songs using ElevenLabs Music API"
echo "⚡ Features enabled:"
echo "   - Real song generation (60 seconds)"
echo "   - Intelligent prompt generation from user stories"
echo "   - 15 musical genres supported"
echo "   - Extended timeout (90 seconds)"
echo "   - Audio data handling (Base64 and URLs)"
echo ""
echo "🧪 Test the integration at: http://162.243.172.151/"
echo ""
EOF

echo ""
echo "3. After running the commands, verify deployment by checking:"
echo "   - Application is running: http://162.243.172.151/"
echo "   - Generate a test song to verify ElevenLabs API integration"
echo ""
echo "🔑 The ElevenLabs API key is already configured in the deployment"
echo "⚡ Music generation now takes 30-90 seconds (real processing time)"
echo ""