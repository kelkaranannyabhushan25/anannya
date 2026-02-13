import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Star, Leaf, Recycle, Heart } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 flex items-center px-8 lg:px-32 py-20">
          <div className="max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-sage/20 text-sage text-[9px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">
              Clean · Vegan · Pure
            </span>
            <h1 className="text-6xl lg:text-8xl font-serif font-light leading-[1.1] mb-8 text-charcoal">
              Skincare for <br />your <span className="text-terracotta font-medium italic">Smile</span>.
            </h1>
            <p className="text-base text-charcoal/60 mb-12 leading-relaxed max-w-md">
              High-performance lip care crafted with only 10 essential natural ingredients. No fillers, no toxins, just pure hydration for your most delicate skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/product/dew-stick" className="bg-terracotta hover:bg-terracotta/90 text-white px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] transition-all text-center shadow-lg shadow-terracotta/20">
                Shop the Collection
              </Link>
              <button className="border border-charcoal/10 bg-white hover:bg-sage/10 px-10 py-4 rounded-lg font-bold tracking-widest uppercase text-[10px] transition-all text-center">
                Our Story
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-screen flex items-center justify-center bg-white overflow-hidden">
           <img 
            src="https://i.ibb.co/nN6p4mNy/Screenshot-2026-02-13-173117.png" 
            alt="High-end editorial photograph of Vela Flora sustainable cosmetic products in minimalist setting" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-sage/10 mix-blend-multiply"></div>
        </div>
      </section>

      {/* The 10-Ingredient Promise */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-serif font-medium mb-6 italic">The 10-Ingredient Promise</h2>
            <p className="text-charcoal/50 max-w-xl mx-auto text-sm leading-relaxed">
              We believe in radical transparency. Every formula contains exactly 10 plant-based ingredients, meticulously sourced for maximum efficacy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Leaf className="w-5 h-5 text-sage" />}
              title="100% Vegan"
              description="Strictly plant-derived. No beeswax, lanolin, or animal by-products ever."
            />
            <ValueCard 
              icon={<Recycle className="w-5 h-5 text-sage" />}
              title="Plastic-Free"
              description="Housed in compostable paper tubes and infinitely recyclable aluminum."
            />
            <ValueCard 
              icon={<Heart className="w-5 h-5 text-sage" />}
              title="Cruelty-Free"
              description="Leaping Bunny certified. We never test on animals at any stage of development."
            />
          </div>
        </div>
      </section>

      {/* Essential Care Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-medium mb-4 italic">Essential Care</h2>
              <p className="text-charcoal/40 text-sm font-sans uppercase tracking-widest text-[10px] font-bold">The core essentials for daily hydration.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 border border-charcoal/5 rounded-full flex items-center justify-center bg-white hover:bg-sage/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center hover:bg-sage/90 transition-colors shadow-lg shadow-sage/20">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-32 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-sm bg-sage/10">
              <img 
                src="https://i.ibb.co/CpW8G0SX/Screenshot-2026-02-13-173543.png" 
                alt="Macro photography of rich, whipped botanical butter texture" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-sage p-8 rounded-2xl text-white shadow-2xl max-w-[240px] border border-white/10">
              <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">
                "Botanically sourced: Creamy, potent, and incredibly restorative."
              </p>
            </div>
          </div>
          <div>
            <span className="text-sage font-bold uppercase tracking-widest text-[9px] mb-6 block">Key Ingredient Spotlight</span>
            <h2 className="text-5xl lg:text-6xl font-serif mb-10 leading-tight italic text-sage">Meet <span className="text-terracotta">Cupuaçu Butter</span></h2>
            <p className="text-sm text-charcoal/50 mb-10 leading-relaxed">
              Sourced sustainably from the Amazon, Cupuaçu (koo-poo-ah-soo) is a superfruit known for its incredible ability to absorb up to 440% of its weight in water.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-widest">Deep Hydration</h4>
                  <p className="text-[11px] text-charcoal/40">Delivers moisture to the deepest layers of the lip epidermis.</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-widest">Natural Elasticity</h4>
                  <p className="text-[11px] text-charcoal/40">Contains plant sterols that improve skin elasticity and suppleness.</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-widest">Protective Barrier</h4>
                  <p className="text-[11px] text-charcoal/40">Creates a breathable, non-greasy film to lock in moisture.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-40 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-terracotta text-terracotta" />)}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-serif leading-[1.4] mb-12 italic">
            "I've tried every high-end lip balm on the market, and nothing compares to the Vela Flora Dew Stick. It's the first time my lips haven't felt dry again after just an hour. Truly a game changer."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sarah Jenkins" />
            </div>
            <div className="text-left">
              <p className="font-bold uppercase tracking-widest text-[9px]">Sarah Jenkins</p>
              <p className="text-[9px] text-charcoal/40 uppercase tracking-widest">Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-cream text-center px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif font-medium mb-4 italic">Join the Flora Fold</h2>
          <p className="text-charcoal/50 mb-10 text-sm">Sign up for early access to new launches and receive 15% off your first order.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-6 py-4 rounded-lg bg-white border border-sage/10 focus:ring-1 focus:ring-sage transition-all text-xs"
            />
            <button className="bg-sage text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-terracotta transition-colors shadow-lg shadow-sage/20">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-[9px] uppercase font-bold tracking-widest text-charcoal/20">By signing up, you agree to our privacy policy.</p>
        </div>
      </section>
    </div>
  );
};

const ValueCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-12 bg-white rounded-2xl border border-charcoal/5 transition-all hover:shadow-sm">
    <div className="w-12 h-12 bg-sage/5 rounded-full flex items-center justify-center mx-auto mb-8">
      {icon}
    </div>
    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">{title}</h3>
    <p className="text-[11px] text-charcoal/40 leading-relaxed">{description}</p>
  </div>
);

const ProductCard: React.FC<{ product: typeof PRODUCTS[0] }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-charcoal/5 hover:shadow-xl transition-all duration-500">
    <div className="relative aspect-square overflow-hidden bg-white">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="p-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold uppercase tracking-widest text-xs">{product.name}</h3>
        <p className="font-bold text-terracotta text-xs">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-2.5 h-2.5 ${i < product.rating ? 'fill-terracotta text-terracotta' : 'text-terracotta/20'}`} />
        ))}
        <span className="text-[9px] text-charcoal/30 font-bold ml-2 uppercase tracking-widest">({product.reviews} reviews)</span>
      </div>
      <p className="text-[11px] text-charcoal/40 leading-relaxed mb-0">{product.description}</p>
    </div>
  </Link>
);

export default Home;