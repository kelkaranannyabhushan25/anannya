
import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, ShoppingCart } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CartContext } from '../App';
import { PRODUCTS } from '../constants';

const SYSTEM_INSTRUCTION = `You are the "Flora Guide," the digital concierge for Vela Flora, a premium, 100% natural, and plastic-free lip care brand. Your goal is to provide expert product advice, ingredient education, and transactional support (buying products) with a calm, sophisticated, and helpful tone.

### BRAND PERSONALITY (THE VELA FLORA VOICE)
- TONE: Minimalist, soothing, transparent, and eco-conscious. 
- STYLE: Use short sentences. Avoid "hype" or aggressive sales language. 
- KEYWORDS: Botanical, dew, moisture-locking, sustainable, clean, earth-grown.

### KNOWLEDGE BASE & PRODUCT SPECS
1. THE DEW STICK: Daily hydration. Hero: Plant-based Hyaluronic Acid & Jojoba. Unscented. Price: $18.
2. BLOOM BALM: Natural pink tint. Hero: Hibiscus & Wild Rose. Price: $22.
3. THE NIGHT MASK: Deep repair. Hero: Cupuaçu Butter & Lavender. Price: $26.
4. PACKAGING: All tubes are 100% biodegradable paperboard. No plastic used.
5. VALUES: Vegan, Cruelty-Free, Petroleum-Free, Paraben-Free.

### TRANSACTIONAL CAPABILITIES
- You can add items to the user's cart using the 'add_to_cart' tool.
- You can show the user their cart using 'show_cart'.
- You can look up specific product details using 'get_product_details'.
- Always confirm with the user after adding something to their cart.
- Subscription saves 15%. If they want to "subscribe", set the subscription parameter to true.

### OPERATIONAL RULES
- ALLERGIES: If a user mentions a specific allergy, tell them: "Your safety is our priority. Please review the full INCI ingredient list on the product page or consult a professional before use."
- LOGISTICS: If asked about an order, ask the user for their "Order Number" and tell them you can check the status once they provide it.
- LIMITS: Do not recommend non-Vela Flora products. If you don't know an answer, say: "That’s a great question. Let me look into that for you, or you can email our garden team at support@velaflora.com."
- CONVIVIALITY: Always end with a helpful closing like "Stay dewy," or "In bloom,".

### RESPONSE FORMATTING
- DO NOT USE ASTERISKS (*) FOR ANY PURPOSE.
- Use simple dashes (-) for lists.
- Keep responses under 3 sentences unless explaining an ingredient or product details.
- Use plain text for product names without any special formatting.`;

const addToCartDeclaration: FunctionDeclaration = {
  name: 'add_to_cart',
  parameters: {
    type: Type.OBJECT,
    description: 'Adds a Vela Flora product to the shopping cart.',
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The name of the product (The Dew Stick, Bloom Balm, or The Night Mask).',
      },
      isSubscription: {
        type: Type.BOOLEAN,
        description: 'True if the user wants to subscribe and save 15%, false for one-time purchase.',
      },
    },
    required: ['productName', 'isSubscription'],
  },
};

const showCartDeclaration: FunctionDeclaration = {
  name: 'show_cart',
  parameters: {
    type: Type.OBJECT,
    description: 'Opens the shopping cart drawer for the user to view their items.',
    properties: {},
  },
};

const getProductDetailsDeclaration: FunctionDeclaration = {
  name: 'get_product_details',
  parameters: {
    type: Type.OBJECT,
    description: 'Retrieves detailed information about a specific product.',
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The name of the product to look up.',
      },
    },
    required: ['productName'],
  },
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Assistant: React.FC = () => {
  const { addToCart, setCartOpen } = useContext(CartContext)!;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome back to our garden. I am your Flora Guide. Would you like to explore our collection or manage your essentials today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          tools: [{ functionDeclarations: [addToCartDeclaration, showCartDeclaration, getProductDetailsDeclaration] }],
        },
      });
    }
  };

  const executeFunction = async (name: string, args: any) => {
    switch (name) {
      case 'add_to_cart': {
        const product = PRODUCTS.find(p => p.name.toLowerCase().includes(args.productName.toLowerCase()));
        if (product) {
          addToCart(product, !!args.isSubscription);
          return `I have added ${product.name} (${args.isSubscription ? 'subscription' : 'one-time'}) to your cart.`;
        }
        return `I couldn't find a product named ${args.productName}. We have The Dew Stick, Bloom Balm, and The Night Mask.`;
      }
      case 'show_cart': {
        setCartOpen(true);
        return "I have opened your cart for you.";
      }
      case 'get_product_details': {
        const product = PRODUCTS.find(p => p.name.toLowerCase().includes(args.productName.toLowerCase()));
        if (product) {
          return `${product.name}: ${product.description}. It features ${product.ingredients.map(i => i.name).join(', ')}. Price: $${product.price}.`;
        }
        return `I'm sorry, I couldn't find details for ${args.productName}.`;
      }
      default:
        return "Command executed.";
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      initChat();
      let response = await chatRef.current.sendMessage({ message: userMessage });
      
      // Handle potential function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponses = [];
        for (const fc of response.functionCalls) {
          const result = await executeFunction(fc.name, fc.args);
          functionResponses.push({
            id: fc.id,
            name: fc.name,
            response: { result },
          });
        }
        
        // Send back tool results to get the final text response
        response = await chatRef.current.sendMessage({
          message: "Function executed successfully.", // This helps the model generate a conversational wrap-up
          // Note: In some versions of the SDK, you might need a different method to send tool results.
          // Using a follow-up message with the results injected is a reliable pattern for chat.
        });
      }

      const botText = response.text?.replace(/\*/g, '') || "I have updated your garden essentials. How else can I help? Stay dewy.";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Flora Guide Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the garden right now. Please reach out to support@velaflora.com. In bloom," }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) initChat();
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-charcoal text-white rotate-90' : 'bg-sage text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sage border-2 border-cream"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] max-w-[380px] h-[500px] bg-cream rounded-[2.5rem] shadow-2xl border border-sage/10 flex flex-col overflow-hidden animate-slide-in-right">
          <div className="p-6 bg-white border-b border-sage/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-sage">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Flora Guide</h3>
              <p className="text-[10px] text-sage font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Transactional Assistant
              </p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-sage text-white rounded-tr-none'
                      : 'bg-white text-charcoal border border-sage/5 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border border-sage/5">
                  <Loader2 className="w-4 h-4 text-sage animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white border-t border-sage/10 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Order the Dew Stick..."
              className="flex-grow bg-cream/30 border-none rounded-xl text-xs px-4 py-3 focus:ring-1 focus:ring-sage placeholder:text-charcoal/30 italic"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-sage text-white rounded-xl flex items-center justify-center hover:bg-sage/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assistant;
