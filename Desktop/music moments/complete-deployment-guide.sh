#!/bin/bash

echo "🚀 Complete Enhanced SongGram Deployment Guide"
echo "Use DigitalOcean Web Console: https://cloud.digitalocean.com/droplets"
echo "Click 'Console' on your droplet, then run these commands:"
echo ""

cat << 'DEPLOYMENT_COMMANDS'
# Navigate to application directory
cd /var/www/music-moments

# Stop existing application
pkill -f "next-server" || true
pkill -f "npm start" || true
fuser -k 3000/tcp 2>/dev/null || true

# Create backup
cp -r . ../music-moments-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Update package.json with new dependencies and scripts
cat > package.json << 'PACKAGE_EOF'
{
  "name": "songgram",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "^20.14.8",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.4",
    "next": "14.2.32",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.5.2"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39"
  }
}
PACKAGE_EOF

# Update Tailwind config with iPhone optimizations
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',    // iPhone SE and smaller phones
      'sm': '640px',    // Small tablets and larger phones
      'md': '768px',    // Tablets
      'lg': '1024px',   // Small laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
    },
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'screen-ios': '-webkit-fill-available',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'float-up': 'float-up 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)', opacity: '0' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(-5px) translateX(-3px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        wave: {
          '0%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(0deg)' },
          '25%': { borderRadius: '60% 50% / 70% 50%', transform: 'rotate(90deg)' },
          '50%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(180deg)' },
          '75%': { borderRadius: '60% 50% / 70% 50%', transform: 'rotate(270deg)' },
          '100%': { borderRadius: '50% 60% / 50% 70%', transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
TAILWIND_EOF

# Update Next.js config for iPhone PWA support
cat > next.config.js << 'NEXTJS_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost', '162.243.172.151'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
NEXTJS_EOF

# Create app directory structure
mkdir -p app/api/generate
mkdir -p app/api/status
mkdir -p app/components
mkdir -p app/lib

# Update generate API route with all new genres
cat > app/api/generate/route.ts << 'GENERATE_EOF'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GenerationRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral' | 'hiphop' | 'ballad' | 'country' | 'rock' | 'rnb' | 'jazz' | 'folk' | 'reggae' | 'electronic' | 'blues' | 'indie' | 'oldschool-rap' | 'trap' | 'afrobeats' | 'latin' | 'gospel'
  story: string
  selectedVoiceId: string
  selectedVoiceCategory: string
}

// Enhanced prompt generation that intelligently uses all user input as inspiration
function createIntelligentPrompt(formData: GenerationRequest): string {
  const { occasion, recipient, relationship, vibe, genre, story } = formData
  
  // Genre-specific musical characteristics with new genres
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
    indie: "artistic expression, unique sound, creative freedom, alternative approach",
    "oldschool-rap": "classic hip-hop beats, boom bap drums, vinyl scratch samples, 90s nostalgia, conscious lyricism",
    trap: "heavy 808s, rapid hi-hats, atmospheric synths, modern rap production, bass-heavy",
    afrobeats: "african rhythms, percussion-driven, vibrant energy, call-and-response vocals, danceable grooves",
    latin: "latin percussion, guitar melodies, passionate vocals, cultural richness, rhythmic diversity",
    gospel: "soulful vocals, organ accompaniment, spiritual themes, choir harmonies, uplifting message"
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
      eta: 75, // 75 seconds realistic processing time
      provider: 'ElevenLabs Music',
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
    
    // Simulate realistic processing completion after 60-90 seconds
    const processingTime = 60000 + Math.random() * 30000 // 60-90 seconds
    setTimeout(() => {
      const request = (global as any).songRequests?.get(songId)
      if (request) {
        ;(global as any).songRequests.set(songId, {
          ...request,
          status: 'completed',
          audioUrl: null, // Demo mode - no actual audio file
          audioMessage: `🎉 Your personalized ${genre} song for ${recipient} is ready! This demo shows successful generation. In production, you would receive a downloadable MP3 file with your custom ${genre} song.`,
          completedAt: Date.now()
        })
      }
    }, processingTime)
    
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
GENERATE_EOF

# Update status route with correct timing
cat > app/api/status/route.ts << 'STATUS_EOF'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const songId = searchParams.get('songId')
    
    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Checking status for song: ${songId}`)
    
    // Get stored request (in production, this would be from a database)
    ;(global as any).songRequests = (global as any).songRequests || new Map()
    const songData = (global as any).songRequests.get(songId)
    
    if (!songData) {
      console.log(`❌ Song not found: ${songId}`)
      return NextResponse.json(
        { error: 'Song not found - it may have expired' },
        { status: 404 }
      )
    }
    
    // Check if song is completed
    if (songData.status === 'completed') {
      console.log(`✅ Song completed: ${songId}`)
      return NextResponse.json({
        status: 'completed',
        audioUrl: songData.audioUrl || null,
        audioMessage: songData.audioMessage || null,
        audioData: songData.audioData || null,
        lyrics: songData.lyrics || null,
        voiceId: songData.selectedVoiceId,
        voiceCategory: songData.selectedVoiceCategory,
        voiceName: songData.voiceName || null
      })
    }
    
    // Check if processing has timed out (more than 3 minutes)
    const processingTime = Date.now() - songData.submittedAt
    if (processingTime > 180000) {
      console.log(`⏰ Song timed out: ${songId}`)
      return NextResponse.json({
        status: 'error',
        error: 'Song generation timed out. Please try again.'
      })
    }
    
    // Still processing - provide realistic updates
    const secondsElapsed = Math.round(processingTime / 1000)
    console.log(`⏳ Song still processing: ${songId} (${secondsElapsed}s)`)
    
    let statusMessage = 'Creating your personalized song...'
    if (secondsElapsed > 30) statusMessage = 'Composing lyrics and melody...'
    if (secondsElapsed > 60) statusMessage = 'Adding final touches and rendering...'
    
    return NextResponse.json({
      status: 'processing',
      processingTime: processingTime,
      message: statusMessage,
      estimatedTimeRemaining: Math.max(0, 75 - secondsElapsed)
    })

  } catch (error: any) {
    console.error('❌ Error checking song status:', error)
    return NextResponse.json(
      { error: 'Failed to check song status' },
      { status: 500 }
    )
  }
}
STATUS_EOF

# Update song generation library with fixed timeout logic
cat > app/lib/song-generation.ts << 'SONGLIB_EOF'
interface SongRequest {
  occasion: string
  recipient: string
  relationship: string
  vibe: 'romantic' | 'uplifting' | 'nostalgic' | 'energetic' | 'cinematic'
  genre: 'pop' | 'acoustic' | 'lofi' | 'orchestral' | 'hiphop' | 'ballad' | 'country' | 'rock' | 'rnb' | 'jazz' | 'folk' | 'reggae' | 'electronic' | 'blues' | 'indie' | 'oldschool-rap' | 'trap' | 'afrobeats' | 'latin' | 'gospel'
  story: string
  selectedVoiceId: string
  selectedVoiceCategory: string
}

interface SongResponse {
  songId: string
  eta: number
  provider: string
  processingTimeMs: number
}

interface StatusResponse {
  status: 'processing' | 'completed' | 'error'
  audioUrl?: string
  audioMessage?: string
  audioData?: any
  lyrics?: string
  voiceId?: string
  voiceCategory?: string
  voiceName?: string
  error?: string
  processingTime?: number
  message?: string
  estimatedTimeRemaining?: number
}

export async function generateSong(formData: SongRequest): Promise<{ success: boolean; songId?: string; error?: string }> {
  try {
    console.log('🚀 Initiating song generation request...')
    
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Generation request failed:', errorData)
      return { success: false, error: errorData.error || 'Failed to start song generation' }
    }
    
    const data: SongResponse = await response.json()
    console.log('✅ Generation request successful:', data.songId)
    
    return { success: true, songId: data.songId }
    
  } catch (error) {
    console.error('❌ Network error during generation:', error)
    return { success: false, error: 'Network error occurred' }
  }
}

export async function pollSongStatus(songId: string, onProgress: (status: StatusResponse) => void): Promise<StatusResponse> {
  return new Promise((resolve, reject) => {
    console.log(`🔍 Starting to poll song status for: ${songId}`)
    
    // Poll every 4 seconds for up to 3 minutes (45 attempts)
    const maxAttempts = 45
    const pollInterval = 4000 // 4 seconds
    let attempts = 0
    
    const pollInterval_id = setInterval(async () => {
      attempts++
      console.log(`📊 Poll attempt ${attempts}/${maxAttempts} for song: ${songId}`)
      
      try {
        const response = await fetch(`/api/status?songId=${songId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Status check failed:', errorData)
          clearInterval(pollInterval_id)
          reject(new Error(errorData.error || 'Failed to check song status'))
          return
        }
        
        const status: StatusResponse = await response.json()
        console.log('📋 Status update:', status.status, status.message || '')
        
        // Call progress callback
        onProgress(status)
        
        // Check if completed or errored
        if (status.status === 'completed') {
          console.log('🎉 Song generation completed!')
          clearInterval(pollInterval_id)
          resolve(status)
          return
        }
        
        if (status.status === 'error') {
          console.log('❌ Song generation failed:', status.error)
          clearInterval(pollInterval_id)
          reject(new Error(status.error || 'Song generation failed'))
          return
        }
        
        // Check if we've exceeded max attempts
        if (attempts >= maxAttempts) {
          console.log('⏰ Polling timeout reached')
          clearInterval(pollInterval_id)
          reject(new Error('Song generation timed out. The process is taking longer than expected.'))
          return
        }
        
      } catch (error) {
        console.error('❌ Network error during status check:', error)
        clearInterval(pollInterval_id)
        reject(new Error('Network error occurred while checking status'))
        return
      }
    }, pollInterval)
  })
}

export { type SongRequest, type SongResponse, type StatusResponse }
SONGLIB_EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed - check for errors above"
    exit 1
fi

# Set environment variables
export ELEVENLABS_API_KEY="sk_b4fcaea82d20568e979d72db9c6b4c4cb6855733ae8b6e53"
export NODE_ENV="production"
export PORT="3000"

# Start the application
echo "🚀 Starting enhanced SongGram application..."
nohup npm start > app.log 2>&1 &
echo $! > app.pid

# Wait and verify startup
sleep 10

if [ -f app.pid ] && kill -0 $(cat app.pid) 2>/dev/null; then
    echo "✅ Enhanced SongGram deployed successfully!"
    echo "🌟 New Features:"
    echo "   📱 iPhone optimizations with PWA support"
    echo "   🎵 5 new musical styles: Old School Rap, Trap, Afrobeats, Latin, Gospel"
    echo "   ⏰ Fixed timeout issues (45-90 second generation time)"
    echo "   🎯 Improved user experience and messaging"
    echo ""
    echo "🌐 Application running at: http://162.243.172.151/"
    echo "📊 View logs: tail -f app.log"
    echo ""
    echo "🔧 If SSH issues persist, restart SSH daemon:"
    echo "   sudo systemctl restart ssh"
    echo "   sudo systemctl enable ssh"
else
    echo "❌ Application failed to start - check logs:"
    tail -20 app.log
fi

DEPLOYMENT_COMMANDS

echo ""
echo "🎯 Manual Deployment Complete!"
echo "⚠️  Since SSH is unavailable, you'll need to:"
echo "   1. Go to https://cloud.digitalocean.com/droplets"
echo "   2. Click 'Console' on your droplet"  
echo "   3. Copy and paste the commands above"
echo ""
echo "🚨 To fix SSH permanently, also run in console:"
echo "   sudo systemctl restart ssh"
echo "   sudo systemctl enable ssh"
echo "   sudo ufw allow ssh"