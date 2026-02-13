import { Product, Ingredient } from './types';

export const INGREDIENTS: Ingredient[] = [
  {
    name: "Cupuaçu Butter",
    source: "Sustainably sourced from the Amazon",
    function: "Moisture Retention",
    benefit: "Nature's moisture powerhouse, locking in hydration for 8+ hours."
  },
  {
    name: "Jojoba Oil",
    source: "Cold-pressed Desert Shrub Seeds",
    function: "Barrier Protection",
    benefit: "Mimics natural skin oils to seal in moisture without clogging pores."
  },
  {
    name: "Candelilla Wax",
    source: "Desert Succulent Leaves",
    function: "Vegan Sealant",
    benefit: "Provides a smooth, plant-based glide and protective barrier."
  },
  {
    name: "Vitamin E",
    source: "Derived from Sunflower Seeds",
    function: "Antioxidant",
    benefit: "Protects delicate lip skin from environmental stressors."
  },
  {
    name: "Castor Seed Oil",
    source: "Ricinus Communis Plant",
    function: "High Shine & Emollient",
    benefit: "Creates a dewy finish while softening rough skin."
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "dew-stick",
    name: "The Dew Stick",
    price: 1499,
    description: "All-day moisture with a sheer, dewy finish. Powered by Plant-based Hyaluronic Acid.",
    image: "https://i.ibb.co/twdxvzTy/Screenshot-2026-02-13-172401.png",
    textureVideo: "https://images.unsplash.com/photo-1611082231242-26396ef335cd?q=80&w=1000&auto=format&fit=crop",
    ingredients: INGREDIENTS.slice(0, 4),
    reviews: 142,
    rating: 5,
    bestSeller: true
  },
  {
    id: "natural-lipstick",
    name: "Natural Lipstick",
    price: 2499,
    description: "A luxury satin finish lipstick enriched with botanical pigments and organic Jojoba oil.",
    image: "https://i.ibb.co/ccr3qvj8/Screenshot-2026-02-13-172938.png",
    textureVideo: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop",
    ingredients: [INGREDIENTS[1], INGREDIENTS[2], INGREDIENTS[4]],
    reviews: 56,
    rating: 4.8
  },
  {
    id: "night-mask",
    name: "The Night Mask",
    price: 2199,
    description: "Deep repair with Cupuaçu Butter and a calming lavender scent.",
    image: "https://i.ibb.co/kV3csC8X/Screenshot-2026-02-13-172249.png",
    textureVideo: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    ingredients: INGREDIENTS.slice(0, 3),
    reviews: 210,
    rating: 5
  }
];