import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Leaf, Package, Search } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CartContext } from '../App';
import { PRODUCTS } from '../constants';

const SYSTEM_INSTRUCTION = `You are the "Flora Guide," the digital soul of Vela Flora. You represent a brand that is 100% natural, plastic-free, and botanically driven.

### GUIDING PRINCIPLES
- TONE: Calm, botanical, minimalist, and deeply knowledgeable. Use gentle language.
- KNOWLEDGE: You are an expert in natural oils, plant-based waxes (Candelilla), and sustainable packaging.
- CONSTRAINTS: 
    1. Keep all responses under 3 sentences.
    2. Never mention competitors. 
    3. For allergy concerns, always say: "Your safety is vital; please check our full INCI ingredient list on the product page or consult a professional."
    4. Do not use emojis unless they are botanical (🌿, 🌼, ✨, 🍃).
- UI CONTEXT: You "live" in a UI with a Sage Green theme and Terracotta message bubbles. Mention this botanical warmth if asked about the brand's 'vibe'.

### PRODUCT QUICK-FACTS
- The Dew Stick: Hero is Plant-based Hyaluronic Acid. No scent.
- Natural Lipstick: Botanical pigments. Satin finish.
- The Night Mask: Cupuaçu Butter. Lavender scent.
- Packaging: 100% biodegradable paperboard.

### ACTIONS
- Use 'add_to_cart' to add products. Confirm once added.

Stay dewy. 🌿`;

const addToCartDeclaration: FunctionDeclaration = {
  name: 'add_to_cart',
  parameters: {
    type: Type.OBJECT,
    description: 'Adds a Vela Flora product to the shopping cart.',
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The name of the product (Dew Stick, Natural Lipstick, or Night Mask).',
      },
      isSubscription: {
        type: Type.BOOLEAN,
        description: 'True for subscription (Save 15%), false for one-time.',
      },
    },
    required: ['productName', 'isSubscription'],
  },
};

const QUICK_REPLIES = [
  { text: "Tell me about the Lipstick", icon: <Leaf className="w-3 h-3" /> },
  { text: "Is your packaging plastic-free?", icon: <Package className="w-3 h-3" /> },
  { text: "Track my order", icon: <Search className="w-3 h-3" /> }
];

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Assistant: React.FC = () => {
  const { addToCart } = useContext(CartContext)!;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! Looking for the perfect natural glow? I am your Flora Guide, here to help.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const initChat = () => {
    if (!chatRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.6,
            tools: [{ functionDeclarations: [addToCartDeclaration] }],
          },
        });
      } catch (err) {
        console.error("AI Initialization failed", err);
      }
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgText = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsgText }]);
    setIsLoading(true);

    try {
      initChat();
      if (!chatRef.current) throw new Error("Chat not initialized");

      let response = await chatRef.current.sendMessage({ message: userMsgText });
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'add_to_cart') {
            const productNameArg = fc.args.productName as string;
            const product = PRODUCTS.find(p => p.name.toLowerCase().includes(productNameArg.toLowerCase()));
            if (product) {
              addToCart(product, !!fc.args.isSubscription);
              const botResponse = `I have added ${product.name} to your garden essentials. Stay dewy. ✨`;
              setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
              setIsLoading(false);
              return;
            }
          }
        }
      }

      const botText = response.text?.replace(/\*/g, '') || "I am here to guide your skincare ritual. Stay dewy. 🌿";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Flora Guide Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the garden right now. Please try again in a moment. In bloom, 🌼" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) initChat();
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-charcoal text-white' : 'bg-sage text-white'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] max-w-[360px] h-[520px] bg-white rounded-[2.5rem] shadow-2xl border border-sage/10 flex flex-col overflow-hidden animate-slide-in-right">
          {/* Sage Header */}
          <div className="p-6 bg-sage border-b border-charcoal/5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sage shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[9px] text-white">Flora Guide</h3>
              <p className="text-[8px] text-white/80 font-black uppercase tracking-widest">Botanical Soul of Vela Flora</p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-cream/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-terracotta text-white rounded-tr-none' : 'bg-white text-charcoal border border-sage/10 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {!isLoading && (
              <div className="flex flex-col gap-2 pt-2">
                {QUICK_REPLIES.map((reply, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(reply.text)}
                    className="flex items-center gap-2 self-start bg-white/80 backdrop-blur-sm border border-sage/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/60 hover:bg-sage/10 hover:border-sage transition-all"
                  >
                    {reply.icon}
                    {reply.text}
                  </button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-sage/5">
                  <Loader2 className="w-3 h-3 text-sage animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-4 bg-white border-t border-sage/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Order the Dew Stick..."
              className="flex-grow bg-cream/30 border-none rounded-xl text-xs px-4 py-3 focus:ring-1 focus:ring-sage placeholder:text-charcoal/30 italic font-sans"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 bg-sage text-white rounded-xl flex items-center justify-center shadow-lg shadow-sage/20 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assistant;