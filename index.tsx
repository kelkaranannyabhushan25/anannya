import { GoogleGenAI } from "@google/genai";

// --- DATA ---
const INGREDIENTS = [
  { name: "Cupuaçu Butter", source: "Amazon Rainforest", function: "Moisture Retention", benefit: "Absorbs 440% its weight in water." },
  { name: "Jojoba Oil", source: "Desert Shrub Seeds", function: "Barrier Protection", benefit: "Mimics natural skin oils." },
  { name: "Candelilla Wax", source: "Desert Succulent", function: "Vegan Sealant", benefit: "Provides smooth plant-based glide." },
  { name: "Vitamin E", source: "Sunflower Seeds", function: "Antioxidant", benefit: "Protects against stressors." },
  { name: "Castor Seed Oil", source: "Ricinus Communis", function: "High Shine", benefit: "Creates dewy finish." }
];

const PRODUCTS = [
  { id: "dew-stick", name: "The Dew Stick", price: 1499, image: "https://i.ibb.co/twdxvzTy/Screenshot-2026-02-13-172401.png", description: "All-day moisture with a sheer finish.", ingredients: INGREDIENTS.slice(0, 4) },
  { id: "natural-lipstick", name: "Natural Lipstick", price: 2499, image: "https://i.ibb.co/ccr3qvj8/Screenshot-2026-02-13-172938.png", description: "Luxury satin finish with botanical pigments.", ingredients: [INGREDIENTS[1], INGREDIENTS[4]] },
  { id: "night-mask", name: "The Night Mask", price: 2199, image: "https://i.ibb.co/kV3csC8X/Screenshot-2026-02-13-172249.png", description: "Deep repair with a calming lavender scent.", ingredients: INGREDIENTS.slice(0, 3) }
];

// --- STATE ---
let cart = [];
let aiChat = null;

// --- CORE FUNCTIONS ---
function showView(viewId, productId = null) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  window.scrollTo(0, 0);
  
  if (viewId === 'home') renderHome();
  if (viewId === 'product') renderProductDetail(productId);
  if (viewId === 'glossary') renderGlossary();
}

function renderHome() {
  const container = document.getElementById('view-home');
  container.innerHTML = `
    <!-- Hero -->
    <section class="relative min-h-screen flex flex-col lg:flex-row items-center">
      <div class="w-full lg:w-1/2 flex items-center px-8 lg:px-32 py-20">
        <div class="max-w-xl">
          <span class="inline-block py-1 px-3 rounded-full bg-sage/20 text-sage text-[9px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">Clean · Vegan · Pure</span>
          <h1 class="text-6xl lg:text-8xl font-serif font-light leading-[1.1] mb-8">Skincare for <br />your <span class="text-terracotta font-medium italic">Smile</span>.</h1>
          <p class="text-base text-charcoal/60 mb-12 leading-relaxed max-w-md">Crafted with only 10 essential natural ingredients. No fillers, no toxins, just pure hydration.</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button onclick="window.showProduct('dew-stick')" class="bg-terracotta text-white px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] shadow-lg shadow-terracotta/20 transition-all hover:bg-terracotta/90">Shop the Collection</button>
            <button class="border border-charcoal/10 bg-white px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] hover:bg-cream transition-all">Our Story</button>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/2 h-[60vh] lg:h-screen bg-white overflow-hidden relative">
        <img src="https://i.ibb.co/nN6p4mNy/Screenshot-2026-02-13-173117.png" class="w-full h-full object-cover" alt="Hero">
        <div class="absolute inset-0 bg-sage/10 mix-blend-multiply"></div>
      </div>
    </section>

    <!-- Essential Care -->
    <section class="py-24 px-6 bg-cream max-w-7xl mx-auto">
      <div class="mb-12">
        <h2 class="text-3xl lg:text-4xl font-serif font-medium italic">Essential Care</h2>
        <p class="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">The core essentials for daily hydration.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${PRODUCTS.map(p => `
          <div class="bg-white rounded-2xl overflow-hidden border border-charcoal/5 group hover:shadow-xl transition-all cursor-pointer" onclick="window.showProduct('${p.id}')">
            <div class="aspect-square bg-white overflow-hidden">
              <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
            </div>
            <div class="p-8">
              <div class="flex justify-between mb-3">
                <h3 class="font-bold uppercase tracking-widest text-xs">${p.name}</h3>
                <span class="font-bold text-terracotta text-xs">₹${p.price.toLocaleString()}</span>
              </div>
              <p class="text-[11px] text-charcoal/40 leading-relaxed">${p.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Spotlight -->
    <section class="py-32 bg-cream px-6 border-t border-sage/5">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="relative">
          <div class="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
            <img src="https://i.ibb.co/CpW8G0SX/Screenshot-2026-02-13-173543.png" class="w-full h-full object-cover scale-110" alt="Butter">
          </div>
          <div class="absolute -bottom-6 -right-6 bg-sage p-8 rounded-2xl text-white shadow-2xl max-w-[240px]">
            <p class="text-xs font-bold leading-relaxed uppercase tracking-widest">"Botanically sourced: Creamy, potent, restorative."</p>
          </div>
        </div>
        <div>
          <span class="text-sage font-bold uppercase tracking-widest text-[9px] mb-6 block">Ingredient Spotlight</span>
          <h2 class="text-5xl font-serif mb-10 italic leading-tight">Meet <span class="text-terracotta">Cupuaçu Butter</span></h2>
          <p class="text-sm text-charcoal/50 mb-10 leading-relaxed max-w-md">Sourced from the Amazon, Cupuaçu absorbs up to 440% of its weight in water, making it a natural hydration miracle.</p>
          <ul class="space-y-6">
            <li class="flex items-center gap-4">
              <div class="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center"><i data-lucide="check" class="w-3 h-3 text-sage"></i></div>
              <h4 class="font-bold text-[11px] uppercase tracking-widest">Deep Hydration</h4>
            </li>
            <li class="flex items-center gap-4">
              <div class="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center"><i data-lucide="check" class="w-3 h-3 text-sage"></i></div>
              <h4 class="font-bold text-[11px] uppercase tracking-widest">Natural Elasticity</h4>
            </li>
            <li class="flex items-center gap-4">
              <div class="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center"><i data-lucide="check" class="w-3 h-3 text-sage"></i></div>
              <h4 class="font-bold text-[11px] uppercase tracking-widest">Protective Barrier</h4>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `;
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

function renderProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const container = document.getElementById('view-product');
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-12">
      <button onclick="window.showHome()" class="text-[10px] font-bold uppercase tracking-widest text-sage mb-8 inline-flex items-center gap-2 hover:gap-4 transition-all">← Back to Shop</button>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div class="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-sage/5"><img src="${p.image}" class="w-full h-full object-cover"></div>
        <div>
          <h1 class="text-5xl lg:text-6xl font-serif italic mb-6 text-charcoal">${p.name}</h1>
          <p class="text-lg text-charcoal/70 mb-10 leading-relaxed">${p.description}</p>
          <div class="space-y-4 mb-10">
            <div class="p-6 rounded-2xl border-2 border-sage bg-white flex justify-between font-bold text-xs uppercase tracking-widest shadow-xl">
              <span>One-time Purchase</span><span>₹${p.price.toLocaleString()}</span>
            </div>
          </div>
          <button onclick="window.addToCart('${p.id}')" class="w-full bg-terracotta text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-terracotta/90 transition-all">Add to Cart — ₹${p.price.toLocaleString()}</button>
          
          <div class="mt-16 border-t border-sage/10 pt-12">
            <h4 class="font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Botanical Composition</h4>
            <div class="flex flex-wrap gap-3">
              ${p.ingredients.map(ing => `
                <div class="ingredient-tooltip relative">
                  <span class="px-5 py-2.5 rounded-full border border-sage/20 text-[10px] uppercase font-bold cursor-help hover:bg-sage hover:text-white transition-all shadow-sm">${ing.name}</span>
                  <div class="tooltip-content absolute bottom-full left-0 mb-4 w-64 p-6 bg-white rounded-2xl shadow-2xl border border-sage/10 z-50">
                    <p class="text-[10px] font-black text-sage uppercase mb-2">${ing.function}</p>
                    <p class="text-[11px] text-charcoal/70 italic leading-relaxed">"${ing.benefit}"</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

function renderGlossary() {
  const container = document.getElementById('view-glossary');
  container.innerHTML = `
    <section class="py-24 px-6 bg-white border-b border-sage/10">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-sage font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">The Flora Filter</span>
        <h1 class="text-5xl lg:text-7xl font-serif italic mb-8">Ingredient Glossary</h1>
        <p class="text-lg text-charcoal/70 mb-12">Explore the 10 plant-derived ingredients that make our formulas effective. No secrets, no fillers.</p>
        <div class="relative max-w-lg mx-auto">
          <input type="text" id="glossary-search" placeholder="Search for an ingredient..." class="w-full px-14 py-5 rounded-full bg-cream border-none italic text-sm focus:ring-2 focus:ring-sage transition-all shadow-inner">
          <i data-lucide="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-sage"></i>
        </div>
      </div>
    </section>
    <div class="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8" id="glossary-grid">
      ${INGREDIENTS.map(ing => `
        <div class="bg-white p-10 rounded-[2.5rem] border border-sage/10 hover:shadow-2xl transition-all group">
          <h3 class="text-2xl font-serif italic mb-2 group-hover:text-sage transition-colors">${ing.name}</h3>
          <span class="text-[10px] font-black uppercase text-sage bg-sage/5 px-2 py-1 rounded inline-block mb-6">${ing.function}</span>
          <div class="space-y-4">
            <div><h4 class="text-[10px] font-bold text-charcoal/40 uppercase mb-2">Source</h4><p class="text-sm">${ing.source}</p></div>
            <div><h4 class="text-[10px] font-bold text-charcoal/40 uppercase mb-2">Benefit</h4><p class="text-sm italic text-charcoal/70">"${ing.benefit}"</p></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  const input = document.getElementById('glossary-search');
  input.oninput = (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const grid = document.getElementById('glossary-grid');
    grid.innerHTML = INGREDIENTS.filter(i => i.name.toLowerCase().includes(query)).map(ing => `
       <div class="bg-white p-10 rounded-[2.5rem] border border-sage/10 hover:shadow-2xl transition-all group">
          <h3 class="text-2xl font-serif italic mb-2 group-hover:text-sage transition-colors">${ing.name}</h3>
          <span class="text-[10px] font-black uppercase text-sage bg-sage/5 px-2 py-1 rounded inline-block mb-6">${ing.function}</span>
          <div class="space-y-4">
            <div><h4 class="text-[10px] font-bold text-charcoal/40 uppercase mb-2">Source</h4><p class="text-sm">${ing.source}</p></div>
            <div><h4 class="text-[10px] font-bold text-charcoal/40 uppercase mb-2">Benefit</h4><p class="text-sm italic text-charcoal/70">"${ing.benefit}"</p></div>
          </div>
        </div>
    `).join('');
  };
  
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

// --- CART LOGIC ---
function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const itemsContainer = document.getElementById('cart-items');
  const footerContainer = document.getElementById('cart-footer');
  const shippingContainer = document.getElementById('free-shipping-bar');
  
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  
  badge.innerText = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-30 italic font-serif text-lg">Your garden is empty.</div>`;
    footerContainer.innerHTML = '';
    shippingContainer.innerHTML = '';
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-4">
        <div class="w-20 h-20 bg-cream rounded-xl overflow-hidden border border-sage/10"><img src="${item.image}" class="w-full h-full object-cover"></div>
        <div class="flex-grow">
          <div class="flex justify-between items-start"><h4 class="font-bold text-xs uppercase">${item.name}</h4><span class="font-bold text-terracotta text-xs">₹${item.price.toLocaleString()}</span></div>
          <div class="flex items-center gap-4 mt-3">
            <button onclick="window.updateCartQty('${item.id}', -1)" class="p-1 hover:text-terracotta"><i data-lucide="minus" class="w-3 h-3"></i></button>
            <span class="text-xs font-bold">${item.quantity}</span>
            <button onclick="window.updateCartQty('${item.id}', 1)" class="p-1 hover:text-terracotta"><i data-lucide="plus" class="w-3 h-3"></i></button>
          </div>
        </div>
      </div>
    `).join('');

    const remaining = Math.max(0, 3000 - subtotal);
    shippingContainer.innerHTML = `
      <p class="text-[10px] font-bold uppercase tracking-widest mb-2">${remaining > 0 ? `Spend ₹${remaining.toLocaleString()} more for Free Shipping` : 'Free Shipping Unlocked!'}</p>
      <div class="h-1 bg-sage/20 rounded-full overflow-hidden"><div class="h-full bg-sage transition-all duration-500" style="width: ${Math.min(100, (subtotal/3000)*100)}%"></div></div>
    `;

    footerContainer.innerHTML = `
      <div class="flex justify-between font-bold mb-6 italic font-serif text-lg"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
      <button class="w-full bg-terracotta text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-2xl hover:bg-terracotta/90 transition-all">Checkout Now</button>
    `;
  }
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

// --- GLOBAL ATTACHMENTS FOR HTML EVENT HANDLERS ---
// @ts-ignore
window.showProduct = (id) => showView('product', id);
// @ts-ignore
window.showHome = () => showView('home');
// @ts-ignore
window.showGlossary = () => showView('glossary');
// @ts-ignore
window.addToCart = (id) => {
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...p, quantity: 1 });
  updateCartUI();
  document.getElementById('cart-drawer').classList.remove('hidden');
};
// @ts-ignore
window.updateCartQty = (id, delta) => {
  const item = cart.find(x => x.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity < 1) cart = cart.filter(x => x.id !== id);
  }
  updateCartUI();
};

// --- INITIALIZATION & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  showView('home');
  
  // Navigation
  document.getElementById('nav-shop').onclick = (e) => { e.preventDefault(); showView('home'); };
  document.getElementById('nav-ingredients').onclick = (e) => { e.preventDefault(); showView('glossary'); };
  document.getElementById('nav-logo').onclick = (e) => { e.preventDefault(); showView('home'); };
  
  // Cart
  document.getElementById('cart-btn').onclick = () => document.getElementById('cart-drawer').classList.remove('hidden');
  document.getElementById('close-cart').onclick = () => document.getElementById('cart-drawer').classList.add('hidden');
  document.getElementById('cart-overlay').onclick = () => document.getElementById('cart-drawer').classList.add('hidden');
  
  // AI Assistant Toggle
  const aiWindow = document.getElementById('ai-window');
  const aiToggle = document.getElementById('ai-toggle');
  aiToggle.onclick = () => {
    aiWindow.classList.remove('hidden');
    aiToggle.classList.add('hidden');
    if (!aiChat) initAI();
  };
  document.getElementById('close-ai').onclick = () => {
    aiWindow.classList.add('hidden');
    aiToggle.classList.remove('hidden');
  };

  // AI Logic
  async function initAI() {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are the Flora Guide for Vela Flora. Be calm, botanical, and minimalist. Use botanical emojis 🌿🌼. Help with ingredients and product info. Keep answers under 3 sentences.",
          temperature: 0.7
        }
      });
      addAIMessage('model', "Welcome to the garden. I am your Flora Guide. How may I assist your skincare ritual?");
    } catch (err) {
      console.error("AI Init Failed", err);
    }
  }

  function addAIMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
    msgDiv.innerHTML = `<div class="max-w-[85%] px-4 py-3 rounded-2xl text-[11px] shadow-sm ${role === 'user' ? 'bg-terracotta text-white rounded-tr-none' : 'bg-white border border-sage/10 text-charcoal rounded-tl-none'}">${text}</div>`;
    const container = document.getElementById('ai-messages');
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  document.getElementById('ai-form').onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('ai-input') as HTMLInputElement;
    const text = input.value.trim();
    if (!text || !aiChat) return;

    addAIMessage('user', text);
    input.value = '';
    
    try {
      const response = await aiChat.sendMessage({ message: text });
      addAIMessage('model', response.text);
    } catch (err) {
      addAIMessage('model', "The garden is quiet right now. Please try again soon. 🍃");
    }
  };

  updateCartUI();
});
