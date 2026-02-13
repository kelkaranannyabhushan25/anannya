import React, { useContext } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartContext } from '../App';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useContext(CartContext)!;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const FREE_SHIPPING_THRESHOLD = 3000;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setCartOpen(false)}
      />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-sage/10 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold italic text-sage">Your Flora Cart</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-cream rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-6 bg-cream border-b border-sage/10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-charcoal/60">
            {remaining > 0 
              ? `Spend ₹${remaining.toLocaleString('en-IN')} more for Free Shipping` 
              : "Congrats! You've unlocked Free Shipping"}
          </p>
          <div className="h-1.5 w-full bg-sage/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sage transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-sage opacity-20" />
              </div>
              <p className="text-charcoal/60 mb-6 font-serif italic text-lg">Your garden cart is empty.</p>
              <button 
                onClick={() => setCartOpen(false)}
                className="bg-sage text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-sage/20"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.isSubscription}`} className="flex gap-4">
                <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden flex-shrink-0 border border-sage/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm uppercase text-charcoal">{item.name}</h3>
                    <p className="font-bold text-terracotta text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sage mb-3">
                    {item.isSubscription ? "Subscription (Save 15%)" : "One-time Purchase"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-sage/20 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-terracotta"><Minus className="w-4 h-4" /></button>
                      <span className="px-4 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-terracotta"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-charcoal/20 hover:text-terracotta transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-sage/10 bg-cream">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold uppercase tracking-widest text-xs text-charcoal/40">Subtotal</span>
              <span className="text-xl font-bold italic font-serif text-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="w-full bg-terracotta text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-terracotta/90 transition-all flex items-center justify-center gap-3">
              Checkout Now
              <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center rotate-45">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </button>
            <div className="mt-4 flex justify-center space-x-4">
               <div className="h-6 w-10 bg-white border border-sage/10 rounded flex items-center justify-center text-[7px] font-black tracking-tighter text-charcoal opacity-40">UPI</div>
               <div className="h-6 w-10 bg-white border border-sage/10 rounded flex items-center justify-center text-[7px] font-black tracking-tighter text-charcoal opacity-40">VISA</div>
               <div className="h-6 w-10 bg-white border border-sage/10 rounded flex items-center justify-center text-[7px] font-black tracking-tighter text-charcoal opacity-40">GPay</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { ShoppingBag } from 'lucide-react';

export default CartDrawer;