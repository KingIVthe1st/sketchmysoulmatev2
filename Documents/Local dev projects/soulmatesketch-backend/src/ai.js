import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-replace-me');
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateProfileText({ quiz, tier, addons }) {
  const prompt = `You are "Soulmate Sketch" AI. Create a concise, romantic but grounded soulmate profile based on user's answers. Include: name (plausible), personality traits, attachment style, love languages, ideal first meeting scenario, "what they're looking for now", and optional astrology/numerology if requested. Keep to ~350-500 words.\nUser Answers: ${JSON.stringify(quiz)}\nTier: ${tier}\nAddons: ${JSON.stringify(addons)}\nStyle: empathetic, modern, slightly mystical, zero medical claims, zero guarantees.`;
  if (!openai) {
    return `Name: Aiden (or similar)\n\nEssence: Warm, grounded, quietly confident. Likely to notice little details about you and make you feel safe to be fully yourself.\n\nAttachment & Love: Secure leaning. Gives reassurance without being overbearing. Primary love languages: Quality Time and Words of Affirmation.\n\nHow you meet: A calm setting where conversation flows—think a cozy cafe on a rainy day, a local bookstore aisle, or a friend’s intimate gathering. You’ll feel a sense of instant familiarity.\n\nRight now: Looking for a relationship that feels like a deep exhale—steady, playful, and honest. Values consistency, humor, and shared little rituals.\n\nAstro vibes (light): Complimentary energy balance with you (yin/yang). Numerology suggests a 2 or 6 life-path resonance—cooperation, care, and home-building.\n\nDisclaimer: This is an inspirational guide for reflection, not a prediction.`;
  }
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You write beautiful, clear, uplifting soulmate reports with ethical disclaimers.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
    });
    return resp.choices[0].message.content;
  } catch (err) {
    console.error('Text generation failed, using fallback:', err?.message || err);
    return `Name: Aiden (or similar)\n\nEssence: Warm, grounded, quietly confident. Likely to notice little details about you and make you feel safe to be fully yourself.\n\nAttachment & Love: Secure leaning. Gives reassurance without being overbearing. Primary love languages: Quality Time and Words of Affirmation.\n\nHow you meet: A calm setting where conversation flows—think a cozy cafe on a rainy day, a local bookstore aisle, or a friend’s intimate gathering. You’ll feel a sense of instant familiarity.\n\nRight now: Looking for a relationship that feels like a deep exhale—steady, playful, and honest. Values consistency, humor, and shared little rituals.\n\nAstro vibes (light): Complimentary energy balance with you (yin/yang). Numerology suggests a 2 or 6 life-path resonance—cooperation, care, and home-building.\n\nDisclaimer: This is an inspirational guide for reflection, not a prediction.`;
  }
}

export async function generateImage({ style, quiz }) {
  const styleMap = {
    realistic: 'realistic portrait, soft natural lighting, cinematic, 85mm lens',
    ethereal: 'ethereal mystical portrait, soft glow, celestial accents, pastel tones',
    anime: 'anime style character portrait, clean lines, studio quality, detailed eyes',
    mystical: 'mystical fantasy portrait, arcane symbols, aura, elegant, painterly'
  };
  const stylePrompt = styleMap[style] || styleMap.ethereal;
  const basePrompt = `A portrait of the user's ideal soulmate based on their preferences. Avoid celebrity likeness. Tasteful, kind eyes, warm presence. ${stylePrompt}`;
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
        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Georgia, serif" fill="#AD1457">Preview Image</text>
      </svg>`
    );
    buffer = await sharp(svg).png().toBuffer();
  } else {
    try {
      const image = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: basePrompt,
        size: '1024x1024'
      });
      const b64 = image.data[0].b64_json;
      buffer = Buffer.from(b64, 'base64');
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
          <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Georgia, serif" fill="#AD1457">Preview Image</text>
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

export async function generatePdf({ text, imagePath, outPath }) {
  const doc = new PDFDocument({ autoFirstPage: false });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // Cover page
  doc.addPage({ size: 'LETTER', margins: { top: 50, left: 50, right: 50, bottom: 50 } });
  doc.fontSize(28).font('Times-Bold').text('Your Soulmate Sketch', { align: 'center' });
  if (imagePath && fs.existsSync(imagePath)) {
    doc.moveDown();
    doc.image(imagePath, { fit: [500, 500], align: 'center', valign: 'center' });
  }
  doc.moveDown();
  doc.fontSize(12).font('Times-Roman').text('Prepared with care by Soulmate Sketch', { align: 'center' });

  // Report page
  doc.addPage({ size: 'LETTER', margins: { top: 50, left: 50, right: 50, bottom: 50 } });
  doc.fontSize(16).font('Times-Bold').text('Compatibility Profile', { align: 'left' });
  doc.moveDown();
  doc.fontSize(12).font('Times-Roman').text(text, { align: 'left' });

  // Disclaimer
  doc.moveDown();
  doc.fontSize(9).fillColor('#666').text('This is an inspirational experience for entertainment and self-reflection. Not a guarantee of outcomes.', { align: 'left' });

  doc.end();

  await new Promise((resolve) => stream.on('finish', resolve));
}
