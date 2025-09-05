// Demo Form Handler
class DemoForm {
  constructor() {
    this.apiUrl = 'https://songgram-backend-clean.onrender.com';
    this.init();
  }

  init() {
    this.bindEvents();
    this.initCharacterCounter();
  }

  bindEvents() {
    const form = document.getElementById('demo-music-form');
    const storyTextarea = document.getElementById('demo-story');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Character counter for story textarea
    if (storyTextarea) {
      storyTextarea.addEventListener('input', () => {
        this.updateCharacterCounter();
      });
    }
  }

  initCharacterCounter() {
    this.updateCharacterCounter();
  }

  updateCharacterCounter() {
    const storyTextarea = document.getElementById('demo-story');
    const counterElement = document.getElementById('demo-story-count');
    
    if (storyTextarea && counterElement) {
      const currentLength = storyTextarea.value.length;
      counterElement.textContent = currentLength;
      
      // Change color when approaching limit
      if (currentLength > 400) {
        counterElement.className = 'text-warning';
      } else if (currentLength >= 500) {
        counterElement.className = 'text-danger';
      } else {
        counterElement.className = 'text-muted';
      }
    }
  }

  async handleFormSubmit() {
    const formData = this.collectFormData();
    
    // Validate form data
    if (!this.validateForm(formData)) {
      return;
    }

    // Generate music prompt from form data
    const musicPrompt = this.generateMusicPrompt(formData);
    
    // Call music generation API
    await this.generateMusic(musicPrompt);
  }

  collectFormData() {
    return {
      occasion: document.getElementById('demo-occasion')?.value || '',
      names: document.getElementById('demo-names')?.value || '',
      relationship: document.getElementById('demo-relationship')?.value || '',
      musicStyle: document.getElementById('demo-music-style')?.value || 'pop',
      story: document.getElementById('demo-story')?.value || ''
    };
  }

  validateForm(formData) {
    const errors = [];
    
    if (!formData.names.trim()) {
      errors.push('Please enter the name(s) of who this song is for.');
    }
    
    if (!formData.relationship.trim()) {
      errors.push('Please specify your relationship to the person(s).');
    }
    
    if (!formData.story.trim()) {
      errors.push('Please share your story to personalize the song.');
    }

    if (formData.story.length < 20) {
      errors.push('Please provide more details in your story (at least 20 characters).');
    }

    if (errors.length > 0) {
      this.showError(errors.join('<br>'));
      return false;
    }

    return true;
  }

  generateMusicPrompt(formData) {
    let prompt = `Create a ${formData.musicStyle} song`;
    
    if (formData.occasion) {
      prompt += ` for a ${formData.occasion}`;
    }
    
    if (formData.names) {
      prompt += ` dedicated to ${formData.names}`;
    }
    
    if (formData.relationship) {
      prompt += ` (my ${formData.relationship})`;
    }
    
    prompt += `. ${formData.story}`;
    
    // Add musical direction based on occasion and style
    if (formData.occasion) {
      switch (formData.occasion) {
        case 'birthday':
          prompt += ' Make it celebratory and joyful with upbeat tempo.';
          break;
        case 'anniversary':
        case 'valentine':
          prompt += ' Make it romantic and heartfelt with emotional melody.';
          break;
        case 'wedding':
          prompt += ' Make it romantic and celebratory with beautiful harmonies.';
          break;
        case 'graduation':
          prompt += ' Make it inspirational and uplifting with triumphant melody.';
          break;
        case 'friendship':
          prompt += ' Make it warm and friendly with feel-good vibes.';
          break;
        case 'apology':
          prompt += ' Make it sincere and gentle with emotional depth.';
          break;
        default:
          prompt += ' Make it heartfelt and meaningful.';
      }
    }

    return prompt;
  }

  async generateMusic(prompt) {
    const generateBtn = document.getElementById('demo-generate-btn');
    const loadingSpinner = document.getElementById('demo-loading-spinner');
    const errorMessage = document.getElementById('demo-error-message');
    const audioPlayer = document.getElementById('demo-audio-player');
    const audioContainer = document.getElementById('demo-audio-container');

    // UI State: Loading
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating...';
    loadingSpinner.style.display = 'block';
    this.hideError();
    this.hideSuccess();
    audioContainer.style.display = 'none';

    try {
      console.log('Generating music for demo form with prompt:', prompt);

      // Make API call to backend
      const response = await fetch(`${this.apiUrl}/api/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          duration: 60
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.audio) {
        console.log('Music generated successfully for demo form');
        
        // Set up audio player with generated audio
        audioPlayer.src = data.audio;
        audioContainer.style.display = 'block';
        
        // Show success message
        this.showSuccess('🎵 Your personalized song has been generated! Listen below and enjoy your musical creation.');
        
        // Scroll to audio player
        audioContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.error || 'Failed to generate music');
      }

    } catch (error) {
      console.error('Error generating music in demo form:', error);
      this.showError(`Failed to generate your song: ${error.message}. Please try again or contact support if the issue persists.`);
    } finally {
      // UI State: Reset
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span>Generate Your Song</span><i class="icon icon-narrow unicon-arrow-right fw-bold ms-2"></i>';
      loadingSpinner.style.display = 'none';
    }
  }

  showError(message) {
    const errorMessage = document.getElementById('demo-error-message');
    if (errorMessage) {
      errorMessage.innerHTML = message;
      errorMessage.style.display = 'block';
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  hideError() {
    const errorMessage = document.getElementById('demo-error-message');
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }

  showSuccess(message) {
    const successMessage = document.getElementById('demo-success-message');
    if (successMessage) {
      successMessage.innerHTML = message;
      successMessage.style.display = 'block';
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 8000);
    }
  }

  hideSuccess() {
    const successMessage = document.getElementById('demo-success-message');
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }
}

// Initialize demo form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DemoForm();
});