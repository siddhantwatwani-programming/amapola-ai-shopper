export type Category = 'produce' | 'bakery' | 'deli' | 'dairy' | 'pantry' | 'frozen' | 'meat' | 'beverages' | 'snacks';

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
  { id: 'frozen', label: 'Frozen', emoji: '🧊' },
  { id: 'meat', label: 'Meat & Seafood', emoji: '🐟' },
  { id: 'beverages', label: 'Beverages', emoji: '🧃' },
  { id: 'snacks', label: 'Snacks & Sweets', emoji: '🍬' },
];

export const products: Product[] = [
  // Produce
  { id: 'p1', name: 'Organic Avocados', description: 'Ripe & ready, pack of 3', price: 4.99, category: 'produce', emoji: '🥑' },
  { id: 'p2', name: 'Roma Tomatoes', description: 'Vine-ripened, per lb', price: 2.49, category: 'produce', emoji: '🍅' },
  { id: 'p3', name: 'Fresh Cilantro', description: 'Locally grown bunch', price: 0.99, category: 'produce', emoji: '🌿' },
  { id: 'p4', name: 'Jalapeños', description: 'Fresh hot peppers, per lb', price: 1.99, category: 'produce', emoji: '🌶️' },
  { id: 'p5', name: 'Limes', description: 'Bag of 6', price: 2.99, category: 'produce', emoji: '🍋' },
  { id: 'p6', name: 'Sweet Corn', description: 'Fresh ears, pack of 4', price: 3.49, category: 'produce', emoji: '🌽' },
  { id: 'p7', name: 'Fresh Spinach', description: 'Organic baby spinach, 5oz', price: 3.99, category: 'produce', emoji: '🥬' },
  { id: 'p8', name: 'White Onions', description: 'Per lb, great for salsa', price: 1.29, category: 'produce', emoji: '🧅' },
  // Bakery
  { id: 'b1', name: 'Bolillo Rolls', description: 'Freshly baked, bag of 6', price: 3.49, category: 'bakery', emoji: '🥖' },
  { id: 'b2', name: 'Pan Dulce Assorted', description: 'Mixed sweet bread, 4 pieces', price: 5.99, category: 'bakery', emoji: '🍩' },
  { id: 'b3', name: 'Flour Tortillas', description: 'Homestyle, pack of 12', price: 4.29, category: 'bakery', emoji: '🫓' },
  { id: 'b4', name: 'Tres Leches Cake', description: 'Slice, made fresh daily', price: 4.99, category: 'bakery', emoji: '🍰' },
  { id: 'b5', name: 'Corn Tortillas', description: 'Fresh pressed, pack of 30', price: 3.99, category: 'bakery', emoji: '🫓' },
  // Deli
  { id: 'd1', name: 'Carne Asada', description: 'Marinated beef, per lb', price: 8.99, category: 'deli', emoji: '🥩' },
  { id: 'd2', name: 'Pollo Asado', description: 'Seasoned chicken, per lb', price: 6.49, category: 'deli', emoji: '🍗' },
  { id: 'd3', name: 'Chorizo', description: 'House-made, per lb', price: 5.99, category: 'deli', emoji: '🌭' },
  { id: 'd4', name: 'Queso Fresco', description: 'Fresh cheese, 12oz', price: 4.49, category: 'deli', emoji: '🧀' },
  { id: 'd5', name: 'Al Pastor', description: 'Seasoned pork, per lb', price: 7.99, category: 'deli', emoji: '🥩' },
  // Dairy
  { id: 'da1', name: 'Whole Milk', description: 'Gallon, farm fresh', price: 4.99, category: 'dairy', emoji: '🥛' },
  { id: 'da2', name: 'Crema Mexicana', description: 'Sour cream, 15oz', price: 3.99, category: 'dairy', emoji: '🫙' },
  { id: 'da3', name: 'Oaxaca Cheese', description: 'String cheese, 12oz', price: 5.49, category: 'dairy', emoji: '🧀' },
  { id: 'da4', name: 'Eggs', description: 'Free-range, dozen', price: 5.99, category: 'dairy', emoji: '🥚' },
  { id: 'da5', name: 'Butter', description: 'Unsalted, 1lb', price: 4.49, category: 'dairy', emoji: '🧈' },
  // Pantry
  { id: 'pa1', name: 'Black Beans', description: 'Dried, 2lb bag', price: 3.29, category: 'pantry', emoji: '🫘' },
  { id: 'pa2', name: 'Mexican Rice', description: 'Long grain, 5lb', price: 4.99, category: 'pantry', emoji: '🍚' },
  { id: 'pa3', name: 'Salsa Verde', description: 'Medium heat, 16oz jar', price: 3.99, category: 'pantry', emoji: '🫙' },
  { id: 'pa4', name: 'Dried Chiles', description: 'Guajillo, 4oz bag', price: 2.99, category: 'pantry', emoji: '🌶️' },
  { id: 'pa5', name: 'Olive Oil', description: 'Extra virgin, 500ml', price: 6.99, category: 'pantry', emoji: '🫒' },
  { id: 'pa6', name: 'Pasta Noodles', description: 'Spaghetti, 16oz', price: 2.49, category: 'pantry', emoji: '🍝' },
  // Frozen
  { id: 'f1', name: 'Frozen Tamales', description: 'Pork, 6 count', price: 9.99, category: 'frozen', emoji: '🫔' },
  { id: 'f2', name: 'Ice Cream Bars', description: 'Paletas, variety 6-pack', price: 6.49, category: 'frozen', emoji: '🍦' },
  { id: 'f3', name: 'Frozen Fruit Mix', description: 'Mango, pineapple, strawberry', price: 5.99, category: 'frozen', emoji: '🍓' },
  { id: 'f4', name: 'Frozen Empanadas', description: 'Beef, 8 count', price: 8.49, category: 'frozen', emoji: '🥟' },
  // Meat & Seafood
  { id: 'm1', name: 'Ground Beef', description: '80/20, per lb', price: 6.99, category: 'meat', emoji: '🥩' },
  { id: 'm2', name: 'Tilapia Fillets', description: 'Fresh, per lb', price: 7.49, category: 'meat', emoji: '🐟' },
  { id: 'm3', name: 'Chicken Thighs', description: 'Bone-in, per lb', price: 4.99, category: 'meat', emoji: '🍗' },
  { id: 'm4', name: 'Shrimp', description: 'Shell-on, per lb', price: 9.99, category: 'meat', emoji: '🦐' },
  { id: 'm5', name: 'Pork Shoulder', description: 'For carnitas, per lb', price: 5.49, category: 'meat', emoji: '🐖' },
  // Beverages
  { id: 'bv1', name: 'Jarritos Mandarin', description: 'Mexican soda, 12.5oz', price: 1.79, category: 'beverages', emoji: '🍊' },
  { id: 'bv2', name: 'Mexican Coca-Cola', description: 'Glass bottle, 355ml', price: 2.49, category: 'beverages', emoji: '🥤' },
  { id: 'bv3', name: 'Horchata', description: 'Fresh, 32oz', price: 4.99, category: 'beverages', emoji: '🥛' },
  { id: 'bv4', name: 'Agua de Jamaica', description: 'Hibiscus water, 32oz', price: 4.49, category: 'beverages', emoji: '🌺' },
  { id: 'bv5', name: 'Topo Chico', description: 'Sparkling mineral water', price: 1.99, category: 'beverages', emoji: '💧' },
  // Snacks & Sweets
  { id: 's1', name: 'Takis Fuego', description: 'Hot rolled tortilla chips', price: 3.49, category: 'snacks', emoji: '🌮' },
  { id: 's2', name: 'Mazapán', description: 'Peanut candy, 4 pack', price: 2.99, category: 'snacks', emoji: '🥜' },
  { id: 's3', name: 'Churro Chips', description: 'Cinnamon sugar, 8oz', price: 3.99, category: 'snacks', emoji: '🍩' },
  { id: 's4', name: 'Duvalin', description: 'Hazelnut & vanilla cream', price: 1.49, category: 'snacks', emoji: '🍫' },
  { id: 's5', name: 'Lucas Muecas', description: 'Chili candy lollipop', price: 0.99, category: 'snacks', emoji: '🍭' },
  { id: 's6', name: 'Chips & Guac Kit', description: 'Tortilla chips + fresh guac', price: 7.99, category: 'snacks', emoji: '🥑' },
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
    message: "🌮 Great choice! Here's everything you need for an amazing taco night at home. Carne asada or al pastor for the protein, fresh tortillas, and all the classic toppings:",
    productIds: ['d1', 'd5', 'b3', 'p3', 'p4', 'p5', 'p2', 'da2', 'p8'],
  },
  {
    keywords: ['pasta', 'spaghetti', 'italian'],
    message: "🍝 For a delicious pasta dinner for 4, I'd recommend our spaghetti noodles with fresh tomatoes, olive oil, and Oaxaca cheese for a Mexican-Italian twist. Add bolillo rolls on the side:",
    productIds: ['pa6', 'p2', 'pa5', 'da3', 'p3', 'b1', 'p7'],
  },
  {
    keywords: ['breakfast', 'morning', 'desayuno'],
    message: "☀️ Here's a wholesome breakfast spread! Free-range eggs, fresh tortillas, chorizo, and a glass of horchata to start your morning right:",
    productIds: ['da4', 'b3', 'd3', 'da1', 'b2', 'bv3'],
  },
  {
    keywords: ['healthy', 'salad', 'light', 'vegetable', 'vegetables'],
    message: "🥗 Great picks for a healthy meal! Fresh organic produce with a light, clean preparation. The spinach and avocados are especially fresh today:",
    productIds: ['p1', 'p7', 'p2', 'p3', 'p5', 'p6', 'pa5'],
  },
  {
    keywords: ['cheese', 'queso'],
    message: "🧀 We have some amazing cheese options — perfect for quesadillas, snacking, or topping your favorite dishes:",
    productIds: ['d4', 'da3', 'da2', 'b3'],
  },
  {
    keywords: ['snack', 'snacks', 'munchies'],
    message: "🍿 Here are some crowd-favorite snacks! From spicy Takis to sweet Mazapán — great for movie night or sharing:",
    productIds: ['s1', 's2', 's3', 's4', 's5', 's6'],
  },
  {
    keywords: ['drink', 'beverage', 'thirsty', 'drinks'],
    message: "🥤 Our beverage selection is amazing — try a classic Jarritos, fresh horchata, or sparkling Topo Chico:",
    productIds: ['bv1', 'bv2', 'bv3', 'bv4', 'bv5'],
  },
  {
    keywords: ['picnic', 'outdoor', 'park'],
    message: "🧺 Perfect picnic spread! Easy-to-carry items that taste great outdoors. The chips & guac kit is a must-have:",
    productIds: ['s6', 'bv5', 's1', 'b1', 'd4', 'f2'],
  },
  {
    keywords: ['carnitas', 'pork'],
    message: "🐖 For authentic carnitas, start with our pork shoulder — slow-cook it with dried chiles and serve with corn tortillas and fresh toppings:",
    productIds: ['m5', 'pa4', 'b5', 'p3', 'p8', 'p5', 'da2'],
  },
  {
    keywords: ['seafood', 'fish', 'shrimp', 'ceviche'],
    message: "🦐 Our seafood selection is perfect for tacos de pescado or fresh ceviche! Pair with limes and cilantro:",
    productIds: ['m2', 'm4', 'p5', 'p3', 'p4', 'p2', 'b5'],
  },
  {
    keywords: ['party', 'fiesta', 'gathering', 'friends'],
    message: "🎉 Throwing a fiesta? Here's a party-ready spread with crowd-pleasers across snacks, drinks, and appetizers:",
    productIds: ['s6', 's1', 'bv1', 'bv3', 'd1', 'b3', 'f4', 'bv4'],
  },
  {
    keywords: ['budget', 'cheap', 'affordable', 'under'],
    message: "💰 Smart shopping! Here are great-value items under $4 that pack a lot of flavor:",
    productIds: ['p3', 'p4', 'p8', 'pa1', 'pa4', 'bv1', 's5', 'pa6'],
  },
  {
    keywords: ['egg', 'eggs', 'spinach'],
    message: "🥚 With eggs and spinach you're halfway to a great meal! Add some cheese, tortillas and salsa for a complete dish:",
    productIds: ['da3', 'b3', 'pa3', 'd4', 'p2'],
  },
  {
    keywords: ['dessert', 'sweet', 'cake', 'treat'],
    message: "🍰 Satisfy your sweet tooth! Our tres leches is made fresh daily, and don't miss the pan dulce and ice cream bars:",
    productIds: ['b4', 'b2', 'f2', 's2', 's4', 's3'],
  },
  {
    keywords: ['soup', 'caldo', 'warm', 'comfort'],
    message: "🍲 For a warm, comforting meal try making a classic caldo. Here's what you'll need from our store:",
    productIds: ['m3', 'p6', 'p2', 'p3', 'p8', 'pa1', 'p4'],
  },
];

export const defaultAiResponse: AiResponse = {
  keywords: [],
  message: "Here are some popular picks from Amapola Market that I think you'll love! We have fresh produce, house-made deli items, and authentic Mexican staples:",
  productIds: ['p1', 'd1', 'b2', 'bv3', 'da4', 'pa3', 's6', 'm4'],
};

export function findAiResponse(query: string): AiResponse {
  const lower = query.toLowerCase();
  return aiResponses.find(r => r.keywords.some(k => lower.includes(k))) || defaultAiResponse;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export const priceRanges = [
  { label: 'Under $3', min: 0, max: 3 },
  { label: '$3 – $6', min: 3, max: 6 },
  { label: '$6 – $10', min: 6, max: 10 },
  { label: 'Over $10', min: 10, max: Infinity },
];
