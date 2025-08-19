const createMainTemplate = (content = '') => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soul Sketch - AI-Powered Soulmate Portrait Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="/css/animate.min.css">
</head>
<body>
    ${content}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/js/swiper-bundle.min.js"></script>
    <script src="/js/script.js"></script>
</body>
</html>`;
};

const createHomePage = () => {
  const homeContent = `
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#home">
                <img src="/images/logo.png" alt="Soul Sketch" height="40">
                Soul Sketch
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#gallery">Gallery</a></li>
                    <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
                    <li class="nav-item"><a class="nav-link" href="#faq">FAQ</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
        <div class="container">
            <div class="row align-items-center min-vh-100">
                <div class="col-lg-6">
                    <div class="hero-content">
                        <h1 class="display-4 fw-bold mb-4 animate__animated animate__fadeInLeft">
                            Discover Your <span class="text-gradient">Soulmate</span> Through AI Art
                        </h1>
                        <p class="lead mb-4 animate__animated animate__fadeInLeft animate__delay-1s">
                            Experience the magic of AI-powered portrait generation. Create stunning, personalized soulmate sketches that capture the essence of your perfect match.
                        </p>
                        <div class="hero-stats mb-4 animate__animated animate__fadeInUp animate__delay-2s">
                            <div class="row text-center">
                                <div class="col-4">
                                    <h3 class="text-gradient mb-0">10K+</h3>
                                    <small>Sketches Created</small>
                                </div>
                                <div class="col-4">
                                    <h3 class="text-gradient mb-0">4.8★</h3>
                                    <small>Rating</small>
                                </div>
                                <div class="col-4">
                                    <h3 class="text-gradient mb-0">24h</h3>
                                    <small>Delivery</small>
                                </div>
                            </div>
                        </div>
                        <div class="hero-buttons d-flex flex-column flex-sm-row gap-3 mb-3">
                            <button class="btn btn-primary btn-lg animate__animated animate__fadeInUp animate__delay-3s" onclick="showOrderForm()">
                                <i class="fas fa-palette me-2"></i>Start Your Sketch
                            </button>
                            <button class="btn btn-secondary btn-lg animate__animated animate__fadeInUp animate__delay-3s" onclick="showDemoForm()">
                                <i class="fas fa-play-circle me-2"></i>Try Demo
                            </button>
                        </div>
                        <button class="btn btn-outline-light btn-lg animate__animated animate__fadeInUp animate__delay-3s" onclick="scrollToSection('gallery')">
                            <i class="fas fa-images me-2"></i>View Gallery
                        </button>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image animate__animated animate__fadeInRight">
                        <img src="/images/hero-main.png" alt="AI Soulmate Sketch" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Demo Modal (3-Step Condensed Process) -->
    <div class="modal fade" id="demoModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-play-circle text-secondary me-2"></i>
                        Demo: Discover Your Soulmate
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Demo Step Progress -->
                    <div class="step-progress mb-4">
                        <div class="step active" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-title">About You</div>
                        </div>
                        <div class="step" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-title">Your Ideal Match</div>
                        </div>
                        <div class="step" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-title">Generate</div>
                        </div>
                    </div>

                    <form id="demoForm" enctype="multipart/form-data">
                        <!-- Demo Step 1: Basic Info -->
                        <div class="step-content active" id="demoStep1">
                            <h6 class="mb-3">Tell us about yourself</h6>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Your Name</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Birthdate</label>
                                    <input type="date" class="form-control" name="birthdate" required>
                                    <small class="text-muted">Used for numerology analysis</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">What gender are you looking for?</label>
                                    <select class="form-control" name="looking_for_gender" required>
                                        <option value="">Choose...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="surprise">Surprise Me!</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Demo Step 2: Preferences & Upload -->
                        <div class="step-content" id="demoStep2">
                            <h6 class="mb-3">Help us create your perfect match</h6>
                            
                            <!-- Photo Upload Section -->
                            <div class="mb-4">
                                <label class="form-label">Upload Your Photo (Optional)</label>
                                <input type="file" class="form-control" name="photo" accept="image/*">
                                <small class="text-muted">This helps us understand your style preferences</small>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Celebrity Crush</label>
                                    <input type="text" class="form-control" name="celebrity_crush" 
                                           placeholder="e.g. Ryan Gosling, Emma Stone">
                                    <small class="text-muted">Optional: helps with appearance inspiration</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Art Style Preference</label>
                                    <select class="form-control" name="art_style">
                                        <option value="realistic">Hyper-Realistic Portrait</option>
                                        <option value="ethereal">Ethereal & Dreamy</option>
                                        <option value="mystical">Mystical & Artistic</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Traits You're Looking For</label>
                                <textarea class="form-control" name="desired_traits" rows="3" 
                                          placeholder="Describe personality traits, interests, values you'd love in a soulmate..."></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Red Lines & Boundaries</label>
                                <textarea class="form-control" name="boundaries" rows="2" 
                                          placeholder="Any deal-breakers or important boundaries..."></textarea>
                                <small class="text-muted">Optional: helps avoid incompatible traits</small>
                            </div>
                        </div>

                        <!-- Demo Step 3: Generate Results -->
                        <div class="step-content" id="demoStep3">
                            <div class="text-center">
                                <div id="demoGenerating" style="display: none;">
                                    <div class="spinner-border text-primary mb-3" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <h6>Creating your soulmate portrait...</h6>
                                    <p class="text-muted">Using AI to generate your perfect match based on numerology and your preferences</p>
                                </div>
                                
                                <div id="demoResults" style="display: none;">
                                    <h6 class="mb-3">✨ Your Soulmate Awaits!</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="mb-0"><i class="fas fa-image me-2"></i>AI Portrait</h6>
                                                </div>
                                                <div class="card-body text-center">
                                                    <img id="generatedImage" src="" alt="Generated Soulmate" class="img-fluid rounded mb-2" style="max-height: 300px;">
                                                    <div>
                                                        <a id="downloadImage" href="" class="btn btn-outline-primary btn-sm" download>
                                                            <i class="fas fa-download me-1"></i>Download Image
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="mb-0"><i class="fas fa-file-pdf me-2"></i>Numerology Report</h6>
                                                </div>
                                                <div class="card-body">
                                                    <p class="text-muted">Complete personality analysis based on your birthdate and preferences</p>
                                                    <a id="downloadPDF" href="" class="btn btn-primary" target="_blank">
                                                        <i class="fas fa-file-pdf me-1"></i>View Full Report
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <p class="text-success"><i class="fas fa-check-circle me-1"></i>Demo Complete! Want the full experience?</p>
                                        <button class="btn btn-primary" onclick="upgradeToPremium()">
                                            <i class="fas fa-star me-2"></i>Upgrade to Premium
                                        </button>
                                    </div>
                                </div>

                                <div id="demoReady">
                                    <h6 class="mb-3">Ready to discover your soulmate?</h6>
                                    <p class="text-muted">We'll generate a hyper-realistic AI portrait and numerology-based personality analysis of your perfect match!</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="demoPrevBtn" onclick="previousDemoStep()" style="display: none;">Previous</button>
                    <button type="button" class="btn btn-primary" id="demoNextBtn" onclick="nextDemoStep()">Next</button>
                    <button type="button" class="btn btn-success" id="demoSubmitBtn" onclick="submitDemo()" style="display: none;">
                        <i class="fas fa-magic me-2"></i>Generate My Soulmate
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentDemoStep = 1;

        function showDemoForm() {
            new bootstrap.Modal(document.getElementById('demoModal')).show();
        }

        function showOrderForm() {
            // Add the full order form if needed
            alert('Full order form would be shown here');
        }

        // Demo Form Functions
        function nextDemoStep() {
            if (validateCurrentDemoStep()) {
                if (currentDemoStep < 3) {
                    currentDemoStep++;
                    updateDemoStepDisplay();
                }
            }
        }

        function previousDemoStep() {
            if (currentDemoStep > 1) {
                currentDemoStep--;
                updateDemoStepDisplay();
            }
        }

        function updateDemoStepDisplay() {
            // Update step indicators
            document.querySelectorAll('#demoModal .step').forEach((step, index) => {
                step.classList.toggle('active', index + 1 <= currentDemoStep);
            });

            // Update step content visibility
            document.querySelectorAll('#demoModal .step-content').forEach((content, index) => {
                content.classList.toggle('active', index + 1 === currentDemoStep);
            });

            // Update button visibility
            document.getElementById('demoPrevBtn').style.display = currentDemoStep > 1 ? 'block' : 'none';
            document.getElementById('demoNextBtn').style.display = currentDemoStep < 3 ? 'block' : 'none';
            document.getElementById('demoSubmitBtn').style.display = currentDemoStep === 3 ? 'block' : 'none';
        }

        function validateCurrentDemoStep() {
            const currentStepElement = document.getElementById('demoStep' + currentDemoStep);
            const requiredFields = currentStepElement.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            return isValid;
        }

        // Calculate numerology life path number
        function calculateLifePath(birthdate) {
            const date = new Date(birthdate);
            let sum = date.getDate() + (date.getMonth() + 1) + date.getFullYear();
            
            // Reduce to single digit
            while (sum > 9) {
                sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
            }
            
            return sum;
        }

        async function submitDemo() {
            if (!validateCurrentDemoStep()) return;

            // Show loading state
            document.getElementById('demoReady').style.display = 'none';
            document.getElementById('demoGenerating').style.display = 'block';
            document.getElementById('demoSubmitBtn').disabled = true;

            const formData = new FormData(document.getElementById('demoForm'));
            const demoData = Object.fromEntries(formData.entries());

            try {
                // Create demo order
                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: demoData.email,
                        tier: 'demo',
                        addons: []
                    })
                });

                if (!response.ok) throw new Error('Failed to create demo order');
                const order = await response.json();

                // Calculate numerology
                const lifePath = calculateLifePath(demoData.birthdate);
                
                // Prepare demo quiz data with enhanced prompts for numerology and realism
                const quizData = {
                    name: demoData.name,
                    email: demoData.email,
                    birthdate: demoData.birthdate,
                    life_path_number: lifePath,
                    looking_for_gender: demoData.looking_for_gender,
                    celebrity_crush: demoData.celebrity_crush || '',
                    desired_traits: demoData.desired_traits || '',
                    boundaries: demoData.boundaries || '',
                    style: demoData.art_style || 'realistic',
                    interest: demoData.looking_for_gender,
                    vibes: demoData.desired_traits,
                    celeb: demoData.celebrity_crush,
                    is_demo: true,
                    // Enhanced prompt for numerology
                    numerology_focus: true,
                    // Enhanced prompt for hyper-realism
                    hyper_realistic: true
                };

                // Submit intake data with photo if provided
                const intakeFormData = new FormData();
                intakeFormData.append('quiz', JSON.stringify(quizData));
                
                if (formData.get('photo') && formData.get('photo').size > 0) {
                    intakeFormData.append('photo', formData.get('photo'));
                }

                const intakeResponse = await fetch('/orders/' + order.id + '/intake', {
                    method: 'POST',
                    body: intakeFormData
                });

                if (!intakeResponse.ok) throw new Error('Failed to submit demo intake');

                // Generate demo results
                const generateResponse = await fetch('/orders/' + order.id + '/generate', {
                    method: 'POST'
                });

                if (!generateResponse.ok) throw new Error('Failed to generate demo');
                const result = await generateResponse.json();

                // Hide loading and show results
                document.getElementById('demoGenerating').style.display = 'none';
                document.getElementById('demoResults').style.display = 'block';

                // Display generated image
                if (result.imagePath) {
                    const imageUrl = '/' + result.imagePath;
                    document.getElementById('generatedImage').src = imageUrl;
                    document.getElementById('downloadImage').href = imageUrl;
                }

                // Display PDF link
                if (result.pdfPath) {
                    const pdfUrl = '/' + result.pdfPath;
                    document.getElementById('downloadPDF').href = pdfUrl;
                }

            } catch (error) {
                document.getElementById('demoGenerating').style.display = 'none';
                document.getElementById('demoReady').style.display = 'block';
                document.getElementById('demoSubmitBtn').disabled = false;
                alert('Demo generation failed: ' + error.message);
            }
        }

        function upgradeToPremium() {
            bootstrap.Modal.getInstance(document.getElementById('demoModal')).hide();
            setTimeout(() => {
                showOrderForm();
            }, 300);
        }

        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ 
                behavior: 'smooth' 
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateDemoStepDisplay();
        });
    </script>

    <!-- Add the rest of your page sections here (About, Gallery, Pricing, FAQ, Contact, etc.) -->
    <!-- For brevity, I'm not including them here, but they should remain as they were -->
    
  `;
  
  return createMainTemplate(homeContent);
};

export const demoHtml = createHomePage;

export {
  createMainTemplate,
  createHomePage
};