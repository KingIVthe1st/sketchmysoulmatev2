import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getElevenLabsClient } from '../../lib/elevenlabs-client'
import { getElevenLabsMusicClient } from '../../lib/elevenlabs-music-client'
import { VoiceSelector } from '../../lib/voice-selection'
import { LyricsProcessor } from '../../lib/lyrics-processing'
import { ErrorHandler } from '../../lib/errors'
import { getTaskManager, TaskManager } from '../../lib/task-manager'

// Voice categories for intelligent prompting
const VOICE_CATEGORIES = [
  { 
    id: 'warm', 
    name: '💝 Warm & Friendly', 
    description: 'Gentle, heartfelt voices perfect for love songs, family celebrations, and intimate moments',
    characteristics: 'Soft tones, emotional warmth, natural expressiveness',
    bestFor: 'Anniversaries, birthdays, thank you songs, romantic ballads',
    examples: 'Think cozy coffee shop singer or close friend singing to you'
  },
  { 
    id: 'professional', 
    name: '🎤 Professional & Clear', 
    description: 'Polished, articulate voices ideal for formal occasions and impressive presentations',
    characteristics: 'Clear pronunciation, confident delivery, sophisticated tone',
    bestFor: 'Graduations, promotions, business celebrations, awards',
    examples: 'Concert hall performer or professional recording artist quality'
  },
  { 
    id: 'energetic', 
    name: '🚀 Energetic & Upbeat', 
    description: 'Dynamic, vibrant voices that bring excitement and joy to any celebration',
    characteristics: 'High energy, enthusiastic delivery, infectious positivity',
    bestFor: 'Parties, achievements, new adventures, motivational songs',
    examples: 'Stadium concert energy or your favorite upbeat radio DJ'
  },
  { 
    id: 'calm', 
    name: '🌸 Calm & Soothing', 
    description: 'Peaceful, meditative voices perfect for comfort and relaxation',
    characteristics: 'Gentle pace, soothing tones, stress-relieving quality',
    bestFor: 'Apologies, healing moments, peaceful celebrations, bedtime songs',
    examples: 'Spa background music or meditation guide singing style'
  }
]

// Enhanced logging utility for ElevenLabs endpoint
const logger = {
  info: (message: string, data?: any) => {
    console.log(`🎤 [ELEVENLABS] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  },
  error: (message: string, error?: any) => {
    console.error(`❌ [ELEVENLABS] ${message}`, error?.message || error)
    if (error?.stack) console.error(error.stack)
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [ELEVENLABS] ${message}`, data ? JSON.stringify(data, null, 2) : '')
    }
  }
}

const ElevenLabsGenerateRequestSchema = z.object({
  prompt: z.string().min(1),
  duration: z.number().min(30).max(300).default(60),
  lyrics: z.string().optional(),
  voiceId: z.string().optional(),
  voiceCategory: z.enum(['professional', 'warm', 'energetic', 'calm', 'fun']).optional(),
  emotion: z.enum(['happy', 'sad', 'angry', 'excited', 'calm', 'romantic', 'energetic']).optional(),
  style: z.enum(['pop', 'rock', 'jazz', 'classical', 'electronic', 'folk', 'hip-hop']).optional(),
  genre: z.enum(['ballad', 'r&b', 'pop', 'techno', 'rock', 'rap', 'country']).optional(),
  occasion: z.string().optional(),
  recipient: z.string().optional(),
  relationship: z.string().optional(),
  vibe: z.string().optional()
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = request.headers.get('X-Request-ID') || Math.random().toString(36).substr(2, 9)
  
  logger.info(`Starting ElevenLabs generation request ${requestId}`)
  
  try {
    // Parse and validate request
    const body = await request.json()
    logger.debug('Received ElevenLabs request', { 
      requestId,
      bodyKeys: Object.keys(body),
      promptLength: body.prompt?.length || 0,
      lyricsLength: body.lyrics?.length || 0
    })

    // Validate input with enhanced error reporting
    let validatedData
    try {
      validatedData = ElevenLabsGenerateRequestSchema.parse(body)
      logger.info('ElevenLabs input validation successful', { requestId })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.error('ElevenLabs input validation failed', { 
          requestId,
          errors: validationError.errors
        })
        return NextResponse.json(
          { 
            error: 'Invalid ElevenLabs request data', 
            details: validationError.errors,
            requestId
          },
          { status: 400 }
        )
      }
      throw validationError
    }

    logger.info('Starting ElevenLabs TTS generation process', { requestId })

    // Initialize components with error handling
    let elevenLabsClient, voiceSelector, lyricsProcessor
    try {
      elevenLabsClient = getElevenLabsClient()
      voiceSelector = new VoiceSelector()
      lyricsProcessor = new LyricsProcessor()
      logger.debug('ElevenLabs components initialized', { requestId })
    } catch (initError) {
      logger.error('Failed to initialize ElevenLabs components', { requestId, error: initError })
      throw new Error('ElevenLabs service initialization failed')
    }

    // Get available voices with timeout
    logger.debug('Fetching available voices', { requestId })
    let voices: any
    try {
      const voiceTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Voice fetching timeout')), 10000)
      })
      
      voices = await Promise.race([
        elevenLabsClient.getVoices(),
        voiceTimeout
      ])
      
      logger.info('Voices fetched successfully', { 
        requestId, 
        voiceCount: voices.length,
        availableVoices: voices.slice(0, 3).map((v: any) => ({ id: v.voice_id, name: v.name }))
      })
    } catch (voiceError) {
      logger.error('Failed to fetch voices', { requestId, error: voiceError })
      throw new Error('Unable to access voice library')
    }

    // Select appropriate voice with detailed logging - ALWAYS prioritize user's specific choice
    let selectedVoiceId = validatedData.voiceId
    let selectedVoice = null
    
    if (selectedVoiceId) {
      // User selected a specific voice - verify it exists and use it
      selectedVoice = voices.find((voice: any) => voice.voice_id === selectedVoiceId)
      if (selectedVoice) {
        logger.info('Using user-selected specific voice', { 
          requestId, 
          selectedVoiceId, 
          voiceName: selectedVoice.name,
          gender: selectedVoice.labels?.gender,
          age: selectedVoice.labels?.age
        })
      } else {
        logger.error('User-selected voice not found, falling back to category selection', { 
          requestId, 
          requestedVoiceId: selectedVoiceId 
        })
        selectedVoiceId = undefined
      }
    }
    
    // Only fall back to category-based selection if no specific voice was selected or found
    if (!selectedVoiceId) {
      logger.debug('No specific voice selected, using category-based selection', { 
        requestId, 
        category: validatedData.voiceCategory 
      })
      
      let targetVoice = null;
      
      if (validatedData.voiceCategory) {
        switch (validatedData.voiceCategory) {
          case 'professional':
            targetVoice = voices.find((voice: any) => 
              voice.labels?.gender === 'female' || voice.labels?.age === 'middle_aged'
            );
            break;
          case 'warm':
            targetVoice = voices.find((voice: any) => 
              voice.labels?.gender === 'female' || voice.labels?.age === 'mature'
            );
            break;
          case 'energetic':
            targetVoice = voices.find((voice: any) => 
              voice.labels?.age === 'young' || voice.labels?.gender === 'male'
            );
            break;
          case 'calm':
            targetVoice = voices.find((voice: any) => 
              voice.labels?.age === 'mature' || voice.labels?.gender === 'female'
            );
            break;
          case 'fun':
            targetVoice = voices.find((voice: any) => 
              voice.labels?.age === 'young' || voice.labels?.gender === 'male'
            );
            break;
          default:
            targetVoice = voices[0];
        }
      }
      
      selectedVoice = targetVoice || voices[0]
      selectedVoiceId = selectedVoice?.voice_id
      
      logger.info('Voice selected via category', { 
        requestId, 
        selectedVoiceId, 
        voiceName: selectedVoice?.name || 'default',
        category: validatedData.voiceCategory,
        gender: selectedVoice?.labels?.gender,
        age: selectedVoice?.labels?.age
      })
    }

    // Process lyrics if provided
    let processedLyrics = validatedData.lyrics
    if (processedLyrics) {
      logger.debug('Processing lyrics', { requestId, originalLength: processedLyrics.length })
      try {
        const processed = await lyricsProcessor.processLyrics(processedLyrics, {
          targetLength: validatedData.duration
        })
        processedLyrics = processed.enhanced
        logger.info('Lyrics processed', { 
          requestId, 
          originalLength: validatedData.lyrics?.length || 0,
          processedLength: processedLyrics.length 
        })
      } catch (lyricsError) {
        logger.error('Lyrics processing failed', { requestId, error: lyricsError })
        // Continue with original lyrics
        processedLyrics = validatedData.lyrics
      }
    }

    // Generate music with singing using optimized settings based on voice characteristics and genre
    const voiceSettings = {
      // Base settings optimized for singing
      stability: selectedVoice?.labels?.age === 'young' ? 0.6 : 0.75, // Younger voices can be less stable for naturalness
      similarity_boost: 0.85, // High similarity but not too rigid for musical expression
      style: validatedData.voiceCategory === 'energetic' ? 0.9 : 0.7, // Higher style for energetic voices
      use_speaker_boost: true
    }
    
    // Genre-specific adjustments
    if (validatedData.genre === 'ballad' || validatedData.genre === 'r&b') {
      voiceSettings.stability = 0.8 // More stable for smooth ballads
      voiceSettings.style = 0.9 // Higher style for emotional delivery
    } else if (validatedData.genre === 'rap') {
      voiceSettings.stability = 0.5 // Less stability for rap flow variation
      voiceSettings.style = 0.6 // Less style, more natural speech patterns
    } else if (validatedData.genre === 'rock') {
      voiceSettings.similarity_boost = 0.9 // High similarity for powerful delivery
      voiceSettings.style = 0.8 // Good style for rock vocals
    }
    
    const generationRequest = {
      text: processedLyrics || validatedData.prompt,
      voice_id: selectedVoiceId,
      model_id: 'eleven_flash_v2_5', // Use the latest, highest quality model
      voice_settings: voiceSettings,
      // Additional quality settings
      pronunciation_dictionary_locators: [], // Can be enhanced with custom pronunciations
      seed: Math.floor(Math.random() * 1000000), // Randomize for variety
    }

    // Generate music using ElevenLabs sound-generation API
    logger.info('Generating music with ElevenLabs sound-generation API', { 
      requestId,
      textLength: generationRequest.text.length
    })

    let generationResponse
    try {
      // Create a comprehensive, intelligent music generation prompt using ALL user inputs
      const selectedCategory = VOICE_CATEGORIES.find(cat => cat.id === validatedData.voiceCategory)
      
      const musicPrompt = `Create a ${validatedData.duration || 60}-second ${validatedData.style || 'pop'} song in ${validatedData.emotion || 'uplifting'} ${validatedData.genre || 'pop'} style.

SONG CONTEXT & PERSONALIZATION:
- Occasion: ${validatedData.occasion || 'special moment'}
- Recipient: ${validatedData.recipient || 'someone special'}  
- Relationship: ${validatedData.relationship || 'loved one'}
- Vibe: ${validatedData.vibe || 'uplifting'} feeling throughout
- Voice Style: ${selectedCategory?.name || 'warm'} (${selectedCategory?.description || 'gentle and heartfelt'})
- Selected Voice: ${selectedVoice?.name || 'default'} (${selectedVoice?.labels?.gender || 'neutral'}, ${selectedVoice?.labels?.age || 'adult'})

STORY INSPIRATION:
"${validatedData.prompt.substring(0, 400)}${validatedData.prompt.length > 400 ? '...' : ''}"

MUSICAL REQUIREMENTS:
- Genre: ${validatedData.genre || 'pop'} with ${validatedData.emotion || 'uplifting'} emotional tone
- Voice characteristics matching: ${selectedVoice?.labels?.gender || 'neutral'} ${selectedVoice?.labels?.age || 'adult'} singer
- Style: ${selectedCategory?.characteristics || 'warm and expressive delivery'}
- Structure: Intro (5s) → Verse (20s) → Chorus (25s) → Bridge/Outro (10s)
- Instrumentation: Full arrangement suitable for ${validatedData.genre || 'pop'} genre
- Vocal delivery: ${selectedCategory?.examples || 'Natural and heartfelt singing style'}

LYRICS TO SING:
${processedLyrics || validatedData.prompt}

Create a professional-quality, emotionally resonant song that captures the essence of this ${validatedData.occasion || 'special moment'} for ${validatedData.recipient || 'the recipient'}, delivered in the exact style and voice characteristics requested.`
      
      logger.debug('Music generation prompt', { requestId, prompt: musicPrompt.substring(0, 200) + '...' })
      
      // Use the music client with the correct endpoint
      const musicClient = getElevenLabsMusicClient()
      
      generationResponse = await musicClient.generateMusic({
        prompt: musicPrompt.substring(0, 2000) // Ensure we don't exceed API limits
      })
      
      logger.info('Music generation completed', { 
        requestId,
        hasAudioUrl: !!generationResponse.audio_url,
        status: generationResponse.status
      })
    } catch (generationError: any) {
      logger.error('Music generation failed', { requestId, error: generationError.message })
      
      // Check if it's an API key issue or unsupported endpoint
      if (generationError.message?.includes('Unauthorized') || 
          generationError.message?.includes('403') ||
          generationError.message?.includes('404') ||
          generationError.message?.includes('sound-generation')) {
        
        logger.info('Falling back to demo mode due to API issue', { requestId })
        
        // Array of actual songs with music and vocals for demo
        const demoSongs = [
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
        ]
        
        // Pick a random demo song
        const randomSong = demoSongs[Math.floor(Math.random() * demoSongs.length)]
        
        // Create a demo music task response
        const demoTaskId = TaskManager.generateTaskId('demo')
        const taskManager = getTaskManager()
        
        taskManager.createTask({
          taskId: demoTaskId,
          status: 'completed',
          audioUrl: randomSong,
          duration: validatedData.duration,
          voiceId: selectedVoiceId,
          text: generationRequest.text,
          lyrics: processedLyrics || validatedData.prompt,
          createdAt: new Date().toISOString(),
          provider: 'music-demo',
          requestId
        })
        
        const processingTime = Date.now() - startTime
        logger.info('Demo mode music response created', { 
          requestId,
          demoTaskId,
          selectedSong: randomSong,
          processingTimeMs: processingTime
        })

        return NextResponse.json({
          taskId: demoTaskId,
          estimatedTime: 0,
          isDemoMode: true,
          provider: 'music-demo',
          requestId,
          processingTimeMs: processingTime,
          message: 'Demo mode: Using sample music. ElevenLabs music API may require special access or different endpoint.'
        })
      } else {
        // For other errors, throw them
        throw new Error(`Music generation failed: ${generationError.message}`)
      }
    }

    // Create a unique task ID for tracking
    const taskId = TaskManager.generateTaskId('elevenlabs')
    
    // Store generation info using thread-safe task manager
    const taskManager = getTaskManager()
    taskManager.createTask({
      taskId,
      status: 'completed',
      audioUrl: generationResponse.audio_url,
      duration: validatedData.duration,
      voiceId: selectedVoiceId,
      text: generationRequest.text,
      createdAt: new Date().toISOString(),
      provider: 'elevenlabs',
      requestId
    })
    
    const processingTime = Date.now() - startTime
    logger.info('ElevenLabs generation request completed successfully', { 
      requestId,
      taskId,
      processingTimeMs: processingTime
    })

    return NextResponse.json({
      taskId,
      estimatedTime: 0, // Eleven Labs is typically faster
      isDemoMode: false,
      provider: 'elevenlabs',
      requestId,
      processingTimeMs: processingTime
    })

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    
    logger.error('ElevenLabs generation request failed', { 
      requestId,
      processingTimeMs: processingTime,
      error: error.message,
      stack: error.stack
    })

    // Handle specific error types with enhanced error responses
    let errorMessage = 'ElevenLabs voice generation failed'
    let statusCode = 500
    
    if (error.message?.includes('ELEVENLABS_API_KEY')) {
      errorMessage = 'ElevenLabs API configuration error'
      statusCode = 503
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Voice generation timed out - please try again'
      statusCode = 408
    } else if (error.message?.includes('Voice generation failed')) {
      errorMessage = 'Voice synthesis error - please try again'
      statusCode = 502
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        requestId,
        processingTimeMs: processingTime
      },
      { status: statusCode }
    )
  }
}