import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GenerationRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral' | 'hiphop' | 'ballad' | 'country' | 'rock' | 'rnb' | 'jazz' | 'folk' | 'reggae' | 'electronic' | 'blues' | 'indie' | 'oldschool-rap' | 'trap' | 'afrobeats' | 'latin' | 'gospel'
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
    indie: "artistic expression, unique sound, creative freedom, alternative approach",
    "oldschool-rap": "classic hip-hop beats, boom bap drums, vinyl scratch samples, 90s nostalgia, conscious lyricism",
    trap: "heavy 808s, rapid hi-hats, atmospheric synths, modern rap production, bass-heavy",
    afrobeats: "african rhythms, percussion-driven, vibrant energy, call-and-response vocals, danceable grooves",
    latin: "latin percussion, guitar melodies, passionate vocals, cultural richness, rhythmic diversity",
    gospel: "soulful vocals, organ accompaniment, spiritual themes, choir harmonies, uplifting message"
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
    
    // Handle fallback voice IDs by using a default voice
    let actualVoiceId = voiceId
    if (voiceId.startsWith('fallback-')) {
      // Use a default voice ID when fallback is selected
      actualVoiceId = 'EXAVITQu4vr4xnSDxMaL' // Default ElevenLabs voice
      console.log(`🎤 Using default voice for fallback: ${actualVoiceId}`)
    }
    
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
        voice_id: actualVoiceId // Use selected or default voice for vocals
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