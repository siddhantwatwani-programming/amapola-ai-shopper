export type Category = 'produce' | 'bakery' | 'deli' | 'dairy' | 'pantry' | 'frozen' | 'meat' | 'beverages' | 'snacks';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
  image?: string;
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
  // Produce — verified real food photos
  { id: 'p1', name: 'Organic Avocados', description: 'Ripe & ready, pack of 3', price: 4.99, category: 'produce', emoji: '🥑', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&crop=center' },
  { id: 'p2', name: 'Roma Tomatoes', description: 'Vine-ripened, per lb', price: 2.49, category: 'produce', emoji: '🍅', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadce55?w=400&h=400&fit=crop&crop=center' },
  { id: 'p3', name: 'Fresh Cilantro', description: 'Locally grown bunch', price: 0.99, category: 'produce', emoji: '🌿', image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=400&fit=crop&crop=center' },
  { id: 'p4', name: 'Jalapeños', description: 'Fresh hot peppers, per lb', price: 1.99, category: 'produce', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=400&fit=crop&crop=center' },
  { id: 'p5', name: 'Limes', description: 'Bag of 6', price: 2.99, category: 'produce', emoji: '🍋', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&crop=center' },
  { id: 'p6', name: 'Sweet Corn', description: 'Fresh ears, pack of 4', price: 3.49, category: 'produce', emoji: '🌽', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop&crop=center' },
  { id: 'p7', name: 'Fresh Spinach', description: 'Organic baby spinach, 5oz', price: 3.99, category: 'produce', emoji: '🥬', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center' },
  { id: 'p8', name: 'White Onions', description: 'Per lb, great for salsa', price: 1.29, category: 'produce', emoji: '🧅', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=400&fit=crop&crop=center' },
  // Bakery — real bakery / tortilla photos
  { id: 'b1', name: 'Bolillo Rolls', description: 'Freshly baked, bag of 6', price: 3.49, category: 'bakery', emoji: '🥖', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&crop=center' },
  { id: 'b2', name: 'Pan Dulce Assorted', description: 'Mixed sweet bread, 4 pieces', price: 5.99, category: 'bakery', emoji: '🍩', image: 'https://images.unsplash.com/photo-1558303065-7414ff41f2ca?w=400&h=400&fit=crop&crop=center' },
  { id: 'b3', name: 'Flour Tortillas', description: 'Homestyle, pack of 12', price: 4.29, category: 'bakery', emoji: '🫓', image: 'https://images.unsplash.com/photo-1612966809280-f9a32b3e2500?w=400&h=400&fit=crop&crop=center' },
  { id: 'b4', name: 'Tres Leches Cake', description: 'Slice, made fresh daily', price: 4.99, category: 'bakery', emoji: '🍰', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop&crop=center' },
  { id: 'b5', name: 'Corn Tortillas', description: 'Fresh pressed, pack of 30', price: 3.99, category: 'bakery', emoji: '🫓', image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?w=400&h=400&fit=crop&crop=center' },
  // Deli — real meat / prepared food photos
  { id: 'd1', name: 'Carne Asada', description: 'Marinated beef, per lb', price: 8.99, category: 'deli', emoji: '🥩', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop&crop=center' },
  { id: 'd2', name: 'Pollo Asado', description: 'Seasoned chicken, per lb', price: 6.49, category: 'deli', emoji: '🍗', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop&crop=center' },
  { id: 'd3', name: 'Chorizo', description: 'House-made, per lb', price: 5.99, category: 'deli', emoji: '🌭', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&crop=center' },
  { id: 'd4', name: 'Queso Fresco', description: 'Fresh cheese, 12oz', price: 4.49, category: 'deli', emoji: '🧀', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop&crop=center' },
  { id: 'd5', name: 'Al Pastor', description: 'Seasoned pork, per lb', price: 7.99, category: 'deli', emoji: '🥩', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop&crop=center' },
  // Dairy
  { id: 'da1', name: 'Whole Milk', description: 'Gallon, farm fresh', price: 4.99, category: 'dairy', emoji: '🥛', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&crop=center' },
  { id: 'da2', name: 'Crema Mexicana', description: 'Sour cream, 15oz', price: 3.99, category: 'dairy', emoji: '🫙', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&crop=center' },
  { id: 'da3', name: 'Oaxaca Cheese', description: 'String cheese, 12oz', price: 5.49, category: 'dairy', emoji: '🧀', image: 'https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=400&h=400&fit=crop&crop=center' },
  { id: 'da4', name: 'Eggs', description: 'Free-range, dozen', price: 5.99, category: 'dairy', emoji: '🥚', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&crop=center' },
  { id: 'da5', name: 'Butter', description: 'Unsalted, 1lb', price: 4.49, category: 'dairy', emoji: '🧈', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&crop=center' },
  // Pantry
  { id: 'pa1', name: 'Black Beans', description: 'Dried, 2lb bag', price: 3.29, category: 'pantry', emoji: '🫘', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop&crop=center' },
  { id: 'pa2', name: 'Mexican Rice', description: 'Long grain, 5lb', price: 4.99, category: 'pantry', emoji: '🍚', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center' },
  { id: 'pa3', name: 'Salsa Verde', description: 'Medium heat, 16oz jar', price: 3.99, category: 'pantry', emoji: '🫙', image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400&h=400&fit=crop&crop=center' },
  { id: 'pa4', name: 'Dried Chiles', description: 'Guajillo, 4oz bag', price: 2.99, category: 'pantry', emoji: '🌶️', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=400&fit=crop&crop=center' },
  { id: 'pa5', name: 'Olive Oil', description: 'Extra virgin, 500ml', price: 6.99, category: 'pantry', emoji: '🫒', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&crop=center' },
  { id: 'pa6', name: 'Pasta Noodles', description: 'Spaghetti, 16oz', price: 2.49, category: 'pantry', emoji: '🍝', image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&h=400&fit=crop&crop=center' },
  // Frozen
  { id: 'f1', name: 'Frozen Tamales', description: 'Pork, 6 count', price: 9.99, category: 'frozen', emoji: '🫔', image: 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=400&h=400&fit=crop&crop=center' },
  { id: 'f2', name: 'Ice Cream Bars', description: 'Paletas, variety 6-pack', price: 6.49, category: 'frozen', emoji: '🍦', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop&crop=center' },
  { id: 'f3', name: 'Frozen Fruit Mix', description: 'Mango, pineapple, strawberry', price: 5.99, category: 'frozen', emoji: '🍓', image: 'https://images.unsplash.com/photo-1577003811926-53b288a6e5d0?w=400&h=400&fit=crop&crop=center' },
  { id: 'f4', name: 'Frozen Empanadas', description: 'Beef, 8 count', price: 8.49, category: 'frozen', emoji: '🥟', image: 'https://images.unsplash.com/photo-1604579278540-db5599ce44d0?w=400&h=400&fit=crop&crop=center' },
  // Meat & Seafood
  { id: 'm1', name: 'Ground Beef', description: '80/20, per lb', price: 6.99, category: 'meat', emoji: '🥩', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop&crop=center' },
  { id: 'm2', name: 'Tilapia Fillets', description: 'Fresh, per lb', price: 7.49, category: 'meat', emoji: '🐟', image: 'https://images.unsplash.com/photo-1510130113581-82a3b7a40498?w=400&h=400&fit=crop&crop=center' },
  { id: 'm3', name: 'Chicken Thighs', description: 'Bone-in, per lb', price: 4.99, category: 'meat', emoji: '🍗', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center' },
  { id: 'm4', name: 'Shrimp', description: 'Shell-on, per lb', price: 9.99, category: 'meat', emoji: '🦐', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop&crop=center' },
  { id: 'm5', name: 'Pork Shoulder', description: 'For carnitas, per lb', price: 5.49, category: 'meat', emoji: '🐖', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop&crop=center' },
  // Beverages
  { id: 'bv1', name: 'Jarritos Mandarin', description: 'Mexican soda, 12.5oz', price: 1.79, category: 'beverages', emoji: '🍊', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop&crop=center' },
  { id: 'bv2', name: 'Mexican Coca-Cola', description: 'Glass bottle, 355ml', price: 2.49, category: 'beverages', emoji: '🥤', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&crop=center' },
  { id: 'bv3', name: 'Horchata', description: 'Fresh, 32oz', price: 4.99, category: 'beverages', emoji: '🥛', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&h=400&fit=crop&crop=center' },
  { id: 'bv4', name: 'Agua de Jamaica', description: 'Hibiscus water, 32oz', price: 4.49, category: 'beverages', emoji: '🌺', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&crop=center' },
  { id: 'bv5', name: 'Topo Chico', description: 'Sparkling mineral water', price: 1.99, category: 'beverages', emoji: '💧', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&crop=center' },
  // Snacks & Sweets
  { id: 's1', name: 'Takis Fuego', description: 'Hot rolled tortilla chips', price: 3.49, category: 'snacks', emoji: '🌮', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=400&fit=crop&crop=center' },
  { id: 's2', name: 'Mazapán', description: 'Peanut candy, 4 pack', price: 2.99, category: 'snacks', emoji: '🥜', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop&crop=center' },
  { id: 's3', name: 'Churro Chips', description: 'Cinnamon sugar, 8oz', price: 3.99, category: 'snacks', emoji: '🍩', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop&crop=center' },
  { id: 's4', name: 'Duvalin', description: 'Hazelnut & vanilla cream', price: 1.49, category: 'snacks', emoji: '🍫', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop&crop=center' },
  { id: 's5', name: 'Lucas Muecas', description: 'Chili candy lollipop', price: 0.99, category: 'snacks', emoji: '🍭', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&h=400&fit=crop&crop=center' },
  { id: 's6', name: 'Chips & Guac Kit', description: 'Tortilla chips + fresh guac', price: 7.99, category: 'snacks', emoji: '🥑', image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&h=400&fit=crop&crop=center' },
];

// Complementary product pairings for AI follow-ups
export const productPairings: Record<string, { ids: string[]; reason: string }> = {
  'd1': { ids: ['b3', 'p3', 'p5', 'da2'], reason: 'Perfect with tortillas, cilantro, limes, and crema' },
  'd5': { ids: ['b5', 'p8', 'p4', 'pa3'], reason: 'Great with corn tortillas, onions, jalapeños, and salsa verde' },
  'b3': { ids: ['d1', 'd4', 'da2'], reason: 'Fill them with carne asada, queso fresco, or crema' },
  'b5': { ids: ['m5', 'pa4', 'p3'], reason: 'Essential for tamales with pork shoulder, chiles, and cilantro' },
  'm5': { ids: ['pa4', 'b5', 'p8', 'p5'], reason: 'Classic carnitas combo: chiles, tortillas, onion, and lime' },
  'p1': { ids: ['p5', 'p3', 'p4', 's6'], reason: 'Make guacamole with lime, cilantro, and jalapeños' },
  'da4': { ids: ['d3', 'b3', 'da1', 'b2'], reason: 'Complete breakfast: chorizo, tortillas, milk, and pan dulce' },
  'd3': { ids: ['da4', 'b3', 'p8'], reason: 'Chorizo and eggs with tortillas and onion — classic' },
  'b2': { ids: ['bv3', 'da1'], reason: 'Pan dulce is best with horchata or milk' },
  'bv3': { ids: ['b2', 'b4'], reason: 'Pair with bakery — pan dulce or tres leches' },
  's6': { ids: ['bv1', 'bv5', 's1'], reason: 'Add a Jarritos, Topo Chico, or Takis for a complete snack spread' },
  'm4': { ids: ['p5', 'p3', 'p4', 'b5'], reason: 'Shrimp tacos: lime, cilantro, jalapeño, and corn tortillas' },
  'f1': { ids: ['pa3', 'da2'], reason: 'Tamales with salsa verde and crema on the side' },
  'pa1': { ids: ['pa2', 'p8', 'p3'], reason: 'Beans and rice with onion and cilantro — staple combo' },
};

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
