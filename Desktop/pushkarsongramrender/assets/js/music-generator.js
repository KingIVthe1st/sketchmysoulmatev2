// Music Generator API Integration
class MusicGenerator {
  constructor() {
    this.apiUrl = 'https://songgram-backend-clean.onrender.com';
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const generateBtn = document.getElementById('generate-music-btn');
    const promptInput = document.getElementById('music-prompt');
    
    if (generateBtn) {
      generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.generateMusic();
      });
    }

    // Allow Enter key to generate music
    if (promptInput) {
      promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.generateMusic();
        }
      });
    }
  }

  async generateMusic() {
    const promptInput = document.getElementById('music-prompt');
    const generateBtn = document.getElementById('generate-music-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const audioPlayer = document.getElementById('audio-player');
    const audioContainer = document.getElementById('audio-container');

    const prompt = promptInput.value.trim();

    if (!prompt) {
      this.showError('Please enter a music prompt!');
      return;
    }

    // UI State: Loading
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="unicon-loading-alt-animate icon-1 me-1"></i>Generating...';
    loadingSpinner.style.display = 'block';
    this.hideError();
    audioContainer.style.display = 'none';

    try {
      console.log('Generating music for prompt:', prompt);

      // Make real API call to backend
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
        console.log('Music generated successfully with Eleven Labs API');
        
        // Set up audio player with generated audio
        audioPlayer.src = data.audio;
        audioContainer.style.display = 'block';
        
        // Show success message
        this.showSuccess(`Music generated successfully for "${prompt}"! Generated with Eleven Labs AI.`);
      } else {
        throw new Error(data.error || 'Failed to generate music');
      }

    } catch (error) {
      console.error('Error generating music:', error);
      this.showError(`Failed to generate music: ${error.message}. Please try again.`);
    } finally {
      // UI State: Reset
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<span>Generate Music</span><i class="icon icon-narrow unicon-arrow-right fw-bold ms-1"></i>';
      loadingSpinner.style.display = 'none';
    }
  }

  showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }

  hideError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }

  showSuccess(message) {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.style.display = 'block';
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    }
  }
}

// Initialize music generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MusicGenerator();
});