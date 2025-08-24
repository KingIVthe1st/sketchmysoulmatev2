# MusicMoments - AI-Powered Song Generator

Turn your personal stories into complete songs with lyrics and vocals using TopMediai AI Music Generator API.

## Features

- 🎵 Generate full songs with vocals from personal stories
- 🎨 Multiple vibes (romantic, uplifting, nostalgic, energetic, cinematic)
- 🎼 Multiple genres (pop, acoustic, lo-fi, orchestral)
- ✍️ Auto-generate lyrics or provide your own
- 🎧 Audio player with download functionality
- 🔄 Regeneration capability (up to 2 times per session)
- 📱 Responsive design with dark mode support

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `.env.local` and add your TopMediai API key:
   ```
   MUSIC_API_KEY=your_topmediai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

This app integrates with TopMediai AI Music Generator API using the following endpoints:

### Primary Endpoints Used:
- **v2 Submit**: [Submit Music Generation Task](https://docs.topmediai.com/api-reference/ai-music-generator/submit-the-music-generation-task)
- **v2 Query**: [Query Music Generation Status](https://docs.topmediai.com/api-reference/ai-music-generator/querying-the-music-generation-status)

### Fallback Endpoints:
- **v1 Music**: [AI Music Generator](https://docs.topmediai.com/api-reference/ai-music-generator/ai-music-generator)
- **v1 Lyrics**: [AI Lyrics Generator](https://docs.topmediai.com/api-reference/ai-music-generator/ai-lyrics)

## Project Structure

```
musicmoments/
├── app/
│   ├── api/
│   │   ├── generate/         # Main song generation endpoint
│   │   ├── lyrics/           # Lyrics generation endpoint
│   │   ├── status/           # Status polling endpoint
│   │   └── generate-one-shot/ # Fallback generation endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── .env.local                # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Routes

### POST /api/generate
Generates a song based on user input:
- Validates form data (story length, profanity filter)
- Builds prompt from user inputs
- Optionally auto-generates lyrics
- Submits to TopMediai v2 API
- Returns songId for status polling

### GET /api/status?songId=:id
Polls for song generation status:
- Queries TopMediai v2 API for completion status
- Returns normalized response with audio URL when complete

### POST /api/lyrics
Generates lyrics from a prompt:
- Used for auto-lyrics generation feature
- Calls TopMediai v1 lyrics endpoint

### POST /api/generate-one-shot
Fallback endpoint for direct generation:
- Uses TopMediai v1 music endpoint
- Returns immediate result (when available)

## Usage

1. **Fill out the form:**
   - Select occasion and relationship details
   - Choose vibe and genre
   - Write your story (200-500 characters)
   - Optionally add custom lyrics or enable auto-generation
   - Optionally add a custom title

2. **Generate your song:**
   - Click "Create Song"
   - Wait for processing (usually under 2 minutes)
   - Song appears with audio player and lyrics

3. **Download and share:**
   - Use the audio player to preview
   - Download the song file
   - Regenerate up to 2 times per session

## Features & Validation

- **Input validation**: Story length (200-500 chars), lyrics length (0-500 chars)
- **Profanity filter**: Basic word filtering before API submission
- **Session limits**: Maximum 2 regenerations per browser session
- **Responsive design**: Works on desktop, tablet, and mobile
- **Error handling**: Graceful error handling with user-friendly messages
- **Status polling**: Real-time updates during song generation
- **Dark mode**: Automatic dark/light theme support

## Technologies Used

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zod** for schema validation
- **TopMediai AI** for music generation

## Development Notes

- All API calls are server-side to protect the API key
- LocalStorage used for tracking generation count
- Polling mechanism handles async song generation
- Error boundaries and loading states provide good UX
- Form validation both client and server-side

## Support

For TopMediai API documentation and support:
- [TopMediai API Docs](https://docs.topmediai.com/)
- [Music Generator API Reference](https://docs.topmediai.com/api-reference/ai-music-generator)

## License

This project is for demonstration purposes. Please ensure you have proper licensing for any commercial use of generated music content.
