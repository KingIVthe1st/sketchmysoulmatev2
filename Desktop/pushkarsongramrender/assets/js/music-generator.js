// Music Generator API Integration
class MusicGenerator {
  constructor() {
    this.apiUrl = 'https://jsonplaceholder.typicode.com'; // Temporary - will update when backend is ready
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

      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For demo, use a sample audio file or create a simple beep
      const demoAudio = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBEOl4vy8ciMFBX/M8+iaGgwWaa/t559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBEOl4vy8ciMFBX/M8+iaGgwWaP/8dFRaYlBRUkJPVVCZlZ1RQVFG5cHGIQK3VVTi3f3ndZCKnM5Qyj3mvZkqHnHsQUvtxU2lHR2qjJWN1PG6zq1QVFRaYlBRUkJPVV5ZHXLsQUvtxU2lHR2qjJWN1PG6zq1QVF//'

      console.log('Music generated successfully (demo mode)');
      
      // Set up audio player with demo audio
      audioPlayer.src = demoAudio;
      audioContainer.style.display = 'block';
      
      // Show success message
      this.showSuccess(`Demo: Music generated for "${prompt}"! This is a sample - Eleven Labs backend is deploying.`);

    } catch (error) {
      console.error('Error generating music:', error);
      this.showError('Demo mode active. Eleven Labs backend is still deploying. Please try again in a few minutes.');
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