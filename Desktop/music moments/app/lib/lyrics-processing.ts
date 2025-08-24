// Lyrics processing and enhancement utilities
export interface LyricsProcessingOptions {
  enhanceLyrics?: boolean;
  addRhymeSuggestions?: boolean;
  improveFlow?: boolean;
  matchVibe?: string;
  targetLength?: number;
}

export interface ProcessedLyrics {
  original: string;
  enhanced: string;
  suggestions: string[];
  rhymeWords: string[];
  structure: {
    verses: string[];
    chorus?: string;
    bridge?: string;
  };
}

export class LyricsProcessor {
  private rhymeDictionary: Map<string, string[]> = new Map([
    ['love', ['above', 'glove', 'dove', 'shove']],
    ['heart', ['start', 'part', 'smart', 'art']],
    ['dream', ['team', 'cream', 'beam', 'seem']],
    ['time', ['rhyme', 'climb', 'sublime', 'chime']],
    ['night', ['light', 'sight', 'bright', 'fight']],
    ['day', ['way', 'say', 'play', 'stay']],
    ['life', ['wife', 'knife', 'strife', 'rife']],
    ['soul', ['whole', 'role', 'goal', 'toll']],
    ['fire', ['desire', 'higher', 'wire', 'tire']],
    ['wind', ['mind', 'kind', 'find', 'blind']]
  ]);

  async processLyrics(lyrics: string, options: LyricsProcessingOptions = {}): Promise<ProcessedLyrics> {
    const lines = lyrics.split('\n').filter(line => line.trim());
    const processed: ProcessedLyrics = {
      original: lyrics,
      enhanced: lyrics,
      suggestions: [],
      rhymeWords: [],
      structure: {
        verses: []
      }
    };

    // Analyze structure
    this.analyzeStructure(lines, processed);

    // Find rhyme words
    processed.rhymeWords = this.findRhymeWords(lines);

    // Enhance lyrics if requested
    if (options.enhanceLyrics) {
      processed.enhanced = await this.enhanceLyrics(lyrics, options);
    }

    // Generate suggestions
    if (options.addRhymeSuggestions) {
      processed.suggestions = this.generateRhymeSuggestions(processed.rhymeWords);
    }

    return processed;
  }

  private analyzeStructure(lines: string[], processed: ProcessedLyrics): void {
    let currentVerse: string[] = [];
    let inChorus = false;
    let chorusLines: string[] = [];

    for (const line of lines) {
      const upperLine = line.toUpperCase().trim();

      if (upperLine.includes('[CHORUS]') || upperLine.includes('(CHORUS)')) {
        if (currentVerse.length > 0) {
          processed.structure.verses.push(currentVerse.join('\n'));
          currentVerse = [];
        }
        inChorus = true;
        continue;
      }

      if (upperLine.includes('[VERSE') || upperLine.includes('(VERSE')) {
        if (inChorus && chorusLines.length > 0) {
          processed.structure.chorus = chorusLines.join('\n');
          chorusLines = [];
          inChorus = false;
        }
        if (currentVerse.length > 0) {
          processed.structure.verses.push(currentVerse.join('\n'));
        }
        currentVerse = [];
        continue;
      }

      if (upperLine.includes('[BRIDGE]') || upperLine.includes('(BRIDGE)')) {
        if (currentVerse.length > 0) {
          processed.structure.verses.push(currentVerse.join('\n'));
          currentVerse = [];
        }
        continue;
      }

      if (inChorus) {
        chorusLines.push(line);
      } else {
        currentVerse.push(line);
      }
    }

    // Add remaining content
    if (inChorus && chorusLines.length > 0) {
      processed.structure.chorus = chorusLines.join('\n');
    } else if (currentVerse.length > 0) {
      processed.structure.verses.push(currentVerse.join('\n'));
    }
  }

  private findRhymeWords(lines: string[]): string[] {
    const rhymeWords: string[] = [];
    const words = lines.join(' ').toLowerCase().match(/\b\w+\b/g) || [];

    for (const word of words) {
      if (word.length >= 3 && this.rhymeDictionary.has(word)) {
        rhymeWords.push(word);
      }
    }

    return [...new Set(rhymeWords)]; // Remove duplicates
  }

  private async enhanceLyrics(lyrics: string, options: LyricsProcessingOptions): Promise<string> {
    let enhanced = lyrics;

    // Basic enhancements
    enhanced = this.improveFlow(enhanced);
    enhanced = this.matchVibe(enhanced, options.matchVibe);

    if (options.targetLength && enhanced.length < options.targetLength) {
      enhanced = this.expandLyrics(enhanced, options.targetLength);
    }

    return enhanced;
  }

  private improveFlow(lyrics: string): string {
    const lines = lyrics.split('\n');
    const improved: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Add rhythm improvements
      if (line.length > 0 && !line.endsWith('.')) {
        line += ',';
      }

      improved.push(line);
    }

    return improved.join('\n');
  }

  private matchVibe(lyrics: string, vibe?: string): string {
    if (!vibe) return lyrics;

    const lines = lyrics.split('\n');
    const enhanced: string[] = [];

    for (const line of lines) {
      let enhancedLine = line;

      switch (vibe.toLowerCase()) {
        case 'romantic':
          enhancedLine = enhancedLine.replace(/\b(love|heart|dream)\b/gi, (match) => {
            return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
          });
          break;
        case 'uplifting':
          if (Math.random() > 0.7) {
            enhancedLine += ' yeah!';
          }
          break;
        case 'nostalgic':
          enhancedLine = enhancedLine.replace(/\b(now|today|here)\b/gi, 'back then');
          break;
      }

      enhanced.push(enhancedLine);
    }

    return enhanced.join('\n');
  }

  private expandLyrics(lyrics: string, targetLength: number): string {
    const lines = lyrics.split('\n');
    const expanded: string[] = [];

    for (const line of lines) {
      expanded.push(line);

      // Add descriptive lines occasionally
      if (line.length > 10 && Math.random() > 0.8 && expanded.length < targetLength / 10) {
        const words = line.split(' ');
        if (words.length > 3) {
          const descriptiveLine = `With ${words.slice(0, 2).join(' ').toLowerCase()} in my soul`;
          expanded.push(descriptiveLine);
        }
      }
    }

    return expanded.join('\n');
  }

  private generateRhymeSuggestions(rhymeWords: string[]): string[] {
    const suggestions: string[] = [];

    for (const word of rhymeWords) {
      const rhymes = this.rhymeDictionary.get(word.toLowerCase());
      if (rhymes) {
        suggestions.push(`Try using "${rhymes.slice(0, 3).join('", "')}" to rhyme with "${word}"`);
      }
    }

    return suggestions;
  }

  // Utility method to clean lyrics
  cleanLyrics(lyrics: string): string {
    return lyrics
      .replace(/[^\w\s.,!?\-()&'"]/g, '') // Fixed regex - escaped hyphen
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Get lyrics statistics
  getLyricsStats(lyrics: string): {
    wordCount: number;
    lineCount: number;
    avgWordsPerLine: number;
    uniqueWords: number;
  } {
    const lines = lyrics.split('\n').filter(line => line.trim());
    const words = lyrics.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    return {
      wordCount: words.length,
      lineCount: lines.length,
      avgWordsPerLine: lines.length > 0 ? words.length / lines.length : 0,
      uniqueWords: uniqueWords.size
    };
  }
}