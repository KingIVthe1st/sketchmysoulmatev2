export const SiteTheme = {
  primary: '#E91E63',
  accent: '#673AB7',
  soft: '#FCE4EC',
  text: '#2D2240',
};

export function demoHtml({ baseUrl }) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Soulmate Sketch - Demo</title>
  <style>
    :root { --pink: ${SiteTheme.primary}; --accent:${SiteTheme.accent}; --soft:${SiteTheme.soft}; --text:${SiteTheme.text}; --glass: rgba(255,255,255,0.6); --shadow: 0 20px 50px rgba(34, 0, 51, 0.18); }
    * { box-sizing: border-box }
    body { font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: var(--text); background: #0b0711; margin: 0; min-height: 100dvh; overflow-x: hidden; }
    .bg { position: fixed; inset: 0; z-index: -2; background: radial-gradient(1200px 800px at 15% 20%, #2a0d4d 0%, rgba(10,6,20,0.3) 60%, transparent 70%), radial-gradient(1000px 700px at 85% 15%, #531b86 0%, rgba(83,27,134,0.3) 50%, transparent 70%), radial-gradient(1200px 900px at 75% 80%, #eb3b86 0%, rgba(235,59,134,0.25) 55%, transparent 75%); filter: saturate(1.05) contrast(1.05); }
    .aurora { position: fixed; inset: -20%; z-index: -1; background: conic-gradient(from 180deg at 50% 50%, rgba(235,59,134,0.16), rgba(103,58,183,0.16), rgba(235,59,134,0.16)); mix-blend-mode: screen; filter: blur(80px); animation: swirl 18s linear infinite; opacity: .9 }
    @keyframes swirl { to { transform: rotate(360deg) } }
    .grain { position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: .06; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.4"/></svg>'); }
    header { padding: 48px 20px 28px; text-align:center; color: white; }
    h1 { font-size: 44px; margin: 0; letter-spacing: -0.5px; }
    h1 span { color: var(--pink); }
    .shell { max-width: 980px; margin: 0 auto 80px; padding: 0 16px; }
    .wizard { backdrop-filter: saturate(1.4) blur(14px); background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55)); border: 1px solid rgba(255,255,255,0.35); border-radius: 20px; box-shadow: var(--shadow); overflow: hidden; }
    .steps { display:flex; gap: 8px; padding: 12px; background: #faf7fb; border-bottom: 1px solid #eee; }
    .step { flex:1; height: 8px; border-radius: 999px; background:#eee; position:relative; overflow:hidden; }
    .step.active::after, .step.done::after { content:''; position:absolute; inset:0; background: linear-gradient(90deg, var(--pink), var(--accent)); }
    .panel { padding: 28px; display:none; }
    .panel.active { display:block; animation: fade 300ms ease; }
    @keyframes fade { from { opacity:0; transform: translateY(4px);} to{ opacity:1; transform:none; } }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .card { background: rgba(255,255,255,0.8); padding: 16px; border-radius: 14px; border:1px solid rgba(240,236,245,0.8); box-shadow: 0 10px 30px rgba(32,0,63,0.06); }
    label { display:block; font-weight:600; margin-bottom: 6px; }
    input[type="text"], input[type="email"], select, textarea { width: 100%; padding: 12px 14px; border: 1px solid #e5e5e7; border-radius: 12px; font-size: 14px; }
    textarea { min-height: 90px; }
    .btn { position: relative; isolation: isolate; background: linear-gradient(90deg, var(--pink), #ff5fa1); color: white; border: none; padding: 12px 18px; border-radius: 999px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(233,30,99,0.35); transition: transform .12s ease; }
    .btn::before { content:''; position:absolute; inset:-2px; border-radius: 999px; background: linear-gradient(90deg, rgba(255,255,255,.6), rgba(255,255,255,0)); z-index:-1; filter: blur(8px); opacity:.5 }
    .btn:hover { transform: translateY(-1px) }
    .btn.secondary { background: linear-gradient(90deg, var(--accent), #8f6ae0); box-shadow: 0 8px 20px rgba(103,58,183,0.3); }
    .row { display:flex; gap: 12px; align-items:center; flex-wrap: wrap; }
    .muted { color: #514a61; }
    .previewWrap { perspective: 1200px; }
    .preview { max-width: 100%; border-radius: 18px; box-shadow: 0 20px 55px rgba(103,58,183,0.25); transform: rotateX(0) rotateY(0); transition: transform 180ms ease; }
    .actions { display:flex; justify-content: space-between; margin-top: 12px; }
    .ghost { background: transparent; color: var(--accent); border: 1px solid #e9e1f5; }
    .share { display:flex; gap: 12px; align-items:center; }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.35); border-top-color: white; border-radius: 50%; display: inline-block; animation: spin 800ms linear infinite; margin-left: 8px; }
    @keyframes spin { to { transform: rotate(360deg) } }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="aurora"></div>
  <div class="grain"></div>
  <header>
    <h1>💘 <span>Soulmate Sketch</span> Demo</h1>
    <p class="muted">Experience a streamlined version of the flow powering the landing page.</p>
  </header>

  <div class="shell">
  <div class="wizard">
    <div class="steps"><div class="step done" id="s1"></div><div class="step" id="s2"></div><div class="step" id="s3"></div></div>

    <div class="panel active" id="p1">
      <h2>1) Start your order</h2>
      <div class="grid">
      <div>
        <label>Email</label>
        <input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div>
        <label>Package</label>
        <select id="tier">
          <option value="basic">Basic ($19)</option>
          <option value="premium" selected>Premium ($39)</option>
          <option value="deluxe">Deluxe ($69)</option>
        </select>
      </div>
      <div>
        <label>Add-ons</label>
        <div class="row">
          <label><input type="checkbox" value="aura" class="addon"/> Aura reading</label>
          <label><input type="checkbox" value="twin_flame" class="addon"/> Twin Flame</label>
          <label><input type="checkbox" value="past_life" class="addon"/> Past life</label>
        </div>
      </div>
      <div class="actions">
        <span class="muted" id="orderStatus"></span>
        <button class="btn" id="createOrder">Continue</button>
      </div>
    </div>
    </div>

    <div class="panel" id="p2">
      <h2>2) Upload photo and answer a few questions</h2>
      <div class="grid">
      <div>
        <label>Photo (optional)</label>
        <input id="photo" type="file" accept="image/*" />
      </div>
      <div>
        <label>What vibes attract you?</label>
        <input id="vibes" type="text" placeholder="warm, grounded, playful..."/>
      </div>
      <div>
        <label>Dealbreakers</label>
        <input id="dealbreakers" type="text" placeholder="non-smoker, unreliable..."/>
      </div>
      <div>
        <label>Celebrity vibes (optional)</label>
        <input id="celeb" type="text" placeholder="e.g. Zendaya, Michael B. Jordan"/>
      </div>
      <div class="actions">
        <button class="btn ghost" id="back1">Back</button>
        <div class="row">
          <span class="muted" id="quizStatus"></span>
          <button class="btn secondary" id="submitQuiz">Continue</button>
        </div>
      </div>
    </div>
    </div>

    <div class="panel" id="p3">
      <h2>3) Generate my sketch + profile</h2>
      <div class="row">
        <button class="btn" id="generate">Generate <span id="spin" class="spinner" style="display:none"></span></button>
        <p class="muted" id="genStatus"></p>
      </div>
      <div id="result" class="grid previewWrap"></div>
      <div id="share" class="share" style="display:none;">
        <a id="storyLink" class="btn ghost" target="_blank">Open Story Image</a>
        <button class="btn secondary" id="copyLink">Copy Share Link</button>
      </div>
      <div class="actions">
        <button class="btn ghost" id="back2">Back</button>
      </div>
    </div>
  </div>
  </div>

  <script>
    // Use relative paths to avoid origin mismatches
    const api = {
      createOrder: () => '/api/orders',
      intake: (id) => "/api/orders/" + id + "/intake",
      generate: (id) => "/api/orders/" + id + "/generate",
    };
    let orderId = null;
    function go(step){
      const ids=['p1','p2','p3'];
      ids.forEach((id,i)=>{
        document.getElementById(id).classList.toggle('active', i===step-1);
        document.getElementById('s'+(i+1)).className = 'step ' + (i<step? 'done': '');
      });
    }

    async function createOrder(){
      const btn = document.getElementById('createOrder');
      const statusEl = document.getElementById('orderStatus');
      btn.disabled = true; statusEl.textContent = 'Creating order...';
      try {
        const email = document.getElementById('email').value;
        const tier = document.getElementById('tier').value;
        const addonEls = document.querySelectorAll('.addon:checked');
        const addons = Array.from(addonEls).map(a => a.value);
        const res = await fetch(api.createOrder(), { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, tier, addons }) });
        const txt = await res.text();
        if(!res.ok) throw new Error('Create failed: ' + txt);
        const data = JSON.parse(txt);
        orderId = data.id;
        statusEl.textContent = 'Order #' + orderId + ' created.';
        go(2);
      } catch (e) {
        console.error(e);
        statusEl.textContent = 'Error: ' + e.message;
      } finally {
        btn.disabled = false;
      }
    }
    document.getElementById('createOrder').onclick = createOrder;

    async function submitQuiz(){
      const btn = document.getElementById('submitQuiz');
      const statusEl = document.getElementById('quizStatus');
      if(!orderId) { alert('Create order first'); return; }
      btn.disabled = true; statusEl.textContent = 'Submitting...';
      try {
        const form = new FormData();
        const file = document.getElementById('photo').files[0];
        if(file) form.append('photo', file);
        form.append('quiz', JSON.stringify({ vibes: document.getElementById('vibes').value, dealbreakers: document.getElementById('dealbreakers').value, celeb: document.getElementById('celeb').value, style: 'ethereal' }));
        const res = await fetch(api.intake(orderId), { method: 'POST', body: form });
        const txt = await res.text();
        if(!res.ok) throw new Error('Intake failed: ' + txt);
        statusEl.textContent = 'Intake saved.';
        // Advance to generate step
        go(3);
      } catch (e) {
        console.error(e);
        statusEl.textContent = 'Error: ' + e.message;
      } finally {
        btn.disabled = false;
      }
    }
    document.getElementById('submitQuiz').onclick = submitQuiz;
    document.getElementById('back1').onclick = ()=>go(1);
    document.getElementById('back2').onclick = ()=>go(2);

    async function generate(){
      const btn = document.getElementById('generate');
      const spin = document.getElementById('spin');
      const statusEl = document.getElementById('genStatus');
      if(!orderId) { alert('Create order first'); return; }
      btn.disabled = true; spin.style.display='inline-block'; statusEl.textContent = 'Generating... this can take ~10–20s';
      try {
        const res = await fetch(api.generate(orderId), { method: 'POST' });
        const txt = await res.text();
        if(!res.ok) throw new Error('Generate failed: ' + txt);
        const data = JSON.parse(txt);
        statusEl.textContent = 'Generated!';
        const container = document.getElementById('result');
        container.innerHTML = '';
        if(data.image){
          const img = document.createElement('img'); img.src = data.image; img.className = 'preview'; container.appendChild(img);
          const wrap = container; let rect;
          function onMove(e){ if(!rect) rect = wrap.getBoundingClientRect(); const x=(e.clientX-rect.left)/rect.width-0.5; const y=(e.clientY-rect.top)/rect.height-0.5; img.style.transform = 'rotateX(' + (-y*6).toFixed(2) + 'deg) rotateY(' + (x*6).toFixed(2) + 'deg)'; }
          function onLeave(){ img.style.transform = 'rotateX(0) rotateY(0)'; rect=null }
          wrap.addEventListener('mousemove', onMove); wrap.addEventListener('mouseleave', onLeave);
        }
        if(data.pdf){
          const a = document.createElement('a'); a.href = data.pdf; a.textContent = 'Download Compatibility Report (PDF)'; a.target = '_blank'; container.appendChild(a);
        }
        if(data.share){
          const share = document.getElementById('share');
          const story = document.getElementById('storyLink');
          story.href = data.share; share.style.display='flex';
          document.getElementById('copyLink').onclick = async ()=>{
            await navigator.clipboard.writeText(location.origin + data.share);
            alert('Story link copied!');
          }
        }
      } catch (e) {
        console.error(e);
        statusEl.textContent = 'Error: ' + e.message;
      } finally {
        btn.disabled = false; spin.style.display='none';
      }
    }
    document.getElementById('generate').onclick = generate;

    function burst(){
      const N=26; const root=document.body; const box=document.createElement('div'); box.style.position='fixed'; box.style.inset='0'; box.style.pointerEvents='none'; root.appendChild(box);
      for(let i=0;i<N;i++){
        const s=document.createElement('span'); s.style.position='absolute'; s.style.left='50%'; s.style.top='25%'; s.style.width='10px'; s.style.height='16px'; s.style.borderRadius='2px'; s.style.background = 'hsl(' + Math.floor(Math.random()*360) + ',90%,65%)'; s.style.transform = 'translate(-50%,-50%) rotate(' + (Math.random()*360) + 'deg)'; s.style.boxShadow='0 2px 6px rgba(0,0,0,.15)';
        const dx=(Math.random()*2-1)*220; const dy=(Math.random()*-1)*240-120; const rot=(Math.random()*720-360);
        s.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) rotate(' + rot + 'deg)',opacity:0}],{duration:900+Math.random()*400, easing:'cubic-bezier(.21,.61,.35,1)'});
        box.appendChild(s);
      }
      setTimeout(()=>box.remove(),1200);
    }
  </script>
</body>
</html>`;
}
