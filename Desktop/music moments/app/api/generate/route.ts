import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

const GenerateRequestSchema = z.object({
  occasion: z.string().min(1),
  recipient: z.string().min(1),
  relationship: z.string().min(1),
  vibe: z.enum(['romantic', 'uplifting', 'nostalgic', 'energetic', 'cinematic']),
  genre: z.enum(['ballad', 'r&b', 'pop', 'techno', 'rock', 'rap', 'country']),
  story: z.string().min(200).max(500),
  lyrics: z.string().max(500).optional(),
  title: z.string().optional(),
  useAutoLyrics: z.boolean().optional(),
  selectedVoiceId: z.string().min(1),
  selectedVoiceCategory: z.string().min(1),
  emotion: z.enum(['happy', 'sad', 'angry', 'excited', 'calm', 'romantic', 'energetic']).optional(),
  style: z.enum(['pop', 'rock', 'jazz', 'classical', 'electronic', 'folk', 'hip-hop']).optional()
})

// HTML sanitization function
const sanitizeInput = (input: string): string => {
  // Remove HTML tags and scripts, keep only text
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
    KEEP_CONTENT: true // Keep text content
  })
}

// Enhanced profanity filter with bypass detection
const profanityWords = [
  // Basic words
  'fuck', 'shit', 'damn', 'bitch', 'asshole',
  // Common bypasses
  'f*uck', 'f**k', 'sh!t', 'sh*t', 'b!tch', 'a$$hole',
  // Character substitutions
  'fück', 'shít', 'b1tch', 'fcuk', 'shiat',
  // Spaced variants
  'f u c k', 's h i t'
]

const containsProfanity = (text: string): boolean => {
  const normalizedText = text.toLowerCase()
    .replace(/[*!@#$%^&()_+=\-\[\]{}|\\:";'<>?,.\/]/g, '') // Remove special chars
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[0-9]/g, '') // Remove numbers used as substitutes
  
  return profanityWords.some(word => {
    const normalizedWord = word.toLowerCase().replace(/[*!@#$%^&()_+=\-\[\]{}|\\:";'<>?,.\/\s0-9]/g, '')
    return normalizedText.includes(normalizedWord)
  })
}

// Enhanced logging utility
const logger = {
  info: (message: string, data?: any) => {
    console.log(`🎵 [GENERATE] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  },
  error: (message: string, error?: any) => {
    console.error(`❌ [GENERATE] ${message}`, error?.message || error)
    if (error?.stack) console.error(error.stack)
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 [GENERATE] ${message}`, data ? JSON.stringify(data, null, 2) : '')
    }
  }
}

// Get the correct base URL for internal API calls
const getInternalBaseUrl = (): string => {
  // In production, use the same host
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  }
  
  // In development, detect the current port
  const port = process.env.PORT || '3000'
  logger.debug('Detected port from environment', { port, NODE_ENV: process.env.NODE_ENV })
  
  return `http://localhost:${port}`
}

// Enhanced fetch with timeout and retry logic
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 30000, retries = 2): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.debug(`API call attempt ${attempt}/${retries}`, { url, method: options.method })
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      logger.debug('API call successful', { 
        url, 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      return response
    } catch (error: any) {
      logger.error(`API call attempt ${attempt}/${retries} failed`, error)
      
      if (attempt === retries || error.name === 'AbortError') {
        clearTimeout(timeoutId)
        throw error
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
  
  throw new Error('All retry attempts failed')
}

// Generate creative song lyrics INSPIRED BY (not repeating) the user's story - using ALL form inputs intelligently
const generateSongLyrics = (story: string, recipient: string, relationship: string, occasion: string, vibe: string, genre: string): string => {
  // AI-powered story analysis and context understanding
  const analyzeStory = (story: string) => {
    const storyLower = story.toLowerCase()
    
    // Extract key emotional themes and memories from the user's story
    const emotionalMarkers = {
      memories: ['remember', 'memory', 'recall', 'think back', 'years ago', 'time when', 'first met', 'first time'],
      feelings: ['love', 'happy', 'joy', 'smile', 'laugh', 'cry', 'proud', 'grateful', 'blessed', 'lucky'],
      experiences: ['together', 'shared', 'experienced', 'went', 'traveled', 'celebrated', 'overcome', 'achieved'],
      growth: ['grown', 'changed', 'learned', 'become', 'stronger', 'better', 'closer', 'deeper'],
      challenges: ['difficult', 'hard', 'struggle', 'tough', 'challenge', 'overcome', 'persevered', 'support']
    }
    
    const extractedElements = {
      hasMemories: emotionalMarkers.memories.some(word => storyLower.includes(word)),
      hasFeelings: emotionalMarkers.feelings.some(word => storyLower.includes(word)),
      hasExperiences: emotionalMarkers.experiences.some(word => storyLower.includes(word)),
      hasGrowth: emotionalMarkers.growth.some(word => storyLower.includes(word)),
      hasChallenges: emotionalMarkers.challenges.some(word => storyLower.includes(word))
    }
    
    // Extract specific phrases or sentences that capture the essence
    const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const keyPhrases = sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 0)
    
    return { extractedElements, keyPhrases }
  }
  
  // Intelligent relationship context understanding
  const interpretRelationship = (relationship: string) => {
    const relationshipMap = {
      // Romantic relationships
      'wife': { type: 'romantic', intimacy: 'highest', tone: 'deeply personal', pronouns: 'her/she' },
      'husband': { type: 'romantic', intimacy: 'highest', tone: 'deeply personal', pronouns: 'him/he' },
      'girlfriend': { type: 'romantic', intimacy: 'high', tone: 'loving', pronouns: 'her/she' },
      'boyfriend': { type: 'romantic', intimacy: 'high', tone: 'loving', pronouns: 'him/he' },
      'partner': { type: 'romantic', intimacy: 'high', tone: 'modern love', pronouns: 'them/they' },
      'fiancé': { type: 'romantic', intimacy: 'high', tone: 'anticipatory love', pronouns: 'him/he' },
      'fiancée': { type: 'romantic', intimacy: 'high', tone: 'anticipatory love', pronouns: 'her/she' },
      
      // Family relationships
      'mom': { type: 'family', intimacy: 'highest', tone: 'nurturing gratitude', pronouns: 'her/she' },
      'mother': { type: 'family', intimacy: 'highest', tone: 'formal gratitude', pronouns: 'her/she' },
      'dad': { type: 'family', intimacy: 'highest', tone: 'respectful love', pronouns: 'him/he' },
      'father': { type: 'family', intimacy: 'highest', tone: 'formal respect', pronouns: 'him/he' },
      'sister': { type: 'family', intimacy: 'high', tone: 'sibling bond', pronouns: 'her/she' },
      'brother': { type: 'family', intimacy: 'high', tone: 'sibling bond', pronouns: 'him/he' },
      'daughter': { type: 'family', intimacy: 'highest', tone: 'protective love', pronouns: 'her/she' },
      'son': { type: 'family', intimacy: 'highest', tone: 'protective love', pronouns: 'him/he' },
      
      // Friends
      'best friend': { type: 'friendship', intimacy: 'high', tone: 'loyal appreciation', pronouns: 'them/they' },
      'friend': { type: 'friendship', intimacy: 'medium', tone: 'warm appreciation', pronouns: 'them/they' },
      
      // Default for unknown relationships
      'default': { type: 'general', intimacy: 'medium', tone: 'warm', pronouns: 'them/they' }
    }
    
    const relationshipLower = relationship.toLowerCase()
    return relationshipMap[relationshipLower as keyof typeof relationshipMap] || relationshipMap.default
  }
  
  // Enhanced occasion-specific context
  const occasionContext = {
    birthday: { 
      timeframe: 'celebratory present', 
      emotion: 'joy and growth', 
      focus: 'another year of life and memories',
      imagery: 'candles, wishes, celebrations'
    },
    anniversary: { 
      timeframe: 'reflective milestone', 
      emotion: 'deep love and commitment', 
      focus: 'journey together and future dreams',
      imagery: 'time passing, milestones, shared journey'
    },
    wedding: { 
      timeframe: 'life-changing moment', 
      emotion: 'pure love and commitment', 
      focus: 'beginning of forever together',
      imagery: 'vows, rings, new beginning'
    },
    valentine: { 
      timeframe: 'romantic present', 
      emotion: 'passionate love', 
      focus: 'expressing deep romantic feelings',
      imagery: 'hearts, roses, romance'
    },
    graduation: { 
      timeframe: 'achievement moment', 
      emotion: 'pride and excitement', 
      focus: 'accomplishment and bright future',
      imagery: 'caps, diplomas, new chapters'
    },
    mothersday: { 
      timeframe: 'gratitude moment', 
      emotion: 'deep appreciation', 
      focus: 'acknowledging love and sacrifice',
      imagery: 'nurturing, care, endless love'
    },
    fathersday: { 
      timeframe: 'gratitude moment', 
      emotion: 'respectful love', 
      focus: 'strength, guidance, and protection',
      imagery: 'strength, wisdom, protection'
    },
    apology: { 
      timeframe: 'healing moment', 
      emotion: 'remorse and hope', 
      focus: 'acknowledgment and rebuilding',
      imagery: 'forgiveness, healing, new start'
    },
    thankyou: { 
      timeframe: 'appreciation moment', 
      emotion: 'grateful recognition', 
      focus: 'acknowledging their impact',
      imagery: 'gratitude, recognition, blessing'
    },
    justtobecause: { 
      timeframe: 'spontaneous love', 
      emotion: 'pure affection', 
      focus: 'celebrating them for who they are',
      imagery: 'spontaneity, pure love, surprise'
    },
    default: { 
      timeframe: 'meaningful moment', 
      emotion: 'heartfelt connection', 
      focus: 'celebrating your bond',
      imagery: 'connection, meaning, celebration'
    }
  }
  
  const storyAnalysis = analyzeStory(story)
  const relationshipContext = interpretRelationship(relationship)
  const currentOccasion = occasionContext[occasion as keyof typeof occasionContext] || occasionContext.default
  
  // Generate intelligent, personalized lyrics using story analysis and context understanding
  const createIntelligentLyrics = () => {
    // Extract story themes that will inspire the lyrics creatively
    const storyInspiration = storyAnalysis.keyPhrases.length > 0 
      ? storyAnalysis.keyPhrases[0].substring(0, 60) // Use first meaningful phrase as inspiration
      : "the memories we share"
    
    // Create contextual emotional phrases based on story analysis
    const emotionalContext = []
    if (storyAnalysis.extractedElements.hasMemories) {
      emotionalContext.push("memories that never fade", "moments we treasure", "times we'll never forget")
    }
    if (storyAnalysis.extractedElements.hasFeelings) {
      emotionalContext.push("heart full of love", "joy that you bring", "happiness we share")
    }
    if (storyAnalysis.extractedElements.hasExperiences) {
      emotionalContext.push("journeys we've taken", "adventures together", "experiences that bond us")
    }
    if (storyAnalysis.extractedElements.hasGrowth) {
      emotionalContext.push("stronger together", "growing closer", "becoming better")
    }
    if (storyAnalysis.extractedElements.hasChallenges) {
      emotionalContext.push("weathered the storms", "stood by each other", "overcome together")
    }
    
    // If no specific themes detected, use relationship-appropriate defaults
    if (emotionalContext.length === 0) {
      if (relationshipContext.type === 'romantic') {
        emotionalContext.push("love that grows stronger", "heart beats for you", "dream come true")
      } else if (relationshipContext.type === 'family') {
        emotionalContext.push("bond that never breaks", "love that's unconditional", "always there for me")
      } else {
        emotionalContext.push("friendship so true", "support that matters", "connection so deep")
      }
    }
    
    // Create vibe-specific and genre-specific emotional enhancers
    const vibeEnhancers = {
      romantic: ["tender moments", "love's sweet embrace", "hearts intertwined", "passionate devotion"],
      uplifting: ["lifting me higher", "brighter tomorrow", "unstoppable spirit", "reaching new heights"],  
      nostalgic: ["golden memories", "echoes of yesterday", "times we hold dear", "looking back with joy"],
      energetic: ["electric connection", "alive with passion", "fire in our souls", "unstoppable energy"],
      cinematic: ["epic love story", "destiny calling", "legendary bond", "tale worth telling"]
    }
    
    const selectedVibeEnhancers = vibeEnhancers[vibe as keyof typeof vibeEnhancers] || vibeEnhancers.uplifting
    
    // Smart genre-specific lyric generation
    if (genre === 'rap') {
      return `[Verse 1]
Yo ${recipient}, let me paint the picture right
From "${storyInspiration}", you've been my light
My ${relationship}, ${relationshipContext.tone} that's so clear
For this ${currentOccasion.focus}, I'm keeping you near
${emotionalContext[0] || selectedVibeEnhancers[0]}, that's the vibe
${currentOccasion.emotion} flowing, I can't hide

[Hook]
${recipient}, you're the one I celebrate
My ${relationship}, making everything first-rate  
${selectedVibeEnhancers[1]}, that's how we roll
This ${occasion} anthem, straight from the soul

[Verse 2]
${storyAnalysis.extractedElements.hasChallenges ? "Through the ups and downs, you stayed true" : "Every moment with you, something new"}
${emotionalContext[1] || selectedVibeEnhancers[2]}, me and you
${currentOccasion.imagery}, that's what I see
${relationshipContext.tone}, wild and free

[Hook]
${recipient}, you're the one I celebrate
My ${relationship}, making everything first-rate
${selectedVibeEnhancers[1]}, that's how we roll
This ${occasion} anthem, straight from the soul`
    } else if (genre === 'country') {
      return `[Verse 1]  
Well ${recipient}, ${storyInspiration}
You're my ${relationship}, through thick and thin
On this ${currentOccasion.timeframe}, by your side I stand
${emotionalContext[0] || "simple love"} in the palm of our hands
${selectedVibeEnhancers[0]}, honest and true
Country roads always lead me back to you

[Chorus]
${recipient}, you're my ${selectedVibeEnhancers[1]}
My ${relationship}, when all is said and done
${emotionalContext[1] || selectedVibeEnhancers[2]}, that's what I see
In this ${currentOccasion.emotion}, you're everything to me
Under these wide open skies so blue
This country song's my gift to you

[Verse 2]
${storyAnalysis.extractedElements.hasMemories ? "Looking back on all we've shared" : "From the front porch to the county fair"}
${emotionalContext[2] || "Your love's a blessing"}, always there
${selectedVibeEnhancers[3]}, day by day
In this small town heart, that's our way

[Chorus]
${recipient}, you're my ${selectedVibeEnhancers[1]}
My ${relationship}, when all is said and done  
${emotionalContext[1] || selectedVibeEnhancers[2]}, that's what I see
In this ${currentOccasion.emotion}, you're everything to me`
    } else {
      // Enhanced structure for pop, ballad, r&b, rock, techno with story integration
      return `[Verse 1]
${recipient}, ${storyInspiration}
${currentOccasion.focus} shining through
You've been my ${relationship}, ${relationshipContext.tone}
${emotionalContext[0] || selectedVibeEnhancers[0]}, near and far

[Pre-Chorus]
${storyAnalysis.extractedElements.hasExperiences ? "Every journey that we've shared" : "Every moment that we share"}
Shows me how much you ${relationshipContext.intimacy === 'highest' ? 'mean to me' : 'care'}
${selectedVibeEnhancers[1]} in every way
On this ${currentOccasion.timeframe} day

[Chorus]
You're my ${emotionalContext[1] || selectedVibeEnhancers[2]}
My ${relationship}, ${relationshipContext.tone}
${selectedVibeEnhancers[3]}, always true
Forever this ${vibe} song I'll sing
Through the seasons and the years
${storyAnalysis.extractedElements.hasChallenges ? "Through the struggles and the cheers" : "Through the laughter and the tears"}
My dear ${recipient}, you're my heart
This ${occasion} is ${currentOccasion.focus}

[Verse 2]
${storyAnalysis.extractedElements.hasGrowth ? "Looking at how we've both grown" : "Looking back on seeds we've sown"}
${emotionalContext[2] || "Every chapter"}, ${relationshipContext.intimacy === 'highest' ? 'our love has shown' : 'friendship has grown'}
You've been there to celebrate
${currentOccasion.imagery}, making life first-rate

[Pre-Chorus]
In this moment, here today
${currentOccasion.focus} lights the way
${emotionalContext[0] || selectedVibeEnhancers[0]} lives in you
Making everything feel new

[Chorus]
You're my ${emotionalContext[1] || selectedVibeEnhancers[2]}
My ${relationship}, ${relationshipContext.tone}
${selectedVibeEnhancers[3]}, always true
Forever this ${vibe} song I'll sing
Through the seasons and the years
${storyAnalysis.extractedElements.hasChallenges ? "Through the struggles and the cheers" : "Through the laughter and the tears"}
My dear ${recipient}, you're my heart
This ${occasion} is ${currentOccasion.focus}

[Bridge]
${storyAnalysis.extractedElements.hasMemories ? "No matter where life's story goes" : "No matter where the future flows"}
${emotionalContext[2] || selectedVibeEnhancers[1]}, that's what I know
${recipient}, you're my ${currentOccasion.imagery}
Making every day feel right

[Final Chorus]
You're my ${emotionalContext[1] || selectedVibeEnhancers[2]}
My ${relationship}, ${relationshipContext.tone}
${selectedVibeEnhancers[3]}, always true
Forever this ${vibe} song I'll sing

[Outro]
${currentOccasion.focus}, ${recipient}
This ${genre} song's my gift to you
A ${vibe} celebration
Of ${relationshipContext.type === 'romantic' ? 'a love so true' : relationshipContext.type === 'family' ? 'family bonds so true' : 'friendship so true'}`
    }
  }
  
  return createIntelligentLyrics()
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substr(2, 9)
  
  logger.info(`Starting song generation request ${requestId}`)
  
  try {
    // Parse and log request body
    const body = await request.json()
    logger.debug('Received request body', { 
      requestId,
      bodyKeys: Object.keys(body),
      storyLength: body.story?.length || 0,
      lyricsLength: body.lyrics?.length || 0
    })
    
    // Validate input with detailed logging
    let validatedData
    try {
      validatedData = GenerateRequestSchema.parse(body)
      logger.info('Input validation successful', { requestId })
      
      // Sanitize user inputs to prevent XSS
      validatedData.story = sanitizeInput(validatedData.story)
      validatedData.recipient = sanitizeInput(validatedData.recipient)
      validatedData.relationship = sanitizeInput(validatedData.relationship)
      validatedData.occasion = sanitizeInput(validatedData.occasion)
      
      if (validatedData.lyrics) {
        validatedData.lyrics = sanitizeInput(validatedData.lyrics)
      }
      if (validatedData.title) {
        validatedData.title = sanitizeInput(validatedData.title)
      }
      
      logger.debug('Input sanitization completed', { requestId })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.error('Input validation failed', { 
          requestId,
          errors: validationError.errors,
          receivedKeys: Object.keys(body)
        })
        return NextResponse.json(
          { 
            error: 'Invalid input data', 
            details: validationError.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            })),
            requestId
          },
          { status: 400 }
        )
      }
      throw validationError
    }
    
    // Check for profanity with logging
    const textToCheck = `${validatedData.story} ${validatedData.lyrics || ''} ${validatedData.title || ''}`
    if (containsProfanity(textToCheck)) {
      logger.error('Content contains profanity', { requestId })
      return NextResponse.json(
        { 
          error: 'Content contains inappropriate language',
          requestId
        },
        { status: 400 }
      )
    }
    
    
    const songLyrics = validatedData.lyrics || generateSongLyrics(
      validatedData.story,
      validatedData.recipient,
      validatedData.relationship,
      validatedData.occasion,
      validatedData.vibe,
      validatedData.genre
    )
    
    logger.debug('Generated song lyrics', { 
      requestId, 
      lyricsLength: songLyrics.length,
      preview: songLyrics.substring(0, 100) + '...'
    })

    // Get the correct internal URL
    const base = getInternalBaseUrl()
    const elevenUrl = `${base}/api/elevenlabs-generate`
    
    logger.info('Making internal API call to ElevenLabs music endpoint', { 
      requestId,
      baseUrl: base,
      fullUrl: elevenUrl,
      environment: process.env.NODE_ENV
    })

    // Prepare request payload for ElevenLabs music generation
    const requestPayload = {
      prompt: `Create a ${validatedData.vibe} ${validatedData.genre} song with singing about: ${validatedData.story.substring(0, 100)}`,
      duration: 60, // 1 minute for testing - saves tokens
      lyrics: songLyrics,
      voiceId: validatedData.selectedVoiceId,
      voiceCategory: validatedData.selectedVoiceCategory,
      emotion: validatedData.emotion,
      style: validatedData.style,
      genre: validatedData.genre,
      occasion: validatedData.occasion,
      recipient: validatedData.recipient,
      relationship: validatedData.relationship,
      vibe: validatedData.vibe
    }
    
    logger.debug('Request payload prepared', { 
      requestId, 
      payload: { 
        ...requestPayload, 
        promptLength: requestPayload.prompt.length,
        lyricsLength: requestPayload.lyrics?.length || 0
      }
    })

    // Make the internal API call with enhanced error handling
    const response = await fetchWithTimeout(elevenUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        'User-Agent': 'MusicMoments-Internal/1.0'
      },
      body: JSON.stringify(requestPayload)
    })

    // Handle response
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      logger.error('ElevenLabs music API returned error', { 
        requestId,
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText,
        responseHeaders: Object.fromEntries(response.headers.entries())
      })
      
      throw new Error(`ElevenLabs music API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    // Parse response
    let data
    try {
      data = await response.json()
      logger.info('ElevenLabs music API response received', { 
        requestId,
        dataKeys: Object.keys(data),
        taskId: data.taskId
      })
    } catch (parseError) {
      logger.error('Failed to parse ElevenLabs music API response', { requestId, parseError })
      throw new Error('Invalid response from ElevenLabs music API')
    }
    
    const processingTime = Date.now() - startTime
    logger.info('Song generation request completed successfully', { 
      requestId,
      processingTimeMs: processingTime,
      taskId: data.taskId
    })
    
    return NextResponse.json({
      songId: data.taskId,
      eta: data.estimatedTime || 0,
      isDemoMode: data.isDemoMode || false,
      provider: 'elevenlabs',
      requestId,
      processingTimeMs: processingTime
    })
    
  } catch (error: any) {
    const processingTime = Date.now() - startTime
    
    logger.error('Song generation request failed', { 
      requestId,
      processingTimeMs: processingTime,
      error: error.message,
      stack: error.stack
    })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: error.errors,
          requestId,
          processingTimeMs: processingTime
        },
        { status: 400 }
      )
    }
    
    // Enhanced error responses based on error type
    let errorMessage = 'Failed to generate song'
    let statusCode = 500
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out - please try again'
      statusCode = 408
    } else if (error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Internal service unavailable - please try again in a moment'
      statusCode = 503
    } else if (error.message?.includes('ElevenLabs')) {
      errorMessage = 'Music generation service error - please try again'
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
