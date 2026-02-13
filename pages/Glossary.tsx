import React, { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import { INGREDIENTS } from '../constants';

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = INGREDIENTS.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.function.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="py-24 px-6 bg-white border-b border-sage/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sage font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">The Flora Filter</span>
          <h1 className="text-5xl lg:text-7xl font-serif italic mb-8">Ingredient Glossary</h1>
          <p className="text-lg text-charcoal/70 mb-12 leading-relaxed">
            Explore the strictly plant-derived ingredients that make our formulas so effective. No secrets, no synthetic fillers—just pure transparency.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder="Search for an ingredient (e.g. Jojoba)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-5 rounded-full bg-cream/50 border-none focus:ring-2 focus:ring-sage transition-all italic text-sm"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-sage" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-sage/10 rounded-full"
              >
                <X className="w-4 h-4 text-sage" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-charcoal/60 font-serif italic text-2xl">No ingredients found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(ing => (
                <div key={ing.name} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-sage/10 hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-serif italic mb-2 group-hover:text-sage transition-colors">{ing.name}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-sage bg-sage/5 px-2 py-1 rounded">
                        {ing.function}
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center">
                      <Info className="w-4 h-4 text-sage" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 mb-2">Source</h4>
                      <p className="text-sm text-charcoal/70 leading-relaxed">{ing.source}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 mb-2">Benefit</h4>
                      <p className="text-sm text-charcoal/70 leading-relaxed italic group-hover:text-sage transition-colors">"{ing.benefit}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sustainability Banner */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-sage rounded-[3rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-4xl lg:text-5xl font-serif italic mb-8">Synthetic vs. Natural</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-10">
              Mainstream lip care often uses petroleum-based waxes (like paraffin) which create a temporary barrier but don't nourish. Our 100% plant-based oils and butters actually penetrate the skin to provide long-term restorative health.
            </p>
            <button className="bg-white text-sage px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-cream transition-colors">
              Our Transparency Report
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 hidden lg:block" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        </div>
      </section>
    </div>
  );
};

export default Glossary;