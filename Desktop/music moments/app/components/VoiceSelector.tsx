'use client'

import React, { useState, useEffect } from 'react'
import { VoiceCategory, VoiceSelector as VoiceSelectorClass } from '../lib/voice-selection'

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  labels?: {
    gender?: string;
    age?: string;
    accent?: string;
  };
}

interface VoiceSelectorProps {
  selectedVoiceId?: string
  selectedVoiceCategory?: string
  onVoiceSelect: (voiceId: string, category: string) => void
  disabled?: boolean
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  selectedVoiceCategory,
  onVoiceSelect,
  disabled = false
}) => {
  const [voiceCategories] = useState<VoiceCategory[]>(VoiceSelectorClass.getVoiceCategories())
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedVoiceCategory || '')

  // Find the currently selected voice object from availableVoices
  const selectedVoice = availableVoices.find(voice => voice.voice_id === selectedVoiceId)

  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/elevenlabs-voices?t=${Date.now()}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (response.ok) {
          const data = await response.json()
          console.log('Voices loaded:', data.voices?.length || 0, 'voices')
          if (data.voices && data.voices.length > 0) {
            console.log('Sample voice:', data.voices[0])
          }
          setAvailableVoices(data.voices || [])
        }
      } catch (error) {
        console.error('Failed to fetch voices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVoices()
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Don't auto-select voice when category changes - let user choose
  }

  const handleVoiceChange = (voiceId: string) => {
    onVoiceSelect(voiceId, selectedCategory)
  }

  return (
    <div className="voice-selector">
      <div className="form-group">
        <label className="form-label">Voice Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-select"
          disabled={disabled || loading}
        >
          <option value="">Select a voice category</option>
          {voiceCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} - {category.description}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="form-group">
          <label className="form-label">Select Voice</label>
          <select
            value={selectedVoice?.voice_id || ''}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="form-select"
            disabled={disabled || loading}
          >
            <option value="">Choose a specific voice</option>
            {availableVoices
              .filter(voice => {
                // Filter voices based on selected category
                if (!selectedCategory) return true
                
                const labels = voice.labels || {}
                
                console.log('Filtering voice:', voice.name, 'for category:', selectedCategory, 'with labels:', labels)
                
                switch (selectedCategory) {
                  case 'professional':
                    return labels.gender === 'female' || labels.age === 'middle aged'
                  case 'warm':
                    return labels.gender === 'female' || labels.age === 'middle aged'
                  case 'energetic':
                    return labels.age === 'young' || labels.gender === 'male'
                  case 'calm':
                    return labels.age === 'middle aged' || labels.age === 'mature' || labels.gender === 'female'
                  case 'fun':
                    return labels.age === 'young' || labels.gender === 'male'
                  default:
                    return true
                }
              })
              .slice(0, 10) // Limit to first 10 voices for better UX
              .map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name || `Voice ${voice.voice_id}`} {voice.labels?.gender ? `(${voice.labels.gender})` : ''}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedVoiceId && (
        <div className="voice-info">
          <h4>Selected Voice ID: {selectedVoiceId}</h4>
          <div className="voice-details">
            <p><strong>Category:</strong> {selectedVoiceCategory}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-voices">
          Loading available voices...
        </div>
      )}
    </div>
  )
}

export default VoiceSelector