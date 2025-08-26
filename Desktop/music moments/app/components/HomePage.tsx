'use client'

import React, { useState } from 'react'
import VoiceSelector from './VoiceSelector-new'
import SongGenerator from '../lib/song-generation'
import type { GenerationRequest, SongResult } from '../lib/song-generation'

interface FormData {
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

export default function HomePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [songResult, setSongResult] = useState<SongResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'complete'>('form')
  const [progressMessage, setProgressMessage] = useState<string>('')

  const songGenerator = SongGenerator.getInstance()

  const handleGenerate = async () => {
    if (!isFormValid) return

    setIsGenerating(true)
    setCurrentStep('generating')
    setError(null)
    setSongResult(null)
    setProgressMessage('Preparing your song...')

    try {
      const validation = songGenerator.validateFormData(formData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const result = await songGenerator.generateSong(
        formData as GenerationRequest,
        (message: string) => {
          setProgressMessage(message)
        }
      )

      if (result.status === 'complete') {
        console.log('🎉 [HOMEPAGE] Song generation complete, result:', {
          hasAudioData: !!result.audioData,
          hasAudioUrl: !!result.audioUrl,
          hasSongId: !!result.songId,
          audioUrlValue: result.audioUrl,
          songIdValue: result.songId,
          audioDataLength: result.audioData?.length || 0
        })
        setSongResult(result)
        setCurrentStep('complete')
      } else if (result.status === 'zombie_detected') {
        throw new Error('System detected runaway processes - please refresh the page and try again')
      } else {
        throw new Error(result.error || 'Song generation failed')
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate song'
      
      // Handle timeout errors with more helpful messaging
      if (errorMessage.includes('3+ minutes') || errorMessage.includes('longer than expected')) {
        setError('Song generation timed out after 3 minutes. This may be due to high server load. Please try again in a few minutes.')
      } else if (errorMessage.includes('zombie')) {
        setError('System detected runaway processes. Please refresh the page and try again.')
      } else {
        setError(errorMessage)
      }
      
      setCurrentStep('form')
      setProgressMessage('')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    const isValid = (
      newFormData.occasion.length > 0 &&
      newFormData.recipient.length > 0 &&
      newFormData.relationship.length > 0 &&
      newFormData.story.length >= 200 &&
      newFormData.selectedVoiceId.length > 0
    )
    
    setIsFormValid(isValid)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setSongResult(null)
    setError(null)
    setCurrentStep('form')
    setIsFormValid(false)
  }

  if (currentStep === 'form') {
    return React.createElement('div', {
      className: "min-h-screen min-h-[-webkit-fill-available] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden safe-area-all no-bounce mobile-optimized"
    }, [
      React.createElement('div', {
        key: 'bg1',
        className: "absolute inset-0 bg-gradient-radial from-indigo-900/20 via-purple-900/10 to-transparent"
      }),
      React.createElement('div', {
        key: 'bg2',
        className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      }),
      React.createElement('div', {
        key: 'bg3',
        className: "absolute inset-0 opacity-50"
      }, React.createElement('div', {
        className: "absolute top-0 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
      })),
      React.createElement('div', {
        key: 'bg4',
        className: "absolute inset-0 opacity-30"
      }, React.createElement('div', {
        className: "absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"
      })),
      React.createElement('div', {
        key: 'container',
        className: "container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 lg:py-12 relative z-10 flex flex-col items-center min-h-screen min-h-[-webkit-fill-available] justify-center"
      }, [
        React.createElement('div', {
          key: 'header',
          className: "text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16 touch-spacing-md"
        }, [
          React.createElement('h1', {
            key: 'title',
            className: "text-mobile-4xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-2 xs:mb-3 sm:mb-4 lg:mb-6 drop-shadow-2xl text-contrast leading-tight"
          }, 'SongGram'),
          React.createElement('p', {
            key: 'subtitle',
            className: "text-mobile-lg xs:text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto px-2 xs:px-3 sm:px-4 text-contrast"
          }, [
            'Transform your memories into ',
            React.createElement('span', {
              key: 'highlight',
              className: "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-medium"
            }, 'personalized AI songs')
          ])
        ]),
        error && React.createElement('div', {
          key: 'error',
          className: "max-w-2xl mx-auto mb-4 xs:mb-6 sm:mb-8 p-3 xs:p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl xs:rounded-2xl touch-padding-sm"
        }, React.createElement('div', {
          className: "flex items-center gap-2 xs:gap-3"
        }, [
          React.createElement('span', { key: 'icon', className: "text-lg xs:text-xl sm:text-2xl flex-shrink-0" }, '⚠️'),
          React.createElement('p', { key: 'message', className: "text-red-200 font-medium text-mobile-base xs:text-sm sm:text-base leading-relaxed" }, error)
        ])),
        React.createElement('div', {
          key: 'form',
          className: "w-full max-w-2xl relative"
        }, [
          React.createElement('div', {
            key: 'form-glow',
            className: "absolute -inset-1 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-cyan-600/20 rounded-[2rem] blur-xl opacity-60 animate-pulse"
          }),
          React.createElement('div', {
            key: 'form-container',
            className: "relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-3xl rounded-xl xs:rounded-2xl sm:rounded-[2rem] border-2 border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.3)] p-4 xs:p-6 sm:p-8 lg:p-10 xl:p-12 overflow-hidden touch-padding-md"
          }, [
            React.createElement('div', {
              key: 'form-shimmer',
              className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"
            }),
            React.createElement('h2', {
            key: 'form-title',
            className: "text-mobile-2xl xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-4 xs:mb-5 sm:mb-6 lg:mb-8 text-center text-contrast leading-tight"
          }, 'Create Your Masterpiece'),
          React.createElement('div', {
            key: 'form-fields',
            className: "space-y-4 xs:space-y-5 sm:space-y-6 lg:space-y-8"
          }, [
            React.createElement('div', { key: 'occasion' }, [
              React.createElement('label', {
                key: 'occasion-label',
                className: "block text-mobile-lg xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-6 text-contrast"
              }, "🎉 What's the occasion?"),
              React.createElement('div', {
                key: 'occasion-wrapper',
                className: "relative group"
              }, [
                React.createElement('div', {
                  key: 'occasion-glow',
                  className: "absolute -inset-0.5 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-indigo-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                }),
                React.createElement('select', {
                  key: 'occasion-select',
                  className: "relative w-full p-3 xs:p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-xl xs:rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400/60 focus:bg-slate-700/60 text-white text-mobile-lg xs:text-base sm:text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-indigo-500/20 appearance-none cursor-pointer mobile-optimized",
                value: formData.occasion,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('occasion', e.target.value)
              }, [
                React.createElement('option', { key: 'default', value: "", className: "bg-slate-800 text-slate-300" }, 'Choose your celebration'),
                React.createElement('option', { key: 'birthday', value: "birthday", className: "bg-slate-800 text-white" }, '🎂 Birthday'),
                React.createElement('option', { key: 'anniversary', value: "anniversary", className: "bg-slate-800 text-white" }, '💕 Anniversary'),
                React.createElement('option', { key: 'wedding', value: "wedding", className: "bg-slate-800 text-white" }, '💒 Wedding'),
                React.createElement('option', { key: 'valentine', value: "valentine", className: "bg-slate-800 text-white" }, '❤️ Valentine\'s Day'),
                React.createElement('option', { key: 'graduation', value: "graduation", className: "bg-slate-800 text-white" }, '🎓 Graduation'),
                React.createElement('option', { key: 'promotion', value: "promotion", className: "bg-slate-800 text-white" }, '🚀 Promotion'),
                React.createElement('option', { key: 'retirement', value: "retirement", className: "bg-slate-800 text-white" }, '🏖️ Retirement'),
                React.createElement('option', { key: 'newbaby', value: "newbaby", className: "bg-slate-800 text-white" }, '👶 New Baby'),
                React.createElement('option', { key: 'mothersday', value: "mothersday", className: "bg-slate-800 text-white" }, '🌸 Mother\'s Day'),
                React.createElement('option', { key: 'fathersday', value: "fathersday", className: "bg-slate-800 text-white" }, '👔 Father\'s Day'),
                React.createElement('option', { key: 'christmas', value: "christmas", className: "bg-slate-800 text-white" }, '🎄 Christmas'),
                React.createElement('option', { key: 'newyear', value: "newyear", className: "bg-slate-800 text-white" }, '🥂 New Year'),
                React.createElement('option', { key: 'thanksgiving', value: "thanksgiving", className: "bg-slate-800 text-white" }, '🦃 Thanksgiving'),
                React.createElement('option', { key: 'apology', value: "apology", className: "bg-slate-800 text-white" }, '🙏 Apology'),
                React.createElement('option', { key: 'thankyou', value: "thankyou", className: "bg-slate-800 text-white" }, '🙌 Thank You'),
                React.createElement('option', { key: 'justtobecause', value: "justtobecause", className: "bg-slate-800 text-white" }, '💝 Just Because')
                ]),
                React.createElement('div', {
                  key: 'occasion-arrow',
                  className: "absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none"
                }, React.createElement('div', {
                  className: "w-3 h-3 border-r-2 border-b-2 border-indigo-300 transform rotate-45"
                }))
              ])
            ]),
            React.createElement('div', {
              key: 'names',
              className: "grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 lg:gap-8"
            }, [
              React.createElement('div', { key: 'recipient' }, [
                React.createElement('label', {
                  key: 'recipient-label',
                  className: "block text-mobile-lg xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-6 text-contrast"
                }, "💫 Who's this for?"),
                React.createElement('div', {
                  key: 'recipient-wrapper',
                  className: "relative group"
                }, [
                  React.createElement('div', {
                    key: 'recipient-glow',
                    className: "absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-blue-600/30 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"
                  }),
                  React.createElement('input', {
                    key: 'recipient-input',
                    type: "text",
                    className: "relative w-full p-3 xs:p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-xl xs:rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400/60 focus:bg-slate-700/60 text-white text-mobile-lg xs:text-base sm:text-lg placeholder-slate-300 shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-blue-500/20 mobile-optimized",
                  placeholder: "Sarah, Mom, John, Alex...",
                  value: formData.recipient,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient', e.target.value)
                  })
                ])
              ]),
              React.createElement('div', { key: 'relationship' }, [
                React.createElement('label', {
                  key: 'relationship-label',
                  className: "block text-mobile-lg xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-6 text-contrast"
                }, "❤️ Your relationship"),
                React.createElement('div', {
                  key: 'relationship-wrapper',
                  className: "relative group"
                }, [
                  React.createElement('div', {
                    key: 'relationship-glow',
                    className: "absolute -inset-0.5 bg-gradient-to-r from-pink-600/30 via-rose-600/30 to-pink-600/30 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"
                  }),
                  React.createElement('input', {
                    key: 'relationship-input',
                    type: "text",
                    className: "relative w-full p-3 xs:p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-xl xs:rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-pink-400/30 focus:border-pink-400/60 focus:bg-slate-700/60 text-white text-mobile-lg xs:text-base sm:text-lg placeholder-slate-300 shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-pink-500/20 mobile-optimized",
                  placeholder: "wife, friend, daughter, partner...",
                  value: formData.relationship,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('relationship', e.target.value)
                  })
                ])
              ])
            ]),
            React.createElement('div', { key: 'genre' }, [
              React.createElement('label', {
                key: 'genre-label',
                className: "block text-mobile-lg xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-3 xs:mb-4 sm:mb-6 text-contrast"
              }, "🎵 Music style"),
              React.createElement('div', {
                key: 'genre-wrapper',
                className: "relative group"
              }, [
                React.createElement('div', {
                  key: 'genre-glow',
                  className: "absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                }),
                React.createElement('select', {
                  key: 'genre-select',
                  className: "relative w-full p-3 xs:p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-xl xs:rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400/60 focus:bg-slate-700/60 text-white text-mobile-lg xs:text-base sm:text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-purple-500/20 appearance-none cursor-pointer mobile-optimized",
                value: formData.genre,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('genre', e.target.value)
               }, [
                 React.createElement('option', { key: 'pop', value: "pop", className: "bg-slate-800 text-white" }, '🎤 Pop'),
                 React.createElement('option', { key: 'acoustic', value: "acoustic", className: "bg-slate-800 text-white" }, '🎸 Acoustic'),
                 React.createElement('option', { key: 'lofi', value: "lofi", className: "bg-slate-800 text-white" }, '🎧 Lo-Fi'),
                 React.createElement('option', { key: 'orchestral', value: "orchestral", className: "bg-slate-800 text-white" }, '🎼 Orchestral'),
                 React.createElement('option', { key: 'hiphop', value: "hiphop", className: "bg-slate-800 text-white" }, '🎯 Hip Hop'),
                 React.createElement('option', { key: 'ballad', value: "ballad", className: "bg-slate-800 text-white" }, '💖 Ballad'),
                 React.createElement('option', { key: 'country', value: "country", className: "bg-slate-800 text-white" }, '🤠 Country'),
                 React.createElement('option', { key: 'rock', value: "rock", className: "bg-slate-800 text-white" }, '🎸 Rock'),
                 React.createElement('option', { key: 'rnb', value: "rnb", className: "bg-slate-800 text-white" }, '✨ R&B'),
                 React.createElement('option', { key: 'jazz', value: "jazz", className: "bg-slate-800 text-white" }, '🎷 Jazz'),
                 React.createElement('option', { key: 'folk', value: "folk", className: "bg-slate-800 text-white" }, '🌾 Folk'),
                 React.createElement('option', { key: 'reggae', value: "reggae", className: "bg-slate-800 text-white" }, '🏝️ Reggae'),
                 React.createElement('option', { key: 'electronic', value: "electronic", className: "bg-slate-800 text-white" }, '⚡ Electronic'),
                 React.createElement('option', { key: 'blues', value: "blues", className: "bg-slate-800 text-white" }, '🎺 Blues'),
                 React.createElement('option', { key: 'indie', value: "indie", className: "bg-slate-800 text-white" }, '🎨 Indie'),
                 React.createElement('option', { key: 'oldschool-rap', value: "oldschool-rap", className: "bg-slate-800 text-white" }, '📻 Old School Rap'),
                 React.createElement('option', { key: 'trap', value: "trap", className: "bg-slate-800 text-white" }, '🔥 Trap'),
                 React.createElement('option', { key: 'afrobeats', value: "afrobeats", className: "bg-slate-800 text-white" }, '🌍 Afrobeats'),
                 React.createElement('option', { key: 'latin', value: "latin", className: "bg-slate-800 text-white" }, '🎵 Latin'),
                 React.createElement('option', { key: 'gospel', value: "gospel", className: "bg-slate-800 text-white" }, '🙏 Gospel')
                 ]),
                React.createElement('div', {
                  key: 'genre-arrow',
                  className: "absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none"
                }, React.createElement('div', {
                  className: "w-3 h-3 border-r-2 border-b-2 border-purple-300 transform rotate-45"
                }))
              ])
            ]),
            React.createElement('div', { key: 'voice' }, [
              React.createElement('div', {
                key: 'voice-container',
                className: "relative"
              }, React.createElement(VoiceSelector, {
                selectedVoiceId: formData.selectedVoiceId,
                selectedVoiceCategory: formData.selectedVoiceCategory,
                onVoiceSelect: (voiceId: string, category: string) => {
                  const newFormData = {
                    ...formData,
                    selectedVoiceId: voiceId,
                    selectedVoiceCategory: category
                  }
                  setFormData(newFormData)
                  
                  const isValid = 
                    newFormData.occasion.length > 0 &&
                    newFormData.recipient.length > 0 &&
                    newFormData.relationship.length > 0 &&
                    newFormData.story.length >= 200 &&
                    newFormData.selectedVoiceId.length > 0
                  
                  setIsFormValid(isValid)
                }
                }))
            ]),
            React.createElement('div', { key: 'story' }, [
              React.createElement('div', {
                key: 'story-header',
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 xs:gap-3 mb-3 xs:mb-4 sm:mb-6"
              }, [
                React.createElement('label', {
                  key: 'story-label',
                  className: "text-mobile-lg xs:text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent text-contrast"
                }, '📝 Share your story'),
                React.createElement('span', {
                  key: 'counter',
                  className: `text-mobile-sm xs:text-xs sm:text-sm font-medium px-2 xs:px-3 py-1 rounded-full backdrop-blur-sm ${formData.story.length >= 200 ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`
                }, `${formData.story.length}/500`)
              ]),
              React.createElement('div', {
                key: 'story-container',
                className: "relative group"
              }, [
                React.createElement('div', {
                  key: 'story-glow',
                  className: "absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 rounded-3xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"
                }),
                React.createElement('textarea', {
                  key: 'story-textarea',
                  className: "relative w-full h-32 xs:h-36 sm:h-40 lg:h-48 p-3 xs:p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-xl xs:rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-amber-400/30 focus:border-amber-400/60 focus:bg-slate-700/60 text-white text-mobile-base xs:text-sm sm:text-base lg:text-lg placeholder-slate-300 resize-none shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-amber-500/20 leading-relaxed mobile-optimized",
                  placeholder: "Tell us about this special moment, person, or memory that means so much to you. The more heartfelt details you share, the more personalized your song will be...",
                  value: formData.story,
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('story', e.target.value),
                  maxLength: 500
                })
              ]),
              React.createElement('div', {
                key: 'story-helper',
                className: `mt-3 xs:mt-4 text-mobile-sm xs:text-xs sm:text-sm flex items-center gap-2 px-3 xs:px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${formData.story.length >= 200 ? 'bg-green-500/10 text-green-300 border border-green-400/20' : 'bg-amber-500/10 text-amber-300 border border-amber-400/20'}`
              }, [
                React.createElement('span', {
                  key: 'helper-icon',
                  className: "text-mobile-base xs:text-sm sm:text-base flex-shrink-0"
                }, formData.story.length >= 200 ? '✅' : '⏳'),
                React.createElement('span', {
                  key: 'helper-text'
                }, formData.story.length >= 200 ? 'Perfect! Your story is ready for a beautiful song' : `${200 - formData.story.length} more characters needed for the best results`)
              ])
            ]),
            React.createElement('div', {
              key: 'submit',
              className: "pt-6 xs:pt-8 sm:pt-10 lg:pt-12"
            }, React.createElement('div', {
              className: "relative group"
            }, [
              React.createElement('div', {
                key: 'button-glow',
                className: `absolute -inset-1 rounded-[2rem] opacity-0 transition-opacity duration-500 ${isFormValid && !isGenerating ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-lg group-hover:opacity-30' : ''}`
              }),
              React.createElement('button', {
                key: 'submit-button',
                onClick: handleGenerate,
                disabled: !isFormValid || isGenerating,
                className: `relative w-full py-4 xs:py-5 sm:py-6 lg:py-8 px-6 xs:px-8 sm:px-10 lg:px-12 rounded-xl xs:rounded-2xl sm:rounded-[2rem] font-black text-mobile-lg xs:text-lg sm:text-xl lg:text-2xl transition-all duration-700 transform mobile-optimized ${
                  isFormValid && !isGenerating
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-2xl hover:scale-[1.02] hover:shadow-purple-500/40 active:scale-[0.98] overflow-hidden touch-action-manipulation'
                    : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-slate-400 cursor-not-allowed border-2 border-white/10'
                }`
              }, [
                React.createElement('span', {
                  key: 'button-text',
                  className: "relative z-10 flex items-center justify-center gap-3"
                }, [
                  isGenerating && React.createElement('div', {
                    key: 'spinner',
                    className: "w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  }),
                  React.createElement('span', {
                    key: 'text'
                  }, isGenerating ? 'Creating your masterpiece...' : '✨ Generate My SongGram')
                ]),
                isFormValid && !isGenerating && React.createElement('div', {
                  key: 'button-shimmer',
                  className: "absolute inset-0 -top-2 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                }, React.createElement('div', {
                  className: "w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                }))
              ])
            ]))
          ])
        ])
      ])
    ])
    ])
  }

  if (currentStep === 'generating') {
    return React.createElement('div', {
      className: "min-h-screen min-h-[-webkit-fill-available] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-3 xs:px-4 sm:px-6 safe-area-all no-bounce mobile-optimized"
    }, React.createElement('div', {
      className: "text-center max-w-2xl mx-auto touch-padding-md"
    }, [
      React.createElement('h1', {
        key: 'title',
        className: "text-mobile-4xl xs:text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4 xs:mb-5 sm:mb-6 text-contrast"
      }, 'SongGram'),
      React.createElement('h2', {
        key: 'subtitle',
        className: "text-mobile-xl xs:text-xl sm:text-2xl lg:text-4xl font-bold mb-6 xs:mb-7 sm:mb-8 text-contrast"
      }, 'Crafting your masterpiece...'),
      React.createElement('div', {
        key: 'progress-container',
        className: "bg-white/10 backdrop-blur-xl rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 mb-6 xs:mb-7 sm:mb-8 mobile-optimized"
      }, [
        React.createElement('div', {
          key: 'spinner',
          className: "w-16 h-16 mx-auto mb-6"
        }, React.createElement('div', {
          className: "w-full h-full border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"
        })),
        React.createElement('p', {
          key: 'progress',
          className: "text-lg sm:text-xl text-gray-200 mb-4 leading-relaxed"
        }, progressMessage || 'AI is composing your personalized song'),
        React.createElement('div', {
          key: 'timing-info',
          className: "text-sm text-purple-200 bg-purple-900/30 rounded-xl p-4 border border-purple-400/20"
        }, [
          React.createElement('p', {
            key: 'timing-text',
            className: "flex items-center justify-center gap-2"
          }, [
            React.createElement('span', { key: 'clock', className: "text-base" }, '⏱️'),
            React.createElement('span', { key: 'time' }, 'Typical generation time: 45-90 seconds')
          ])
        ])
      ]),
      React.createElement('div', {
        key: 'tips',
        className: "text-sm text-gray-400 space-y-2"
      }, [
        React.createElement('p', {
          key: 'tip1'
        }, '🎵 Your AI composer is working on lyrics, melody, and vocal performance'),
        React.createElement('p', {
          key: 'tip2'
        }, '🎤 Creating personalized vocals with your selected voice'),
        React.createElement('p', {
          key: 'tip3'
        }, '✨ Please keep this tab open while your song generates')
      ])
    ]))
  }

  if (currentStep === 'complete' && songResult) {
    return React.createElement('div', {
      className: "min-h-screen min-h-[-webkit-fill-available] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white safe-area-all no-bounce mobile-optimized"
    }, React.createElement('div', {
      className: "container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8"
    }, React.createElement('div', {
      className: "max-w-4xl mx-auto text-center touch-padding-md"
    }, [
      React.createElement('h1', {
        key: 'title',
        className: "text-mobile-4xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3 xs:mb-4 text-contrast"
      }, 'SongGram'),
      React.createElement('h2', {
        key: 'subtitle',
        className: "text-mobile-2xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 xs:mb-5 sm:mb-6 text-contrast"
      }, 'Your masterpiece is ready!'),
      (songResult.audioUrl || songResult.audioData || songResult.songId) && React.createElement('div', {
        key: 'audio',
        className: "bg-white/10 backdrop-blur-xl rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 mb-6 xs:mb-7 sm:mb-8 mobile-optimized"
      }, React.createElement('audio', {
        controls: true,
        className: "w-full mb-2 xs:mb-3 sm:mb-4 audio-player",
        src: (() => {
          let audioSrc = '#'
          if (songResult.audioData) {
            audioSrc = `data:audio/mpeg;base64,${songResult.audioData}`
            console.log('🎵 [HOMEPAGE] Using base64 audio data')
          } else if (songResult.audioUrl && songResult.audioUrl !== '' && !songResult.audioUrl.includes('elevenlabs')) {
            audioSrc = songResult.audioUrl
            console.log('🔗 [HOMEPAGE] Using external audio URL:', songResult.audioUrl)
          } else if (songResult.songId) {
            audioSrc = `/api/audio?songId=${songResult.songId}`
            console.log('🎯 [HOMEPAGE] Using audio proxy endpoint:', audioSrc)
          } else {
            console.warn('⚠️ [HOMEPAGE] No valid audio source available')
          }
          return audioSrc
        })(),
        preload: "metadata",
        controlsList: "nodownload noremoteplayback",
        style: { minHeight: '54px' }
      })),
      React.createElement('div', {
        key: 'actions',
        className: "flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center items-center max-w-md mx-auto"
      }, [
        React.createElement('button', {
          key: 'reset',
          onClick: resetForm,
          className: "w-full xs:w-auto py-3 xs:py-4 px-6 xs:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 rounded-xl xs:rounded-2xl font-bold text-mobile-base xs:text-base sm:text-lg transition-all duration-300 hover:scale-105 mobile-optimized touch-action-manipulation"
        }, 'Create Another SongGram'),
        songResult.audioUrl ? React.createElement('a', {
          key: 'download',
          href: songResult.audioUrl,
          download: `songgram-for-${formData.recipient}.mp3`,
          className: "w-full xs:w-auto py-3 xs:py-4 px-6 xs:px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 active:scale-95 rounded-xl xs:rounded-2xl font-bold text-mobile-base xs:text-base sm:text-lg transition-all duration-300 hover:scale-105 mobile-optimized touch-action-manipulation text-center no-underline"
        }, '📥 Download Song') : React.createElement('div', {
          key: 'demo-message',
          className: "py-4 px-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl text-center max-w-md mx-auto"
        }, [
          React.createElement('h3', {
            key: 'demo-title',
            className: "font-bold text-lg mb-2"
          }, '🎵 Demo Mode'),
          React.createElement('p', {
            key: 'demo-text',
            className: "text-sm text-slate-200"
          }, songResult.audioMessage || 'Song generation completed! In production mode, you would receive a downloadable MP3 file.')
        ])
      ])
    ])))
  }

  return null
}