/* Web Interaction Coordinator - Ojas Organics */

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initProductCatalog();
  initMobileNav();
  initParallaxEffects();
});

// Scroll Effects (Frosted Navbar & Reveal Transitions)
function initScrollEffects() {
  const header = document.querySelector('.header');
  
  // Track scroll position for header height and frosted backing
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // IntersectionObserver for elements fading in on scroll
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Product Grid Rendering & Filtering
function initProductCatalog() {
  const grid = document.getElementById('products-grid');
  const filters = document.querySelectorAll('.filter-btn');
  
  if (!grid) return;

  // Render initial catalog
  renderCatalog('all');

  // Set up filter click handlers
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      
      // Animate grid transition
      grid.style.opacity = '0';
      setTimeout(() => {
        renderCatalog(category);
        grid.style.opacity = '1';
      }, 250);
    });
  });
}

// Visual-First Product Card Rendering
function renderCatalog(filter) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filteredList = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filteredList.map((product, index) => {
    const isHero = product.category === 'restorative';
    return `
      <div class="product-card reveal reveal-delay-${(index % 4) + 1} ${isHero ? 'hero-product-highlight' : ''} active" data-product-id="${product.id}">
        ${isHero ? `<span class="product-hero-tag">Restorative</span>` : ''}
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-quick-view-overlay">
            <button class="btn-quick-view" onclick="openProductQuickDetail('${product.id}')">Quick View</button>
          </div>
        </div>
        <div class="product-info-wrap">
          <div class="product-meta-header">
            <h4 class="product-card-title">${product.name}</h4>
          </div>
          <span class="product-skin-benefit">${product.benefit}</span>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
            <span class="product-volume-label" style="font-size: 8.5px; color: var(--color-warm-gray); text-transform: uppercase; font-family: var(--font-sans); letter-spacing: var(--ls-widest); font-weight: 500;">200ml</span>
            <div class="product-size-selector" style="display: flex; gap: 4px;">
              <button class="size-btn active" data-size="200ml" onclick="selectCardSize(event, '${product.id}', '200ml')" aria-label="Select 200ml">200ml</button>
              <button class="size-btn" data-size="500ml" onclick="selectCardSize(event, '${product.id}', '500ml')" aria-label="Select 500ml">500ml</button>
            </div>
          </div>

          <div class="product-card-actions">
            <button class="btn-add-to-cart" onclick="addToCart('${product.id}', '200ml')">
              <span>Add to Cart</span> · <span class="btn-price-span">$${product.prices["200ml"].toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Card Size Selector
function selectCardSize(event, productId, size) {
  event.stopPropagation();
  const card = event.target.closest('.product-card');
  if (!card) return;

  const buttons = card.querySelectorAll('.size-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const priceVal = product.prices[size];
  
  // Update volume label
  const volumeLabel = card.querySelector('.product-volume-label');
  if (volumeLabel) volumeLabel.textContent = size;

  // Update Add to Cart button
  const addToCartBtn = card.querySelector('.btn-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.setAttribute('onclick', `addToCart('${productId}', '${size}')`);
    const priceSpan = addToCartBtn.querySelector('.btn-price-span');
    if (priceSpan) priceSpan.textContent = `$${priceVal.toFixed(2)}`;
  }
}

// Modal Size Selector
function selectModalSize(event, productId, size) {
  const container = event.target.closest('#quiz-container');
  if (!container) return;

  const buttons = container.querySelectorAll('.size-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const priceVal = product.prices[size];

  const priceLabel = container.querySelector('.modal-price-label');
  if (priceLabel) priceLabel.textContent = `$${priceVal.toFixed(2)}`;

  const volumeLabel = container.querySelector('.modal-volume-label');
  if (volumeLabel) volumeLabel.textContent = `Volume: ${size}`;

  const addToCartBtn = container.querySelector('.btn-modal-add');
  if (addToCartBtn) {
    addToCartBtn.setAttribute('onclick', `addToCartAndClose('${productId}', '${size}')`);
  }
}

// Mobile Nav
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.textContent = '☰';
    });
  });
}

// Parallax
function initParallaxEffects() {
  const parallaxPanes = document.querySelectorAll('.hero-image-pane');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    parallaxPanes.forEach(pane => {
      const img = pane.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.05) translateY(${scrolled * 0.08}px)`;
      }
    });
  });
}

// Quick View Modal
function openProductQuickDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quiz-modal');
  const container = document.getElementById('quiz-container');
  if (!modal || !container) return;

  modal.classList.add('active');

  const defaultContent = container.innerHTML;

  container.innerHTML = `
    <button class="btn-close-quiz" id="btn-close-detail" aria-label="Close modal">✕</button>
    <div style="padding: var(--spacing-2xl); display: grid; grid-template-columns: 1fr 1.2fr; gap: var(--spacing-xl); max-height: 85vh; overflow-y: auto;">
      <div style="background-color: var(--color-parchment); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; padding: var(--spacing-md);">
        <img src="${product.image}" alt="${product.name}" style="max-height: 300px; width: auto; object-fit: contain;">
      </div>
      <div style="display: flex; flex-direction: column; justify-content: center;">
        <span class="recommendation-badge">${product.benefit}</span>
        <h3 style="font-family: var(--font-serif); font-size: var(--fs-3xl); margin-bottom: 2px; letter-spacing: var(--ls-wide);">${product.name}</h3>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border-light); padding-bottom: 8px;">
          <span class="modal-volume-label" style="font-family: var(--font-sans); font-size: var(--fs-xs); font-weight: 600; text-transform: uppercase; color: var(--color-warm-gray); letter-spacing: var(--ls-widest);">Volume: 200ml</span>
          <div class="product-size-selector" style="display: flex; gap: 4px;">
            <button class="size-btn active" data-size="200ml" onclick="selectModalSize(event, '${product.id}', '200ml')">200ml</button>
            <button class="size-btn" data-size="500ml" onclick="selectModalSize(event, '${product.id}', '500ml')">500ml</button>
          </div>
        </div>

        <span style="font-family: var(--font-sans); font-size: var(--fs-xs); font-weight: 600; text-transform: uppercase; color: var(--color-sage); margin-bottom: var(--spacing-md); letter-spacing: var(--ls-widest);">For: ${product.skinType}</span>
        <p style="font-size: var(--fs-sm); color: var(--color-bark-soft); line-height: 1.7; margin-bottom: var(--spacing-lg);">${product.shortDesc}</p>
        <div style="display: flex; align-items: center; gap: var(--spacing-xl); margin-top: auto;">
          <span class="modal-price-label" style="font-family: var(--font-serif); font-size: var(--fs-2xl); font-weight: 500;">$${product.prices["200ml"].toFixed(2)}</span>
          <button class="btn-premium btn-gold btn-modal-add" onclick="addToCartAndClose('${product.id}', '200ml')" style="flex: 1;">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  const closeDetail = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      container.innerHTML = defaultContent;
      modal.onclick = (e) => {
        if (e.target === modal) closeQuiz();
      };
    }, 400);
  };

  const closeBtn = document.getElementById('btn-close-detail');
  if (closeBtn) closeBtn.addEventListener('click', closeDetail);
  
  modal.onclick = (e) => {
    if (e.target === modal) closeDetail();
  };
}

// Hero Product Size Toggle
function selectHeroSize(event, size) {
  const section = event.target.closest('.hero-product-info');
  if (!section) return;

  const buttons = section.querySelectorAll('.size-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const product = PRODUCTS.find(p => p.id === 'gandusha-sesame');
  if (!product) return;

  const priceVal = product.prices[size];

  const priceDisplay = document.getElementById('hero-price-display');
  if (priceDisplay) {
    priceDisplay.innerHTML = `$${priceVal.toFixed(2)}`;
  }

  const volumeLabel = section.querySelector('.hero-volume-label');
  if (volumeLabel) volumeLabel.textContent = `Volume: ${size}`;

  const addToCartBtn = document.getElementById('btn-hero-add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.setAttribute('onclick', `addToCart('gandusha-sesame', '${size}')`);
  }
}
