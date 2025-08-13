export const SiteTheme = {
  primary: '#E91E63',
  accent: '#673AB7',
  soft: '#FCE4EC',
  text: '#2D2240',
};

export function demoHtml({ baseUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
  <title>SoulmateSketch</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23667eea'/><stop offset='50%' style='stop-color:%23f093fb'/><stop offset='100%' style='stop-color:%2310f3d4'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23g)'/><path d='M35 40 Q50 25 65 40 Q50 55 35 40' fill='white' opacity='0.9'/></svg>" type="image/svg+xml">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      background: #111827;
      color: #f9fafb;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      min-height: 100vh;
      position: relative;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-text-size-adjust: 100%;
      -webkit-overflow-scrolling: touch;
    }

    .site-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 60% 40%, rgba(16, 243, 212, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #0f3460 100%);
      z-index: -1;
      animation: backgroundShift 20s ease-in-out infinite;
    }

    @keyframes backgroundShift {
      0%, 100% { 
        filter: hue-rotate(0deg) brightness(1);
      }
      25% { 
        filter: hue-rotate(5deg) brightness(1.1);
      }
      50% { 
        filter: hue-rotate(-3deg) brightness(0.95);
      }
      75% { 
        filter: hue-rotate(3deg) brightness(1.05);
      }
    }

    #stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    #particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }

    .floating-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      animation: floatUp 8s linear infinite;
    }

    @keyframes floatUp {
      0% {
        opacity: 0;
        transform: translateY(100vh) scale(0);
      }
      10% {
        opacity: 1;
        transform: translateY(90vh) scale(1);
      }
      90% {
        opacity: 1;
        transform: translateY(10vh) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-10vh) scale(0);
      }
    }

    .container {
      position: relative;
      z-index: 2;
      min-height: 100vh;
    }

    /* Header */
    .header {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(12px);
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #10f3d4 100%);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.025em;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      font-size: 11px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #fbbf24;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 100%);
      background-size: 200% 100%;
      animation: shimmer 2s ease-in-out infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Hero Section */
    .hero {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 16px 24px;
      text-align: center;
    }

    .hero h1 {
      margin-top: 16px;
      font-size: 48px;
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.025em;
    }

    .gradient-text {
      background: linear-gradient(45deg, #818cf8, #f093fb, #10f3d4, #818cf8);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 4s ease-in-out infinite;
      position: relative;
    }

    .gradient-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(45deg, #818cf8, #f093fb, #10f3d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: blur(2px);
      opacity: 0.5;
      z-index: -1;
      animation: gradientShift 4s ease-in-out infinite reverse;
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .text-glow {
      text-shadow: 
        0 0 10px rgba(129, 140, 248, 0.5),
        0 0 20px rgba(240, 147, 251, 0.3),
        0 0 30px rgba(16, 243, 212, 0.2);
      animation: textGlow 3s ease-in-out infinite;
    }

    @keyframes textGlow {
      0%, 100% { 
        text-shadow: 
          0 0 10px rgba(129, 140, 248, 0.5),
          0 0 20px rgba(240, 147, 251, 0.3),
          0 0 30px rgba(16, 243, 212, 0.2);
      }
      50% { 
        text-shadow: 
          0 0 15px rgba(129, 140, 248, 0.8),
          0 0 30px rgba(240, 147, 251, 0.5),
          0 0 45px rgba(16, 243, 212, 0.4);
      }
    }

    .hero p {
      margin-top: 12px;
      color: rgba(255, 255, 255, 0.7);
      max-width: 512px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Main Layout */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
      display: grid;
      gap: 32px;
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 1024px) {
      .main {
        grid-template-columns: 1fr;
      }
      .hero h1 {
        font-size: 36px;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 12px;
      }
      
      .logo-text {
        font-size: 20px;
      }
      
      .status-badge {
        font-size: 10px;
        padding: 3px 8px;
      }
      
      .hero {
        padding: 24px 12px 16px;
      }
      
      .hero h2 {
        font-size: 28px;
        line-height: 1.2;
      }
      
      .hero p {
        font-size: 14px;
      }
      
      .main {
        padding: 20px 12px;
        gap: 20px;
      }
      
      .card {
        padding: 16px;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .form-group {
        margin-bottom: 12px;
      }
      
      input, select, textarea {
        padding: 14px;
        font-size: 16px; /* Prevents zoom on iOS */
      }
      
      .file-upload {
        padding: 16px;
      }
      
      .file-upload p {
        font-size: 14px;
      }
      
      .btn {
        padding: 14px 16px;
        font-size: 16px;
        font-weight: 600;
      }
      
      .credits {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }
      
      .credits-text {
        text-align: center;
      }
      
      .result-actions {
        flex-direction: column;
      }
      
      .result-actions .btn {
        width: 100%;
        margin-bottom: 8px;
      }
      
      .result-text {
        max-height: 200px;
        font-size: 13px;
      }
      
      .loading {
        padding: 30px 0;
      }
      
      .spinner {
        width: 32px;
        height: 32px;
      }
    }

    @media (max-width: 480px) {
      .hero h2 {
        font-size: 24px;
      }
      
      .main {
        padding: 16px 8px;
      }
      
      .card {
        padding: 12px;
        margin: 0 4px;
      }
      
      .form-grid {
        gap: 8px;
      }
      
      input, select, textarea {
        padding: 12px;
      }
      
      .file-upload {
        padding: 12px;
      }
      
      .result-image {
        border-radius: 8px;
      }
    }

    /* Touch improvements */
    @media (hover: none) and (pointer: coarse) {
      .btn:hover {
        filter: none;
      }
      
      .btn:active {
        filter: brightness(1.1);
        transform: scale(0.98);
      }
      
      .file-upload:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.05);
      }
      
      .file-upload:active {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }
      
      input:focus, select:focus, textarea:focus {
        transform: scale(1.02);
      }
    }

    /* Card Styling */
    .card {
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: 
        linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
        rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px) saturate(1.8);
      padding: 24px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      height: fit-content;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
      transition: left 0.6s;
      pointer-events: none;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .card:hover::before {
      left: 100%;
    }

    .card h2 {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    /* Form Styling */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: #f9fafb;
    }

    input, select, textarea {
      width: 100%;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: 
        linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%),
        rgba(255, 255, 255, 0.03);
      padding: 12px;
      color: #f9fafb;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative;
      backdrop-filter: blur(10px);
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      background: 
        linear-gradient(145deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.05) 100%),
        rgba(255, 255, 255, 0.05);
      box-shadow: 
        0 0 0 3px rgba(102, 126, 234, 0.15),
        0 4px 20px rgba(102, 126, 234, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    input:hover, select:hover, textarea:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: 
        linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%),
        rgba(255, 255, 255, 0.05);
    }

    input::placeholder, textarea::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    textarea {
      min-height: 112px;
      resize: vertical;
    }

    /* File Upload */
    .file-upload {
      border: 2px dashed rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .file-upload:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }

    .file-upload.dragover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.2);
    }

    .file-upload input[type="file"] {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    /* Advanced Button */
    .btn {
      border-radius: 8px;
      padding: 12px 16px;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #f093fb 50%, #10f3d4 100%);
      border: none;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
      box-shadow: 
        0 4px 15px rgba(102, 126, 234, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s;
    }

    .btn::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent, rgba(255, 255, 255, 0.1));
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 25px rgba(102, 126, 234, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      filter: brightness(1.1);
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn:hover::after {
      opacity: 1;
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn:disabled::before {
      display: none;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      flex: 1;
      min-width: 140px;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* Credits */
    .credits {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
      margin-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .credits-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Results Panel */
    .results-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .results-content {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      padding: 40px 0;
    }

    .result-image {
      max-width: 100%;
      border-radius: 12px;
      margin-bottom: 16px;
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .result-image::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(
        from 0deg at 50% 50%,
        transparent 0deg,
        rgba(102, 126, 234, 0.1) 90deg,
        rgba(240, 147, 251, 0.1) 180deg,
        rgba(16, 243, 212, 0.1) 270deg,
        transparent 360deg
      );
      animation: rotateGlow 8s linear infinite;
      opacity: 0;
      pointer-events: none;
      border-radius: 12px;
    }

    .result-image.revealed::before {
      opacity: 1;
    }

    @keyframes rotateGlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .cinematic-reveal {
      position: relative;
      overflow: hidden;
    }

    .cinematic-reveal::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.1) 20%, 
        rgba(255, 255, 255, 0.3) 50%, 
        rgba(255, 255, 255, 0.1) 80%, 
        transparent 100%
      );
      animation: cinematicSweep 2s ease-out;
      z-index: 10;
    }

    @keyframes cinematicSweep {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .result-text {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      text-align: left;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 14px;
    }

    .result-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .result-actions .btn {
      flex: 1;
      min-width: 140px;
    }

    /* Advanced Loading */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 40px 0;
      position: relative;
    }

    .neural-network {
      position: relative;
      width: 200px;
      height: 120px;
      margin-bottom: 16px;
    }

    .neural-node {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: linear-gradient(45deg, #667eea, #f093fb);
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
      animation: neuralPulse 2s ease-in-out infinite;
    }

    .neural-connection {
      position: absolute;
      height: 2px;
      background: linear-gradient(90deg, transparent, #667eea, transparent);
      opacity: 0.6;
      animation: neuralFlow 1.5s linear infinite;
    }

    @keyframes neuralPulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    @keyframes neuralFlow {
      0% { background-position: -100% 50%; }
      100% { background-position: 200% 50%; }
    }

    .processing-stages {
      text-align: center;
      margin-top: 16px;
    }

    .stage-indicator {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stage-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .stage-dot.active {
      background: linear-gradient(45deg, #667eea, #f093fb);
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
      transform: scale(1.2);
    }

    .stage-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .progress-bar-container {
      width: 100%;
      max-width: 300px;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 16px;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #f093fb, #10f3d4);
      border-radius: 2px;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .hidden { display: none; }

    /* Performance Analytics */
    .performance-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 200px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 11px;
      color: #00ff88;
      backdrop-filter: blur(10px);
      z-index: 1000;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .performance-panel.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .performance-panel h4 {
      color: #667eea;
      margin-bottom: 8px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      color: rgba(255, 255, 255, 0.8);
    }

    .metric-value {
      color: #00ff88;
      font-weight: bold;
    }

    .metric-value.warning {
      color: #ffb700;
    }

    .metric-value.critical {
      color: #ff4757;
    }

    .fps-graph {
      height: 40px;
      margin-top: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }

    .fps-bar {
      position: absolute;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to top, #667eea, #00ff88);
      transition: height 0.1s ease;
    }

    /* Developer Console */
    .dev-console {
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      height: 150px;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      color: #00ff88;
      padding: 12px;
      backdrop-filter: blur(10px);
      z-index: 999;
      opacity: 0;
      transform: translateY(100%);
      transition: all 0.3s ease;
      overflow-y: auto;
    }

    .dev-console.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .console-log {
      margin-bottom: 4px;
      opacity: 0.8;
    }

    .console-log.info { color: #667eea; }
    .console-log.success { color: #00ff88; }
    .console-log.warning { color: #ffb700; }
    .console-log.error { color: #ff4757; }

    /* Context-Aware UI */
    .context-indicator {
      position: fixed;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      width: 4px;
      height: 60px;
      background: linear-gradient(to bottom, #667eea, #f093fb, #10f3d4);
      border-radius: 2px;
      opacity: 0.6;
      transition: all 0.3s ease;
      z-index: 100;
    }

    .context-indicator.active {
      opacity: 1;
      width: 6px;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
    }

    /* Hidden Developer Features */
    .konami-activated {
      animation: matrixRain 10s linear infinite;
    }

    @keyframes matrixRain {
      0% { filter: hue-rotate(0deg) invert(0); }
      25% { filter: hue-rotate(90deg) invert(0.1); }
      50% { filter: hue-rotate(180deg) invert(0); }
      75% { filter: hue-rotate(270deg) invert(0.1); }
      100% { filter: hue-rotate(360deg) invert(0); }
    }

    /* Footer */
    .footer {
      padding: 40px 0;
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  </style>
</head>
<body>
  <div class="site-bg"></div>
  <canvas id="stars"></canvas>
  <div id="particles"></div>
  
  <!-- Performance Analytics Panel -->
  <div id="performancePanel" class="performance-panel">
    <h4>Performance Metrics</h4>
    <div class="metric">
      <span>FPS:</span>
      <span id="fpsValue" class="metric-value">60</span>
    </div>
    <div class="metric">
      <span>Memory:</span>
      <span id="memoryValue" class="metric-value">0MB</span>
    </div>
    <div class="metric">
      <span>Particles:</span>
      <span id="particleCount" class="metric-value">0</span>
    </div>
    <div class="metric">
      <span>Load Time:</span>
      <span id="loadTime" class="metric-value">0ms</span>
    </div>
    <div id="fpsGraph" class="fps-graph"></div>
  </div>

  <!-- Developer Console -->
  <div id="devConsole" class="dev-console">
    <div id="consoleContent"></div>
  </div>

  <!-- Context Indicator -->
  <div id="contextIndicator" class="context-indicator"></div>
  
  <div class="container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon"></div>
          <h1 class="logo-text">SoulmateSketch</h1>
      </div>
        <div class="status-badge">
          <span class="status-dot"></span>
          <span class="shimmer">AI powered mystical insights</span>
        </div>
      </div>
  </header>

    <section class="hero">
      <h2>Turn memories into <span class="gradient-text text-glow" data-text="soulmate sketches">soulmate sketches</span></h2>
      <p>Describe your ideal match and upload your photo. We'll create a personalized AI sketch with mystical insights.</p>
    </section>

    <main class="main">
      <!-- Form Section -->
      <section class="card">
        <h2>Describe your soulmate</h2>
        <form id="soulmateForm">
          <div class="form-grid">
            <div class="form-group">
        <label>Email</label>
              <input type="email" id="email" placeholder="you@example.com" required />
      </div>
            <div class="form-group">
              <label>Interested in</label>
              <select id="interest">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="surprise" selected>Surprise me</option>
        </select>
      </div>
            <div class="form-group">
              <label>Birthday</label>
              <input type="date" id="birthday" />
        </div>
            <div class="form-group">
              <label>Celebrity lookalike</label>
              <input type="text" id="celeb" placeholder="e.g. Ryan Gosling, Emma Stone..." />
      </div>
            <div class="form-group full-width">
              <label>Upload your photo</label>
              <div class="file-upload" id="fileUpload">
                <p>📸 Drag & drop or click to upload</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.6);">Best results with clear face photos</p>
                <input type="file" id="photo" accept="image/*" />
      </div>
    </div>
            <div class="form-group full-width">
              <label>Ideal vibe & personality</label>
              <textarea id="vibes" placeholder="e.g., adventurous yet grounded, loves art and travel, kind and ambitious..." maxLength="500"></textarea>
    </div>
            <div class="form-group full-width">
              <label>Story / background details</label>
              <textarea id="dealbreakers" placeholder="Share details about your ideal match, their interests, values, or any specific traits that matter to you..."></textarea>
      </div>
      </div>
          <div class="credits">
            <div class="credits-text">All premium features included</div>
            <button type="submit" class="btn">Create Soulmate Sketch</button>
      </div>
        </form>
      </section>

      <!-- Results Section -->
      <section class="card">
        <h2>Your soulmate sketch</h2>
        <div class="results-panel">
          <div id="initialMessage" class="results-content">
            <p>Your personalized soulmate sketch and mystical insights will appear here after generation.</p>
      </div>

                    <div id="loading" class="loading hidden">
            <div class="neural-network" id="neuralNetwork"></div>
            <div class="processing-stages">
              <div class="stage-indicator">
                <div class="stage-dot" id="stage1"></div>
                <div class="stage-dot" id="stage2"></div>
                <div class="stage-dot" id="stage3"></div>
                <div class="stage-dot" id="stage4"></div>
                <div class="stage-dot" id="stage5"></div>
        </div>
              <div class="stage-text" id="stageText">Initializing AI models...</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" id="progressFill" style="width: 0%"></div>
      </div>
    </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 16px;">Advanced AI processing in progress</p>
    </div>

          <div id="results" class="hidden">
            <img id="resultImage" src="" alt="Your Soulmate Sketch" class="result-image" />
            <div id="resultText" class="result-text"></div>
            <div class="result-actions">
              <a id="pdfLink" href="" class="btn">📋 Download Full Report</a>
              <button class="btn btn-secondary" onclick="restart()">🔄 Create Another</button>
      </div>
      </div>
      </div>
      </section>
    </main>

    <footer class="footer">
      By using this service you agree to our terms. Your data is processed securely and never shared.
    </footer>
  </div>

  <script>
    let orderId = null;

    // Performance Monitoring System
    class PerformanceMonitor {
      constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.maxHistory = 100;
        this.isVisible = false;
        this.particleCount = 0;
        this.loadStartTime = performance.now();
        
        this.initFpsGraph();
        this.startMonitoring();
      }
      
      initFpsGraph() {
        const graph = document.getElementById('fpsGraph');
        for (let i = 0; i < this.maxHistory; i++) {
          const bar = document.createElement('div');
          bar.className = 'fps-bar';
          bar.style.left = (i * 2) + 'px';
          bar.style.height = '0px';
          graph.appendChild(bar);
        }
      }
      
      startMonitoring() {
        const monitor = () => {
          this.frameCount++;
          const currentTime = performance.now();
          const deltaTime = currentTime - this.lastTime;
          
          if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            this.fpsHistory.push(this.fps);
            if (this.fpsHistory.length > this.maxHistory) {
              this.fpsHistory.shift();
            }
            
            this.updateDisplay();
          }
          
          requestAnimationFrame(monitor);
        };
        monitor();
      }
      
      updateDisplay() {
        if (!this.isVisible) return;
        
        // Update FPS
        const fpsElement = document.getElementById('fpsValue');
        fpsElement.textContent = this.fps;
        fpsElement.className = 'metric-value ' + (this.fps < 30 ? 'critical' : this.fps < 50 ? 'warning' : '');
        
        // Update Memory (if available)
        if (performance.memory) {
          const memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
          document.getElementById('memoryValue').textContent = memory + 'MB';
        }
        
        // Update Particle Count
        document.getElementById('particleCount').textContent = this.particleCount;
        
        // Update Load Time
        const loadTime = Math.round(performance.now() - this.loadStartTime);
        document.getElementById('loadTime').textContent = loadTime + 'ms';
        
        // Update FPS Graph
        this.updateFpsGraph();
      }
      
      updateFpsGraph() {
        const bars = document.querySelectorAll('.fps-bar');
        this.fpsHistory.forEach((fps, index) => {
          if (bars[index]) {
            const height = (fps / 60) * 40;
            bars[index].style.height = Math.max(1, height) + 'px';
          }
        });
      }
      
      toggle() {
        this.isVisible = !this.isVisible;
        const panel = document.getElementById('performancePanel');
        panel.classList.toggle('visible', this.isVisible);
        if (this.isVisible) {
          this.updateDisplay();
        }
      }
      
      setParticleCount(count) {
        this.particleCount = count;
      }
    }

    // Developer Console System
    class DevConsole {
      constructor() {
        this.logs = [];
        this.isVisible = false;
        this.maxLogs = 50;
      }
      
      log(message, type = 'info') {
        const timestamp = new Date().toISOString().substr(11, 12);
        this.logs.push({ message, type, timestamp });
        
        if (this.logs.length > this.maxLogs) {
          this.logs.shift();
        }
        
        this.render();
      }
      
      render() {
        if (!this.isVisible) return;
        
        const content = document.getElementById('consoleContent');
        content.innerHTML = this.logs.map(log => 
          '<div class="console-log ' + log.type + '">[' + log.timestamp + '] ' + log.message + '</div>'
        ).join('');
        content.scrollTop = content.scrollHeight;
      }
      
      toggle() {
        this.isVisible = !this.isVisible;
        const console = document.getElementById('devConsole');
        console.classList.toggle('visible', this.isVisible);
        if (this.isVisible) {
          this.render();
        }
      }
      
      clear() {
        this.logs = [];
        this.render();
      }
    }

    // Context-Aware UI System
    class ContextAwareUI {
      constructor() {
        this.currentContext = 'idle';
        this.indicator = document.getElementById('contextIndicator');
        this.lastActivity = Date.now();
        this.startTracking();
      }
      
      setContext(context) {
        if (this.currentContext !== context) {
          this.currentContext = context;
          this.updateIndicator();
          devConsole.log('Context changed to: ' + context, 'info');
        }
      }
      
      updateIndicator() {
        this.indicator.classList.toggle('active', this.currentContext !== 'idle');
        
        const colors = {
          'idle': 'linear-gradient(to bottom, #667eea, #f093fb, #10f3d4)',
          'form': 'linear-gradient(to bottom, #00ff88, #00ff88, #00ff88)',
          'processing': 'linear-gradient(to bottom, #ffb700, #ff6b6b, #ffb700)',
          'results': 'linear-gradient(to bottom, #10f3d4, #667eea, #f093fb)'
        };
        
        this.indicator.style.background = colors[this.currentContext] || colors.idle;
      }
      
      startTracking() {
        // Track user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
          document.addEventListener(event, () => {
            this.lastActivity = Date.now();
            if (this.currentContext === 'idle') {
              this.setContext('form');
            }
          });
        });
        
        // Auto-idle after inactivity
        setInterval(() => {
          if (Date.now() - this.lastActivity > 30000) { // 30 seconds
            this.setContext('idle');
          }
        }, 1000);
      }
    }

    // Konami Code Easter Egg
    class KonamiCode {
      constructor() {
        this.sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        this.userInput = [];
        this.init();
      }
      
      init() {
        document.addEventListener('keydown', (e) => {
          this.userInput.push(e.keyCode);
          if (this.userInput.length > this.sequence.length) {
            this.userInput.shift();
          }
          
          if (this.userInput.length === this.sequence.length && 
              this.userInput.every((val, i) => val === this.sequence[i])) {
            this.activate();
          }
        });
      }
      
      activate() {
        devConsole.log('🎮 KONAMI CODE ACTIVATED! Matrix mode enabled!', 'success');
        document.body.classList.add('konami-activated');
        
        // Show all hidden panels
        performanceMonitor.isVisible = true;
        devConsole.isVisible = true;
        performanceMonitor.toggle();
        devConsole.toggle();
        
        // Play special sound sequence
        audio.playTone(523, 0.2); // C
        setTimeout(() => audio.playTone(659, 0.2), 200); // E
        setTimeout(() => audio.playTone(784, 0.2), 400); // G
        setTimeout(() => audio.playTone(1047, 0.4), 600); // C
        
        setTimeout(() => {
          document.body.classList.remove('konami-activated');
        }, 10000);
      }
    }

    // Initialize Systems
    const performanceMonitor = new PerformanceMonitor();
    const devConsole = new DevConsole();
    const contextUI = new ContextAwareUI();
    const konamiCode = new KonamiCode();

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'p':
            e.preventDefault();
            performanceMonitor.toggle();
            break;
          case 'c':
            e.preventDefault();
            devConsole.toggle();
            break;
          case 'l':
            e.preventDefault();
            devConsole.clear();
            break;
        }
      }
    });

    // Enhanced Particle System with Tracking
    function createParticleSystem() {
      const particleContainer = document.getElementById('particles');
      
      function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random starting position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        
        // Random color variation
        const colors = [
          'rgba(102, 126, 234, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(16, 243, 212, 0.8)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = 'radial-gradient(circle, ' + color + ' 0%, transparent 70%)';
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            performanceMonitor.setParticleCount(particleContainer.children.length);
          }
        }, 12000);
        
        performanceMonitor.setParticleCount(particleContainer.children.length);
      }
      
      // Create particles periodically
      setInterval(createParticle, 2000);
      
      // Create initial particles
      for (let i = 0; i < 3; i++) {
        setTimeout(createParticle, i * 1000);
      }
      
      devConsole.log('Particle system initialized', 'success');
    }

    // Haptic Feedback
    function triggerHaptic(intensity = 'medium') {
      if ('vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          strong: [50]
        };
        navigator.vibrate(patterns[intensity] || patterns.medium);
      }
    }

    // Sound Effects (Web Audio API)
    function createAudioContext() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        function playTone(frequency, duration, type = 'sine') {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }
        
        return { playTone };
      } catch (e) {
        return { playTone: () => {} }; // Fallback
      }
    }

    const audio = createAudioContext();

    // Enhanced Form Interactions
    function enhanceFormInteractions() {
      const inputs = document.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          triggerHaptic('light');
          audio.playTone(440, 0.1);
        });
        
        input.addEventListener('input', () => {
          if (Math.random() < 0.1) { // Occasional feedback
            audio.playTone(880, 0.05);
          }
        });
      });
      
      // Button interactions
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          triggerHaptic('medium');
          audio.playTone(660, 0.2);
          
          // Create click particles
          createClickParticles(button);
        });
      });
    }

    function createClickParticles(element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 6;
        const distance = 30 + Math.random() * 20;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 1
          },
          { 
            transform: 'translate(' + (endX - centerX) + 'px, ' + (endY - centerY) + 'px) scale(1)',
            opacity: 0
          }
        ], {
          duration: 600,
          easing: 'ease-out'
        }).onfinish = () => {
          document.body.removeChild(particle);
        };
      }
    }

    // Neural Network Visualization
    function createNeuralNetwork() {
      const container = document.getElementById('neuralNetwork');
        container.innerHTML = '';
      
      // Create nodes in layers
      const layers = [
        { count: 3, x: 20 },   // Input layer
        { count: 5, x: 100 },  // Hidden layer 1
        { count: 4, x: 180 }   // Output layer
      ];
      
      const nodes = [];
      
      layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < layer.count; i++) {
          const node = document.createElement('div');
          node.className = 'neural-node';
          const y = (120 / (layer.count + 1)) * (i + 1) - 6;
          node.style.left = layer.x + 'px';
          node.style.top = y + 'px';
          node.style.animationDelay = (layerIndex * 0.2 + i * 0.1) + 's';
          container.appendChild(node);
          
          nodes.push({ element: node, layer: layerIndex, x: layer.x + 6, y: y + 6 });
        }
      });
      
      // Create connections
      for (let i = 0; i < layers.length - 1; i++) {
        const currentLayer = nodes.filter(n => n.layer === i);
        const nextLayer = nodes.filter(n => n.layer === i + 1);
        
        currentLayer.forEach(node1 => {
          nextLayer.forEach(node2 => {
            const connection = document.createElement('div');
            connection.className = 'neural-connection';
            
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            connection.style.width = length + 'px';
            connection.style.left = node1.x + 'px';
            connection.style.top = node1.y + 'px';
            connection.style.transform = 'rotate(' + angle + 'deg)';
            connection.style.transformOrigin = '0 50%';
            connection.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(connection);
          });
        });
      }
    }

    // Advanced Loading States
    function startAdvancedLoading() {
      createNeuralNetwork();
      
      const stages = [
        { text: "Initializing AI models...", duration: 8000 },
        { text: "Analyzing photo features...", duration: 12000 },
        { text: "Processing numerology...", duration: 8000 },
        { text: "Generating soulmate traits...", duration: 15000 },
        { text: "Finalizing mystical insights...", duration: 22000 }
      ];
      
      let currentStage = 0;
      let totalDuration = 65000; // Total expected time
      let startTime = Date.now();
      
      function updateStage() {
        if (currentStage < stages.length) {
          // Update stage indicator
          document.querySelectorAll('.stage-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index <= currentStage);
          });
          
          // Update text
          document.getElementById('stageText').textContent = stages[currentStage].text;
          
          currentStage++;
          
          if (currentStage < stages.length) {
            setTimeout(updateStage, stages[currentStage - 1].duration);
          }
        }
      }
      
      // Start stage progression
      updateStage();
      
      // Update progress bar
      function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 95);
        document.getElementById('progressFill').style.width = progress + '%';
        
        if (progress < 95) {
          requestAnimationFrame(updateProgress);
        }
      }
      
      updateProgress();
    }

    function completeAdvancedLoading() {
      document.getElementById('progressFill').style.width = '100%';
      document.querySelectorAll('.stage-dot').forEach(dot => {
        dot.classList.add('active');
      });
      document.getElementById('stageText').textContent = 'Complete! Revealing your soulmate...';
    }

    // Stars canvas effect
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = [];
    const shootingStars = [];

    // Create static stars (responsive count based on screen size)
    const isMobile = window.innerWidth <= 768;
    const starCount = isMobile ? 75 : 150;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * (isMobile ? 1 : 1.5),
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }

    function createShootingStar() {
      const shootingStarChance = isMobile ? 0.001 : 0.002;
      if (Math.random() < shootingStarChance) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * (isMobile ? 40 : 60) + 20,
          speed: Math.random() * (isMobile ? 4 : 6) + 3,
          opacity: 1,
          angle: Math.random() * Math.PI / 6 + Math.PI / 4
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach(star => {
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        star.opacity = Math.max(0.1, Math.min(0.8, star.opacity));
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + star.opacity + ')';
        ctx.fill();
      });

      // Draw shooting stars
      shootingStars.forEach((shootingStar, index) => {
        const gradient = ctx.createLinearGradient(
          shootingStar.x, shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + shootingStar.opacity + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      createShootingStar();
      requestAnimationFrame(animate);
    }
    animate();

    // Initialize all advanced features
    window.addEventListener('load', () => {
      createParticleSystem();
      enhanceFormInteractions();
      
      devConsole.log('🚀 SoulmateSketch v3.0 - Technical Showcase Mode', 'success');
      devConsole.log('Performance monitoring active', 'info');
      devConsole.log('Context-aware UI initialized', 'info');
      devConsole.log('Shortcuts: Ctrl+P (Performance), Ctrl+C (Console), Ctrl+L (Clear)', 'info');
      devConsole.log('Easter egg: Try the Konami code! ↑↑↓↓←→←→BA', 'info');
      
      contextUI.setContext('form');
    });

    // File upload handling
    const fileUpload = document.getElementById('fileUpload');
    const photoInput = document.getElementById('photo');

    fileUpload.addEventListener('click', () => photoInput.click());
    fileUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUpload.classList.add('dragover');
    });
    fileUpload.addEventListener('dragleave', () => {
      fileUpload.classList.remove('dragover');
    });
    fileUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUpload.classList.remove('dragover');
      photoInput.files = e.dataTransfer.files;
      updateFileUploadText();
    });
    photoInput.addEventListener('change', updateFileUploadText);

    function updateFileUploadText() {
      if (photoInput.files.length > 0) {
        fileUpload.innerHTML = '<p>✅ ' + photoInput.files[0].name + '</p>';
      }
    }

    // Form submission
    document.getElementById('soulmateForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      if (!email) {
        // Better mobile alert
        if (window.innerWidth <= 768) {
          const emailInput = document.getElementById('email');
          emailInput.focus();
          emailInput.style.borderColor = '#ef4444';
          setTimeout(() => emailInput.style.borderColor = '', 3000);
        }
        alert('Please enter your email');
        return;
      }

      // Disable form during submission to prevent double-taps
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const formInputs = e.target.querySelectorAll('input, select, textarea, button');
      formInputs.forEach(input => input.disabled = true);
      submitBtn.textContent = 'Creating...';

      // Show loading with advanced visualization
      document.getElementById('initialMessage').classList.add('hidden');
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('results').classList.add('hidden');
      
      contextUI.setContext('processing');
      devConsole.log('Starting AI processing pipeline', 'info');
      startAdvancedLoading();

      try {
        // Create order with all premium features
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            tier: 'deluxe', 
            addons: ['aura', 'twin_flame', 'past_life'] 
          })
        });
        const orderData = await orderResponse.json();
        orderId = orderData.id;

        // Submit intake data
        const formData = new FormData();
        if (photoInput.files.length > 0) {
          formData.append('photo', photoInput.files[0]);
        }
        formData.append('quiz', JSON.stringify({
          interest: document.getElementById('interest').value,
          birthday: document.getElementById('birthday').value,
          vibes: document.getElementById('vibes').value,
          dealbreakers: document.getElementById('dealbreakers').value,
          celeb: document.getElementById('celeb').value,
          style: 'realistic'
        }));

        await fetch('/api/orders/' + orderId + '/intake', {
          method: 'POST',
          body: formData
        });

        // Generate result
        const generateResponse = await fetch('/api/orders/' + orderId + '/generate', {
          method: 'POST'
        });
        const generateData = await generateResponse.json();
        
        // Complete loading animation
        completeAdvancedLoading();
        
        // Show results with cinematic reveal
        setTimeout(() => {
          document.getElementById('loading').classList.add('hidden');
          document.getElementById('results').classList.remove('hidden');
          document.getElementById('resultImage').src = '/' + generateData.imagePath;
          document.getElementById('pdfLink').href = '/' + generateData.pdfPath;
          
          // Load and display the profile text
          if (generateData.profileText) {
            document.getElementById('resultText').textContent = generateData.profileText;
          }
          
          // Add reveal animation
          const resultImage = document.getElementById('resultImage');
          resultImage.style.opacity = '0';
          resultImage.style.transform = 'scale(0.8)';
          
          resultImage.onload = () => {
            // Add cinematic reveal class
            document.getElementById('results').classList.add('cinematic-reveal');
            
            setTimeout(() => {
              resultImage.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
              resultImage.style.opacity = '1';
              resultImage.style.transform = 'scale(1)';
              resultImage.classList.add('revealed');
              
              // Trigger haptic and sound
              triggerHaptic('strong');
              audio.playTone(330, 0.5);
              setTimeout(() => audio.playTone(440, 0.3), 200);
              setTimeout(() => audio.playTone(550, 0.2), 400);
              
              contextUI.setContext('results');
              devConsole.log('Soulmate sketch generation completed successfully', 'success');
            }, 100);
          };
        }, 1500);
        
      } catch (error) {
        console.error('Error generating soulmate:', error);
        alert('Error generating your soulmate sketch. Please try again.');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('initialMessage').classList.remove('hidden');
      } finally {
        // Re-enable form
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const formInputs = e.target.querySelectorAll('input, select, textarea, button');
        formInputs.forEach(input => input.disabled = false);
        submitBtn.textContent = 'Create Soulmate Sketch';
      }
    });

    function restart() {
      orderId = null;
      
      // Reset form
      document.getElementById('soulmateForm').reset();
      photoInput.value = '';
      fileUpload.innerHTML = '<p>📸 Drag & drop or click to upload</p><p style="font-size: 12px; color: rgba(255,255,255,0.6);">Best results with clear face photos</p>';
      
      // Reset button text
      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Create Soulmate Sketch';
      
      // Reset UI
      document.getElementById('results').classList.add('hidden');
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('initialMessage').classList.remove('hidden');
    }
  </script>
</body>
</html>`;
}
