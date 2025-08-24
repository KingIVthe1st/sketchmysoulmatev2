// ElevenLabs Music Generation API client
export interface MusicGenerationRequest {
  prompt?: string;
  composition_plan?: any;
  output_format?: string;
}

export interface MusicGenerationResponse {
  audio_url?: string;
  audio_data?: string;
  status?: string;
}

export class ElevenLabsMusicClient {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMusic(request: MusicGenerationRequest): Promise<MusicGenerationResponse> {
    try {
      console.log('🎵 [MUSIC] Generating music with ElevenLabs Music API');
      
      const response = await fetch(`${this.baseUrl}/music`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          output_format: request.output_format || 'mp3_44100_128'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`ElevenLabs Music API error: ${response.status} - ${errorText}`);
      }

      // Convert audio response to base64
      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

      console.log('✅ [MUSIC] Music generation successful');
      return {
        audio_url: dataUrl,
        status: 'completed',
      };
    } catch (error: any) {
      console.error('❌ [MUSIC] Music generation failed:', error.message);
      throw error;
    }
  }
}

// Factory function
export function getElevenLabsMusicClient(): ElevenLabsMusicClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY environment variable is required');
  }
  
  return new ElevenLabsMusicClient(apiKey);
}