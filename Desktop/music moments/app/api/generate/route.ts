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

    // Create intelligent prompt that uses all user input as inspiration
    const intelligentPrompt = createIntelligentPrompt(formData)
    
    console.log('🧠 Generated intelligent prompt with themes and inspiration')
    
    // Generate unique song ID for tracking
    const songId = `song_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    
    // Simulate backend processing - in production this would call actual music generation API
    const mockResponse = {
      songId: songId,
      eta: 5, // 5 seconds estimated processing time
      provider: 'ElevenLabs',
      processingTimeMs: Date.now()
    }
    
    // Store the request for status checking (in production, this would be a database)
    ;(global as any).songRequests = (global as any).songRequests || new Map()
    ;(global as any).songRequests.set(songId, {
      ...formData,
      prompt: intelligentPrompt,
      status: 'processing',
      submittedAt: Date.now()
    })
    
    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      const request = (global as any).songRequests?.get(songId)
      if (request) {
        ;(global as any).songRequests.set(songId, {
          ...request,
          status: 'completed',
          audioUrl: '/demo-song.mp3', // In production, this would be the actual generated song
          completedAt: Date.now()
        })
      }
    }, 3000)
    
    console.log('✅ Song generation request submitted:', songId)
    
    return NextResponse.json(mockResponse)

  } catch (error: any) {
    console.error('❌ Error in song generation:', error)
    return NextResponse.json(
      { error: 'Failed to process song generation request' },
      { status: 500 }
    )
  }
}