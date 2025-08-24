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
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral'
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
        setSongResult(result)
        setCurrentStep('complete')
      } else if (result.status === 'zombie_detected') {
        throw new Error('System detected runaway processes - please refresh the page and try again')
      } else {
        throw new Error(result.error || 'Song generation failed')
      }

    } catch (err: any) {
      setError(err.message || 'Failed to generate song')
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
      className: "min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden"
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
        className: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10 flex flex-col items-center min-h-screen justify-center"
      }, [
        React.createElement('div', {
          key: 'header',
          className: "text-center mb-12 sm:mb-16"
        }, [
          React.createElement('h1', {
            key: 'title',
            className: "text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-4 sm:mb-6 drop-shadow-2xl"
          }, 'SongGram'),
          React.createElement('p', {
            key: 'subtitle',
            className: "text-lg sm:text-xl lg:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto px-4"
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
          className: "max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl"
        }, React.createElement('div', {
          className: "flex items-center"
        }, [
          React.createElement('span', { key: 'icon', className: "text-2xl mr-3" }, '⚠️'),
          React.createElement('p', { key: 'message', className: "text-red-200 font-medium" }, error)
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
            className: "relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-3xl rounded-[2rem] border-2 border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.3)] p-8 sm:p-10 lg:p-12 overflow-hidden"
          }, [
            React.createElement('div', {
              key: 'form-shimmer',
              className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"
            }),
            React.createElement('h2', {
            key: 'form-title',
            className: "text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-6 sm:mb-8 text-center"
          }, 'Create Your Masterpiece'),
          React.createElement('div', {
            key: 'form-fields',
            className: "space-y-6 sm:space-y-8"
          }, [
            React.createElement('div', { key: 'occasion' }, [
              React.createElement('label', {
                key: 'occasion-label',
                className: "block text-lg font-semibold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent mb-6"
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
                  className: "relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400/60 focus:bg-slate-700/60 text-white text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-indigo-500/20 appearance-none cursor-pointer",
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
              className: "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
            }, [
              React.createElement('div', { key: 'recipient' }, [
                React.createElement('label', {
                  key: 'recipient-label',
                  className: "block text-lg font-semibold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-6"
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
                    className: "relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400/60 focus:bg-slate-700/60 text-white text-lg placeholder-slate-300 shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-blue-500/20",
                  placeholder: "Sarah, Mom, John, Alex...",
                  value: formData.recipient,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('recipient', e.target.value)
                  })
                ])
              ]),
              React.createElement('div', { key: 'relationship' }, [
                React.createElement('label', {
                  key: 'relationship-label',
                  className: "block text-lg font-semibold bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent mb-6"
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
                    className: "relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-pink-400/30 focus:border-pink-400/60 focus:bg-slate-700/60 text-white text-lg placeholder-slate-300 shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-pink-500/20",
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
                className: "block text-lg font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-6"
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
                  className: "relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400/60 focus:bg-slate-700/60 text-white text-lg shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-purple-500/20 appearance-none cursor-pointer",
                value: formData.genre,
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('genre', e.target.value)
               }, [
                 React.createElement('option', { key: 'pop', value: "pop", className: "bg-slate-800 text-white" }, '🎤 Pop'),
                 React.createElement('option', { key: 'acoustic', value: "acoustic", className: "bg-slate-800 text-white" }, '🎸 Acoustic'),
                 React.createElement('option', { key: 'lofi', value: "lofi", className: "bg-slate-800 text-white" }, '🎧 Lo-Fi'),
                 React.createElement('option', { key: 'orchestral', value: "orchestral", className: "bg-slate-800 text-white" }, '🎼 Orchestral')
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
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6"
              }, [
                React.createElement('label', {
                  key: 'story-label',
                  className: "text-lg font-semibold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent"
                }, '📝 Share your story'),
                React.createElement('span', {
                  key: 'counter',
                  className: `text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm ${formData.story.length >= 200 ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`
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
                  className: "relative w-full h-40 sm:h-48 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl focus:ring-4 focus:ring-amber-400/30 focus:border-amber-400/60 focus:bg-slate-700/60 text-white text-base sm:text-lg placeholder-slate-300 resize-none shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-amber-500/20 leading-relaxed",
                  placeholder: "Tell us about this special moment, person, or memory that means so much to you. The more heartfelt details you share, the more personalized your song will be...",
                  value: formData.story,
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('story', e.target.value),
                  maxLength: 500
                })
              ]),
              React.createElement('div', {
                key: 'story-helper',
                className: `mt-4 text-sm flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 ${formData.story.length >= 200 ? 'bg-green-500/10 text-green-300 border border-green-400/20' : 'bg-amber-500/10 text-amber-300 border border-amber-400/20'}`
              }, [
                React.createElement('span', {
                  key: 'helper-icon',
                  className: "text-base"
                }, formData.story.length >= 200 ? '✅' : '⏳'),
                React.createElement('span', {
                  key: 'helper-text'
                }, formData.story.length >= 200 ? 'Perfect! Your story is ready for a beautiful song' : `${200 - formData.story.length} more characters needed for the best results`)
              ])
            ]),
            React.createElement('div', {
              key: 'submit',
              className: "pt-12"
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
                className: `relative w-full py-6 sm:py-8 px-10 sm:px-12 rounded-[2rem] font-black text-lg sm:text-xl lg:text-2xl transition-all duration-700 transform ${
                  isFormValid && !isGenerating
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-2xl hover:scale-[1.02] hover:shadow-purple-500/40 active:scale-[0.98] overflow-hidden'
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
      className: "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center"
    }, React.createElement('div', {
      className: "text-center"
    }, [
      React.createElement('h1', {
        key: 'title',
        className: "text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4"
      }, 'SongGram'),
      React.createElement('h2', {
        key: 'subtitle',
        className: "text-4xl font-bold mb-6"
      }, 'Crafting your masterpiece...'),
      React.createElement('p', {
        key: 'progress',
        className: "text-2xl text-gray-200 mb-4"
      }, progressMessage || 'AI is composing your personalized song')
    ]))
  }

  if (currentStep === 'complete' && songResult) {
    return React.createElement('div', {
      className: "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    }, React.createElement('div', {
      className: "container mx-auto px-4 py-8"
    }, React.createElement('div', {
      className: "max-w-4xl mx-auto text-center"
    }, [
      React.createElement('h1', {
        key: 'title',
        className: "text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4"
      }, 'SongGram'),
      React.createElement('h2', {
        key: 'subtitle',
        className: "text-4xl font-bold mb-6"
      }, 'Your masterpiece is ready!'),
      (songResult.audioUrl || songResult.audioData) && React.createElement('div', {
        key: 'audio',
        className: "bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8"
      }, React.createElement('audio', {
        controls: true,
        className: "w-full mb-4",
        src: songResult.audioUrl || `data:audio/mp3;base64,${songResult.audioData}`
      })),
      React.createElement('div', {
        key: 'actions',
        className: "flex gap-4 justify-center"
      }, [
        React.createElement('button', {
          key: 'reset',
          onClick: resetForm,
          className: "py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
        }, 'Create Another SongGram'),
        songResult.audioUrl && React.createElement('a', {
          key: 'download',
          href: songResult.audioUrl,
          download: `songgram-for-${formData.recipient}.mp3`,
          className: "py-4 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
        }, 'Download Song')
      ])
    ])))
  }

  return null
}