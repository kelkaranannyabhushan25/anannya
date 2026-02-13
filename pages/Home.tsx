
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, Leaf, Recycle, Heart } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex items-center px-8 lg:px-24 py-20 bg-cream">
          <div className="max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-sage/10 text-sage text-[10px] font-black tracking-[0.2em] uppercase mb-8">
              Clean · Vegan · Pure
            </span>
            <h1 className="text-6xl lg:text-8xl font-serif font-light leading-none mb-8">
              Skincare for your <span className="text-sage italic font-medium">Smile</span>.
            </h1>
            <p className="text-lg text-charcoal/70 mb-12 leading-relaxed">
              High-performance lip care crafted with only 10 essential natural ingredients. No fillers, no toxins, just pure hydration for your most delicate skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/product/dew-stick" className="bg-sage hover:bg-sage/90 text-white px-10 py-5 rounded-xl font-bold tracking-widest uppercase text-xs transition-all shadow-xl shadow-sage/20 text-center">
                Shop the Collection
              </Link>
              <button className="border-2 border-sage/20 hover:border-sage/50 px-10 py-5 rounded-xl font-bold tracking-widest uppercase text-xs transition-all text-center">
                Our Story
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&auto=format&fit=crop" 
            alt="Macro botanical photography of a leaf with dew" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* The 10-Ingredient Promise */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-serif italic mb-6">The 10-Ingredient Promise</h2>
            <p className="text-charcoal/60 max-w-2xl mx-auto text-lg">We believe in radical transparency. Every formula contains exactly 10 plant-based ingredients, meticulously sourced for maximum efficacy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Leaf className="w-8 h-8 text-sage" />}
              title="100% Vegan"
              description="Strictly plant-derived. No beeswax, lanolin, or animal by-products ever."
            />
            <ValueCard 
              icon={<Recycle className="w-8 h-8 text-sage" />}
              title="Plastic-Free"
              description="Housed in compostable paper tubes and infinitely recyclable aluminum."
            />
            <ValueCard 
              icon={<Heart className="w-8 h-8 text-sage" />}
              title="Cruelty-Free"
              description="Leaping Bunny certified. We never test on animals at any stage of development."
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-serif italic mb-4">Essential Care</h2>
              <p className="text-charcoal/60">The core essentials for daily hydration.</p>
            </div>
            <Link to="/" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage hover:gap-4 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=1000&auto=format&fit=crop" 
                alt="Macro botanical green floral detail" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-sage p-12 rounded-[2rem] text-white shadow-2xl max-w-sm hidden md:block">
              <p className="text-xl font-serif italic leading-tight">
                "Harnessing the pure power of botanical hydration."
              </p>
            </div>
          </div>
          <div>
            <span className="text-sage font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Key Ingredient Spotlight</span>
            <h2 className="text-5xl lg:text-6xl font-serif mb-10 leading-tight">Meet <span className="text-sage italic">Cupuaçu Butter</span></h2>
            <p className="text-lg text-charcoal/70 mb-10 leading-relaxed">
              Sourced sustainably from the Amazon, Cupuaçu (koo-poo-ah-soo) is a superfruit known for its incredible ability to absorb up to 440% of its weight in water.
            </p>
            <ul className="space-y-8">
              <li className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Deep Hydration</h4>
                  <p className="text-charcoal/60 leading-relaxed">Delivers moisture to the deepest layers of the lip epidermis for lasting comfort.</p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-2">Natural Elasticity</h4>
                  <p className="text-charcoal/60 leading-relaxed">Contains unique plant sterols that improve skin elasticity and suppleness.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-40 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-sage text-sage" />)}
          </div>
          <blockquote className="text-3xl lg:text-4xl font-serif font-light italic leading-snug mb-12">
            "I've tried every high-end lip balm on the market, and nothing compares to the Vela Flora Dew Stick. It's the first time my lips haven't felt dry again after just an hour. Truly a game changer."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" 
              alt="Sarah Jenkins" 
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold uppercase tracking-widest text-xs">Sarah Jenkins</p>
              <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">Verified Buyer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif italic mb-6">Join the Flora Fold</h2>
          <p className="text-charcoal/60 mb-10">Sign up for early access to new launches and receive 15% off your first order.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-8 py-5 rounded-2xl bg-cream/50 border-none focus:ring-2 focus:ring-sage transition-all italic text-sm"
            />
            <button className="bg-charcoal text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-sage transition-colors">
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">By signing up, you agree to our privacy policy.</p>
        </div>
      </section>
    </div>
  );
};

const ValueCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-12 bg-cream/30 rounded-[2.5rem] border border-sage/5 transition-all hover:shadow-xl hover:-translate-y-2">
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-bold uppercase tracking-widest mb-4">{title}</h3>
    <p className="text-sm text-charcoal/60 leading-relaxed">{description}</p>
  </div>
);

const ProductCard: React.FC<{ product: typeof PRODUCTS[0] }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group">
    <div className="relative aspect-[4/5] bg-white rounded-[2rem] overflow-hidden mb-8 border border-sage/5">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {product.bestSeller && (
        <span className="absolute top-6 left-6 bg-sage text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
          Best Seller
        </span>
      )}
      <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="bg-white text-charcoal px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
          Quick View
        </span>
      </div>
    </div>
    <div className="flex justify-between items-start mb-2 px-2">
      <h3 className="font-bold uppercase tracking-widest text-sm">{product.name}</h3>
      <p className="font-bold text-sage">${product.price}</p>
    </div>
    <div className="flex items-center gap-1 mb-2 px-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'fill-sage text-sage' : 'text-sage/20'}`} />
      ))}
      <span className="text-[10px] text-charcoal/40 font-bold ml-2 uppercase tracking-widest">({product.reviews})</span>
    </div>
    <p className="text-xs text-charcoal/50 leading-relaxed px-2 line-clamp-2">{product.description}</p>
  </Link>
);

export default Home;
