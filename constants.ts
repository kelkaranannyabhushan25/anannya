
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
    price: 18,
    description: "All-day moisture with a sheer, dewy finish. Perfect for daily hydration and a natural glow.",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop",
    textureVideo: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhic2R6ZTZ4ZWZ6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Z2Z6Zm0mZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKMGpxXzUWy9pW8/giphy.gif",
    ingredients: INGREDIENTS.slice(0, 4),
    reviews: 142,
    rating: 5,
    bestSeller: true
  },
  {
    id: "bloom-balm",
    name: "Bloom Balm",
    price: 22,
    description: "A buildable berry tint with antioxidant protection. Infused with natural pigments for a healthy flush.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1000&auto=format&fit=crop",
    ingredients: INGREDIENTS.slice(1, 5),
    reviews: 89,
    rating: 4.5
  },
  {
    id: "night-mask",
    name: "The Night Mask",
    price: 26,
    description: "Overnight repair with ultra-pure botanical oils. Wake up to soft, rejuvenated lips.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1000&auto=format&fit=crop",
    ingredients: INGREDIENTS.slice(0, 3),
    reviews: 210,
    rating: 5
  }
];
