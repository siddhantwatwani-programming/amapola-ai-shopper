export type Category = 'produce' | 'bakery' | 'deli' | 'dairy' | 'pantry' | 'snacks';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
}

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: 'produce', label: 'Produce', emoji: '🥬' },
  { id: 'bakery', label: 'Bakery', emoji: '🍞' },
  { id: 'deli', label: 'Deli', emoji: '🥩' },
  { id: 'dairy', label: 'Dairy', emoji: '🧀' },
  { id: 'pantry', label: 'Pantry', emoji: '🫘' },
  { id: 'snacks', label: 'Snacks', emoji: '🥤' },
];

export const products: Product[] = [
  // Produce
  { id: 'p1', name: 'Organic Avocados', description: 'Ripe & ready, pack of 3', price: 4.99, category: 'produce', emoji: '🥑' },
  { id: 'p2', name: 'Roma Tomatoes', description: 'Vine-ripened, per lb', price: 2.49, category: 'produce', emoji: '🍅' },
  { id: 'p3', name: 'Fresh Cilantro', description: 'Locally grown bunch', price: 0.99, category: 'produce', emoji: '🌿' },
  { id: 'p4', name: 'Jalapeños', description: 'Fresh hot peppers, per lb', price: 1.99, category: 'produce', emoji: '🌶️' },
  { id: 'p5', name: 'Limes', description: 'Bag of 6', price: 2.99, category: 'produce', emoji: '🍋' },
  { id: 'p6', name: 'Sweet Corn', description: 'Fresh ears, pack of 4', price: 3.49, category: 'produce', emoji: '🌽' },
  // Bakery
  { id: 'b1', name: 'Bolillo Rolls', description: 'Freshly baked, bag of 6', price: 3.49, category: 'bakery', emoji: '🥖' },
  { id: 'b2', name: 'Pan Dulce Assorted', description: 'Mixed sweet bread, 4 pieces', price: 5.99, category: 'bakery', emoji: '🍩' },
  { id: 'b3', name: 'Flour Tortillas', description: 'Homestyle, pack of 12', price: 4.29, category: 'bakery', emoji: '🫓' },
  { id: 'b4', name: 'Tres Leches Cake', description: 'Slice, made fresh daily', price: 4.99, category: 'bakery', emoji: '🍰' },
  // Deli
  { id: 'd1', name: 'Carne Asada', description: 'Marinated beef, per lb', price: 8.99, category: 'deli', emoji: '🥩' },
  { id: 'd2', name: 'Pollo Asado', description: 'Seasoned chicken, per lb', price: 6.49, category: 'deli', emoji: '🍗' },
  { id: 'd3', name: 'Chorizo', description: 'House-made, per lb', price: 5.99, category: 'deli', emoji: '🌭' },
  { id: 'd4', name: 'Queso Fresco', description: 'Fresh cheese, 12oz', price: 4.49, category: 'deli', emoji: '🧀' },
  // Dairy
  { id: 'da1', name: 'Whole Milk', description: 'Gallon, farm fresh', price: 4.99, category: 'dairy', emoji: '🥛' },
  { id: 'da2', name: 'Crema Mexicana', description: 'Sour cream, 15oz', price: 3.99, category: 'dairy', emoji: '🫙' },
  { id: 'da3', name: 'Oaxaca Cheese', description: 'String cheese, 12oz', price: 5.49, category: 'dairy', emoji: '🧀' },
  { id: 'da4', name: 'Eggs', description: 'Free-range, dozen', price: 5.99, category: 'dairy', emoji: '🥚' },
  // Pantry
  { id: 'pa1', name: 'Black Beans', description: 'Dried, 2lb bag', price: 3.29, category: 'pantry', emoji: '🫘' },
  { id: 'pa2', name: 'Mexican Rice', description: 'Long grain, 5lb', price: 4.99, category: 'pantry', emoji: '🍚' },
  { id: 'pa3', name: 'Salsa Verde', description: 'Medium heat, 16oz jar', price: 3.99, category: 'pantry', emoji: '🫙' },
  { id: 'pa4', name: 'Dried Chiles', description: 'Guajillo, 4oz bag', price: 2.99, category: 'pantry', emoji: '🌶️' },
  // Snacks
  { id: 's1', name: 'Jarritos Mandarin', description: 'Mexican soda, 12.5oz', price: 1.79, category: 'snacks', emoji: '🍊' },
  { id: 's2', name: 'Takis Fuego', description: 'Hot rolled tortilla chips', price: 3.49, category: 'snacks', emoji: '🌮' },
  { id: 's3', name: 'Mexican Coca-Cola', description: 'Glass bottle, 355ml', price: 2.49, category: 'snacks', emoji: '🥤' },
  { id: 's4', name: 'Mazapán', description: 'Peanut candy, 4 pack', price: 2.99, category: 'snacks', emoji: '🥜' },
];

// AI scripted responses
export interface AiResponse {
  keywords: string[];
  message: string;
  productIds: string[];
}

export const aiResponses: AiResponse[] = [
  {
    keywords: ['taco', 'tacos', 'taco night'],
    message: "🌮 Great choice! Here's everything you need for an amazing taco night at home:",
    productIds: ['d1', 'b3', 'p3', 'p4', 'p5', 'p2', 'da2'],
  },
  {
    keywords: ['pasta', 'spaghetti', 'italian'],
    message: "🍝 I'd recommend these items for a delicious pasta dinner:",
    productIds: ['p2', 'da1', 'da3', 'p3', 'b1'],
  },
  {
    keywords: ['breakfast', 'morning', 'desayuno'],
    message: "☀️ Here's a wholesome breakfast spread from Amapola:",
    productIds: ['da4', 'b3', 'd3', 'da1', 'b2'],
  },
  {
    keywords: ['healthy', 'salad', 'light', 'vegetable', 'vegetables'],
    message: "🥗 Great picks for a healthy meal! Try these fresh options:",
    productIds: ['p1', 'p2', 'p3', 'p5', 'p6'],
  },
  {
    keywords: ['cheese', 'queso'],
    message: "🧀 We have some amazing cheese options for you:",
    productIds: ['d4', 'da3', 'da2'],
  },
  {
    keywords: ['snack', 'drink', 'beverage', 'thirsty'],
    message: "🥤 Here are some crowd-favorite snacks and drinks:",
    productIds: ['s1', 's2', 's3', 's4'],
  },
];

export const defaultAiResponse: AiResponse = {
  keywords: [],
  message: "Here are some popular picks from Amapola Market that I think you'll love:",
  productIds: ['p1', 'd1', 'b2', 's1', 'da4', 'pa3'],
};

export function findAiResponse(query: string): AiResponse {
  const lower = query.toLowerCase();
  return aiResponses.find(r => r.keywords.some(k => lower.includes(k))) || defaultAiResponse;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
