
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, Instagram, Twitter, Check } from 'lucide-react';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Glossary from './pages/Glossary';
import CartDrawer from './components/CartDrawer';
import Assistant from './components/Assistant';
import { CartItem, Product } from './types';

// Cart Context
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
        <div className="min-h-screen flex flex-col relative">
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
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-sage/10 px-4 py-4 lg:px-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Desktop Left Nav */}
        <div className="hidden lg:flex items-center space-x-8 flex-1">
          <Link to="/" className="text-xs font-bold uppercase tracking-widest hover:text-sage transition-colors">Shop</Link>
          <Link to="/glossary" className="text-xs font-bold uppercase tracking-widest hover:text-sage transition-colors">Glossary</Link>
          <Link to="/" className="text-xs font-bold uppercase tracking-widest hover:text-sage transition-colors">Sustainability</Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
          VELA<span className="text-sage">FLORA</span>
        </Link>

        {/* Desktop Right Nav */}
        <div className="flex items-center justify-end space-x-4 lg:space-x-6 flex-1">
          <button className="hidden lg:block p-2 hover:bg-sage/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden lg:block p-2 hover:bg-sage/10 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button 
            className="p-2 hover:bg-sage/10 rounded-full transition-colors relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-sage text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-cream p-8 animate-slide-in-right">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black tracking-tighter uppercase">VELA<span className="text-sage">FLORA</span></span>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-8 h-8" /></button>
          </div>
          <div className="flex flex-col space-y-8">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif font-medium">Shop All</Link>
            <Link to="/glossary" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif font-medium">Ingredients</Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif font-medium">Our Story</Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-serif font-medium">Sustainability</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-white pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-6">VELA<span className="text-sage">FLORA</span></h2>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-6">
            Transparently formulated, sustainably packaged, and naturally derived lip care for the modern minimalist.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center hover:bg-sage hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center hover:bg-sage hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Shop</h4>
          <ul className="space-y-4 text-sm text-charcoal/60">
            <li><Link to="/" className="hover:text-sage">Best Sellers</Link></li>
            <li><Link to="/" className="hover:text-sage">Gift Sets</Link></li>
            <li><Link to="/" className="hover:text-sage">Night Care</Link></li>
            <li><Link to="/" className="hover:text-sage">Bundles</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Experience</h4>
          <ul className="space-y-4 text-sm text-charcoal/60">
            <li><Link to="/" className="hover:text-sage">Our Story</Link></li>
            <li><Link to="/glossary" className="hover:text-sage">Ingredient Glossary</Link></li>
            <li><Link to="/" className="hover:text-sage">Sustainability</Link></li>
            <li><Link to="/" className="hover:text-sage">Transparency</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 uppercase tracking-wider text-xs">Support</h4>
          <ul className="space-y-4 text-sm text-charcoal/60">
            <li><Link to="/" className="hover:text-sage">Track Order</Link></li>
            <li><Link to="/" className="hover:text-sage">Shipping Policy</Link></li>
            <li><Link to="/" className="hover:text-sage">Returns</Link></li>
            <li><Link to="/" className="hover:text-sage">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sage/10 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">
        <p>© 2024 VELA FLORA BEAUTY. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-8 mt-6 md:mt-0">
          <a href="#" className="hover:text-sage">Privacy Policy</a>
          <a href="#" className="hover:text-sage">Terms of Service</a>
          <a href="#" className="hover:text-sage">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>
);

export default App;
