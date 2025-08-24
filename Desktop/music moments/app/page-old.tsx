'use client'

import { useState, useEffect, useRef } from 'react'
import VoiceSelector from './components/VoiceSelector'

// Types
interface FormData {
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

interface SongResult {
  songId: string
  audioUrl?: string
  coverUrl?: string
  lyrics?: string
  status: 'stream' | 'complete' | 'error'
  voiceId?: string
  voiceCategory?: string
  voiceName?: string
}

const initialFormData: FormData = {
  occasion: '',
  recipient: '',
  relationship: '',
  vibe: 'uplifting',
  genre: 'pop',
  story: '',
  lyrics: '',
  title: '',
  useAutoLyrics: false,
  selectedVoiceId: '',
  selectedVoiceCategory: ''
}

// Global interval tracker to prevent zombie polling
const globalIntervals = new Set<NodeJS.Timeout>()

// Add hard reset utility function at window level to kill zombie polling
if (typeof window !== 'undefined') {
  (window as any).killAllPolling = () => {
    console.log('🚨 [FRONTEND] HARD RESET: Killing all polling loops')
    localStorage.removeItem('activeSongId')
    localStorage.removeItem('zombieCounter')
    // Clear all intervals - this is a nuclear option
    for (let i = 1; i < 99999; i++) window.clearInterval(i)
    // Also clear our tracked intervals
    globalIntervals.forEach(interval => clearInterval(interval))
    globalIntervals.clear()
    console.log('🚨 [FRONTEND] All intervals cleared')
  }
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [processedSongUrl, setProcessedSongUrl] = useState<string | null>(null)
  const [songTitle, setSongTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [generationCount, setGenerationCount] = useState(0)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [currentSongId, setCurrentSongId] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStatus, setCurrentStatus] = useState('Initializing...')
  const pollingRef = useRef<boolean>(false)

  // Kill any orphaned intervals on mount and implement zombie detection
  useEffect(() => {
    // Nuclear reset on page load - kill ALL intervals
    console.log('🚨 Performing nuclear reset on page load')
    for (let i = 1; i < 99999; i++) {
      try {
        clearInterval(i)
      } catch(e) {}
    }
    
    // Clear any orphaned song IDs from previous sessions
    const orphanedId = localStorage.getItem('activeSongId')
    if (orphanedId) {
      console.log('🧹 Clearing orphaned song ID from previous session:', orphanedId)
      localStorage.removeItem('activeSongId')
    }
    localStorage.removeItem('zombieCounter')
    
    // Set up zombie detection interval
    const zombieDetector = setInterval(() => {
      const activeSongId = localStorage.getItem('activeSongId')
      const zombieCounter = parseInt(localStorage.getItem('zombieCounter') || '0')
      
      if (activeSongId && zombieCounter > 0) {
        console.log('🧟 Zombie polling detected! Counter:', zombieCounter)
        
        // If zombie counter exceeds threshold, perform nuclear reset
        if (zombieCounter > 5) {
          console.log('🚨 Zombie threshold exceeded! Performing nuclear reset')
          for (let i = 1; i < 99999; i++) {
            try {
              clearInterval(i)
            } catch(e) {}
          }
          localStorage.removeItem('activeSongId')
          localStorage.removeItem('zombieCounter')
          setPollingInterval(null)
          setCurrentSongId(null)
          pollingRef.current = false
          globalIntervals.clear()
        }
      }
    }, 5000) // Check every 5 seconds
    
    // Load generation count
    const saved = localStorage.getItem('generationCount')
    if (saved) {
      setGenerationCount(parseInt(saved, 10))
    }
    
    // Cleanup function
    return () => {
      clearInterval(zombieDetector)
      if (pollingInterval) {
        clearInterval(pollingInterval)
        globalIntervals.delete(pollingInterval)
        setPollingInterval(null)
      }
      localStorage.removeItem('activeSongId')
      localStorage.removeItem('zombieCounter')
    }
  }, [])

  // Save generation count to localStorage
  useEffect(() => {
    localStorage.setItem('generationCount', generationCount.toString())
  }, [generationCount])

  // Enhanced poll for song status with zombie prevention
  const pollStatus = async (songId: string) => {
    console.log(`🔄 Starting polling for songId: ${songId}`)
    
    // Stop any existing polling to prevent conflicts
    if (pollingInterval) {
      console.log('🛑 Clearing existing polling interval before starting new one')
      clearInterval(pollingInterval)
      globalIntervals.delete(pollingInterval)
      setPollingInterval(null)
    }
    
    // Kill all other intervals as extra safety
    globalIntervals.forEach(interval => {
      if (interval !== pollingInterval) {
        clearInterval(interval)
        globalIntervals.delete(interval)
      }
    })
    
    // Set current song ID to track what we're polling for
    setCurrentSongId(songId)
    localStorage.setItem('activeSongId', songId)
    localStorage.setItem('zombieCounter', '0')
    pollingRef.current = true
    
    console.log(`🎯 Set active song ID in localStorage: ${songId}`)
    
    const pollStartTime = Date.now()
    let isActive = true
    
    const interval = setInterval(async () => {
      // Check if this polling loop is still the active one
      if (!isActive || !pollingRef.current) {
        console.log('🛑 Polling loop detected it\'s no longer active, stopping')
        clearInterval(interval)
        globalIntervals.delete(interval)
        return
      }
      
      // Race condition prevention - check if this is still the active song
      const activeSongId = localStorage.getItem('activeSongId')
      if (currentSongId !== songId || activeSongId !== songId) {
        console.log('🛑 Race condition detected - stopping polling for:', songId)
        isActive = false
        clearInterval(interval)
        globalIntervals.delete(interval)
        return
      }
      
      // Increment zombie counter (will be reset on successful status)
      const zombieCounter = parseInt(localStorage.getItem('zombieCounter') || '0')
      localStorage.setItem('zombieCounter', String(zombieCounter + 1))
      
      try {
        console.log(`📡 Checking status for: ${songId}`)
        const response = await fetch(`/api/status?songId=${songId}`)
        
        if (!response.ok) {
          // Handle zombie kill signal (410 Gone) - server detected zombie polling
          if (response.status === 410) {
            const killData = await response.json().catch(() => null)
            console.log('🧟 [ZOMBIE-KILL] Server detected zombie polling - executing nuclear reset', killData)
            
            // Nuclear reset when server tells us we're zombie polling
            for (let i = 1; i < 99999; i++) {
              try {
                clearInterval(i)
              } catch(e) {}
            }
            
            // Clear all state
            setError('Zombie polling detected - cleared all intervals. Please refresh page.')
            setIsLoading(false)
            isActive = false
            clearInterval(interval)
            globalIntervals.clear()
            localStorage.removeItem('activeSongId')
            localStorage.removeItem('zombieCounter')
            setCurrentSongId(null)
            pollingRef.current = false
            setPollingInterval(null)
            
            console.log('🧟 [ZOMBIE-KILL] Nuclear reset complete - all polling stopped')
            return
          }
          
          // Handle 404 specifically - task not found
          if (response.status === 404) {
            console.error('❌ Task not found (404) for songId:', songId)
            setError('Song generation task expired. Please try again.')
            setIsLoading(false)
            isActive = false
            clearInterval(interval)
            globalIntervals.delete(interval)
            localStorage.removeItem('activeSongId')
            localStorage.removeItem('zombieCounter')
            return
          }
          throw new Error(`Status check failed: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📊 Status:', data.status, 'Progress:', data.progress)
        
        // Reset zombie counter on successful response
        localStorage.setItem('zombieCounter', '0')
        
        if (data.status === 'completed' && data.url) {
          console.log('✅ Song completed! URL:', data.url)
          setProcessedSongUrl(data.url)
          setSongTitle(data.title || 'Your Personalized Song')
          setIsLoading(false)
          setProgress(100)
          setCurrentStatus('Song ready to play!')
          clearInterval(interval)
          globalIntervals.delete(interval)
          localStorage.removeItem('activeSongId')
          localStorage.removeItem('zombieCounter')
          setCurrentSongId(null)
          pollingRef.current = false
          
          // Nuclear cleanup just to be safe
          setTimeout(() => {
            console.log('🧹 Final cleanup after completion')
            for (let i = 1; i < 99999; i++) {
              try {
                if (i !== interval) clearInterval(i)
              } catch(e) {}
            }
          }, 100)
          return
        } else if (data.status === 'processing' || data.status === 'pending') {
          // Still processing - reset zombie counter since we got a valid response
          localStorage.setItem('zombieCounter', '0')
          const progressValue = data.progress || Math.min(30 + (Date.now() - pollStartTime) / 1000, 90)
          setProgress(progressValue)
          setCurrentStatus(data.message || 'Processing your song...')
        } else if (data.status === 'error' || data.status === 'failed') {
          console.error('❌ Song generation failed:', data.error)
          setIsLoading(false)
          setError(data.error || 'Song generation failed')
          clearInterval(interval)
          globalIntervals.delete(interval)
          localStorage.removeItem('activeSongId')
          localStorage.removeItem('zombieCounter')
          setCurrentSongId(null)
          pollingRef.current = false
          
          // Nuclear cleanup on error
          setTimeout(() => {
            console.log('🧹 Cleanup after error')
            for (let i = 1; i < 99999; i++) {
              try {
                if (i !== interval) clearInterval(i)
              } catch(e) {}
            }
          }, 100)
          return
        }
        
        // Timeout after 3 minutes
        if (Date.now() - pollStartTime > 180000) {
          console.error('⏱️ Polling timeout')
          setError('Song generation timed out. Please try again.')
          setIsLoading(false)
          isActive = false
          clearInterval(interval)
          globalIntervals.delete(interval)
          localStorage.removeItem('activeSongId')
          localStorage.removeItem('zombieCounter')
        }
      } catch (err) {
        console.error('❌ Status check error:', err)
        // Don't immediately fail on network errors, retry a few times
        const zombieCount = parseInt(localStorage.getItem('zombieCounter') || '0')
        if (zombieCount > 10) {
          setError('Connection lost. Please check your network and try again.')
          setIsLoading(false)
          isActive = false
          clearInterval(interval)
          globalIntervals.delete(interval)
          localStorage.removeItem('activeSongId')
          localStorage.removeItem('zombieCounter')
        }
      }
    }, 3000)
    
    setPollingInterval(interval)
    globalIntervals.add(interval)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProcessedSongUrl(null)
    setSongTitle('')
    
    // Nuclear reset before starting new generation
    console.log('🚨 Nuclear reset before new generation')
    for (let i = 1; i < 99999; i++) {
      try {
        clearInterval(i)
      } catch(e) {}
    }
    globalIntervals.clear()
    localStorage.removeItem('activeSongId')
    localStorage.removeItem('zombieCounter')
    pollingRef.current = false

    // Use the centralized validation function
    if (!validateForm(formData)) {
      setError('Please ensure all fields are filled correctly');
      return;
    }

    setIsLoading(true)
    setProgress(10)
    setCurrentStatus('Preparing your request...')

    try {
      console.log('🎵 Submitting form data')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        throw new Error(errorData.error || 'Failed to generate song')
      }

      const data = await response.json()
      console.log('✅ Generate API success, songId:', data.songId)

      setGenerationCount(prev => prev + 1)
      setProgress(30)
      setCurrentStatus('Song generated! Processing audio...')
      
      // Start polling for completion
      pollStatus(data.songId)
      
    } catch (err) {
      console.error('❌ Form submission failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during song generation'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  // Handle regeneration
  const handleRegenerate = () => {
    if (generationCount >= 2) return
    
    // Nuclear reset before regenerating
    console.log('🚨 Nuclear reset before regeneration')
    for (let i = 1; i < 99999; i++) {
      try {
        clearInterval(i)
      } catch(e) {}
    }
    globalIntervals.clear()
    localStorage.removeItem('activeSongId')
    localStorage.removeItem('zombieCounter')
    pollingRef.current = false
    
    setProcessedSongUrl(null)
    setSongTitle('')
    setError(null)
    setProgress(0)
    setCurrentStatus('Initializing...')
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  // Validate form in real-time
  const validateForm = (form: FormData): boolean => {
    // Check required fields
    if (!form.occasion || form.occasion.trim() === '') return false
    if (!form.recipient || form.recipient.trim() === '') return false
    if (!form.relationship || form.relationship.trim() === '') return false
    if (form.story.length < 200 || form.story.length > 500) return false
    if (form.lyrics && form.lyrics.length > 500) return false
    if (!form.selectedVoiceId || form.selectedVoiceId.trim() === '') return false
    
    return true
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => {
      const newForm = { ...prev, [field]: value }
      setIsFormValid(validateForm(newForm))
      return newForm
    })
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          🎵 MusicMoments
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Turn your story into a song in seconds. Create full songs with lyrics and vocals using AI.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid-main">
        {/* Form Section */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Occasion */}
            <div className="form-group">
              <label htmlFor="occasion" className="form-label">Occasion</label>
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={(e) => handleInputChange('occasion', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="wedding">Wedding</option>
                <option value="graduation">Graduation</option>
                <option value="valentines">Valentine's Day</option>
                <option value="mother's day">Mother's Day</option>
                <option value="father's day">Father's Day</option>
                <option value="friendship">Friendship</option>
                <option value="farewell">Farewell</option>
                <option value="motivation">Motivation</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Recipient and Relationship */}
            <div className="grid-2">
               <div className="form-group">
                 <label htmlFor="recipient" className="form-label">Recipient</label>
                 <input
                   id="recipient"
                   name="recipient"
                   type="text"
                   value={formData.recipient}
                   onChange={(e) => handleInputChange('recipient', e.target.value)}
                   placeholder="Sarah"
                   className="form-input"
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="relationship" className="form-label">Relationship</label>
                 <input
                   id="relationship"
                   name="relationship"
                   type="text"
                   value={formData.relationship}
                   onChange={(e) => handleInputChange('relationship', e.target.value)}
                   placeholder="wife, friend, daughter..."
                   className="form-input"
                   required
                 />
               </div>
             </div>

            {/* Vibe and Genre */}
            <div className="grid-2">
               <div className="form-group">
                 <label htmlFor="vibe" className="form-label">Vibe</label>
                 <select
                   id="vibe"
                   name="vibe"
                   value={formData.vibe}
                   onChange={(e) => handleInputChange('vibe', e.target.value)}
                   className="form-select"
                 >
                  <option value="romantic">Romantic</option>
                  <option value="uplifting">Uplifting</option>
                  <option value="nostalgic">Nostalgic</option>
                  <option value="energetic">Energetic</option>
                  <option value="cinematic">Cinematic</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="genre" className="form-label">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="form-select"
                >
                  <option value="pop">Pop</option>
                  <option value="acoustic">Acoustic</option>
                  <option value="lofi">Lo-Fi</option>
                  <option value="orchestral">Orchestral</option>
                </select>
              </div>
            </div>
            {/* Voice Selection */}
            <div className="form-group">
              <label className="form-label">Voice Selection</label>
              <VoiceSelector
                selectedVoiceId={formData.selectedVoiceId}
                selectedVoiceCategory={formData.selectedVoiceCategory}
                onVoiceSelect={(voiceId: string, category: string) => {
                  handleInputChange('selectedVoiceId', voiceId);
                  handleInputChange('selectedVoiceCategory', category);
                }}
              />
            </div>

            {/* Story */}
            <div className="form-group">
              <label htmlFor="story" className="form-label">
                Your Story ({formData.story.length}/500)
              </label>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={(e) => handleInputChange('story', e.target.value)}
                placeholder="Tell the story you want to turn into a song. Be specific about memories, feelings, and moments that matter..."
                rows={4}
                className="form-textarea"
                minLength={200}
                maxLength={500}
                required
              />
              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                Minimum 200 characters required
              </p>
            </div>

            {/* Optional Lyrics */}
            <div className="form-group">
              <label htmlFor="lyrics" className="form-label">
                Optional Lyrics ({formData.lyrics.length}/500)
              </label>
              <textarea
                id="lyrics"
                name="lyrics"
                value={formData.lyrics}
                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                placeholder="Optional: Add your own lyrics, or leave empty to auto-generate..."
                rows={3}
                className="form-textarea"
                maxLength={500}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="autoLyrics"
                  checked={formData.useAutoLyrics}
                  onChange={(e) => handleInputChange('useAutoLyrics', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                <label htmlFor="autoLyrics" style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Auto-generate lyrics if empty
                </label>
              </div>
            </div>

            {/* Optional Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">Song Title (Optional)</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Leave empty for auto-generated title"
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="btn-primary"
            >
              {isLoading ? 'Creating Your Song...' : 'Create Song'}
            </button>

            {/* Animated Progress Meter */}
            {isLoading && (
              <div className="progress-container" style={{ marginTop: '1.5rem' }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">
                  <span className="progress-percentage">{progress}%</span>
                  <span className="progress-status">{currentStatus}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="results-container">
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner animate-spin"></div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Composing your song...
              </h3>
              <p style={{ opacity: 0.8 }}>
                This usually takes under 3 minutes
              </p>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: '#8b5cf6', fontWeight: '600' }}>
                  {progress}% Complete
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                  {currentStatus}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                </div>
                <div style={{ marginLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.25rem 0' }}>
                    Error
                  </h3>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {processedSongUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {songTitle || 'Your Song is Ready!'} 🎉
              </h3>

              {/* Audio Player */}
              <div style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem' }}>
                <audio
                  controls
                  src={processedSongUrl}
                  className="audio-player"
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Action Buttons */}
              <div>
                {/* Download Button */}
                <a
                  href={processedSongUrl}
                  download="musicmoments-song.mp3"
                  className="btn-download"
                >
                  Download Song
                </a>

                {/* Regenerate Button */}
                <button
                  onClick={handleRegenerate}
                  disabled={generationCount >= 2 || isLoading}
                  className="btn-secondary"
                >
                  {generationCount >= 2 
                    ? 'Generation Limit Reached (2/2)' 
                    : `Regenerate (${generationCount}/2)`
                  }
                </button>
              </div>

              {/* Usage Stats */}
              <div className="text-center" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Generations used: {generationCount}/2
              </div>
            </div>
          )}

          {!isLoading && !error && !processedSongUrl && (
            <div className="text-center" style={{ opacity: 0.7 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎵</div>
              <p>Fill out the form to create your personalized song</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}