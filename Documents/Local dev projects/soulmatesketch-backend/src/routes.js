import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createPaymentIntent } from './payments.js';
import OpenAI from 'openai';

// OpenAI configuration (add your OpenAI API key to environment variables)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Enhanced quiz data storage (in production, use a database)
const orders = new Map();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export function createRouter() {
  const router = express.Router();

  // NUMEROLOGY CALCULATIONS
  function calculateLifePathNumber(birthDate) {
    if (!birthDate) return 1;
    
    try {
      // Parse the birth date properly
      const date = new Date(birthDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      
      // Calculate life path number using proper numerology method
      // First reduce each component separately
      let monthSum = month;
      let daySum = day;
      let yearSum = year;
      
      // Reduce year to single digits
      while (yearSum > 9) {
        yearSum = yearSum.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
      }
      
      // Sum all components
      let sum = monthSum + daySum + yearSum;
      
      // Reduce to single digit (except master numbers 11, 22, 33)
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      }
      
      return sum;
    } catch (error) {
      console.error('Error calculating life path number:', error);
      return 1; // Default fallback
    }
  }

  function calculateDestinyNumber(fullName) {
    if (!fullName) return 7;
    
    const letterValues = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    };
    
    try {
      // Calculate sum of all letters
      let sum = 0;
      const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
      
      for (let char of cleanName) {
        if (letterValues[char]) {
          sum += letterValues[char];
        }
      }
      
      // Reduce to single digit (except master numbers)
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      }
      
      return sum || 7; // Default to 7 if calculation fails
    } catch (error) {
      console.error('Error calculating destiny number:', error);
      return 7; // Default fallback
    }
  }

  function generateNumerologyInsights(lifePathNumber, destinyNumber) {
    const lifePathMeanings = {
      1: "Natural leader with strong independence and pioneering spirit",
      2: "Diplomatic peacemaker with intuitive and cooperative nature", 
      3: "Creative communicator with artistic talents and social charm",
      4: "Practical builder with strong work ethic and organizational skills",
      5: "Free spirit with adventurous nature and love of change",
      6: "Nurturing caretaker with deep sense of responsibility and love",
      7: "Spiritual seeker with analytical mind and mystical insights",
      8: "Ambitious achiever with business acumen and material success",
      9: "Humanitarian with compassionate heart and universal wisdom",
      11: "Intuitive master with spiritual gifts and inspirational leadership",
      22: "Master builder with ability to manifest grand visions",
      33: "Master teacher with advanced spiritual understanding"
    };

    const destinyMeanings = {
      1: "Destined to lead and inspire others through innovation",
      2: "Called to bring harmony and cooperation to relationships",
      3: "Meant to express creativity and bring joy to the world",
      4: "Purpose involves building solid foundations for others",
      5: "Destined to explore and experience life's adventures",
      6: "Called to serve and nurture family and community",
      7: "Purpose involves seeking truth and sharing wisdom",
      8: "Destined for material success and business leadership",
      9: "Called to serve humanity through compassion and healing",
      11: "Meant to inspire others through spiritual insight",
      22: "Destined to create lasting impact through grand projects",
      33: "Called to teach and heal on a global scale"
    };

    return {
      lifePath: {
        number: lifePathNumber,
        meaning: lifePathMeanings[lifePathNumber]
      },
      destiny: {
        number: destinyNumber,
        meaning: destinyMeanings[destinyNumber]
      }
    };
  }

  // ASTROLOGY CALCULATIONS
  function getZodiacSign(birthDate) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();

    const zodiacSigns = [
      { sign: "Capricorn", start: [12, 22], end: [1, 19], element: "Earth", quality: "Cardinal" },
      { sign: "Aquarius", start: [1, 20], end: [2, 18], element: "Air", quality: "Fixed" },
      { sign: "Pisces", start: [2, 19], end: [3, 20], element: "Water", quality: "Mutable" },
      { sign: "Aries", start: [3, 21], end: [4, 19], element: "Fire", quality: "Cardinal" },
      { sign: "Taurus", start: [4, 20], end: [5, 20], element: "Earth", quality: "Fixed" },
      { sign: "Gemini", start: [5, 21], end: [6, 20], element: "Air", quality: "Mutable" },
      { sign: "Cancer", start: [6, 21], end: [7, 22], element: "Water", quality: "Cardinal" },
      { sign: "Leo", start: [7, 23], end: [8, 22], element: "Fire", quality: "Fixed" },
      { sign: "Virgo", start: [8, 23], end: [9, 22], element: "Earth", quality: "Mutable" },
      { sign: "Libra", start: [9, 23], end: [10, 22], element: "Air", quality: "Cardinal" },
      { sign: "Scorpio", start: [10, 23], end: [11, 21], element: "Water", quality: "Fixed" },
      { sign: "Sagittarius", start: [11, 22], end: [12, 21], element: "Fire", quality: "Mutable" }
    ];

    for (let zodiac of zodiacSigns) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;
      
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return zodiac;
      }
    }
    
    return zodiacSigns[0]; // Default to Capricorn if something goes wrong
  }

  function generateAstrologyInsights(zodiacSign, birthTime, birthCity) {
    const signTraits = {
      "Aries": { personality: "Bold, energetic, pioneering", compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"] },
      "Taurus": { personality: "Stable, sensual, determined", compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"] },
      "Gemini": { personality: "Curious, adaptable, communicative", compatibility: ["Libra", "Aquarius", "Aries", "Leo"] },
      "Cancer": { personality: "Nurturing, intuitive, emotional", compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"] },
      "Leo": { personality: "Confident, generous, dramatic", compatibility: ["Aries", "Sagittarius", "Gemini", "Libra"] },
      "Virgo": { personality: "Analytical, practical, perfectionist", compatibility: ["Taurus", "Capricorn", "Cancer", "Scorpio"] },
      "Libra": { personality: "Harmonious, diplomatic, aesthetic", compatibility: ["Gemini", "Aquarius", "Leo", "Sagittarius"] },
      "Scorpio": { personality: "Intense, mysterious, transformative", compatibility: ["Cancer", "Pisces", "Virgo", "Capricorn"] },
      "Sagittarius": { personality: "Adventurous, philosophical, optimistic", compatibility: ["Aries", "Leo", "Libra", "Aquarius"] },
      "Capricorn": { personality: "Ambitious, disciplined, responsible", compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"] },
      "Aquarius": { personality: "Independent, innovative, humanitarian", compatibility: ["Gemini", "Libra", "Aries", "Sagittarius"] },
      "Pisces": { personality: "Compassionate, artistic, intuitive", compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"] }
    };

    return {
      sign: zodiacSign.sign,
      element: zodiacSign.element,
      quality: zodiacSign.quality,
      personality: signTraits[zodiacSign.sign]?.personality || "Unique and special",
      compatibility: signTraits[zodiacSign.sign]?.compatibility || ["All signs"],
      soulmatePrediction: `Your ideal soulmate likely shares your ${zodiacSign.element} element energy or complements it with ${getComplementaryElement(zodiacSign.element)} traits.`
    };
  }

  function getComplementaryElement(element) {
    const complements = {
      "Fire": "Air", 
      "Air": "Fire",
      "Water": "Earth",
      "Earth": "Water"
    };
    return complements[element] || "balanced";
  }

  // AGE CALCULATION
  function calculateSoulmateAge(userBirthDate) {
    const userDate = new Date(userBirthDate);
    const currentDate = new Date();
    let userAge = currentDate.getFullYear() - userDate.getFullYear();
    
    // Adjust for birthday not yet occurred this year
    if (currentDate.getMonth() < userDate.getMonth() || 
        (currentDate.getMonth() === userDate.getMonth() && currentDate.getDate() < userDate.getDate())) {
      userAge--;
    }
    
    // Soulmate is 5 years younger
    return Math.max(18, userAge - 5);
  }

  // OPENAI INTEGRATION
  async function generateSoulmateImage(userPrefs, numerologyData, astrologyData, soulmateAge) {
    console.log('Starting DALL-E image generation...');
    console.log('API Key check:', {
      exists: !!OPENAI_API_KEY,
      type: typeof OPENAI_API_KEY,
      length: OPENAI_API_KEY ? OPENAI_API_KEY.length : 0
    });
    
    // Always use OpenAI DALL-E for production
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
      console.error('OpenAI API key not configured - using temporary fallback');
      // Temporary fallback only for missing API key
      const filename = `soulmate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      const sourcePath = path.join('public', 'images', 'home', 'pencil-generated.jpg');
      const destPath = path.join('uploads', filename);
      
      try {
        await fs.promises.copyFile(sourcePath, destPath);
        return { imagePath: `uploads/${filename}`, isPlaceholder: true };
      } catch (error) {
        return { imagePath: 'images/home/pencil-generated.jpg', isPlaceholder: true };
      }
    }
    
    try {
      const prompt = createImagePrompt(userPrefs, numerologyData, astrologyData, soulmateAge);
      console.log('DALL-E Prompt:', prompt);
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      });
      
      const imageUrl = response.data[0].url;
      console.log('DALL-E image generated successfully:', imageUrl);
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const buffer = await imageResponse.arrayBuffer();
      const filename = `soulmate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      const imagePath = path.join('uploads', filename);
      
      await fs.promises.writeFile(imagePath, Buffer.from(buffer));
      console.log('Image saved to:', imagePath);
      
      return { imagePath: `uploads/${filename}`, isPlaceholder: false };
    } catch (error) {
      console.error('DALL-E generation error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Emergency fallback only if API fails
      const filename = `soulmate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      const sourcePath = path.join('public', 'images', 'home', 'pencil-generated.jpg');
      const destPath = path.join('uploads', filename);
      
      try {
        await fs.promises.copyFile(sourcePath, destPath);
        return { imagePath: `uploads/${filename}`, isPlaceholder: true };
      } catch (copyError) {
        return { imagePath: 'images/home/pencil-generated.jpg', isPlaceholder: true };
      }
    }
  }

  function createImagePrompt(userPrefs, numerologyData, astrologyData, soulmateAge) {
    const genderMap = {
      'female': 'beautiful woman',
      'male': 'handsome man',
      'any': 'attractive person',
      'prefer-not-to-say': 'attractive person'
    };
    
    const baseGender = genderMap[userPrefs.preferred_gender] || 'attractive person';
    
    let prompt = `Ultra-realistic portrait of a ${baseGender}, age ${soulmateAge}, moderate to very attractive, `;
    
    // Add astrological influences
    if (astrologyData) {
      const elementStyles = {
        'Fire': 'warm, confident expression with bright, energetic eyes',
        'Earth': 'grounded, serene expression with kind, steady eyes', 
        'Air': 'intellectual, curious expression with bright, thoughtful eyes',
        'Water': 'intuitive, compassionate expression with deep, emotional eyes'
      };
      prompt += elementStyles[astrologyData.element] + ', ';
    }
    
    // Add physical preferences if provided
    if (userPrefs.hair_color) {
      prompt += `${userPrefs.hair_color} hair, `;
    }
    if (userPrefs.eye_color) {
      prompt += `${userPrefs.eye_color} eyes, `;
    }
    
    // Add personality-based physical traits
    if (userPrefs.personality_traits) {
      const personalityMap = {
        'adventurous': 'athletic build with confident posture',
        'artistic': 'creative styling with expressive features',
        'intellectual': 'thoughtful expression with intelligent eyes',
        'spiritual': 'serene expression with peaceful demeanor',
        'ambitious': 'confident posture with determined expression'
      };
      
      for (let trait in personalityMap) {
        if (userPrefs.personality_traits.toLowerCase().includes(trait)) {
          prompt += personalityMap[trait] + ', ';
        }
      }
    }
    
    // Add celebrity inspiration if provided
    if (userPrefs.celeb) {
      prompt += `subtle inspiration from ${userPrefs.celeb} features, `;
    }
    
    prompt += 'professional studio lighting, high-end portrait photography, perfect skin, stunning features, extremely detailed, 8k resolution';
    
    return prompt;
  }

  // AI-POWERED PERSONALIZED PREDICTIONS GENERATION
  async function generatePersonalizedPredictions(orderData, numerologyData, astrologyData, packageLevel) {
    console.log('Generating AI-powered personalized predictions with GPT-4...');
    
    // Always use OpenAI GPT for production
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
      console.error('OpenAI API key not configured - using basic predictions');
      return {
        basicPredictions: [
          `<strong>A complementary life path</strong> that enhances your spiritual journey`,
          `<strong>Magnetic attraction</strong> based on your astrological compatibility`,
          `<strong>Shared values</strong> that align with your numerological destiny`,
          `<strong>Perfect timing</strong> orchestrated by the universe`,
          `<strong>Deep understanding</strong> of your authentic self`
        ],
        premiumInsight: `Your soulmate connection transcends the physical realm. The universe has been preparing this meeting through multiple lifetimes.`
      };
    }
    
    try {
      // Build comprehensive context for AI
      const context = `
        User Profile:
        - Name: ${orderData.name}
        - Birth Date: ${orderData.birthdate}
        - Seeking: ${orderData.preferences?.preferred_gender || 'any'}
        - Relationship Goals: ${orderData.preferences?.relationship_goals || 'deep connection'}
        - Personality Traits: ${orderData.preferences?.personality_traits || 'not specified'}
        - Interests: ${orderData.preferences?.interests || 'not specified'}
        - Location: ${orderData.preferences?.location || 'not specified'}
        
        Numerology Analysis:
        - Life Path Number: ${numerologyData?.lifePath?.number || 1}
        - Life Path Meaning: ${numerologyData?.lifePath?.meaning || 'Natural leader'}
        - Destiny Number: ${numerologyData?.destiny?.number || 7}
        - Destiny Meaning: ${numerologyData?.destiny?.meaning || 'Seeker of truth'}
        
        Astrology Analysis:
        - Sun Sign: ${astrologyData.sunSign}
        - Element: ${astrologyData.element}
        - Traits: ${astrologyData.traits}
        - Compatible Signs: ${astrologyData.compatibleSigns?.join(', ')}
        
        Package Level: ${packageLevel}
      `;
      
      let systemPrompt = `You are a mystical soulmate advisor creating deeply personalized predictions based on numerology, astrology, and user data. 
        Create unique, specific insights that feel personally crafted for this individual.
        Be mystical yet believable, romantic yet grounded in the data provided.
        Use the numerology and astrology data to create meaningful connections and predictions.`;
      
      let userPrompt = '';
      
      if (packageLevel === 'basic') {
        userPrompt = `Based on the following profile, generate 5 unique, personalized soulmate predictions. 
          Each should be specific to their numerology and astrology.
          Format each as a short, impactful statement.
          ${context}`;
      } else if (packageLevel === 'plus') {
        userPrompt = `Based on the following profile, generate:
          1. 5 unique, personalized soulmate predictions
          2. Location insights about where they might meet their soulmate
          3. Enhanced astrological analysis of their romantic compatibility
          Make everything specific to their numbers and signs.
          ${context}`;
      } else if (packageLevel === 'premium') {
        userPrompt = `Based on the following profile, generate:
          1. 5 unique, deeply personalized soulmate predictions
          2. A profound spiritual insight about their soulmate connection (2-3 paragraphs)
          3. A comprehensive relationship strategy guide including:
             - Optimal meeting times based on their astrology
             - Recognition signs specific to their numerology
             - Approach strategies aligned with their personality
             - Relationship development advice based on their life path
          Make everything deeply specific and personalized.
          ${context}`;
      }
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: packageLevel === 'premium' ? 1500 : packageLevel === 'plus' ? 800 : 500
      });
      
      const aiResponse = completion.choices[0].message.content;
      console.log('AI predictions generated successfully');
      
      // Parse the AI response into structured format
      const lines = aiResponse.split('\n').filter(line => line.trim());
      
      // Extract predictions (first 5 bullet points or numbered items)
      const basicPredictions = [];
      let premiumInsight = '';
      let locationInsight = '';
      let enhancedAstrology = '';
      let strategyGuide = '';
      
      let section = 'predictions';
      for (const line of lines) {
        if (line.toLowerCase().includes('location') && packageLevel !== 'basic') {
          section = 'location';
        } else if (line.toLowerCase().includes('astrolog') && packageLevel !== 'basic') {
          section = 'astrology';
        } else if (line.toLowerCase().includes('spiritual') && packageLevel === 'premium') {
          section = 'spiritual';
        } else if (line.toLowerCase().includes('strategy') && packageLevel === 'premium') {
          section = 'strategy';
        }
        
        if (section === 'predictions' && basicPredictions.length < 5) {
          if (line.match(/^[1-5]\.|^[•\-\*]/)) {
            basicPredictions.push(line.replace(/^[1-5]\.|^[•\-\*]/, '').trim());
          }
        } else if (section === 'location') {
          locationInsight += line + ' ';
        } else if (section === 'astrology') {
          enhancedAstrology += line + ' ';
        } else if (section === 'spiritual') {
          premiumInsight += line + ' ';
        } else if (section === 'strategy') {
          strategyGuide += line + ' ';
        }
      }
      
      // Ensure we have at least 5 predictions
      while (basicPredictions.length < 5) {
        basicPredictions.push(`<strong>Divine connection</strong> aligned with your Life Path ${numerologyData?.lifePath?.number || 1}`);
      }
      
      return {
        basicPredictions: basicPredictions.slice(0, 5),
        premiumInsight: premiumInsight || aiResponse,
        locationInsight: locationInsight,
        enhancedAstrology: enhancedAstrology,
        strategyGuide: strategyGuide
      };
      
    } catch (error) {
      console.error('GPT prediction error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Fallback predictions if API fails
      return {
        basicPredictions: [
          `<strong>Life Path ${numerologyData?.lifePath?.number || 1} Connection</strong>: Your soulmate shares complementary numerological vibrations`,
          `<strong>${astrologyData.sunSign} Magnetic Pull</strong>: The stars align to bring ${astrologyData.compatibleSigns?.[0] || 'compatible'} energy into your life`,
          `<strong>Destiny Number ${numerologyData?.destiny?.number || 7} Alignment</strong>: Your paths are destined to cross at the perfect moment`,
          `<strong>${astrologyData.element} Element Harmony</strong>: Your soulmate brings balance through elemental compatibility`,
          `<strong>Universal Timing</strong>: The cosmos has orchestrated your meeting for maximum spiritual growth`
        ],
        premiumInsight: `As a Life Path ${numerologyData?.lifePath?.number || 1} ${astrologyData?.sunSign || 'soul'}, your soulmate journey is uniquely yours. The universe has been aligning circumstances, preparing both you and your destined partner for the moment of recognition. Your ${astrologyData?.element || 'spiritual'} energy will harmonize perfectly with their complementary vibration, creating a connection that transcends the physical realm.`,
        locationInsight: `Based on your ${astrologyData.element} element, your soulmate likely resides in locations that resonate with ${astrologyData.element.toLowerCase()} energy.`,
        enhancedAstrology: `Your ${astrologyData.sunSign} nature seeks deep compatibility with ${astrologyData.compatibleSigns?.join(', ') || 'aligned signs'}.`,
        strategyGuide: `Trust your Life Path ${numerologyData?.lifePath?.number || 1} intuition when recognizing your soulmate.`
      };
    }
  }

  // PDF REPORT GENERATION
  async function generatePDFReport(orderData, numerologyData, astrologyData, imagePath, packageLevel) {
    // Generate AI-powered personalized predictions
    const personalizedPredictions = await generatePersonalizedPredictions(orderData, numerologyData, astrologyData, packageLevel);
    const reportContent = createReportContent(orderData, numerologyData, astrologyData, packageLevel, personalizedPredictions);
    const filename = `soulmate-report-${orderData.id}-${Date.now()}.pdf`;
    const pdfPath = path.join('uploads', filename);
    
    // For now, create a text file (in production, use a PDF library like puppeteer)
    await fs.promises.writeFile(pdfPath.replace('.pdf', '.txt'), reportContent);
    
    return `uploads/${filename.replace('.pdf', '.txt')}`;
  }

  function createReportContent(orderData, numerologyData, astrologyData, packageLevel, personalizedPredictions) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SoulSketch Mystical Report</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .report-container {
            background: white;
            border-radius: 20px;
            padding: 60px 50px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        .report-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        }
        .header {
            text-align: center;
            margin-bottom: 50px;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            color: #667eea;
            margin: 0 0 10px 0;
            font-weight: 300;
            text-shadow: 0 2px 4px rgba(102,126,234,0.1);
        }
        .header .subtitle {
            color: #718096;
            font-size: 1.1em;
            font-style: italic;
        }
        .section {
            margin-bottom: 40px;
            padding: 30px;
            background: #f7fafc;
            border-radius: 15px;
            border-left: 5px solid #667eea;
        }
        .section h2 {
            color: #4a5568;
            font-size: 1.5em;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section h2::before {
            content: '✨';
            font-size: 1.2em;
        }
        .profile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .profile-item {
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        .profile-item strong {
            color: #667eea;
            display: block;
            margin-bottom: 5px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .number-highlight {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            margin: 20px 0;
            text-shadow: 0 2px 4px rgba(102,126,234,0.2);
        }
        .insight-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
            position: relative;
        }
        .insight-box::before {
            content: '"';
            font-size: 4em;
            position: absolute;
            top: -10px;
            left: 15px;
            opacity: 0.3;
            font-family: serif;
        }
        .prediction-list {
            list-style: none;
            padding: 0;
        }
        .prediction-list li {
            background: white;
            margin: 10px 0;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            position: relative;
        }
        .prediction-list li::before {
            content: '💫';
            margin-right: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #edf2f7;
            color: #718096;
            font-style: italic;
        }
        .premium-badge {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #1a202c;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>Your SoulSketch Mystical Report</h1>
            <div class="subtitle">A Personalized Journey to Your Destined Love</div>
            <div style="margin-top: 15px; color: #a0aec0; font-size: 0.9em;">Generated on ${currentDate}</div>
            ${packageLevel === 'premium' ? '<div class="premium-badge">✨ Premium Report ✨</div>' : 
              packageLevel === 'plus' ? '<div class="premium-badge" style="background: linear-gradient(135deg, #667eea, #764ba2);">✨ Plus Report ✨</div>' : 
              '<div class="premium-badge" style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white;">✨ Basic Report ✨</div>'}
        </div>

        <div class="section">
            <h2>Your Personal Profile</h2>
            <div class="profile-grid">
                <div class="profile-item">
                    <strong>Name</strong>
                    ${orderData.name || 'Spiritual Seeker'}
                </div>
                <div class="profile-item">
                    <strong>Birth Date</strong>
                    ${orderData.birth_date || 'Not provided'}
                </div>
                <div class="profile-item">
                    <strong>Seeking</strong>
                    ${orderData.preferred_gender || 'Soul Connection'}
                </div>
                <div class="profile-item">
                    <strong>Age Preference</strong>
                    ${orderData.age_range || 'Open to destiny'}
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Numerology Insights</h2>
            ${numerologyData?.lifePath?.number ? `
                <div class="number-highlight">Life Path ${numerologyData.lifePath.number}</div>
                <div class="insight-box">
                    ${numerologyData.lifePath.meaning}
                </div>
            ` : '<p style="text-align: center; color: #a0aec0; font-style: italic;">Birth date required for numerology calculation</p>'}
            
            ${numerologyData?.destiny?.number ? `
                <div class="number-highlight">Destiny ${numerologyData.destiny.number}</div>
                <div class="insight-box">
                    ${numerologyData.destiny.meaning}
                </div>
            ` : ''}
        </div>

        <div class="section">
            <h2>Astrological Profile</h2>
            ${astrologyData?.sign ? `
                <div class="profile-grid">
                    <div class="profile-item">
                        <strong>Sun Sign</strong>
                        ${astrologyData.sign}
                    </div>
                    <div class="profile-item">
                        <strong>Element</strong>
                        ${astrologyData.element || 'N/A'}
                    </div>
                </div>
                <div class="insight-box">
                    ${astrologyData.personality || 'Your astrological essence guides your romantic destiny.'}
                </div>
                ${astrologyData.compatibility ? `
                    <div style="margin-top: 20px;">
                        <strong style="color: #667eea;">Most Compatible Signs:</strong>
                        <p style="font-size: 1.1em; color: #4a5568;">${astrologyData.compatibility.join(', ')}</p>
                    </div>
                ` : ''}
            ` : '<p style="text-align: center; color: #a0aec0; font-style: italic;">Birth date required for astrological analysis</p>'}
        </div>

        <div class="section">
            <h2>Soulmate Predictions</h2>
            <p style="font-size: 1.1em; margin-bottom: 25px; color: #4a5568;">Based on your unique numerological and astrological profile, your destined soulmate likely possesses:</p>
            
            <ul class="prediction-list">
                ${personalizedPredictions && personalizedPredictions.basicPredictions 
                  ? personalizedPredictions.basicPredictions.map(prediction => `<li>${prediction}</li>`).join('\n                ')
                  : `<li><strong>A complementary life path</strong> that enhances your spiritual journey</li>
                <li><strong>Magnetic attraction</strong> based on your astrological compatibility</li>
                <li><strong>Shared values</strong> that align with your numerological destiny</li>
                <li><strong>Perfect timing</strong> orchestrated by the universe</li>
                <li><strong>Deep understanding</strong> of your authentic self</li>`
                }
            </ul>
            
            ${(packageLevel === 'plus' || packageLevel === 'premium') ? `
                <div class="insight-box" style="margin-top: 30px;">
                    <h3 style="margin-top: 0; color: #ffd700;">✨ Plus Insight: Location & Enhanced Analysis</h3>
                    <p><strong>Location Insights:</strong> ${personalizedPredictions?.locationInsight || `Your soulmate likely resides in a location that complements your energy - potentially in ${astrologyData?.element === 'Water' ? 'coastal areas or near water bodies' : astrologyData?.element === 'Fire' ? 'vibrant cities or sunny climates' : astrologyData?.element === 'Earth' ? 'grounded communities or nature-rich environments' : astrologyData?.element === 'Air' ? 'intellectual hubs or elevated locations' : 'places that resonate with your soul\'s calling'}.`}</p>
                    <p><strong>Enhanced Astrological Analysis:</strong> ${personalizedPredictions?.enhancedAstrology || (astrologyData?.sign ? `As a ${astrologyData.sign}, your ruling planetary influences suggest your soulmate will have strong ${astrologyData.element} energy characteristics, bringing ${astrologyData.element === 'Fire' ? 'passion and inspiration' : astrologyData.element === 'Earth' ? 'stability and grounding' : astrologyData.element === 'Air' ? 'intellectual stimulation and communication' : 'emotional depth and intuition'} to your connection.` : 'Deep astrological connections will guide you to your perfect match.')}</p>
                </div>
            ` : ''}
            
            ${packageLevel === 'premium' ? `
                <div class="insight-box" style="margin-top: 30px;">
                    <h3 style="margin-top: 0; color: #ffd700;">✨ Premium: Full AI Analysis & Strategy Guide</h3>
                    <p>${personalizedPredictions && personalizedPredictions.premiumInsight 
                      ? personalizedPredictions.premiumInsight
                      : 'Your soulmate connection transcends the physical realm. The universe has been preparing this meeting through multiple lifetimes, aligning your energetic frequencies for the perfect moment of recognition. Trust in divine timing and remain open to unexpected encounters.'
                    }</p>
                    
                    ${personalizedPredictions?.strategyGuide ? `
                    <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                        <h4 style="color: #ffd700; margin-top: 0;">Personal Relationship Strategy Guide:</h4>
                        <div style="color: white;">${personalizedPredictions.strategyGuide}</div>
                    </div>
                    ` : `
                    <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                        <h4 style="color: #ffd700; margin-top: 0;">Personal Relationship Strategy Guide:</h4>
                        <ul style="color: white; margin: 0; padding-left: 20px;">
                            <li><strong>Optimal Meeting Times:</strong> ${astrologyData?.sign ? `During ${astrologyData.sign === 'Aries' || astrologyData.sign === 'Leo' || astrologyData.sign === 'Sagittarius' ? 'summer months and fire season celebrations' : astrologyData.sign === 'Taurus' || astrologyData.sign === 'Virgo' || astrologyData.sign === 'Capricorn' ? 'spring and harvest seasons' : astrologyData.sign === 'Gemini' || astrologyData.sign === 'Libra' || astrologyData.sign === 'Aquarius' ? 'intellectual gatherings and social events' : 'emotional full moons and water-related activities'}` : 'during spiritually significant times aligned with your energy'}</li>
                            <li><strong>Recognition Signs:</strong> You'll feel an immediate sense of "coming home" and notice synchronized life patterns</li>
                            <li><strong>Approach Strategy:</strong> Lead with authenticity and trust your intuitive first impressions</li>
                            <li><strong>Relationship Development:</strong> Focus on spiritual growth together and embrace your complementary life paths</li>
                        </ul>
                    </div>
                    `}
                </div>
            ` : ''}
        </div>

        ${packageLevel === 'premium' ? `
        <div class="section">
            <h2>Complete Cosmic Profile</h2>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #ffd700;">✨ Your Complete Cosmic Blueprint</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <h4 style="color: #ffd700; margin-top: 0;">Soul Contract</h4>
                        <p style="margin: 0;">You've incarnated to ${numerologyData?.lifePath?.number ? `fulfill a Life Path ${numerologyData.lifePath.number} destiny` : 'discover your true spiritual purpose'}, which directly influences your soulmate selection.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <h4 style="color: #ffd700; margin-top: 0;">Karmic Connections</h4>
                        <p style="margin: 0;">${astrologyData?.sign ? `Your ${astrologyData.sign} energy` : 'Your soul signature'} indicates past-life connections that will feel instantly familiar and deeply meaningful.</p>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h4 style="color: #ffd700; margin-top: 0;">Divine Timeline Activation</h4>
                    <p>The cosmos has perfectly orchestrated your paths to intersect. Your soulmate is currently experiencing their own spiritual awakening that will align them with your frequency. Trust that divine timing is already in motion.</p>
                    
                    <div style="margin-top: 15px;">
                        <strong style="color: #ffd700;">Key Activation Periods:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>During major life transitions and personal growth phases</li>
                            <li>When you're authentically expressing your true self</li>
                            <li>In moments of spiritual practice and higher consciousness</li>
                            <li>${astrologyData?.sign ? `During ${astrologyData.sign} season and related astrological events` : 'During spiritually significant celestial alignments'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p>✨ May this reading guide you to your destined love ✨</p>
            <p>Order ID: ${orderData.id}</p>
        </div>
    </div>
</body>
</html>`;

    return content;
  }

  // Basic health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Create order
  router.post('/orders', (req, res) => {
    try {
      const { email, name, gender, preferred_gender, age_range, hair_color, eye_color, 
              personality_traits, hobbies, birth_date, birth_time, birth_city, package: packageType } = req.body;

      const orderId = `order_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`;
      
      const order = {
        id: orderId,
        email: email || '',
        name: name || '',
        gender: gender || '',
        preferred_gender: preferred_gender || 'any',
        age_range,
        hair_color,
        eye_color, 
        personality_traits,
        hobbies,
        birth_date: birth_date || '',
        birth_time: birth_time || '',
        birth_city: birth_city || '',
        package: packageType || 'premium',
        status: 'created',
        created_at: new Date().toISOString()
      };

      orders.set(orderId, order);
      
      console.log('Order created:', order);
      
      res.json({ 
        id: orderId,
        status: 'created',
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Submit intake data
  router.post('/orders/:orderId/intake', upload.single('photo'), (req, res) => {
    try {
      const { orderId } = req.params;
      const order = orders.get(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Parse quiz data
      let quizData = {};
      if (req.body.quiz) {
        try {
          quizData = typeof req.body.quiz === 'string' ? JSON.parse(req.body.quiz) : req.body.quiz;
        } catch (e) {
          quizData = req.body; // Fallback to direct body parsing
        }
      } else {
        quizData = req.body;
      }

      // Update order with quiz data
      Object.assign(order, {
        ...quizData,
        photo_path: req.file ? req.file.path : null,
        intake_submitted: true,
        updated_at: new Date().toISOString()
      });

      orders.set(orderId, order);
      
      console.log('Intake submitted for order:', orderId);
      
      res.json({ 
        status: 'intake_received',
        message: 'Quiz data and photo received successfully'
      });
    } catch (error) {
      console.error('Error processing intake:', error);
      res.status(500).json({ error: 'Failed to process intake data' });
    }
  });

  // Generate soulmate
  router.post('/orders/:orderId/generate', async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = orders.get(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      console.log('Generation requested for order:', orderId);

      // Calculate numerology if birth data available
      let numerologyData = null;
      if (order.birth_date) {
        const lifePathNumber = calculateLifePathNumber(order.birth_date);
        const destinyNumber = calculateDestinyNumber(order.name || 'Unknown');
        numerologyData = generateNumerologyInsights(lifePathNumber, destinyNumber);
      }

      // Calculate astrology if birth data available
      let astrologyData = null;
      if (order.birth_date) {
        const zodiacSign = getZodiacSign(order.birth_date);
        astrologyData = generateAstrologyInsights(zodiacSign, order.birth_time, order.birth_city);
      }

      // Calculate soulmate age
      const soulmateAge = order.birth_date ? calculateSoulmateAge(order.birth_date) : 25;

      // Generate AI image
      const imageResult = await generateSoulmateImage(order, numerologyData, astrologyData, soulmateAge);

      // Generate PDF report
      const pdfPath = await generatePDFReport(order, numerologyData, astrologyData, imageResult.imagePath, order.package);

      // Create profile text
      let profileText = `Your Soulmate Profile:\n\n`;
      
      if (numerologyData) {
        profileText += `Numerology reveals your life path number ${numerologyData.lifePath.number}, indicating ${numerologyData.lifePath.meaning.toLowerCase()}.\n\n`;
      }
      
      if (astrologyData) {
        profileText += `As a ${astrologyData.sign}, your ideal match shares ${astrologyData.element} element compatibility and resonates with your ${astrologyData.personality.toLowerCase()}.\n\n`;
      }
      
      profileText += `Your soulmate is approximately ${soulmateAge} years old and embodies the perfect complement to your spiritual journey.`;

      // Update order
      order.status = 'completed';
      order.generation_completed = true;
      order.image_path = imageResult.imagePath;
      order.pdf_path = pdfPath;
      order.profile_text = profileText;
      order.numerology_data = numerologyData;
      order.astrology_data = astrologyData;
      order.completed_at = new Date().toISOString();
      
      orders.set(orderId, order);

      // Convert image path to API URL
      const imageFilename = path.basename(imageResult.imagePath);
      const imageApiUrl = `/api/images/${imageFilename}`;

      res.json({
        success: true,
        message: 'Generation completed',
        result: {
          sketch_url: imageApiUrl,
          story_url: pdfPath
        },
        status: 'completed',
        imagePath: imageApiUrl,
        pdfPath: pdfPath,
        profileText: profileText,
        numerologyInsights: numerologyData,
        astrologyInsights: astrologyData
      });

    } catch (error) {
      console.error('Error generating soulmate:', error);
      res.status(500).json({ 
        error: 'Failed to generate soulmate sketch',
        details: error.message 
      });
    }
  });

  // Get order status
  router.get('/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.get(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  });

  // Get PDF report for an order
  router.get('/orders/:orderId/report', async (req, res) => {
    console.log('Report endpoint hit for orderId:', req.params.orderId);
    try {
      const { orderId } = req.params;
      const order = orders.get(orderId);
      
      console.log('Order found:', !!order);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Handle case where pdf_path doesn't exist or file is missing
      let shouldRegenerate = false;
      let reportPath = order.pdf_path;
      
      if (!order.pdf_path) {
        shouldRegenerate = true;
      } else {
        const fullPath = path.join(process.cwd(), order.pdf_path);
        const fileExists = await fs.promises.access(fullPath).then(() => true).catch(() => false);
        if (!fileExists) {
          shouldRegenerate = true;
        }
      }
      
      if (shouldRegenerate) {
        console.log('Regenerating report with AI predictions for order:', orderId);
        
        // Regenerate the report with AI predictions
        const numerologyData = order.numerology_data || calculateNumerology(order.birth_date);
        const astrologyData = order.astrology_data || calculateAstrology(order.birth_date);
        
        // Generate new report with AI predictions
        const newReportPath = await generatePDFReport(order, numerologyData, astrologyData, order.image_path, order.package);
        
        // Update the order with the new report path
        order.pdf_path = newReportPath;
        reportPath = newReportPath;
      }
      
      
      // Serve the HTML report
      const finalPath = path.join(process.cwd(), reportPath);
      const content = await fs.promises.readFile(finalPath, 'utf8');
      
      // Set appropriate headers for HTML rendering
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="soulmate-report-${orderId}.html"`);
      
      res.send(content);
    } catch (error) {
      console.error('Error serving report:', error);
      res.status(500).json({ error: 'Failed to serve report' });
    }
  });

  // Serve generated images
  router.get('/images/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
      const imagePath = path.join(process.cwd(), 'uploads', filename);
      
      // Check if file exists and is safe to serve
      if (!await fs.promises.access(imagePath).then(() => true).catch(() => false)) {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      
      // Serve the image
      res.sendFile(path.resolve(imagePath));
    } catch (error) {
      console.error('Error serving image:', error);
      res.status(500).json({ error: 'Failed to serve image' });
    }
  });

  // Create payment intent endpoint
  router.post('/payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'usd', metadata } = req.body;
      
      const paymentIntent = await createPaymentIntent({
        amount,
        currency,
        metadata
      });
      
      res.json(paymentIntent);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });
  
  return router;
}