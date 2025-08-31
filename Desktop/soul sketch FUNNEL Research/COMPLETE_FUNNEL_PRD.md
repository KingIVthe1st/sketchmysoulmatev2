# ASTRO-SENSE SOULMATE FUNNEL - COMPLETE PRD FOR RECREATION

## TECHNICAL SPECIFICATIONS

### Framework & Technology Stack
- **Frontend**: Nuxt.js (Vue.js framework with SSR)
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite (based on _nuxt structure)
- **Icons**: Custom SVG icons + Unicode emojis
- **Fonts**: Custom font stack (sans-serif based)

### Color Palette
- **Primary Purple**: #7944C8 (buttons, progress bar)
- **Primary Background**: #FFF8F5 (cream/off-white)
- **Card Background**: #f0e9cb (beige for gender cards)
- **Card Border**: #FED6C0 (light orange)
- **Progress Background**: #FFEEE5 (light peach)
- **Text Primary**: #2D2D2D (dark gray)
- **Text Secondary**: #9F90A1 (muted purple-gray)

### Layout Structure
- **Container**: max-width-md sm:max-w-xl (responsive)
- **Mobile-first**: Full viewport height (h-svh)
- **Background Pattern**: Repeating magical chart image
- **Card Design**: Rounded-3xl with shadows and borders
- **Progress Bar**: Animated width transitions (duration-500)

---

## STEP-BY-STEP RECREATION GUIDE

### LANDING PAGE (Pre-funnel)
**URL Pattern**: `/soulmate`

**Header Section:**
- Logo: Hands icon + "Astro Sense" text
- Clean, centered layout

**Hero Section:**
- **Main Headline**: "Ready to finally discover your **True Soulmate?**" 
  - "True Soulmate" in purple (#7944C8)
- **Hero Image**: Soulmate illustration (soulmate-start-image.webp)
- **Benefit Badges**: 
  - Clock icon + "1-min quiz" in rounded pill (#F5EAF7 background, #A13A70 text)
  - Gift icon + "Detailed sketch portrait" in matching pill

**Social Proof Section:**
- **Stats**: "Astro Sense has helped **2,000,000+** people to find their perfect partner with **87% accuracy rate**"
- **Testimonial Card**:
  - Quote marks icon
  - Text: "I was skeptical but desperate. After 5 years of bad dates, this portrait helped me find Marcus in just 6 weeks! 💝 💝 Still can't believe it!"
  - Attribution: "Maria, Texas, 🇺🇸USA"
  - Profile image: statistics-woman.webp (circular, bottom-right)

**CTA Button:**
- Text: "Let's begin" with sparkle icons
- Style: Full-width, purple (#7944C8), rounded-2xl, py-4
- Hover: Slight opacity change (#7944C880)

**Footer:**
- Legal: Links to EULA and Privacy Notice
- Support: Email link to support@astro-sense.com
- Company: "Pintoulini LTD 28 Oktovriou, 367, Mediterranean Court, 1st Floor, office A5, 3107, Limassol, Cyprus"

---

### FUNNEL STEP TEMPLATE STRUCTURE

**Header (Consistent across all steps):**
- Back button (30x30px, rounded, light orange background)
- Centered logo (hands icon + text)
- Step counter: "X/14" format
- Horizontal divider line
- Progress bar: Purple fill on light background, animated width

**Content Area:**
- Question headline: Large, bold, center-aligned
- Options container: Scrollable with gradient fade effects
- Card-based selection system

**Option Card Design:**
- White background with light border
- Rounded-3xl corners
- Padding: px-4 py-2
- Min height: 12 (3rem)
- Hover effects: opacity-95, cursor-pointer
- Icon circle: 46x46px centered
- Text: Base font, medium weight, opacity-80

---

### STEP 1/14: GENDER SELECTION
**Question**: "Select your gender"
**Progress**: 7% (width: 7%)
**Card Style**: Special beige background (#f0e9cb) with orange border (#FED6C0)

**Options:**
1. **Male**: 
   - Icon: Male figure illustration (soulmate-gender-male.webp)
   - Text: "Male"
2. **Female**: 
   - Icon: Female figure illustration (soulmate-gender-female.webp)
   - Text: "Female"

**Layout**: 2-column grid (grid-cols-2), gap-6
**Card Size**: Height 36 md:52, full width images

---

### STEP 2/14: SEXUAL ORIENTATION
**Question**: "Who are you interested in?"
**Progress**: 14% (width: 14%)

**Options:**
1. **Male**: 
   - Emoji: 🧑 (32px)
   - Text: "Male"
2. **Female**: 
   - Emoji: 👩 (32px)  
   - Text: "Female"

**Layout**: Single column list, white cards

---

### STEP 3/14: AGE PREFERENCE
**Question**: "What is ideal age range for your soulmate?"
**Progress**: 21% (width: 21%)

**Options:**
1. **20-30**: 
   - Emoji: 👨‍🦱 (32px)
   - Text: "20-30"
2. **30-40**: 
   - Emoji: 👨 (32px)
   - Text: "30-40"
3. **40-50**: 
   - Emoji: 🧔 (32px)
   - Text: "40-50"
4. **50+**: 
   - Emoji: 👴 (32px)
   - Text: "50+"

**Layout**: Single column list, scrollable

---

### STEP 4/14: ETHNICITY PREFERENCE
**Question**: "Any preferred ethnic background for your soulmate?"
**Progress**: 29% (width: 29%)

**Options:**
1. **Caucasian/White**: 
   - Emoji: 👱🏻‍♂️ (32px)
   - Text: "Caucasian/White"
2. **Hispanic/Latino**: 
   - Emoji: 🧑🏽 (32px)
   - Text: "Hispanic/Latino"
3. **African/African-American**: 
   - Emoji: 👨🏿 (32px)
   - Text: "African/African-American"
4. **Asian**: 
   - Emoji: 🧑🏻‍🦱 (32px)
   - Text: "Asian"
5. **No preference**: 
   - Emoji: 🙂 (32px)
   - Text: "No preference"

**Layout**: Single column list, scrollable

---

### STEP 5/14: PERSONALITY TRAITS
**Question**: "What's the key quality your soulmate should have?"
**Progress**: 36% (width: 36%)

**Options:**
1. **Kindness**: 
   - Emoji: 🤗 (32px)
   - Text: "Kindness"
2. **Loyalty**: 
   - Emoji: 🤞 (32px)
   - Text: "Loyalty"
3. **Intelligence**: 
   - Emoji: 🧠 (32px)
   - Text: "Intelligence"
4. **Creativity**: 
   - Emoji: 🎨 (32px)
   - Text: "Creativity"
5. **Passion**: 
   - Emoji: 😍 (32px)
   - Text: "Passion"
6. **Empathy**: 
   - Emoji: 🥹 (32px)
   - Text: "Empathy"

**Layout**: Single column list, scrollable

---

## IMPLEMENTATION NOTES

### JavaScript Behavior
- Auto-advance on selection (no "Next" button needed)
- Click handlers on entire card elements
- Smooth progress bar animations
- Route transitions between steps

### Responsive Design
- Mobile-first approach
- Breakpoints: sm: (640px+), md: (768px+)
- Touch-friendly tap targets (min 44px)
- Proper viewport handling (h-svh for mobile)

### Animation & Transitions
- Progress bar: `transition-all duration-500`
- Hover effects: `hover:opacity-95`, `hover:scale-110`
- Card interactions: `active:opacity-95`

### Data Collection
- Form state management across steps
- URL routing for each step (/step/1, /step/2, etc.)
- Progress persistence (likely localStorage)

---

### STEP 6/14: INTROVERT VS EXTROVERT
**Question**: "Are you more of an introvert or extrovert?"
**Progress**: 43% (width: 43%)

**Options:**
1. **Introvert**: 
   - Emoji: 📚 (32px)
   - Text: "Introvert"
2. **Extrovert**: 
   - Emoji: 🎉 (32px)
   - Text: "Extrovert"

**Layout**: Single column list, white cards

---

### TRANSITION PAGE: CONGRATULATIONS
**Message**: "Awesome!" with celebration styling
**Progress**: Hidden during transition
**Background**: Different styling with celebratory elements
**Auto-advance**: Likely timed progression to next step

---

### STEP 7/14: BIRTH DATE
**Question**: "What's your birth date?"
**Progress**: 50% (width: 50%)
**Subtitle**: "We use this information to determine the placement and impact of the planets in your birth chart."

**Input Elements**:
1. **Month Dropdown**: 
   - Options: January, February, March... December
   - Default: "Month" placeholder
2. **Day Dropdown**: 
   - Options: 1, 2, 3... 31 (dynamic based on month)
   - Default: "Day" placeholder  
3. **Year Dropdown**:
   - Options: Range of years (likely 1940-2010+)
   - Default: "Year" placeholder

**Layout**: Three dropdowns in a row, centered
**Background**: Decorative astrology-themed background image

---

### STEP 8/14: BIRTH TIME
**Question**: "What time were you born?"
**Progress**: 57% (width: 57%)
**Subtitle**: "We use this information to determine the placement and impact of the planets in your birth chart."

**Input Elements**:
1. **Hour Dropdown**: 
   - Options: 1, 2, 3... 12
   - Default: "Hour" placeholder
2. **Minute Dropdown**: 
   - Options: 00, 01, 02... 59
   - Default: "Min" placeholder
3. **AM/PM Dropdown**:
   - Options: AM, PM
   - Default: "AM/PM" placeholder

**Special Option**:
- **Checkbox**: "I'm not sure" (allows skipping exact time)

**Layout**: Three dropdowns in a row, with checkbox below
**Background**: Same decorative astrology-themed background

---

### STEP 9/14: BIRTH PLACE
**Question**: "Specify your birth place"
**Progress**: 64% (width: 64%)
**Subtitle**: "We use this information to determine the placement and impact of the planets in your birth chart."

**Input Elements**:
1. **Place Search Field**: 
   - Type: Text input with autocomplete/search functionality
   - Placeholder: "Enter the city"
   - Style: Centered text, rounded-xl, purple focus border
   - Features: Likely connects to location API for city/country lookup

**Layout**: Single search input field, full width
**Background**: Bottom decorative image (bottom-bg.BJDX8lrw.webp)
**Button State**: "Next" button disabled until valid location entered

---

---

## TECHNICAL IMPLEMENTATION CHALLENGES DISCOVERED

### Form Validation Issues
**Birth Place Step (Step 9/14)**:
- Input field requires specific city format validation
- Autocomplete dropdown requires user selection from suggestions
- Manual text entry ("New York" or "New York, United States") doesn't pass validation
- Button remains disabled until valid location selected from dropdown
- Form reverts to previous steps when validation fails
- Likely uses external geocoding API (Google Places, Mapbox, etc.)

### URL Routing Protection
- Direct URL navigation to future steps blocked (/step/10 returns 404)
- Funnel enforces sequential progression through steps
- Form state management prevents skipping steps
- Each step validates required data before allowing progression

### JavaScript Interaction Patterns
- Standard Playwright click actions sometimes fail
- Requires JavaScript evaluation for complex interactions
- Form elements need manual event dispatching (change, input, blur events)
- Dropdown selections require `.value` setting + `.dispatchEvent()`

---

## ASTROLOGY THEME ANALYSIS

### Data Collection Strategy
The funnel systematically collects complete astrological birth data:

1. **Personal Identity** (Steps 1-2): Gender, sexual orientation
2. **Partner Preferences** (Steps 3-5): Age range, ethnicity, key qualities  
3. **Personality Assessment** (Step 6): Introvert vs extrovert
4. **Complete Birth Chart Data** (Steps 7-9):
   - Birth date (month/day/year)
   - Birth time (hour/minute/AM-PM) with "not sure" option
   - Birth place (city/country with geocoding validation)

### Astrological Accuracy Focus
- Multiple step descriptions emphasize "placement and impact of planets"
- Birth chart terminology: "ascendant, houses, position of the Moon"
- Suggests actual astrological calculations behind scenes
- Data completeness prioritized over speed (validation requirements)

---

## CONVERSION OPTIMIZATION PATTERNS

### Progress Psychology
- **Linear Progression**: 7% increments (7%, 14%, 21%, 29%, 36%, 43%, 50%, 57%, 64%)
- **Midpoint Celebration**: "Awesome!" transition page around 43% mark
- **Visual Progress Bar**: Prominent purple progress indicator
- **Step Counter**: "X/14" format builds completion expectation

### Form Design Patterns
- **Single Question Focus**: One primary question per step
- **Visual Selection**: Cards, emojis, illustrations over text lists
- **Immediate Feedback**: Auto-advance on selection (no "Next" button clicking)
- **Validation Enforcement**: Cannot proceed with invalid/incomplete data

### Trust Building Elements
- **Consistent Branding**: Logo on every step
- **Professional Design**: Consistent color palette, typography
- **Data Purpose Explanation**: Subtitle text explaining why information is needed
- **Progress Transparency**: Always show current step and percentage

---

## REMAINING STEPS TO DOCUMENT: 5 MORE STEPS (10-14/14)
*Further documentation pending resolution of Step 9 birth place validation requirement...*

## RECOMMENDATION FOR RECREATION

Based on analysis of Steps 1-9, the recreation should prioritize:

1. **Robust Form Validation**: Implement proper city/location autocomplete with external API
2. **Sequential Step Protection**: Prevent URL manipulation to skip steps  
3. **Progress State Management**: Maintain form state across page transitions
4. **Astrology Data Structure**: Prepare backend to handle complete birth chart calculations
5. **Mobile-First Responsive**: All elements tested and optimized for mobile interaction
6. **Professional Visual Design**: Exact color matching, typography, spacing as documented