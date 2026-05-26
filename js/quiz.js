/* Ayurvedic Skin Oil Finder Quiz - Ojas Organics */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How does your body skin feel after bathing or in dry weather?",
    options: [
      { text: "Tight, dry, flaky, or rough on my limbs (arms and shins)", points: { dry: 3, normal: 0, sensitive: 1, oily: 0 } },
      { text: "Sensitized, warm, prone to winter itch or sudden redness", points: { dry: 1, normal: 0, sensitive: 3, oily: 0 } },
      { text: "Soft, slightly oily, or slow to absorb heavy body lotions", points: { dry: 0, normal: 1, sensitive: 0, oily: 3 } },
      { text: "Supple, comfortably hydrated, and naturally balanced", points: { dry: 0, normal: 3, sensitive: 1, oily: 1 } }
    ]
  },
  {
    id: 2,
    question: "What is your primary body skin wellness concern?",
    options: [
      { text: "Severe dehydration, deep cracks, dry eczema patches", points: { dry: 5, normal: 0, sensitive: 1, oily: 0 } },
      { text: "Reducing redness, irritation, or reaction to synthetic fabrics", points: { dry: 1, normal: 0, sensitive: 4, oily: 0 } },
      { text: "Sluggish dermal circulation, minor body pore congestion", points: { dry: 0, normal: 2, sensitive: 2, oily: 2 } },
      { text: "Maintaining cellular elasticity and a daily protective aura", points: { dry: 2, normal: 3, sensitive: 0, oily: 0 } }
    ]
  },
  {
    id: 3,
    question: "What constitutional temperature do you naturally carry in your limbs?",
    options: [
      { text: "Chronically cold joints, fingers, and toes; craves warming massage", points: { dry: 3, normal: 1, sensitive: 1, oily: 0 } },
      { text: "Constantly warm, easily overheated, prefers cooling sensations", points: { dry: 1, normal: 0, sensitive: 4, oily: 1 } },
      { text: "Slow-moving circulation, skin feels cool but rarely gets dry", points: { dry: 0, normal: 0, sensitive: 0, oily: 4 } },
      { text: "Perfectly balanced heat, adapts easily to environmental shifts", points: { dry: 0, normal: 4, sensitive: 0, oily: 1 } }
    ]
  },
  {
    id: 4,
    question: "What seasonal environment causes the most distress to your skin barrier?",
    options: [
      { text: "Dry winter wind and central heating, causing tight cracks", points: { dry: 4, normal: 0, sensitive: 1, oily: 0 } },
      { text: "Direct summer sun exposure, causing burning or heat rashes", points: { dry: 3, normal: 1, sensitive: 2, oily: 0 } },
      { text: "Humid, sticky weather, making heavy body lotions feel congested", points: { dry: 0, normal: 1, sensitive: 1, oily: 3 } },
      { text: "Moderate temperate transitions cause minor, easily balanced dryness", points: { dry: 0, normal: 3, sensitive: 1, oily: 1 } }
    ]
  }
];

// Quiz State Variables
let currentSlideIndex = 0;
let userAnswers = {}; // Map of slide index -> points object

function openQuiz() {
  const modal = document.getElementById('quiz-modal');
  modal.classList.add('active');
  resetQuiz();
}

function closeQuiz() {
  const modal = document.getElementById('quiz-modal');
  modal.classList.remove('active');
}

function resetQuiz() {
  currentSlideIndex = 0;
  userAnswers = {};
  buildQuizSlides();
  showSlide(0);
}

function buildQuizSlides() {
  const body = document.getElementById('quiz-body');
  if (!body) return;

  body.innerHTML = QUIZ_QUESTIONS.map((q, qIndex) => `
    <div class="quiz-slide" id="quiz-slide-${qIndex}">
      <span class="recommendation-badge">Ritual Quiz • Question ${q.id} of ${QUIZ_QUESTIONS.length}</span>
      <h4 class="question-text">${q.question}</h4>
      <div class="quiz-options">
        ${q.options.map((opt, oIndex) => `
          <div class="quiz-option" onclick="selectQuizOption(${qIndex}, ${oIndex})">
            <div class="option-radio"></div>
            <span class="option-label">${opt.text}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <div class="quiz-slide" id="quiz-slide-recommendation">
      <div class="recommendation-view" id="recommendation-view"></div>
    </div>
  `;
}

function selectQuizOption(questionIndex, optionIndex) {
  const slides = document.getElementById(`quiz-slide-${questionIndex}`);
  const options = slides.querySelectorAll('.quiz-option');
  
  options.forEach((opt, idx) => {
    if (idx === optionIndex) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });

  // Store user selection points
  userAnswers[questionIndex] = QUIZ_QUESTIONS[questionIndex].options[optionIndex].points;

  // Auto-advance after small delay for organic feel
  setTimeout(() => {
    nextQuizSlide();
  }, 350);
}

function showSlide(index) {
  const slides = document.querySelectorAll('.quiz-slide');
  slides.forEach(slide => slide.classList.remove('active'));

  const activeSlide = document.getElementById(index === 'recommendation' ? 'quiz-slide-recommendation' : `quiz-slide-${index}`);
  if (activeSlide) activeSlide.classList.add('active');

  // Update navigation buttons
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const progress = document.getElementById('quiz-progress');

  if (prevBtn) {
    if (index === 0 || index === 'recommendation') {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }
  }

  if (nextBtn) {
    if (index === 'recommendation') {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-flex';
      // Disable next until answer is picked
      if (userAnswers[index] === undefined) {
        nextBtn.setAttribute('disabled', 'true');
        nextBtn.style.opacity = '0.5';
      } else {
        nextBtn.removeAttribute('disabled');
        nextBtn.style.opacity = '1';
      }
    }
  }

  // Update progress bar
  if (progress) {
    if (index === 'recommendation') {
      progress.style.width = '100%';
    } else {
      const pct = ((index) / QUIZ_QUESTIONS.length) * 100;
      progress.style.width = `${pct || 10}%`;
    }
  }
}

function nextQuizSlide() {
  if (currentSlideIndex < QUIZ_QUESTIONS.length - 1) {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  } else if (currentSlideIndex === QUIZ_QUESTIONS.length - 1) {
    calculateRecommendation();
    currentSlideIndex = 'recommendation';
    showSlide(currentSlideIndex);
  }
}

function prevQuizSlide() {
  if (currentSlideIndex === 'recommendation') {
    currentSlideIndex = QUIZ_QUESTIONS.length - 1;
    showSlide(currentSlideIndex);
  } else if (currentSlideIndex > 0) {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
  }
}

function calculateRecommendation() {
  // Aggregate Points
  let totalScore = { dry: 0, normal: 0, sensitive: 0, oily: 0 };
  
  Object.values(userAnswers).forEach(points => {
    totalScore.dry += points.dry || 0;
    totalScore.normal += points.normal || 0;
    totalScore.sensitive += points.sensitive || 0;
    totalScore.oily += points.oily || 0;
  });

  // Recommendation engine
  let recommendedProduct = null;

  // Determine highest score
  const maxCategory = Object.keys(totalScore).reduce((a, b) => totalScore[a] > totalScore[b] ? a : b);

  if (maxCategory === 'dry') {
    // Spotlight hero product for extreme dry skin!
    recommendedProduct = PRODUCTS.find(p => p.id === 'brahmi-sesame');
  } else if (maxCategory === 'sensitive') {
    // Spotlight Sandalwood Jojoba for extreme dry & sensitive!
    recommendedProduct = PRODUCTS.find(p => p.id === 'sandalwood-jojoba');
  } else if (maxCategory === 'oily') {
    recommendedProduct = PRODUCTS.find(p => p.id === 'organic-coconut');
  } else {
    // Default or balanced profile
    recommendedProduct = PRODUCTS.find(p => p.id === 'organic-sesame');
  }

  const recView = document.getElementById('recommendation-view');
  if (!recView) return;

  recView.innerHTML = `
    <span class="recommendation-badge">Diagnostic Complete</span>
    <h3 class="recommendation-title">Your Ayurvedic Skin Match</h3>
    <div class="recommendation-card">
      <div class="rec-img-wrap">
        <img src="${recommendedProduct.image}" alt="${recommendedProduct.name}">
      </div>
      <div class="rec-info-wrap">
        <h4 class="rec-item-title">${recommendedProduct.name}</h4>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-sm); border-bottom: 1px solid rgba(28,28,28,0.05); padding-bottom: 6px;">
          <span class="modal-volume-label" style="font-family: var(--font-sans); font-size: 8.5px; font-weight: 500; text-transform: uppercase; color: var(--color-gray-medium); letter-spacing: var(--ls-widest);">Volume: 200ml</span>
          <div class="product-size-selector" style="display: flex; gap: 4px;">
            <button class="size-btn active" data-size="200ml" onclick="selectModalSize(event, '${recommendedProduct.id}', '200ml')">200ml</button>
            <button class="size-btn" data-size="500ml" onclick="selectModalSize(event, '${recommendedProduct.id}', '500ml')">500ml</button>
          </div>
        </div>

        <span class="rec-item-skin-type">Suitable for: ${recommendedProduct.skinType}</span>
        <p class="rec-item-desc">${recommendedProduct.shortDesc}</p>
        <div class="rec-actions">
          <button class="btn-premium btn-gold btn-modal-add" onclick="addToCartAndClose('${recommendedProduct.id}', '200ml')" style="flex: 1; border-radius: 0px;">
            Add Match to Cart - <span class="modal-price-label">$${recommendedProduct.prices["200ml"].toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
    <button class="btn-link" onclick="resetQuiz()">Retake Skin Quiz</button>
  `;
}

function addToCartAndClose(productId, size = "200ml") {
  addToCart(productId, size);
  closeQuiz();
}

// Attach listener to key overlay closure
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('quiz-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuiz();
    });
  }
});
