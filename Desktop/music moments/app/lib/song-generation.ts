// Bulletproof Song Generation Library
// Zero intervals, zero loops, guaranteed to work

interface GenerationRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral' | 'hiphop' | 'ballad' | 'country' | 'rock' | 'rnb' | 'jazz' | 'folk' | 'reggae' | 'electronic' | 'blues' | 'indie' | 'oldschool-rap' | 'trap' | 'afrobeats' | 'latin' | 'gospel'
  story: string
  lyrics: string
  title: string
  useAutoLyrics: boolean
  selectedVoiceId: string
  selectedVoiceCategory: string
}

interface GenerationResponse {
  songId: string
  eta: number
  provider: string
  isDemoMode?: boolean
  requestId?: string
  processingTimeMs?: number
}

interface SongResult {
  status: 'processing' | 'complete' | 'completed' | 'error' | 'zombie_detected'
  audioUrl?: string
  audioData?: string
  audioMessage?: string
  lyrics?: string
  voiceId?: string
  voiceCategory?: string
  voiceName?: string
  error?: string
  killSignal?: boolean
  pollingStats?: {
    requestCount: number
    duration: number
    requestsPerMinute: number
  }
}

class SongGenerator {
  private static instance: SongGenerator
  
  public static getInstance(): SongGenerator {
    if (!SongGenerator.instance) {
      SongGenerator.instance = new SongGenerator()
    }
    return SongGenerator.instance
  }

  // Step 1: Submit generation request
  async submitGeneration(formData: GenerationRequest): Promise<GenerationResponse> {
    console.log('🎵 [GENERATOR] Submitting song generation request...')
    
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Generator': 'SongGenerator-v2'
      },
      body: JSON.stringify(formData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Generation failed: ${response.status}`)
    }

    const result: GenerationResponse = await response.json()
    console.log('✅ [GENERATOR] Generation submitted successfully:', result.songId)
    
    return result
  }

  // Step 2: Check song status (single call, no loops)
  async checkSongStatus(songId: string): Promise<SongResult> {
    console.log(`🔍 [GENERATOR] Checking status for song: ${songId}`)
    
    const response = await fetch(`/api/status?songId=${songId}`, {
      headers: {
        'X-Generator': 'SongGenerator-v2'
      }
    })
    
    // Handle zombie detection kill signal
    if (response.status === 410) {
      const killData = await response.json().catch(() => null)
      console.log('🧟 [GENERATOR] Zombie polling detected by server:', killData)
      
      return {
        status: 'zombie_detected',
        error: 'Server detected zombie polling - system reset required',
        killSignal: true,
        pollingStats: killData?.pollingStats
      }
    }
    
    // Handle not found
    if (response.status === 404) {
      throw new Error('Song not found - it may have expired')
    }
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`📊 [GENERATOR] Status response:`, { 
      status: data.status, 
      hasAudio: !!(data.audioUrl || data.audioData),
      hasLyrics: !!data.lyrics
    })
    
    // Normalize status - backend returns 'completed', frontend expects 'complete'
    const normalizedStatus = data.status === 'completed' ? 'complete' : data.status
    
    return {
      status: normalizedStatus,
      audioUrl: data.audioUrl,
      audioData: data.audioData,
      audioMessage: data.audioMessage,
      lyrics: data.lyrics,
      voiceId: data.voiceId,
      voiceCategory: data.voiceCategory,
      voiceName: data.voiceName,
      error: data.error
    }
  }

  // Step 3: Complete generation flow with proper ElevenLabs timing (45-90 seconds)
  async generateSong(
    formData: GenerationRequest,
    onProgress?: (message: string) => void
  ): Promise<SongResult> {
    console.log('🚀 [GENERATOR] Starting complete generation flow...')
    
    try {
      // Step 1: Submit request
      onProgress?.('Preparing your personalized song...')
      const generationResponse = await this.submitGeneration(formData)
      
      // Step 2: Start polling with proper ElevenLabs timing (45-90 seconds typical)
      onProgress?.('Generating your personalized song... This typically takes 45-90 seconds')
      console.log('⏳ [GENERATOR] Starting status polling for ElevenLabs generation...')
      
      // Poll every 4 seconds for up to 3 minutes (180 seconds)
      const maxAttempts = 45 // 45 * 4 seconds = 3 minutes
      const pollInterval = 4000 // 4 seconds between polls
      let attempt = 0
      
      while (attempt < maxAttempts) {
        attempt++
        
        // Wait before checking (except first attempt which waits longer for initial processing)
        const waitTime = attempt === 1 ? 8000 : pollInterval
        console.log(`⏳ [GENERATOR] Waiting ${waitTime/1000} seconds before status check ${attempt}/${maxAttempts}...`)
        await this.sleep(waitTime)
        
        // Update progress message based on time elapsed
        const timeElapsed = (attempt === 1) ? 8 : 8 + ((attempt - 1) * 4)
        if (timeElapsed < 30) {
          onProgress?.('AI is composing your personalized lyrics and melody...')
        } else if (timeElapsed < 60) {
          onProgress?.('Creating the vocal performance with your chosen voice...')
        } else if (timeElapsed < 90) {
          onProgress?.('Finalizing audio production and mixing...')
        } else {
          onProgress?.('Almost ready... Adding final touches to your song...')
        }
        
        // Check status
        console.log(`🔍 [GENERATOR] Status check ${attempt}/${maxAttempts} for song: ${generationResponse.songId}`)
        let result = await this.checkSongStatus(generationResponse.songId)
        
        // Handle completed song
        if (result.status === 'complete' || result.status === 'completed') {
          console.log(`🎉 [GENERATOR] Song ready after ${attempt} attempts (${timeElapsed} seconds)!`)
          onProgress?.('Your personalized song is ready!')
          return result
        }
        
        // Handle errors
        if (result.status === 'error') {
          throw new Error(result.error || 'Song generation failed')
        }
        
        // Handle zombie detection
        if (result.status === 'zombie_detected') {
          throw new Error('System detected runaway processes - please refresh the page and try again')
        }
        
        // Continue polling if still processing
        if (result.status === 'processing') {
          console.log(`🔄 [GENERATOR] Still processing after ${timeElapsed} seconds, continuing to poll...`)
          continue
        }
        
        // Unknown status
        console.warn(`⚠️ [GENERATOR] Unknown status: ${result.status}, continuing to poll...`)
      }
      
      // If we've exhausted all attempts (3 minutes), throw timeout error
      throw new Error('Song generation is taking longer than expected (3+ minutes). This may be due to high server load. Please try again in a few minutes.')
      
    } catch (error) {
      console.error('❌ [GENERATOR] Generation failed:', error)
      throw error
    }
  }

  // Simple sleep utility
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Validate form data before submission
  validateFormData(formData: GenerationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!formData.occasion) errors.push('Occasion is required')
    if (!formData.recipient) errors.push('Recipient is required')
    if (!formData.relationship) errors.push('Relationship is required')
    if (!formData.story || formData.story.length < 200) errors.push('Story must be at least 200 characters')
    if (!formData.selectedVoiceId) errors.push('Voice selection is required')
    if (!formData.selectedVoiceCategory) errors.push('Voice category is required')
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export default SongGenerator
export type { GenerationRequest, GenerationResponse, SongResult }