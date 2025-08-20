import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-replace-me');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Numerology helper functions
function calculateNumerologyInsights(birthdate, lifePath) {
  const numerologyMeanings = {
    1: "Independent, pioneering, natural leader with strong determination",
    2: "Cooperative, diplomatic, seeks harmony and partnership",
    3: "Creative, expressive, optimistic with artistic talents",
    4: "Practical, organized, reliable with strong work ethic",
    5: "Adventurous, freedom-loving, seeks variety and change",
    6: "Nurturing, responsible, family-oriented and caring",
    7: "Analytical, spiritual, seeks deeper understanding",
    8: "Ambitious, business-minded, focused on material success",
    9: "Humanitarian, generous, focused on serving others"
  };

  const compatibleNumbers = {
    1: [2, 3, 9],
    2: [1, 4, 8],
    3: [1, 5, 9],
    4: [2, 6, 8],
    5: [3, 7, 9],
    6: [2, 4, 8],
    7: [5, 9],
    8: [2, 4, 6],
    9: [1, 3, 5, 7]
  };

  return {
    meaning: numerologyMeanings[lifePath] || "Unique and balanced energy",
    compatible: compatibleNumbers[lifePath] || [lifePath],
    lifePath: lifePath
  };
}

export async function generateProfileText({ quiz, tier, addons }) {
  // Check if this is a demo with enhanced numerology
  const isDemo = quiz.is_demo || false;
  const hasNumerology = quiz.numerology_focus || isDemo;
  const lifePath = quiz.life_path_number;
  
  let numerologySection = '';
  if (hasNumerology && lifePath) {
    const insights = calculateNumerologyInsights(quiz.birthdate, lifePath);
    numerologySection = `
    
Special focus on numerology analysis:
- User's Life Path Number: ${lifePath}
- Life Path Meaning: ${insights.meaning}
- Compatible Life Path Numbers: ${insights.compatible.join(', ')}
- Use this numerological framework to describe the soulmate's personality and compatibility`;
  }

  const enhancedPrompt = `You are "Soulmate Sketch" AI. Create a polished, production-ready soulmate profile grounded in the user's answers${hasNumerology ? ' with special emphasis on numerological compatibility' : ''}. Write in clear sections with short headings and skimmable formatting. Avoid medical or deterministic claims. Length ~400–550 words.

Required sections (use these headings exactly):
- Overview
- Personality & Vibe
- Attachment Style & Love Languages
- First Meeting Scenario
- What They're Looking For Now
${hasNumerology ? '- Numerology Compatibility Analysis' : '- Numerology/Astro Notes (only if relevant)'}

${numerologySection}

Tone: warm, contemporary, romantic-but-grounded. Output plain text (no markdown symbols like # or *).

Context:
User Answers: ${JSON.stringify(quiz)}
Tier: ${tier}
Addons: ${JSON.stringify(addons)}
Birthdate: ${quiz.birthdate || 'Not provided'}
Looking for: ${quiz.looking_for_gender || 'Not specified'}
Celebrity inspiration: ${quiz.celebrity_crush || 'None specified'}
Desired traits: ${quiz.desired_traits || 'Not specified'}
Boundaries: ${quiz.boundaries || 'None specified'}

Additional guidance:
- Subtly reflect the user's vibe keywords in the way you describe setting, style, and energy.
- Keep names plausible and culturally neutral unless the user's answers suggest otherwise.
- Keep it uplifting and specific, but never absolute. Include an ethical, reflective framing.
${hasNumerology ? '- Focus heavily on numerological compatibility and how the life path numbers complement each other' : ''}
- If celebrity crush is mentioned, subtly incorporate similar aesthetic energy without direct resemblance.
- Incorporate the desired traits naturally into the personality description.
- Acknowledge boundaries by describing what the soulmate respects and avoids.

If Add-ons include any of the following, add corresponding sections with actionable, specific but gentle insights:
- If contains "aura": include a section titled "Aura Reading" describing color impressions and what they symbolize for connection dynamics (avoid medical language).
- If contains "twin_flame": include a section titled "Twin Flame Insight" focusing on mirroring lessons and growth, not guarantees.
- If contains "past_life": include a section titled "Past Life Glimpse" offering an evocative narrative thread that complements, not predicts.
When add-ons are not selected, do not include those sections.`;

  if (!openai) {
    return `Name: Aiden (or similar)

Essence: Warm, grounded, quietly confident. Likely to notice little details about you and make you feel safe to be fully yourself.

Attachment & Love: Secure leaning. Gives reassurance without being overbearing. Primary love languages: Quality Time and Words of Affirmation.

How you meet: A calm setting where conversation flows—think a cozy cafe on a rainy day, a local bookstore aisle, or a friend's intimate gathering. You'll feel a sense of instant familiarity.

Right now: Looking for a relationship that feels like a deep exhale—steady, playful, and honest. Values consistency, humor, and shared little rituals.

Numerology Analysis: Complimentary energy balance with you (yin/yang). Your life path suggests a ${lifePath || 'balanced'} nature, attracting someone with nurturing and cooperative qualities.

Disclaimer: This is an inspirational guide for reflection, not a prediction.`;
  }
  
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write beautiful, clear, uplifting soulmate reports with ethical, non-deterministic framing and sectioned formatting. You have deep knowledge of numerology and create meaningful connections between numbers and personality traits.' },
        { role: 'user', content: enhancedPrompt }
      ],
      temperature: 0.8,
    });
    return resp.choices[0].message.content;
  } catch (err) {
    console.error('Text generation failed, using fallback:', err?.message || err);
    return `Name: Aiden (or similar)

Essence: Warm, grounded, quietly confident. Likely to notice little details about you and make you feel safe to be fully yourself.

Attachment & Love: Secure leaning. Gives reassurance without being overbearing. Primary love languages: Quality Time and Words of Affirmation.

How you meet: A calm setting where conversation flows—think a cozy cafe on a rainy day, a local bookstore aisle, or a friend's intimate gathering. You'll feel a sense of instant familiarity.

Right now: Looking for a relationship that feels like a deep exhale—steady, playful, and honest. Values consistency, humor, and shared little rituals.

Numerology Analysis: Complimentary energy balance with you (yin/yang). Your life path suggests a ${lifePath || 'balanced'} nature, attracting someone with nurturing and cooperative qualities.

Disclaimer: This is an inspirational guide for reflection, not a prediction.`;
  }
}

export async function generateImage({ style, quiz, addons = [] }) {
  // Enhanced prompts for hyper-realism
  const isHyperRealistic = quiz.hyper_realistic || quiz.is_demo || style === 'realistic';
  
  const styleMap = {
    realistic: 'hyper-realistic portrait photography, natural skin texture, studio-grade lighting, 85mm lens, shallow depth of field, precise color grading, photojournalistic quality',
    ethereal: 'ethereal but realistic portrait, soft glow, celestial accents, pastel tones, natural skin texture, subtle bokeh, dreamlike but photorealistic',
    anime: 'anime style character portrait, clean lines, studio quality, detailed eyes',
    mystical: 'mystical but realistic portrait, arcane accents, cinematic light, painterly color grading, fantasy elements but photorealistic execution'
  };

  // Enhanced style prompt for hyper-realism
  let stylePrompt = styleMap[style] || styleMap.realistic;
  if (isHyperRealistic) {
    stylePrompt = `Ultra-hyper-realistic portrait photography, professional headshot quality, Canon 5D Mark IV with 85mm f/1.4 lens, perfect skin texture with natural pores and fine details, studio lighting setup with key light and fill light, shallow depth of field, high dynamic range, color graded like a professional photographer, magazine-quality realism`;
  }

  const gender = (quiz && quiz.interest) ? (quiz.interest === 'male' ? 'male adult' : (quiz.interest === 'female' ? 'female adult' : 'adult person')) : 'adult person';
  
  // Enhanced trait incorporation
  const traits = quiz.desired_traits ? `Personality should subtly reflect these traits through expression and demeanor: ${quiz.desired_traits}.` : '';
  const vibe = (quiz && quiz.vibes) ? `Reflect these vibe cues: ${quiz.vibes}.` : '';
  const setting = (quiz && quiz.vibes) ? 'Place the subject in a subtle, context-appropriate setting inspired by those vibes (e.g., cozy cafe, golden-hour park, artful studio), without clutter.' : 'Use a tasteful, softly lit studio or natural background.';
  
  // Enhanced celebrity inspiration
  const celeb = (quiz && quiz.celeb) ? `Aesthetic inspiration: channel general vibe and energy similar to ${quiz.celeb}, but create a unique individual - avoid direct resemblance, focus on similar energy and style.` : '';
  
  const auraHint = Array.isArray(addons) && addons.includes('aura') ? 'Add a very subtle, realistic aura-like rim light in a complementary color around the hair/shoulders (barely noticeable, tasteful).' : '';
  const twinFlameHint = Array.isArray(addons) && addons.includes('twin_flame') ? 'Optionally, include a faint twin-bokeh highlight in the background that gently suggests duality (keep it photographic and unobtrusive).' : '';
  
  // Enhanced base prompt for maximum realism
  const basePrompt = `Create a single portrait image of a ${gender} as the user's ideal soulmate derived from their answers. ${traits} ${vibe} ${setting} ${celeb}

Image goals:
- MAXIMUM HYPER-REALISM: photorealistic skin with visible pores, natural skin texture, realistic eye reflections, flyaway hairs, natural imperfections that make it look like a real photograph
- Professional photography quality: shot with professional camera equipment, perfect lighting setup, studio-grade post-processing
- Attractive but natural: symmetrical features, flattering angles, genuine warmth in expression, natural smile
- Skin tone: choose a realistic tone that fits the context; diverse representation, avoid bias or defaulting to one complexion. Ensure natural, unfiltered skin appearance
- Composition: waist-up portrait, rule of thirds, cinematic framing, professional headshot composition
- Lighting: professional portrait lighting setup with key light, fill light, and rim light; soft shadows, no harsh flash
- Eyes: crystal clear, natural catchlights, realistic iris detail, natural eye moisture
- Hair: individual strand detail, natural texture, realistic styling, flyaway hairs for authenticity  
- Background: professional portrait background, clean and tasteful, subtle environmental hints
- Camera technical specs: 85mm portrait lens equivalent, f/1.8-2.8 depth of field, high dynamic range, RAW-like fidelity, natural color science
- Post-processing: professional color grading, natural skin tones, enhanced but not artificial, subtle sharpening
- Detail level: magazine cover quality, every detail should be photorealistic, no plastic or artificial appearance

Strictly avoid: cartoonish looks, plastic skin, heavy airbrushing, distorted anatomy, exaggerated features, fantasy species, minors, weapons, text overlays, logos, watermarks, signatures, anime style, illustration style, painting style.

Negative prompt: disfigured, blurry, extra fingers, deformed, cloned face, watermark, lowres, oversaturated skin, plastic sheen, waxy texture, uncanny valley, text artifacts, cartoon, anime, illustration, painting, rendered, digital art, artificial skin, smooth skin, porcelain skin.

${auraHint} ${twinFlameHint}
Style: ${stylePrompt}

CRITICAL: This must look like an actual photograph of a real person, not an AI-generated image.`;

  let buffer;
  if (!openai) {
    // Fallback: generate a soft gradient placeholder with text
    const svg = Buffer.from(
      `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#FCE4EC"/>
            <stop offset="100%" stop-color="#E1BEE7"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="1024" fill="url(#g)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48" font-family="Georgia, serif" fill="#7B1FA2">Soulmate Sketch</text>
        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Georgia, serif" fill="#AD1457">Hyper-Realistic Preview</text>
      </svg>`
    );
    buffer = await sharp(svg).png().toBuffer();
  } else {
    try {
      const image = await openai.images.generate({
        model: 'dall-e-3',  // Use DALL-E 3 for better quality
        prompt: basePrompt,
        size: '1024x1024',
        quality: 'hd',  // High definition for better realism
        style: 'natural'  // Natural style for photorealism
      });
      
      const imageUrl = image.data[0].url;
      const response = await fetch(imageUrl);
      buffer = Buffer.from(await response.arrayBuffer());
    } catch (err) {
      console.error('Image generation failed, using placeholder:', err?.message || err);
      const svg = Buffer.from(
        `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#FCE4EC"/>
              <stop offset="100%" stop-color="#E1BEE7"/>
            </linearGradient>
          </defs>
          <rect width="1024" height="1024" fill="url(#g)"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="48" font-family="Georgia, serif" fill="#7B1FA2">Soulmate Sketch</text>
          <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Georgia, serif" fill="#AD1457">Hyper-Realistic Preview</text>
        </svg>`
      );
      buffer = await sharp(svg).png().toBuffer();
    }
  }
  
  const outDir = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `result_${Date.now()}.png`);
  await fs.promises.writeFile(filePath, buffer);
  
  // create social share variant 1080x1920
  const sharePath = filePath.replace('.png', '_story.png');
  await sharp(buffer).resize(1080, 1920, { fit: 'cover' }).toFile(sharePath);
  
  return { filePath, sharePath };
}

export async function generatePdf({ text, imagePath, outPath, addons = [] }) {
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // Cover page
  doc.addPage({ size: 'LETTER', margins: { top: 56, left: 56, right: 56, bottom: 56 } });
  // Title badge
  doc.roundedRect(180, 60, 255, 28, 14).fillOpacity(0.06).fill('#E91E63').fillOpacity(1);
  doc.fontSize(10).fillColor('#E91E63').font('Times-Bold').text('Soulmate Sketch • Personal Report', 190, 67);
  // Main title
  doc.moveDown(2);
  doc.fontSize(30).fillColor('#000').font('Times-Bold').text('Your Soulmate Sketch', { align: 'center' });
  if (imagePath && fs.existsSync(imagePath)) {
    doc.moveDown();
    doc.image(imagePath, { fit: [480, 480], align: 'center', valign: 'center' });
  }
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#666').font('Times-Roman').text('Prepared with care by Soulmate Sketch', { align: 'center' });

  // Report page
  doc.addPage({ size: 'LETTER', margins: { top: 56, left: 56, right: 56, bottom: 56 } });
  
  // Section header style
  const writeSection = (heading, body) => {
    if (!body) return;
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#E91E63').font('Times-Bold').text(heading);
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333').font('Times-Roman').text(body, { lineGap: 2 });
  };

  // Parse and format the text content
  const sections = text.split('\n\n');
  let currentSection = '';
  let currentBody = '';

  sections.forEach(section => {
    const lines = section.split('\n');
    if (lines.length > 0) {
      // Check if this looks like a section header (short line, possibly with colons)
      const firstLine = lines[0].trim();
      if (firstLine.length < 50 && (firstLine.includes(':') || firstLine.match(/^[A-Z][a-z\s&]+$/))) {
        // Write previous section if we have one
        if (currentSection && currentBody) {
          writeSection(currentSection, currentBody);
        }
        currentSection = firstLine.replace(':', '');
        currentBody = lines.slice(1).join('\n').trim();
      } else {
        // Continue current section
        currentBody += '\n\n' + section;
      }
    }
  });

  // Write the last section
  if (currentSection && currentBody) {
    writeSection(currentSection, currentBody);
  }

  // Add disclaimer at bottom
  doc.moveDown(1);
  doc.fontSize(9).fillColor('#999').font('Times-Italic')
    .text('This report is created for entertainment and self-reflection purposes. Results are not guaranteed and should not be considered as definitive predictions about your future relationships.', 
    { align: 'center' });

  doc.end();
  
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}