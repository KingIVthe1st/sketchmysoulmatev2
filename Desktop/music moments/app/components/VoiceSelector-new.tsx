'use client'

import React, { useState, useEffect } from 'react'

interface Voice {
  voice_id: string
  name: string
  category?: string
  description?: string
  preview_url?: string
  labels?: {
    gender?: string
    age?: string
    accent?: string
    description?: string
  }
}

interface VoiceSelectorProps {
  selectedVoiceId: string
  selectedVoiceCategory: string
  onVoiceSelect: (voiceId: string, category: string) => void
  disabled?: boolean
}

// Enhanced voice categories with detailed descriptions and use cases
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

export default function VoiceSelector({
  selectedVoiceId,
  selectedVoiceCategory,
  onVoiceSelect,
  disabled = false
}: VoiceSelectorProps) {
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debug: Log prop changes
  useEffect(() => {
    console.log('🔄 VoiceSelector props updated:', { selectedVoiceId, selectedVoiceCategory })
  }, [selectedVoiceId, selectedVoiceCategory])

  // Fetch available voices
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🎤 Fetching available voices...')
        const response = await fetch('/api/elevenlabs-voices')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch voices: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('✅ Fetched voices:', data.voices?.length || 0)
        
        if (data.voices && Array.isArray(data.voices)) {
          setAvailableVoices(data.voices)
          console.log('📊 Sample voices:', data.voices.slice(0, 3).map(v => ({ id: v.voice_id, name: v.name })))
        } else {
          throw new Error('No voices received from API')
        }
        
      } catch (err: any) {
        console.error('❌ Voice fetch error:', err)
        setError(err.message || 'Failed to load voices')
      } finally {
        setLoading(false)
      }
    }

    fetchVoices()
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    console.log('📂 Category selected:', categoryId)
    // Clear voice selection when category changes
    onVoiceSelect('', categoryId)
  }

  const handleVoiceSelect = (voiceId: string) => {
    console.log('🎵 Voice selected:', voiceId)
    console.log('🔍 Current props:', { selectedVoiceId, selectedVoiceCategory })
    const selectedVoice = availableVoices.find(v => v.voice_id === voiceId)
    if (selectedVoice) {
      console.log('✅ Selected voice details:', { id: selectedVoice.voice_id, name: selectedVoice.name })
    }
    console.log('📞 Calling onVoiceSelect with:', voiceId, selectedVoiceCategory)
    onVoiceSelect(voiceId, selectedVoiceCategory)
  }

  // Filter voices based on category (simple approach - just show all voices for any category)
  const getVoicesForCategory = () => {
    if (!selectedVoiceCategory) return []
    
    // Get first 15 voices
    let voices = availableVoices.slice(0, 15)
    
    // Always include the currently selected voice if it's not in the first 15
    if (selectedVoiceId) {
      const selectedVoice = availableVoices.find(v => v.voice_id === selectedVoiceId)
      if (selectedVoice && !voices.find(v => v.voice_id === selectedVoiceId)) {
        voices = [selectedVoice, ...voices.slice(0, 14)] // Add selected voice to beginning
      }
    }
    
    return voices
  }

  const filteredVoices = getVoicesForCategory()
  const selectedVoice = availableVoices.find(v => v.voice_id === selectedVoiceId)

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">Voice Selection</label>
        <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg border border-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent mr-3"></div>
          <span className="text-gray-300">Loading voices...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium mb-2">Voice Selection</label>
        <div className="p-4 bg-red-800 border border-red-600 rounded-lg">
          <p className="text-red-100 text-sm">Error loading voices: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Category Selection */}
      <div>
        <label className="block text-lg font-semibold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4">Choose Your Voice Style</label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 via-cyan-600/30 to-emerald-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <select
            className="relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-400/60 focus:bg-slate-700/60 text-white text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-emerald-500/20 appearance-none cursor-pointer pr-12"
            value={selectedVoiceCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            disabled={disabled}
          >
            <option value="" className="bg-slate-800 text-slate-300">Select a voice style...</option>
            {VOICE_CATEGORIES.map((category) => (
              <option 
                key={category.id} 
                value={category.id} 
                className="bg-slate-800 text-white py-2"
              >
                {category.name}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-3 h-3 border-r-2 border-b-2 border-emerald-300 transform rotate-45"></div>
          </div>
          
          {/* Liquid glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-emerald-400/10 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        </div>
      </div>

      {/* Voice Selection */}
      {selectedVoiceCategory && (
        <div>
          <label className="block text-lg font-semibold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent mb-4">Select Specific Voice</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 via-cyan-600/30 to-emerald-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <select
              className="relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-400/60 focus:bg-slate-700/60 text-white text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-emerald-500/20 appearance-none cursor-pointer pr-12"
              value={selectedVoiceId}
              onChange={(e) => handleVoiceSelect(e.target.value)}
              disabled={disabled || filteredVoices.length === 0}
            >
              <option value="" className="bg-slate-800 text-slate-300">Choose your perfect voice...</option>
              {filteredVoices.map((voice) => {
                const genderInfo = voice.labels?.gender || 'voice'
                const ageInfo = voice.labels?.age || 'adult'
                const accentInfo = voice.labels?.accent ? ` (${voice.labels.accent})` : ''
                
                return (
                  <option 
                    key={voice.voice_id} 
                    value={voice.voice_id} 
                    className="bg-slate-800 text-white py-2"
                    title={`${voice.name} - ${genderInfo}, ${ageInfo}${accentInfo}`}
                  >
                    🎵 {voice.name} - {genderInfo}, {ageInfo}{accentInfo}
                  </option>
                )
              })}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-3 h-3 border-r-2 border-b-2 border-emerald-300 transform rotate-45"></div>
            </div>
            
            {/* Liquid glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-emerald-400/10 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>
          
          {filteredVoices.length === 0 && selectedVoiceCategory && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-sm text-amber-300">No voices available for this style. Please try another option.</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Voice Info */}
      {selectedVoice && (
        <div className="p-6 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border-2 border-emerald-400/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="text-emerald-300 text-sm font-medium">Voice Selected</p>
                <p className="text-white font-bold text-lg">{selectedVoice.name}</p>
              </div>
            </div>
            <div className="text-3xl">🎤</div>
          </div>
          
          <div className="mt-4 flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl">
            <span className="text-emerald-400 mr-2 text-lg">✨</span>
            <p className="text-emerald-200 text-sm font-medium">
              Ready to create your masterpiece!
            </p>
          </div>
        </div>
      )}

      {availableVoices.length > 0 && (
        <p className="text-xs text-gray-500">
          {availableVoices.length} voices available
        </p>
      )}
    </div>
  )
}