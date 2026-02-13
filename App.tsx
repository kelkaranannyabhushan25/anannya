import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Instagram, Twitter } from 'lucide-react';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Glossary from './pages/Glossary';
import CartDrawer from './components/CartDrawer';
import Assistant from './components/Assistant';
import { CartItem, Product } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, isSubscription: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product, isSubscription: boolean) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.isSubscription === isSubscription 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { ...product, quantity: 1, isSubscription }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setCartOpen }}>
      <Router>
        <div className="min-h-screen flex flex-col relative bg-cream">
          <ScrollToTop />
          <Navbar totalItems={totalItems} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/glossary" element={<Glossary />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <Assistant />
        </div>
      </Router>
    </CartContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar: React.FC<{ totalItems: number }> = ({ totalItems }) => {
  const { setCartOpen } = useContext(CartContext)!;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 lg:px-12 border-b border-charcoal/5">
      <nav className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="hidden lg:flex items-center space-x-10 flex-1">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 hover:text-terracotta transition-colors">Shop All</Link>
          <Link to="/glossary" className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 hover:text-terracotta transition-colors">Our Ingredients</Link>
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 hover:text-terracotta transition-colors">Sustainability</Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="text-xl font-black tracking-tighter uppercase flex items-center text-charcoal">
          VELA<span className="text-terracotta">FLORA</span>
        </Link>

        <div className="flex items-center justify-end space-x-2 lg:space-x-6 flex-1">
          <button className="p-2 text-charcoal/40 hover:text-terracotta transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-charcoal/40 hover:text-terracotta transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-charcoal/40 hover:text-terracotta transition-colors relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-terracotta text-white text-[7px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-8 animate-slide-in-right">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-black tracking-tighter uppercase">VELA<span className="text-terracotta">FLORA</span></span>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-col space-y-8">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif italic">Shop All</Link>
            <Link to="/glossary" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif italic">Ingredients</Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif italic">Sustainability</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white pt-24 pb-12 border-t border-charcoal/5">
    <div className="max-w-[1600px] mx-auto px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:pr-12">
          <h2 className="text-xl font-black tracking-tighter uppercase mb-6">VELA<span className="text-terracotta">FLORA</span></h2>
          <p className="text-[11px] text-charcoal/40 leading-relaxed mb-8">
            Transparently formulated, sustainably packaged, and naturally derived lip care for the modern minimalist.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-charcoal/40 hover:text-terracotta transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-charcoal/40 hover:text-terracotta transition-all"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[9px] text-charcoal">Shop</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-charcoal/30">
            <li><Link to="/" className="hover:text-terracotta transition-colors">Best Sellers</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Gift Sets</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Night Care</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Limited Edition</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[9px] text-charcoal">Experience</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-charcoal/30">
            <li><Link to="/" className="hover:text-terracotta transition-colors">Our Story</Link></li>
            <li><Link to="/glossary" className="hover:text-terracotta transition-colors">Ingredient Glossary</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Sustainability</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Store Locator</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-[0.2em] text-[9px] text-charcoal">Support</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-charcoal/30">
            <li><Link to="/" className="hover:text-terracotta transition-colors">Track Order</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Shipping Policy</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/" className="hover:text-terracotta transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/20">© 2024 VELA FLORA BEAUTY. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
           <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/20 hover:text-charcoal transition-colors">Privacy Policy</Link>
           <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/20 hover:text-charcoal transition-colors">Terms of Service</Link>
           <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/20 hover:text-charcoal transition-colors">Accessibility</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default App;