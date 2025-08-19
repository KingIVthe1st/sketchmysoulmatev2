export const SiteTheme = {
  primary: '#E91E63',
  accent: '#673AB7',
  soft: '#FCE4EC',
  text: '#2D2240',
};

export function demoHtml({ baseUrl }) {
  return `<!DOCTYPE html>
<html lang="zxx">
<head>
  <!-- Meta -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
  <meta name="description" content="Share your preferences and optional birth details. Our AI generates a custom soulmate sketch and mini reading—delivered to your inbox within 24 hours." />
  <meta name="keywords" content="soulmate sketch, AI generated art, personalized portraits" />
  <meta name="author" content="SoulmateSketch AI" />
  
  <!-- Page Title -->
  <title>Sketch My Soulmate — Personalized AI Soulmate Portraits in 24 Hours</title>
  
  <!-- Meta Tags -->
  <meta property="og:title" content="Sketch My Soulmate — Personalized AI Soulmate Portraits in 24 Hours" />
  <meta property="og:description" content="Share your preferences and optional birth details. Our AI generates a custom soulmate sketch and mini reading—delivered in 24 hours." />
  <meta property="og:image" content="/images/hero-image.jpg" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  
  <!-- Favicon Icon -->
  <link rel="shortcut icon" type="image/x-icon" href="images/favicon.png" />
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
  
  <!-- CSS Files -->
  <link href="css/bootstrap.min.css" rel="stylesheet" media="screen" />
  <link href="css/slicknav.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="css/swiper-bundle.min.css" />
  <link href="css/all.min.css" rel="stylesheet" media="screen" />
  <link href="css/animate.css" rel="stylesheet" />
  <link rel="stylesheet" href="css/magnific-popup.css" />
  <link rel="stylesheet" href="css/mousecursor.css" />
  <link href="css/custom.css" rel="stylesheet" media="screen" />
  
  <style>
    /* Additional custom styles for API integration */
    .order-step { display: none; }
    .order-step.active { display: block; }
    .progress-bar { transition: width 0.3s ease; }
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      display: none;
    }
    .api-message {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid #667eea;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid #ef4444;
      color: #ef4444;
    }
    .success-message {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid #22c55e;
      color: #22c55e;
    }
    .result-container {
      display: none;
      margin-top: 40px;
    }
    .result-image {
      max-width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
  </style>
</head>

<body>
  <!-- Preloader Start -->
  <div class="preloader">
    <div class="loading-container">
      <div class="loading"></div>
      <div id="loading-icon"><img src="images/loader.svg" alt="" /></div>
    </div>
  </div>
  <!-- Preloader End -->

  <!-- Loading Overlay -->
  <div id="loadingOverlay" class="loading-overlay">
    <div class="text-center">
      <div class="loading-container">
        <div class="loading"></div>
      </div>
      <p style="color: white; margin-top: 20px;">Creating your soulmate sketch...</p>
    </div>
  </div>

  <!-- Header Start -->
  <header class="main-header bg-section">
    <div class="header-sticky">
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <!-- Logo Start -->
          <a class="navbar-brand" href="#home">
            <img src="images/logo.svg" alt="Sketch My Soulmate Logo" style="width: 183px; height: 50px" />
          </a>
          <!-- Logo End -->

          <!-- Main Menu Start -->
          <div class="collapse navbar-collapse main-menu">
            <div class="nav-menu-wrapper">
              <ul class="navbar-nav mr-auto" id="menu">
                <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                <li class="nav-item"><a class="nav-link" href="#gallery">Gallery</a></li>
                <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
                <li class="nav-item"><a class="nav-link" href="#how-it-works">How It Works</a></li>
                <li class="nav-item"><a class="nav-link" href="#reviews">Reviews</a></li>
              </ul>
            </div>

            <!-- Header Btn Start -->
            <div class="header-btn">
              <a href="#order" class="btn-default" onclick="showOrderForm()">Start your sketch</a>
            </div>
            <!-- Header Btn End -->
          </div>
          <!-- Main Menu End -->
          <div class="navbar-toggle"></div>
        </div>
      </nav>
      <div class="responsive-menu"></div>
    </div>
  </header>
  <!-- Header End -->

  <!-- Hero Section Start -->
  <div id="home" class="hero bg-section">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-lg-12">
          <!-- Hero Box Start -->
          <div class="hero-box">
            <!-- Hero Content Start -->
            <div class="hero-content">
              <!-- Section Title Start -->
              <div class="section-title">
                <h3 class="wow fadeInUp">Sketch My Soulmate</h3>
                <h1 class="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                  See the face you're <span>destined</span> to meet
                </h1>
                <p class="wow fadeInUp" data-wow-delay="0.4s">
                  Share your story and preferences—our AI generates a personalized soulmate sketch and mini reading, delivered to your inbox within 24 hours.
                </p>
              </div>
              <!-- Section Title End -->

              <!-- Hero Button Start -->
              <div class="hero-btn wow fadeInUp" data-wow-delay="0.6s">
                <a href="#order" class="btn-default" onclick="showOrderForm()">Start your sketch</a>
                <a href="#gallery" class="btn-default btn-highlighted">View samples</a>
              </div>
              <!-- Hero Button End -->

              <!-- Review Box Start -->
              <div class="review-box wow fadeInUp" data-wow-delay="0.8s">
                <!-- Review Images Start -->
                <div class="review-images">
                  <div class="review-image">
                    <figure class="image-anime">
                      <img src="images/author-1.jpg" alt="Happy customer 1" loading="lazy" />
                    </figure>
                  </div>
                  <div class="review-image">
                    <figure class="image-anime">
                      <img src="images/author-2.jpg" alt="Happy customer 2" loading="lazy" />
                    </figure>
                  </div>
                  <div class="review-image">
                    <figure class="image-anime">
                      <img src="images/author-3.jpg" alt="Happy customer 3" loading="lazy" />
                    </figure>
                  </div>
                  <div class="review-image">
                    <figure class="image-anime">
                      <img src="images/author-4.jpg" alt="Happy customer 4" loading="lazy" />
                    </figure>
                  </div>
                  <div class="review-image add-more">
                    <i class="fa-solid fa-plus"></i>
                  </div>
                </div>
                <!-- Review Images End -->

                <!-- Review Content Start -->
                <div class="satisfy-client-content">
                  <p>10,000+ sketches delivered • 4.8/5 average rating • 24h delivery</p>
                </div>
                <!-- Review Content End -->
              </div>
              <!-- Review Box End -->
            </div>
            <!-- Hero Content End -->

            <!-- Hero Image Box Start -->
            <div class="hero-image-box">
              <!-- Hero Image Start -->
              <div class="hero-image">
                <figure class="image-anime">
                  <img src="images/home/hero.jpg" alt="Sketch My Soulmate Hero" />
                </figure>
              </div>
              <!-- Hero Image End -->

              <!-- Contact Us Circle Start -->
              <div class="contact-us-circle">
                <a href="#order" onclick="showOrderForm()">
                  <img src="images/order-first-sketch-circle.svg" alt="Order your sketch" />
                </a>
              </div>
              <!-- Contact Us Circle End -->
            </div>
            <!-- Hero Image Box End -->
          </div>
          <!-- Hero Box End -->
        </div>
      </div>
    </div>
  </div>
  <!-- Hero Section End -->

  <!-- Order Form Section Start -->
  <div id="order" class="contact-map-form" style="padding: 80px 0; display: block;">
    <div class="container">
      <div class="row section-row">
        <div class="col-lg-8 offset-lg-2">
          <div class="section-title section-title-center">
            <h3 class="wow fadeInUp">Order Form</h3>
            <h2 class="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
              Create your <span>soulmate sketch</span>
            </h2>
          </div>

          <!-- Order Progress -->
          <div class="order-progress wow fadeInUp" data-wow-delay="0.1s">
            <div id="stepLabel">Step 1 of 3 — About You</div>
            <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow="1">
              <div id="progressBar" class="progress-bar" style="width: 33.33%"></div>
            </div>
          </div>

          <!-- Messages -->
          <div id="orderMessages"></div>

          <!-- Order Form -->
          <form id="orderForm" novalidate>
            <!-- Step 1: Basic Info -->
            <section id="step1" class="order-step active" aria-labelledby="step1_title">
              <div class="section-title section-title-center">
                <h3 class="wow fadeInUp">Step 1</h3>
                <h2 id="step1_title" class="wow fadeInUp" data-wow-delay="0.1s" data-cursor="-opaque" style="margin: 40px 0">
                  About <span>you</span>
                </h2>
              </div>
              <div class="contact-us-form">
                <div class="row">
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label" for="email">Email <span>*</span></label>
                    <input type="email" class="form-control" id="email" required />
                  </div>
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label" for="tier">Package</label>
                    <select id="tier" class="form-control">
                      <option value="basic">Basic - $29</option>
                      <option value="plus">Plus - $49</option>
                      <option value="premium" selected>Premium - $79</option>
                    </select>
                  </div>
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label" for="attractedTo">Attracted to</label>
                    <select id="attractedTo" class="form-control">
                      <option value="all-genders">All Genders</option>
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="non-binary">Non-Binary</option>
                    </select>
                  </div>
                  <div class="form-group col-md-6 mb-4">
                    <label class="form-label" for="style">Art Style</label>
                    <select id="style" class="form-control">
                      <option value="ethereal">Ethereal</option>
                      <option value="realistic">Realistic</option>
                      <option value="anime">Anime</option>
                      <option value="painterly">Painterly</option>
                    </select>
                  </div>
                  <div class="form-group col-md-12 mb-4">
                    <label class="form-label" for="personality">Ideal personality & vibe</label>
                    <textarea id="personality" rows="3" class="form-control" placeholder="Describe the personality traits and energy you're drawn to..."></textarea>
                  </div>
                </div>
              </div>
              <div class="what-we-btn order-nav" style="margin: 40px 0">
                <button type="button" class="btn-default next" onclick="nextStep()">Next</button>
              </div>
            </section>

            <!-- Step 2: Upload Photo -->
            <section id="step2" class="order-step" aria-labelledby="step2_title">
              <div class="section-title section-title-center">
                <h3>Step 2</h3>
                <h2 id="step2_title" data-cursor="-opaque" style="margin: 40px 0">
                  Upload your <span>photo</span>
                </h2>
              </div>
              <div class="contact-us-form">
                <div class="row">
                  <div class="form-group col-md-12 mb-4">
                    <label class="form-label">Your Photo (Optional but recommended)</label>
                    <div class="file-upload-area" style="border: 2px dashed #ccc; padding: 40px; text-align: center; border-radius: 8px; cursor: pointer;" onclick="document.getElementById('photo').click()">
                      <i class="fa-solid fa-cloud-upload" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                      <p>Click to upload or drag and drop your photo</p>
                      <p style="font-size: 12px; color: #666;">Best results with clear face photos. JPG, PNG up to 10MB</p>
                      <input type="file" id="photo" accept="image/*" style="display: none;" />
                    </div>
                    <div id="photoPreview" style="margin-top: 16px; display: none;">
                      <img id="previewImage" style="max-width: 200px; border-radius: 8px;" />
                    </div>
                  </div>
                  <div class="form-group col-md-12 mb-4">
                    <label class="form-label" for="physicalPreferences">Physical preferences (Optional)</label>
                    <textarea id="physicalPreferences" rows="3" class="form-control" placeholder="Describe any physical traits you're drawn to (hair, eyes, build, etc.)..."></textarea>
                  </div>
                  <div class="form-group col-md-12 mb-4">
                    <label class="form-label" for="dealbreakers">Deal-breakers (Optional)</label>
                    <textarea id="dealbreakers" rows="2" class="form-control" placeholder="Any absolute no-gos or important requirements..."></textarea>
                  </div>
                </div>
              </div>
              <div class="what-we-btn order-nav" style="margin: 40px 0">
                <button type="button" class="btn-default back" onclick="prevStep()">Back</button>
                <button type="button" class="btn-default next" onclick="nextStep()">Next</button>
              </div>
            </section>

            <!-- Step 3: Generate -->
            <section id="step3" class="order-step" aria-labelledby="step3_title">
              <div class="section-title section-title-center">
                <h3>Step 3</h3>
                <h2 id="step3_title" data-cursor="-opaque" style="margin: 40px 0">
                  Generate your <span>sketch</span>
                </h2>
              </div>
              <div class="contact-us-form">
                <div class="row">
                  <div class="col-md-12 text-center">
                    <p>Ready to create your personalized soulmate sketch? Our AI will combine all your preferences to generate a unique portrait and mystical reading.</p>
                    <div class="pricing-summary" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h4>Order Summary</h4>
                      <div id="pricingSummary">
                        <p>Package: <span id="selectedTier">Premium</span></p>
                        <p>Price: <span id="totalPrice">$79</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="what-we-btn order-nav" style="margin: 40px 0">
                <button type="button" class="btn-default back" onclick="prevStep()">Back</button>
                <button type="button" class="btn-default" onclick="submitOrder()" id="generateBtn">Generate Sketch</button>
              </div>
            </section>
          </form>

          <!-- Results Section -->
          <div id="results" class="result-container">
            <div class="section-title section-title-center">
              <h3>Your Results</h3>
              <h2 data-cursor="-opaque" style="margin: 40px 0">
                Your <span>soulmate sketch</span>
              </h2>
            </div>
            <div id="resultContent">
              <!-- Results will be populated here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Order Form Section End -->

  <!-- Footer Start -->
  <footer class="main-footer bg-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 text-center">
          <p>&copy; 2024 SoulmateSketch AI. Powered by advanced AI technology.</p>
        </div>
      </div>
    </div>
  </footer>
  <!-- Footer End -->

  <!-- JavaScript Files -->
  <script src="js/jquery-3.7.1.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/jquery.slicknav.min.js"></script>
  <script src="js/swiper-bundle.min.js"></script>
  <script src="js/jquery.counterup.min.js"></script>
  <script src="js/waypoints.min.js"></script>
  <script src="js/wow.min.js"></script>
  <script src="js/jquery.magnific-popup.min.js"></script>
  <script src="js/mousecursor.js"></script>
  <script src="js/custom.js"></script>

  <script>
    // Global variables
    let currentStep = 1;
    let orderData = {};
    let currentOrderId = null;
    
    // API Base URL
    const API_BASE = '${baseUrl}/api';

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      // Photo upload preview
      document.getElementById('photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('photoPreview').style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });

      // Tier change handler
      document.getElementById('tier').addEventListener('change', function() {
        updatePricingSummary();
      });

      updatePricingSummary();
    });

    // Show order form
    function showOrderForm() {
      document.getElementById('order').style.display = 'block';
      document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    }

    // Update pricing summary
    function updatePricingSummary() {
      const tier = document.getElementById('tier').value;
      const tierNames = { basic: 'Basic', plus: 'Plus', premium: 'Premium' };
      const tierPrices = { basic: '$29', plus: '$49', premium: '$79' };
      
      document.getElementById('selectedTier').textContent = tierNames[tier];
      document.getElementById('totalPrice').textContent = tierPrices[tier];
    }

    // Navigation functions
    function nextStep() {
      if (validateCurrentStep()) {
        currentStep++;
        updateStepDisplay();
      }
    }

    function prevStep() {
      currentStep--;
      updateStepDisplay();
    }

    function updateStepDisplay() {
      // Hide all steps
      document.querySelectorAll('.order-step').forEach(step => {
        step.classList.remove('active');
      });
      
      // Show current step
      document.getElementById('step' + currentStep).classList.add('active');
      
      // Update progress
      const progress = (currentStep / 3) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
      
      // Update step label
      const stepLabels = {
        1: 'Step 1 of 3 — About You',
        2: 'Step 2 of 3 — Upload Photo',
        3: 'Step 3 of 3 — Generate'
      };
      document.getElementById('stepLabel').textContent = stepLabels[currentStep];
    }

    function validateCurrentStep() {
      if (currentStep === 1) {
        const email = document.getElementById('email').value;
        if (!email || !email.includes('@')) {
          showMessage('Please enter a valid email address.', 'error');
          return false;
        }
      }
      return true;
    }

    // Show message
    function showMessage(message, type = 'info') {
      const messagesDiv = document.getElementById('orderMessages');
      messagesDiv.innerHTML = \`<div class="api-message \${type === 'error' ? 'error-message' : type === 'success' ? 'success-message' : ''}">\${message}</div>\`;
      setTimeout(() => messagesDiv.innerHTML = '', 5000);
    }

    // Submit order
    async function submitOrder() {
      try {
        showMessage('Creating your order...', 'info');
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        // Step 1: Create order
        const orderResponse = await fetch(\`\${API_BASE}/orders\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            tier: document.getElementById('tier').value,
            addons: []
          })
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }

        const orderData = await orderResponse.json();
        currentOrderId = orderData.id;

        // Step 2: Submit intake data
        const formData = new FormData();
        
        // Add photo if uploaded
        const photoFile = document.getElementById('photo').files[0];
        if (photoFile) {
          formData.append('photo', photoFile);
        }

        // Prepare quiz data
        const quiz = {
          attractedTo: document.getElementById('attractedTo').value,
          style: document.getElementById('style').value,
          personality: document.getElementById('personality').value,
          physicalPreferences: document.getElementById('physicalPreferences').value,
          dealbreakers: document.getElementById('dealbreakers').value
        };

        formData.append('quiz', JSON.stringify(quiz));

        const intakeResponse = await fetch(\`\${API_BASE}/orders/\${currentOrderId}/intake\`, {
          method: 'POST',
          body: formData
        });

        if (!intakeResponse.ok) {
          throw new Error('Failed to submit intake data');
        }

        // Step 3: Generate sketch
        const generateResponse = await fetch(\`\${API_BASE}/orders/\${currentOrderId}/generate\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!generateResponse.ok) {
          throw new Error('Failed to generate sketch');
        }

        const result = await generateResponse.json();
        
        // Hide loading and show results
        document.getElementById('loadingOverlay').style.display = 'none';
        showResults(result);
        
      } catch (error) {
        document.getElementById('loadingOverlay').style.display = 'none';
        showMessage('Error: ' + error.message, 'error');
        console.error('Order submission error:', error);
      }
    }

    // Show results
    function showResults(result) {
      const resultContent = document.getElementById('resultContent');
      
      resultContent.innerHTML = \`
        <div class="row">
          <div class="col-md-8 offset-md-2 text-center">
            \${result.imagePath ? \`<img src="\${result.imagePath}" class="result-image" alt="Your soulmate sketch" />\` : ''}
            
            \${result.profileText ? \`
              <div class="result-text-container" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h4>Your Mystical Reading</h4>
                <div class="result-text">\${result.profileText}</div>
              </div>
            \` : ''}
            
            <div class="result-actions" style="margin: 30px 0;">
              \${result.pdfPath ? \`<a href="\${result.pdfPath}" class="btn-default" download>Download PDF</a>\` : ''}
              <button class="btn-default btn-secondary" onclick="location.reload()">Create Another</button>
            </div>
          </div>
        </div>
      \`;

      // Hide order form and show results
      document.getElementById('order').style.display = 'none';
      document.getElementById('results').style.display = 'block';
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
      
      showMessage('Your soulmate sketch has been generated successfully!', 'success');
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  </script>
</body>
</html>`;
}
