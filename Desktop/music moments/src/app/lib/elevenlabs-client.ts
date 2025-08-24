// ElevenLabs API client for voice generation
export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
}

export interface VoiceGenerationRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export interface VoiceGenerationResponse {
  audio_url?: string;
  generation_id?: string;
  status?: string;
}

export class ElevenLabsClient {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateVoice(request: VoiceGenerationRequest, retries = 2): Promise<VoiceGenerationResponse> {
    let lastError;
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        // Use a more reliable model for better performance
        const modelId = request.model_id || 'eleven_flash_v2_5';
        
        console.log(`🔄 Attempt ${attempt}/${retries + 1} for voice generation`);
        
        const response = await fetch(`${this.baseUrl}/text-to-speech/${request.voice_id}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
            'User-Agent': 'MusicMoments/1.0'
          },
          body: JSON.stringify({
            text: request.text,
            model_id: modelId,
            voice_settings: request.voice_settings || {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        }

        // For server-side, we'll return the audio data as base64
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

        console.log(`✅ Voice generation successful on attempt ${attempt}`);
        return {
          audio_url: dataUrl,
          status: 'completed',
        };
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        // Don't retry on authentication errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw error;
        }
        
        // If this was the last attempt, throw the error
        if (attempt === retries + 1) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    console.error('❌ All retry attempts failed, throwing last error');
    throw lastError;
  }

  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      return [];
    }
  }
}

// Factory function to create and return an ElevenLabsClient instance
export function getElevenLabsClient(): ElevenLabsClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY environment variable is required');
  }
  
  return new ElevenLabsClient(apiKey);
}