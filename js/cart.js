/* Shopping Cart Manager - Ojas Organics */

// Core Product Definitions - Supporting 200ml and 500ml Sizes
const PRODUCTS = [
  {
    id: "brahmi-sesame",
    name: "Brahmi Infused Sesame Body Oil",
    category: "restorative",
    benefit: "Extreme Dry Skin / Restorative",
    shortDesc: "Our Ayurvedic crown jewel. Organic Brahmi (Gotu Kola) slow-infused into low-speed cold-pressed black sesame oil. Feeds nutrients deep into dry skin layers to repair compromised cell barriers and calm nerve endpoints.",
    image: "assets/images/bottle_brahmi_sesame.png",
    skinType: "Severely dry, dehydrated, or eczema-prone body skin",
    prices: {
      "200ml": 110.00,
      "500ml": 220.00
    }
  },

  {
    id: "organic-jojoba",
    name: "Cold-Pressed Golden Jojoba Body Oil",
    category: "soothing",
    benefit: "Liquid Wax Hydrator / Deep Shield",
    shortDesc: "100% certified organic unrefined golden jojoba. Mimics the skin's natural sebum, offering immediate cellular elasticity, barrier lock-down, and silky structural protection.",
    image: "assets/images/bottle_golden_jojoba.png",
    skinType: "Fatigued, tight, or moisture-depleted skin",
    prices: {
      "200ml": 72.00,
      "500ml": 144.00
    }
  },
  {
    id: "organic-sesame",
    name: "Cold-Pressed Sesame Body Oil",
    category: "warming",
    benefit: "Warming & Grounding / Deep Nourish",
    shortDesc: "An ancient comfort rich in zinc and calcium. Low-velocity extraction preserves active nutrients that warm cold tissue layers, soften rough limbs, and ground constitutional fatigue.",
    image: "assets/images/bottle_sesame.png",
    skinType: "Dry, cold-prone, or fatigued skin",
    prices: {
      "200ml": 54.00,
      "500ml": 108.00
    }
  },
  {
    id: "organic-coconut",
    name: "Cold-Pressed Coconut Body Oil",
    category: "cooling",
    benefit: "Cooling & Clarifying / Pitta Soothing",
    shortDesc: "Raw, unrefined organic coconut oil that melts upon dermal contact. Immensely cooling after sun exposure, forms a highly breathable skin barrier and locks in moisture.",
    image: "assets/images/bottle_coconut.png",
    skinType: "Sun-exposed, warm, or slightly sensitive skin",
    prices: {
      "200ml": 48.00,
      "500ml": 96.00
    }
  },
  {
    id: "organic-olive",
    name: "Cold-Pressed Olive Body Oil",
    category: "soothing",
    benefit: "Antioxidant Rich / Heavy Barrier Shield",
    shortDesc: "Organic cold-pressed extra-virgin olive oil packed with natural squalene and polyphenols. Acts as a heavy shield against dry air, preventing flaking and moisture-loss.",
    image: "assets/images/bottle_olive.png",
    skinType: "Chronically dry, thin, or wind-burned skin",
    prices: {
      "200ml": 52.00,
      "500ml": 104.00
    }
  },
  {
    id: "organic-almond",
    name: "Cold-Pressed Sweet Almond Body Oil",
    category: "cooling",
    benefit: "Hypoallergenic / Deep Dermal Softness",
    shortDesc: "Lightweight, delicate body oil rich in vitamins E and A. Soothes dry skin patches, relieves mild winter itch, and absorbs cleanly without leaving a greasy trace.",
    image: "assets/images/bottle_almond.png",
    skinType: "Highly delicate, sensitive, or child-like skin",
    prices: {
      "200ml": 60.00,
      "500ml": 120.00
    }
  },
  {
    id: "gandusha-sesame",
    name: "Gandusha Premium Sesame Oral Elixir",
    category: "gandusha",
    benefit: "Oral Detoxification / Gum Strength",
    shortDesc: "Our premier unrefined organic sesame oil, slow-pressed and cured specifically for daily Gandusha (oil pulling). Draws out oral impurities, strengthens gum tissue, balances saliva, and clarifies cellular channels.",
    image: "assets/images/bottle_gandusha.png",
    skinType: "Suitable for daily morning oral detoxification and gum care",
    prices: {
      "200ml": 45.00,
      "500ml": 90.00
    }
  }
];

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('ojas_cart')) || [];

// Cart Functions
function saveCart() {
  localStorage.setItem('ojas_cart', JSON.stringify(cart));
  updateCartCounters();
}

function addToCart(productId, size = "200ml", quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cartItemId = `${productId}-${size}`;
  const existingItemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: productId,
      cartItemId: cartItemId,
      name: product.name,
      price: product.prices[size],
      category: product.category,
      benefit: product.benefit,
      image: product.image,
      skinType: product.skinType,
      volume: size,
      quantity: quantity
    });
  }

  saveCart();
  renderCartItems();
  openCartDrawer();
}

function removeFromCart(cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  saveCart();
  renderCartItems();
}

function updateQuantity(cartItemId, delta) {
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;

  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartItems();
}

function getSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// UI Controllers
function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-backdrop');
  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-backdrop');
  if (drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-backdrop');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function updateCartCounters() {
  const counters = document.querySelectorAll('.cart-count');
  const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
  counters.forEach(counter => {
    counter.textContent = totalQty;
  });
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">♢</div>
        <h4>Your Alchemist Jar is Empty</h4>
        <p>Introduce the vital energies of our cold-pressed organic body essences to your daily self-care rituals.</p>
        <button class="btn-premium" onclick="closeCartDrawer()">View Collection</button>
      </div>
    `;
    updateTotalsDisplay(0);
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-cart-item-id="${item.cartItemId}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title-row">
          <h4 class="cart-item-title">${item.name}</h4>
          <button class="btn-remove-item" onclick="removeFromCart('${item.cartItemId}')" aria-label="Remove item">✕</button>
        </div>
        <div style="font-size: 9px; color: var(--color-gray-medium); margin-bottom: 2px;">Volume: ${item.volume}</div>
        <div class="cart-item-skin-tag">${item.benefit}</div>
        <div class="cart-item-bottom-row">
          <div class="cart-item-qty">
            <button class="btn-qty" onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="btn-qty" onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
          </div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      </div>
    </div>
  `).join('');

  updateTotalsDisplay(getSubtotal());
}

function updateTotalsDisplay(subtotal) {
  const subtotalLabel = document.getElementById('cart-subtotal-val');
  const totalLabel = document.getElementById('cart-total-val');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (subtotalLabel) subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;
  if (totalLabel) totalLabel.textContent = `$${subtotal.toFixed(2)}`;

  if (checkoutBtn) {
    if (subtotal === 0) {
      checkoutBtn.setAttribute('disabled', 'true');
      checkoutBtn.style.opacity = '0.5';
    } else {
      checkoutBtn.removeAttribute('disabled');
      checkoutBtn.style.opacity = '1';
    }
  }
}

function simulateCheckout() {
  if (cart.length === 0) return;

  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');

  if (container) {
    container.innerHTML = `
      <div class="checkout-success-view">
        <div class="success-check-icon">✓</div>
        <h4>Radiant Vitality Awaits</h4>
        <p>Your Ojas Organics body oils are being freshly sealed. Expect your 200ml pump bottles to arrive in 2-3 business days. Prepare your skin for deep holistic renewal.</p>
        <button class="btn-premium btn-gold" onclick="closeCartDrawer()">Begin Wellness Journey</button>
      </div>
    `;
  }

  if (footer) {
    footer.style.display = 'none';
  }

  cart = [];
  localStorage.removeItem('ojas_cart');
  updateCartCounters();

  const drawer = document.getElementById('cart-drawer');
  const resetObserver = new MutationObserver(() => {
    if (!drawer.classList.contains('active')) {
      setTimeout(() => {
        if (footer) footer.style.display = 'block';
        renderCartItems();
      }, 500);
      resetObserver.disconnect();
    }
  });
  resetObserver.observe(drawer, { attributes: true, attributeFilter: ['class'] });
}

// Initial Loading
document.addEventListener('DOMContentLoaded', () => {
  updateCartCounters();
  renderCartItems();
});
