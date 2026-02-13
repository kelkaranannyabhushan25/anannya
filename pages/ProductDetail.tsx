
import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ChevronDown, Check, Info, ArrowLeft, Play } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { CartContext } from '../App';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext)!;
  const product = PRODUCTS.find(p => p.id === id);

  const [purchaseMode, setPurchaseMode] = useState<'one-time' | 'subscribe'>('one-time');
  const [openAccordion, setOpenAccordion] = useState<string | null>('ingredients');
  const [showTexture, setShowTexture] = useState(false);

  if (!product) return <div className="p-20 text-center font-serif text-3xl">Product not found.</div>;

  const currentPrice = purchaseMode === 'subscribe' ? product.price * 0.85 : product.price;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sage mb-12 hover:gap-4 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Images Section */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative shadow-2xl">
              {!showTexture ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src={product.textureVideo} alt="Texture demonstration" className="w-full h-full object-cover" />
              )}
              
              <button 
                onClick={() => setShowTexture(!showTexture)}
                className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 hover:bg-white transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white">
                  {showTexture ? <ArrowLeft className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {showTexture ? "Product Shot" : "Texture Video"}
                </span>
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-10">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-sage text-sage' : 'text-sage/20'}`} />
                ))}
                <span className="text-[10px] text-charcoal/40 font-bold ml-2 uppercase tracking-widest">({product.reviews} Customer Reviews)</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif italic mb-6">{product.name}</h1>
              <p className="text-lg text-charcoal/70 leading-relaxed mb-8">{product.description}</p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4 mb-10">
              <button 
                onClick={() => setPurchaseMode('one-time')}
                className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  purchaseMode === 'one-time' ? 'border-sage bg-white shadow-xl' : 'border-sage/10 hover:border-sage/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseMode === 'one-time' ? 'border-sage' : 'border-charcoal/20'}`}>
                    {purchaseMode === 'one-time' && <div className="w-3 h-3 rounded-full bg-sage" />}
                  </div>
                  <span className="font-bold uppercase tracking-widest text-xs">One-time Purchase</span>
                </div>
                <span className="font-bold text-lg">${product.price}</span>
              </button>

              <button 
                onClick={() => setPurchaseMode('subscribe')}
                className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  purchaseMode === 'subscribe' ? 'border-sage bg-white shadow-xl' : 'border-sage/10 hover:border-sage/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${purchaseMode === 'subscribe' ? 'border-sage' : 'border-charcoal/20'}`}>
                    {purchaseMode === 'subscribe' && <div className="w-3 h-3 rounded-full bg-sage" />}
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-widest text-xs block text-left">Subscribe & Save 15%</span>
                    <span className="text-[10px] text-sage font-bold uppercase tracking-widest">Deliver every 30 days</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg text-sage">${currentPrice.toFixed(2)}</span>
                  <span className="block text-[10px] text-charcoal/40 line-through">${product.price}</span>
                </div>
              </button>
            </div>

            <button 
              onClick={() => addToCart(product, purchaseMode === 'subscribe')}
              className="w-full bg-terracotta text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-terracotta/90 transition-all mb-12"
            >
              Add to Cart — ${currentPrice.toFixed(2)}
            </button>

            {/* Content Accordions */}
            <div className="border-t border-sage/10">
              <AccordionItem 
                title="Full Ingredients" 
                isOpen={openAccordion === 'ingredients'} 
                onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
              >
                <div className="space-y-6 pt-4">
                  {product.ingredients.map(ing => (
                    <div key={ing.name} className="group cursor-help">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold uppercase tracking-widest text-xs border-b border-sage/40 group-hover:border-sage transition-all">{ing.name}</span>
                        <Info className="w-3 h-3 text-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[10px] text-charcoal/60 uppercase tracking-widest">{ing.function}</p>
                      <div className="hidden group-hover:block mt-2 p-4 bg-white rounded-xl shadow-lg border border-sage/10">
                         <p className="text-xs font-bold text-sage uppercase tracking-widest mb-1">Source: {ing.source}</p>
                         <p className="text-xs text-charcoal/70 leading-relaxed">{ing.benefit}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/glossary" className="inline-block text-[10px] font-black uppercase tracking-widest text-sage underline mt-4">Learn more in our Glossary</Link>
                </div>
              </AccordionItem>

              <AccordionItem 
                title="How to Use" 
                isOpen={openAccordion === 'usage'} 
                onClick={() => setOpenAccordion(openAccordion === 'usage' ? null : 'usage')}
              >
                <p className="text-sm text-charcoal/60 leading-relaxed pt-4">
                  Apply liberally as needed throughout the day. For deep overnight repair, apply a thicker layer before sleep. Store in a cool, dry place.
                </p>
              </AccordionItem>

              <AccordionItem 
                title="Shipping & Returns" 
                isOpen={openAccordion === 'shipping'} 
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
              >
                <p className="text-sm text-charcoal/60 leading-relaxed pt-4">
                  Free standard shipping on all orders over $50. We offer a 30-day "Happiness Guarantee" — if you don't love it, we'll make it right.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccordionItem: React.FC<{ title: string, isOpen: boolean, onClick: () => void, children: React.ReactNode }> = ({ title, isOpen, onClick, children }) => (
  <div className="border-b border-sage/10">
    <button 
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between hover:text-sage transition-colors"
    >
      <span className="font-bold uppercase tracking-[0.2em] text-xs">{title}</span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      {children}
    </div>
  </div>
);

export default ProductDetail;
