import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

// --- BOTANICAL DATA ---
const INGREDIENTS = [
  { name: "Cupuaçu Butter", source: "Amazon Rainforest", function: "Moisture Retention", benefit: "Absorbs 440% its weight in water, acting as a deep hydration powerhouse." },
  { name: "Jojoba Oil", source: "Desert Shrub Seeds", function: "Barrier Protection", benefit: "Mimics natural skin oils to seal in moisture without being greasy." },
  { name: "Candelilla Wax", source: "Desert Succulent", function: "Vegan Sealant", benefit: "A smooth, plant-based glide that creates a breathable protective layer." },
  { name: "Vitamin E", source: "Sunflower Seeds", function: "Antioxidant", benefit: "Provides defense against environmental stressors for delicate lip skin." },
  { name: "Castor Seed Oil", source: "Ricinus Communis", function: "High Shine", benefit: "Creates a luminous, dewy finish while deeply softening textures." }
];

const PRODUCTS = [
  { id: "dew-stick", name: "The Dew Stick", price: 1499, image: "https://i.ibb.co/twdxvzTy/Screenshot-2026-02-13-172401.png", description: "Our hero hydration stick for a sheer, all-day luminous finish.", ingredients: INGREDIENTS.slice(0, 4) },
  { id: "natural-lipstick", name: "Natural Lipstick", price: 2499, image: "https://i.ibb.co/ccr3qvj8/Screenshot-2026-02-13-172938.png", description: "Luxury satin finish powered by botanical pigments.", ingredients: [INGREDIENTS[1], INGREDIENTS[4]] },
  { id: "night-mask", name: "The Night Mask", price: 2199, image: "https://i.ibb.co/kV3csC8X/Screenshot-2026-02-13-172249.png", description: "Intensive overnight repair with Amazonian butter.", ingredients: INGREDIENTS.slice(0, 3) }
];

// --- APP STATE ---
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isSubscription: boolean;
}

let cart: CartItem[] = [];
let aiChat: any = null;
let currentPurchaseMode: 'one-time' | 'subscribe' = 'one-time';

// --- CORE FUNCTIONS ---
const formatPrice = (p: number) => `₹${p.toLocaleString('en-IN')}`;

function showView(viewId: string, productId: string | null = null) {
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  const activeView = document.getElementById(`view-${viewId}`);
  if (activeView) activeView.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  if (viewId === 'home') renderHome();
  if (viewId === 'product') renderProductDetail(productId);
  if (viewId === 'glossary') renderGlossary();
}

function renderHome() {
  const container = document.getElementById('view-home')!;
  container.innerHTML = `
    <section class="fade-in relative min-h-[90vh] flex flex-col lg:flex-row items-center overflow-hidden">
      <div class="w-full lg:w-1/2 flex items-center px-8 lg:px-32 py-20 relative z-10">
        <div class="max-w-xl">
          <span class="inline-block py-1 px-4 rounded-full bg-sage/10 text-sage text-[9px] font-bold tracking-[0.3em] uppercase mb-8 border border-sage/10">Botanically Minded</span>
          <h1 class="text-7xl lg:text-9xl font-serif font-light leading-[0.95] mb-10 tracking-tight text-charcoal">
            Pure Care. <br /><span class="text-terracotta italic font-medium">True Glow.</span>
          </h1>
          <p class="text-base text-charcoal/50 mb-12 leading-relaxed max-w-sm font-medium">
            High-performance essentials crafted with only 10 plant-based ingredients. Minimalist by design, powerful by nature.
          </p>
          <div class="flex flex-col sm:flex-row gap-6">
            <button onclick="window.nav('product', 'dew-stick')" class="bg-terracotta text-white px-12 py-5 rounded-2xl font-bold tracking-widest uppercase text-[10px] shadow-2xl shadow-terracotta/20">Shop Dew Stick</button>
            <button class="border border-charcoal/5 bg-white px-12 py-5 rounded-2xl font-bold tracking-widest uppercase text-[10px]">Our Story</button>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/2 h-[70vh] lg:h-[90vh] relative group">
        <img src="https://i.ibb.co/nN6p4mNy/Screenshot-2026-02-13-173117.png" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Editorial Product Shot">
        <div class="absolute inset-0 bg-sage/5 mix-blend-multiply"></div>
      </div>
    </section>

    <section class="py-32 px-6 max-w-[1400px] mx-auto">
      <div class="mb-16">
        <h2 class="text-4xl font-serif italic mb-2">Essential Collection</h2>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">The foundational ritual</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        ${PRODUCTS.map(p => `
          <div class="group cursor-pointer" onclick="window.nav('product', '${p.id}')">
            <div class="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-sm group-hover:shadow-2xl transition-all mb-8">
              <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
            </div>
            <div class="px-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold uppercase tracking-widest text-[11px]">${p.name}</h3>
                <span class="font-bold text-terracotta text-xs">${formatPrice(p.price)}</span>
              </div>
              <p class="text-[11px] text-charcoal/40 leading-relaxed">${p.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

function renderProductDetail(id: string | null) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const container = document.getElementById('view-product')!;
  
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-20 fade-in">
      <button onclick="window.nav('home')" class="text-[10px] font-black uppercase tracking-widest text-sage mb-12 inline-flex items-center gap-3">← Return to Shop</button>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div class="aspect-[4/5] bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-sage/5">
          <img src="${p.image}" class="w-full h-full object-cover">
        </div>
        <div>
          <h1 class="text-7xl font-serif italic mb-10 text-charcoal">${p.name}</h1>
          <p class="text-lg text-charcoal/60 mb-12 leading-relaxed">${p.description}</p>
          
          <div class="space-y-6 mb-12">
            <div onclick="window.setPurchaseMode('one-time')" id="opt-one-time" class="p-8 rounded-[2rem] border-2 border-sage bg-white flex justify-between items-center cursor-pointer shadow-xl transition-all">
              <span class="font-bold uppercase tracking-widest text-xs">One-time Order</span>
              <span class="font-black text-xl">${formatPrice(p.price)}</span>
            </div>
            <div onclick="window.setPurchaseMode('subscribe')" id="opt-subscribe" class="p-8 rounded-[2rem] border-2 border-sage/10 bg-white/50 flex justify-between items-center cursor-pointer hover:border-sage/30 transition-all">
              <div>
                <span class="font-bold uppercase tracking-widest text-xs block mb-1">Subscribe & Save 15%</span>
                <span class="text-[10px] text-sage font-black uppercase tracking-widest">Ships Monthly</span>
              </div>
              <span class="font-black text-xl text-sage">${formatPrice(p.price * 0.85)}</span>
            </div>
          </div>

          <button onclick="window.addToCart('${p.id}')" class="w-full bg-terracotta text-white py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl">
            Add to Garden Bag
          </button>
          
          <div class="border-t border-charcoal/5 pt-12 mt-16">
            <h4 class="font-black uppercase text-[10px] tracking-[0.3em] mb-10 text-charcoal/40">Botanical Composition</h4>
            <div class="flex flex-wrap gap-4">
              ${p.ingredients.map(ing => `
                <div class="ingredient-tooltip relative">
                  <span class="px-6 py-3 rounded-full border border-sage/20 text-[10px] uppercase font-bold cursor-help hover:bg-sage hover:text-white transition-all">${ing.name}</span>
                  <div class="tooltip-content absolute bottom-full left-0 mb-6 w-72 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-sage/10 z-50">
                    <p class="text-[9px] font-black text-sage uppercase tracking-widest mb-3">${ing.function}</p>
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
  const container = document.getElementById('view-glossary')!;
  container.innerHTML = `
    <section class="py-32 px-6 bg-white border-b border-sage/10 fade-in">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-7xl font-serif italic mb-10 tracking-tight">Ingredient Glossary</h1>
        <p class="text-xl text-charcoal/50 mb-16 max-w-2xl mx-auto leading-relaxed">Explore the 10 plant-derived ingredients that make our formulas high-performance.</p>
        <div class="relative max-w-xl mx-auto">
          <input type="text" id="glossary-search" placeholder="Search for an ingredient..." class="w-full px-16 py-7 rounded-[2.5rem] bg-cream/50 border-none italic text-sm focus:ring-2 focus:ring-sage shadow-inner">
        </div>
      </div>
    </section>
    <div class="py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" id="glossary-grid">
      ${INGREDIENTS.map(ing => `
        <div class="bg-white p-12 rounded-[3.5rem] border border-sage/10 hover:shadow-2xl transition-all group">
          <h3 class="text-3xl font-serif italic mb-4 group-hover:text-sage">${ing.name}</h3>
          <span class="text-[9px] font-black uppercase text-sage bg-sage/5 px-3 py-1.5 rounded-full inline-block mb-10">${ing.function}</span>
          <div class="space-y-8">
            <div><h4 class="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest mb-3">Origin</h4><p class="text-sm font-medium">${ing.source}</p></div>
            <div><h4 class="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest mb-3">Benefit</h4><p class="text-[13px] italic text-charcoal/60 leading-relaxed">"${ing.benefit}"</p></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  const input = document.getElementById('glossary-search') as HTMLInputElement;
  input.oninput = (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    const grid = document.getElementById('glossary-grid')!;
    grid.innerHTML = INGREDIENTS.filter(i => i.name.toLowerCase().includes(query)).map(ing => `
       <div class="bg-white p-12 rounded-[3.5rem] border border-sage/10 hover:shadow-2xl transition-all group">
          <h3 class="text-3xl font-serif italic mb-4 group-hover:text-sage">${ing.name}</h3>
          <span class="text-[9px] font-black uppercase text-sage bg-sage/5 px-3 py-1.5 rounded-full inline-block mb-10">${ing.function}</span>
          <div class="space-y-8">
            <div><h4 class="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest mb-3">Origin</h4><p class="text-sm font-medium">${ing.source}</p></div>
            <div><h4 class="text-[9px] font-bold text-charcoal/20 uppercase tracking-widest mb-3">Benefit</h4><p class="text-[13px] italic text-charcoal/60 leading-relaxed">"${ing.benefit}"</p></div>
          </div>
        </div>
    `).join('');
  };
}

// --- CART & UI UPDATES ---
function updateCartUI() {
  const badge = document.getElementById('cart-badge')!;
  const itemsContainer = document.getElementById('cart-items')!;
  const footerContainer = document.getElementById('cart-footer')!;
  const shippingContainer = document.getElementById('free-shipping-bar')!;
  
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  
  badge.innerText = totalItems.toString();
  badge.classList.toggle('hidden', totalItems === 0);

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<div class="h-full flex flex-col items-center justify-center opacity-20 italic font-serif text-2xl">Your garden bag is empty.</div>`;
    footerContainer.innerHTML = '';
    shippingContainer.innerHTML = '';
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-6 fade-in">
        <div class="w-24 h-24 bg-cream rounded-3xl overflow-hidden border border-sage/10 flex-shrink-0 shadow-sm"><img src="${item.image}" class="w-full h-full object-cover"></div>
        <div class="flex-grow">
          <div class="flex justify-between mb-2"><h4 class="font-bold text-xs uppercase tracking-widest">${item.name}</h4><span class="font-bold text-terracotta text-sm">${formatPrice(item.price)}</span></div>
          <span class="text-[9px] font-black uppercase text-sage mb-4 block">${item.isSubscription ? 'Monthly Bloom (15% off)' : 'One-time Essential'}</span>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-4 bg-cream/50 px-4 py-2 rounded-xl">
              <button onclick="window.updateCartQty('${item.id}', -1)" class="hover:text-terracotta"><i data-lucide="minus" class="w-3 h-3"></i></button>
              <span class="text-xs font-bold">${item.quantity}</span>
              <button onclick="window.updateCartQty('${item.id}', 1)" class="hover:text-terracotta"><i data-lucide="plus" class="w-3 h-3"></i></button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const threshold = 3000;
    const remaining = Math.max(0, threshold - subtotal);
    shippingContainer.innerHTML = `
      <p class="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center">${remaining > 0 ? `Spend ${formatPrice(remaining)} more for Free Shipping` : 'Your Free Shipping is Unlocked 🍃'}</p>
      <div class="h-1.5 bg-sage/20 rounded-full overflow-hidden shadow-inner"><div class="h-full bg-sage transition-all duration-1000 ease-out" style="width: ${Math.min(100, (subtotal/threshold)*100)}%"></div></div>
    `;

    footerContainer.innerHTML = `
      <div class="flex justify-between font-bold mb-8 italic font-serif text-2xl px-2"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <button class="w-full bg-charcoal text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl">Proceed to Checkout</button>
    `;
  }
  // @ts-ignore
  if (window.lucide) window.lucide.createIcons();
}

// --- GLOBAL ATTACHMENTS ---
// @ts-ignore
window.nav = (v, id) => showView(v, id);
// @ts-ignore
window.setPurchaseMode = (mode) => {
  currentPurchaseMode = mode;
  const optOne = document.getElementById('opt-one-time')!;
  const optSub = document.getElementById('opt-subscribe')!;
  if (mode === 'one-time') { 
    optOne.classList.replace('border-sage/10', 'border-sage'); optOne.classList.replace('bg-white/50', 'bg-white');
    optSub.classList.replace('border-sage', 'border-sage/10'); optSub.classList.replace('bg-white', 'bg-white/50');
  } else {
    optSub.classList.replace('border-sage/10', 'border-sage'); optSub.classList.replace('bg-white/50', 'bg-white');
    optOne.classList.replace('border-sage', 'border-sage/10'); optOne.classList.replace('bg-white', 'bg-white/50');
  }
};
// @ts-ignore
window.addToCart = (id) => {
  const p = PRODUCTS.find(x => x.id === id)!;
  const isSub = currentPurchaseMode === 'subscribe';
  const price = isSub ? p.price * 0.85 : p.price;
  const existing = cart.find(x => x.id === id && x.isSubscription === isSub);
  if (existing) existing.quantity++;
  else cart.push({ id, name: p.name, price, image: p.image, quantity: 1, isSubscription: isSub });
  updateCartUI();
  document.getElementById('cart-drawer')!.classList.remove('hidden');
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

// --- AI ASSISTANT ---
const addToCartDeclaration: FunctionDeclaration = {
  name: 'add_to_cart',
  parameters: {
    type: Type.OBJECT,
    description: 'Adds a Vela Flora product to the shopping cart.',
    properties: {
      productName: { type: Type.STRING, description: 'The name of the product (Dew Stick, Lipstick, Night Mask).' },
      isSubscription: { type: Type.BOOLEAN, description: 'True for subscribe & save (15%), false for one-time.' },
    },
    required: ['productName', 'isSubscription'],
  },
};

async function initAI() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    aiChat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are the Flora Guide for Vela Flora. Be calm, botanical, and minimalist. Help with products and ingredients. Keep answers under 3 sentences.",
        temperature: 0.7,
        tools: [{ functionDeclarations: [addToCartDeclaration] }],
      },
    });
    addAIMessage('model', "Welcome to the garden. I am your Flora Guide. How may I assist your skincare ritual?");
  } catch (err) { console.error("AI Error", err); }
}

function addAIMessage(role: string, text: string) {
  const container = document.getElementById('ai-messages')!;
  const msgDiv = document.createElement('div');
  msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} fade-in`;
  msgDiv.innerHTML = `<div class="max-w-[85%] px-6 py-4 rounded-[2rem] text-[11px] font-medium shadow-sm ${role === 'user' ? 'bg-terracotta text-white rounded-tr-none' : 'bg-white border border-sage/10 text-charcoal rounded-tl-none'}">${text}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// --- DOM INIT ---
document.addEventListener('DOMContentLoaded', () => {
  showView('home');
  
  document.getElementById('nav-shop')!.onclick = (e) => { e.preventDefault(); showView('home'); };
  document.getElementById('nav-ingredients')!.onclick = (e) => { e.preventDefault(); showView('glossary'); };
  document.getElementById('nav-logo')!.onclick = (e) => { e.preventDefault(); showView('home'); };
  
  document.getElementById('cart-btn')!.onclick = () => document.getElementById('cart-drawer')!.classList.remove('hidden');
  document.getElementById('close-cart')!.onclick = () => document.getElementById('cart-drawer')!.classList.add('hidden');
  document.getElementById('cart-overlay')!.onclick = () => document.getElementById('cart-drawer')!.classList.add('hidden');
  
  const aiToggle = document.getElementById('ai-toggle')!;
  const aiWindow = document.getElementById('ai-window')!;
  aiToggle.onclick = () => { aiWindow.classList.toggle('hidden'); if (!aiChat) initAI(); };
  document.getElementById('close-ai')!.onclick = () => aiWindow.classList.add('hidden');

  document.getElementById('ai-form')!.onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('ai-input') as HTMLInputElement;
    const text = input.value.trim();
    if (!text || !aiChat) return;
    addAIMessage('user', text);
    input.value = '';
    try {
      const response = await aiChat.sendMessage({ message: text });
      if (response.functionCalls?.length) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'add_to_cart') {
            const p = PRODUCTS.find(x => x.name.toLowerCase().includes(fc.args.productName.toLowerCase()));
            if (p) {
              cart.push({ id: p.id, name: p.name, price: fc.args.isSubscription ? p.price * 0.85 : p.price, image: p.image, quantity: 1, isSubscription: !!fc.args.isSubscription });
              updateCartUI();
              addAIMessage('model', `I have carefully added ${p.name} to your garden essentials. ✨`);
            }
          }
        }
      } else {
        addAIMessage('model', response.text);
      }
    } catch (err) { addAIMessage('model', "The garden is a bit quiet. Please try again soon. 🍃"); }
  };

  updateCartUI();
});
