// Bulletproof Song Generation Library
// Zero intervals, zero loops, guaranteed to work

interface GenerationRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral'
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
      lyrics: data.lyrics,
      voiceId: data.voiceId,
      voiceCategory: data.voiceCategory,
      voiceName: data.voiceName,
      error: data.error
    }
  }

  // Step 3: Complete generation flow with smart timing
  async generateSong(
    formData: GenerationRequest,
    onProgress?: (message: string) => void
  ): Promise<SongResult> {
    console.log('🚀 [GENERATOR] Starting complete generation flow...')
    
    try {
      // Step 1: Submit request
      onProgress?.('Submitting generation request...')
      const generationResponse = await this.submitGeneration(formData)
      
      // Step 2: Smart wait based on backend performance (2-3 seconds average)
      onProgress?.('Generation in progress... (this takes 2-5 seconds)')
      console.log('⏳ [GENERATOR] Waiting 3 seconds before first status check...')
      await this.sleep(3000)
      
      // Step 3: First status check
      onProgress?.('Checking if song is ready...')
      let result = await this.checkSongStatus(generationResponse.songId)
      
      if (result.status === 'complete' || result.status === 'completed') {
        console.log('🎉 [GENERATOR] Song ready on first check!')
        return result
      }
      
      if (result.status === 'error') {
        throw new Error(result.error || 'Song generation failed')
      }
      
      if (result.status === 'zombie_detected') {
        throw new Error('Zombie polling detected - please refresh the page')
      }
      
      // Step 4: If still processing, wait a bit more and try once more
      if (result.status === 'processing') {
        onProgress?.('Still processing... just a moment more...')
        console.log('🔄 [GENERATOR] Still processing, waiting 2 more seconds...')
        await this.sleep(2000)
        
        // Final status check
        result = await this.checkSongStatus(generationResponse.songId)
        
        if (result.status === 'complete' || result.status === 'completed') {
          console.log('🎉 [GENERATOR] Song ready on second check!')
          return result
        }
        
        if (result.status === 'zombie_detected') {
          throw new Error('Zombie polling detected - please refresh the page')
        }
        
        if (result.status === 'error') {
          throw new Error(result.error || 'Song generation failed')
        }
        
        // If still not ready, that's unusual but we'll throw a timeout error
        throw new Error('Song generation is taking longer than expected. Please try again.')
      }
      
      // Unknown status
      throw new Error(`Unexpected status: ${result.status}`)
      
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