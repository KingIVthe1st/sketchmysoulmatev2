// Voice selection and management system
export interface VoiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}


export class VoiceSelector {
  private categories: VoiceCategory[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clear, articulate voices for formal occasions',
      color: '#3b82f6'
    },
    {
      id: 'warm',
      name: 'Warm & Friendly',
      description: 'Gentle, approachable voices for personal messages',
      color: '#10b981'
    },
    {
      id: 'energetic',
      name: 'Energetic',
      description: 'Dynamic, enthusiastic voices for celebrations',
      color: '#f59e0b'
    },
    {
      id: 'calm',
      name: 'Calm & Soothing',
      description: 'Peaceful, reassuring voices for emotional moments',
      color: '#8b5cf6'
    },
    {
      id: 'fun',
      name: 'Fun & Playful',
      description: 'Lighthearted, entertaining voices for casual occasions',
      color: '#ef4444'
    }
  ];

  // Static method to get voice categories
  static getVoiceCategories(): VoiceCategory[] {
    const instance = new VoiceSelector();
    return instance.getCategories();
  }


  // Static method to get the best voice for a category
  static getBestVoiceForCategory(voices: any[], categoryId: string): any | null {
    if (!voices.length) return null;

    const filtered = voices.filter(voice => {
      const labels = voice.labels || {};
      switch (categoryId) {
        case 'romantic':
        case 'warm':
          return labels.gender === 'female' || labels.age === 'middle aged';
        case 'uplifting':
        case 'energetic':
          return labels.age === 'young' || labels.gender === 'male';
        case 'calm':
          return labels.age === 'middle aged' || labels.age === 'mature';
        case 'professional':
          return labels.age === 'middle aged' || labels.gender === 'female';
        default:
          return true;
      }
    });

    return filtered.length > 0 ? filtered[0] : voices[0];
  }

  getCategories(): VoiceCategory[] {
    return this.categories;
  }

  getCategoryById(id: string): VoiceCategory | undefined {
    return this.categories.find(cat => cat.id === id);
  }
}