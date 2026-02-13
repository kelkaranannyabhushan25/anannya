
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  textureVideo?: string;
  ingredients: Ingredient[];
  reviews: number;
  rating: number;
  bestSeller?: boolean;
}

export interface Ingredient {
  name: string;
  source: string;
  function: string;
  benefit: string;
}

export interface CartItem extends Product {
  quantity: number;
  isSubscription: boolean;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
