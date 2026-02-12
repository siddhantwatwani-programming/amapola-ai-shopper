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
    message: "🌮 Taco night is what we do best at Amapola! Grab our marinated carne asada or al pastor from the Deli counter, fresh flour tortillas from our Tortilla Factory, and load up on cilantro, jalapeños, and limes from Produce. Don't forget the crema!",
    productIds: ['d1', 'd5', 'b3', 'p3', 'p4', 'p5', 'p2', 'da2', 'p8'],
  },
  {
    keywords: ['tamale', 'tamales', 'masa'],
    message: "🫔 Making tamales? You'll want our pork shoulder from the Meat counter, dried guajillo chiles from Pantry, and corn tortillas for the masa base. We also carry frozen tamales if you want a shortcut — they're made with our own recipe!",
    productIds: ['m5', 'pa4', 'b5', 'f1', 'p8', 'da2', 'pa1'],
  },
  {
    keywords: ['pasta', 'spaghetti', 'italian'],
    message: "🍝 For a pasta dinner with an Amapola twist — grab our spaghetti noodles from Pantry, vine-ripened Roma tomatoes, extra virgin olive oil, and Oaxaca cheese for melting on top. Our bolillo rolls make perfect garlic bread on the side.",
    productIds: ['pa6', 'p2', 'pa5', 'da3', 'p3', 'b1', 'p7'],
  },
  {
    keywords: ['breakfast', 'morning', 'desayuno'],
    message: "☀️ Start your morning the Amapola way! Our free-range eggs with house-made chorizo from the Deli, warm flour tortillas from the Tortilla Factory, and a fresh horchata from our Beverage section. Grab some pan dulce from our Bakery too!",
    productIds: ['da4', 'b3', 'd3', 'da1', 'b2', 'bv3'],
  },
  {
    keywords: ['healthy', 'salad', 'light', 'vegetable', 'vegetables'],
    message: "🥗 Our Produce section has everything for a fresh, healthy meal! The organic baby spinach and avocados came in fresh this morning. Pair with Roma tomatoes, cilantro, and a squeeze of lime — add our olive oil for a simple dressing.",
    productIds: ['p1', 'p7', 'p2', 'p3', 'p5', 'p6', 'pa5'],
  },
  {
    keywords: ['cheese', 'queso', 'quesadilla'],
    message: "🧀 Our cheese selection is a neighborhood favorite! Try the queso fresco from our Deli for crumbling, Oaxaca cheese for melting (perfect for quesadillas), and crema Mexicana to finish. Pair with our fresh flour tortillas.",
    productIds: ['d4', 'da3', 'da2', 'b3'],
  },
  {
    keywords: ['snack', 'snacks', 'munchies', 'antojito'],
    message: "🍿 Our Snacks & Sweets aisle has all the favorites! Takis Fuego for the spice lovers, Mazapán and Duvalin for a sweet treat, and our Chips & Guac Kit is made fresh in-store. Perfect for movie night or sharing with friends.",
    productIds: ['s1', 's2', 's3', 's4', 's5', 's6'],
  },
  {
    keywords: ['drink', 'beverage', 'thirsty', 'drinks', 'agua'],
    message: "🥤 From our Beverage cooler — the Jarritos and Mexican Coca-Cola are always popular. But if you haven't tried our fresh horchata or agua de Jamaica, you're missing out! Both are made in-house daily at Amapola.",
    productIds: ['bv1', 'bv2', 'bv3', 'bv4', 'bv5'],
  },
  {
    keywords: ['picnic', 'outdoor', 'park'],
    message: "🧺 Heading to the park? Our in-store Chips & Guac Kit travels perfectly. Add some bolillo rolls, queso fresco, and Topo Chico. Grab paletas from our Frozen section for a sweet finish!",
    productIds: ['s6', 'bv5', 's1', 'b1', 'd4', 'f2'],
  },
  {
    keywords: ['carnitas', 'pork'],
    message: "🐖 For real-deal carnitas, start with pork shoulder from our Meat counter — slow-cook it low and slow. Grab dried guajillo chiles from Pantry, our fresh corn tortillas, and pile on the cilantro, onion, and lime from Produce.",
    productIds: ['m5', 'pa4', 'b5', 'p3', 'p8', 'p5', 'da2'],
  },
  {
    keywords: ['seafood', 'fish', 'shrimp', 'ceviche', 'pescado'],
    message: "🦐 Our Meat & Seafood counter has fresh tilapia and shell-on shrimp — perfect for tacos de pescado or ceviche. Grab limes, cilantro, and jalapeños from Produce. Use our corn tortillas from the Tortilla Factory to serve.",
    productIds: ['m2', 'm4', 'p5', 'p3', 'p4', 'p2', 'b5'],
  },
  {
    keywords: ['party', 'fiesta', 'gathering', 'friends'],
    message: "🎉 Fiesta time! Our Deli has marinated carne asada ready to grill. Grab flour tortillas, our Chips & Guac Kit, and stock up on Jarritos and agua de Jamaica from Beverages. Frozen empanadas make great appetizers!",
    productIds: ['s6', 's1', 'bv1', 'bv3', 'd1', 'b3', 'f4', 'bv4'],
  },
  {
    keywords: ['budget', 'cheap', 'affordable', 'under'],
    message: "💰 Great value finds at Amapola! Fresh cilantro, jalapeños, and onions from Produce are all under $2. Dried beans and chiles from Pantry stretch a long way. A Jarritos is just $1.79 — hard to beat!",
    productIds: ['p3', 'p4', 'p8', 'pa1', 'pa4', 'bv1', 's5', 'pa6'],
  },
  {
    keywords: ['egg', 'eggs', 'spinach'],
    message: "🥚 You're already set with eggs and spinach! I'd add Oaxaca cheese for melting, flour tortillas for wraps, and our salsa verde from Pantry. That's a complete meal right there — classic Amapola style.",
    productIds: ['da3', 'b3', 'pa3', 'd4', 'p2'],
  },
  {
    keywords: ['dessert', 'sweet', 'cake', 'treat', 'postre'],
    message: "🍰 Our Bakery makes tres leches fresh daily — it's a neighborhood legend! Pair with our pan dulce assortment. From Frozen, try our paletas (ice cream bars). And don't sleep on the Mazapán and churro chips from Snacks!",
    productIds: ['b4', 'b2', 'f2', 's2', 's4', 's3'],
  },
  {
    keywords: ['soup', 'caldo', 'warm', 'comfort'],
    message: "🍲 Nothing beats a warm caldo on a cold day! Grab bone-in chicken thighs from our Meat counter, sweet corn and tomatoes from Produce, and dried beans from Pantry. Add cilantro, onions, and jalapeños for the classic Amapola touch.",
    productIds: ['m3', 'p6', 'p2', 'p3', 'p8', 'pa1', 'p4'],
  },
  {
    keywords: ['carne asada', 'grill', 'bbq', 'asada', 'barbecue'],
    message: "🔥 Our Deli team marinates the carne asada fresh every morning — it's the most popular item at Amapola! Pair with flour tortillas, fresh salsa fixings from Produce, and crema Mexicana. Grab some Jarritos to keep cool while grilling.",
    productIds: ['d1', 'b3', 'p2', 'p3', 'p5', 'p8', 'da2', 'bv1'],
  },
  {
    keywords: ['recommend', 'suggestion', 'popular', 'best', 'favorite'],
    message: "⭐ Here are Amapola Market's all-time favorites! Our carne asada from the Deli, fresh pan dulce from the Bakery, horchata made daily, and our famous Chips & Guac Kit. These are what keep our neighbors coming back!",
    productIds: ['d1', 'b2', 'bv3', 's6', 'da4', 'b4', 'p1'],
  },
];

export const defaultAiResponse: AiResponse = {
  keywords: [],
  message: "Welcome to Amapola Market! 🌺 Here are some of our most popular items — from the Deli counter to our Bakery to fresh Produce. What are you cooking today? I can help you find exactly what you need!",
  productIds: ['d1', 'b2', 'bv3', 's6', 'da4', 'pa3', 'p1', 'm4'],
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
