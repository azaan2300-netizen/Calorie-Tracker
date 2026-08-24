/**
 * Curated common-foods reference table so manual logging can auto-calculate macros from just
 * a food name and a weight, instead of requiring calories/protein/carbs/fat every time.
 *
 * Values are per 100g and approximate standard USDA FoodData Central reference figures for
 * each food's typical preparation (noted in the name, e.g. "cooked" vs "raw") — they're a
 * reasonable estimate for that food in general, not a measurement of any specific product.
 * For a packaged product's actual label values, use barcode scanning instead.
 */

export interface FoodDatabaseEntry {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export const FOOD_DATABASE: FoodDatabaseEntry[] = [
  { name: 'Chicken breast, cooked', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { name: 'Chicken thigh, cooked', caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 10.9 },
  { name: 'Turkey breast, cooked', caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1 },
  { name: 'Ground beef (85% lean), cooked', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 17 },
  { name: 'Steak (sirloin), cooked', caloriesPer100g: 201, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 9.6 },
  { name: 'Pork chop, cooked', caloriesPer100g: 231, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 14 },
  { name: 'Bacon, cooked', caloriesPer100g: 541, proteinPer100g: 37, carbsPer100g: 1.4, fatPer100g: 42 },
  { name: 'Salmon, cooked', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
  { name: 'Tuna, canned in water', caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 0.8 },
  { name: 'Shrimp, cooked', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { name: 'Egg, whole, cooked', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { name: 'Egg white', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2 },
  { name: 'Tofu, firm', caloriesPer100g: 144, proteinPer100g: 15, carbsPer100g: 3, fatPer100g: 8.7 },
  { name: 'White rice, cooked', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { name: 'Brown rice, cooked', caloriesPer100g: 123, proteinPer100g: 2.6, carbsPer100g: 26, fatPer100g: 1 },
  { name: 'Quinoa, cooked', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9 },
  { name: 'Oats, dry', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7 },
  { name: 'Oatmeal, cooked', caloriesPer100g: 71, proteinPer100g: 2.5, carbsPer100g: 12, fatPer100g: 1.5 },
  { name: 'Pasta, cooked', caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1 },
  { name: 'Whole wheat bread', caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4 },
  { name: 'White bread', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.2 },
  { name: 'Potato, baked', caloriesPer100g: 93, proteinPer100g: 2.5, carbsPer100g: 21, fatPer100g: 0.1 },
  { name: 'Sweet potato, baked', caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 21, fatPer100g: 0.2 },
  { name: 'Corn, cooked', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5 },
  { name: 'Black beans, cooked', caloriesPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24, fatPer100g: 0.5 },
  { name: 'Chickpeas, cooked', caloriesPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27, fatPer100g: 2.6 },
  { name: 'Lentils, cooked', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4 },
  { name: 'Broccoli, cooked', caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4 },
  { name: 'Spinach, raw', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Carrots, raw', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
  { name: 'Tomato', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2 },
  { name: 'Cucumber', caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1 },
  { name: 'Avocado', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15 },
  { name: 'Banana', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { name: 'Apple', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { name: 'Orange', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1 },
  { name: 'Strawberries', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3 },
  { name: 'Blueberries', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3 },
  { name: 'Almonds', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
  { name: 'Walnuts', caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 65 },
  { name: 'Peanut butter', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { name: 'Milk, whole', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3 },
  { name: 'Milk, skim', caloriesPer100g: 34, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 0.1 },
  { name: 'Greek yogurt, plain nonfat', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Yogurt, plain whole milk', caloriesPer100g: 61, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3 },
  { name: 'Cottage cheese', caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3 },
  { name: 'Cheddar cheese', caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { name: 'Mozzarella cheese', caloriesPer100g: 280, proteinPer100g: 28, carbsPer100g: 3.1, fatPer100g: 17 },
  { name: 'Butter', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81 },
  { name: 'Olive oil', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { name: 'Popcorn, air-popped', caloriesPer100g: 387, proteinPer100g: 13, carbsPer100g: 78, fatPer100g: 4.5 },
  { name: 'French fries', caloriesPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41, fatPer100g: 15 },
  { name: 'Pizza, cheese', caloriesPer100g: 266, proteinPer100g: 11, carbsPer100g: 33, fatPer100g: 10 },
  { name: 'Dark chocolate', caloriesPer100g: 546, proteinPer100g: 4.9, carbsPer100g: 61, fatPer100g: 31 },
  { name: 'Ice cream, vanilla', caloriesPer100g: 207, proteinPer100g: 3.5, carbsPer100g: 24, fatPer100g: 11 },
  { name: 'Orange juice', caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10.4, fatPer100g: 0.2 },
  { name: 'Cola', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.6, fatPer100g: 0 },
  { name: 'Beer, light lager', caloriesPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 3.6, fatPer100g: 0 },
  { name: 'Coffee, black', caloriesPer100g: 1, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Ramen noodles, cooked', caloriesPer100g: 138, proteinPer100g: 4.5, carbsPer100g: 20, fatPer100g: 4.7 },
  { name: 'Dumplings, pork, steamed', caloriesPer100g: 220, proteinPer100g: 8, carbsPer100g: 25, fatPer100g: 9.5 },
  { name: 'Soup, chicken noodle', caloriesPer100g: 38, proteinPer100g: 2.3, carbsPer100g: 5, fatPer100g: 1 },
  { name: 'Sandwich, turkey and cheese', caloriesPer100g: 230, proteinPer100g: 13, carbsPer100g: 26, fatPer100g: 8 },
  { name: 'Hamburger, plain', caloriesPer100g: 250, proteinPer100g: 12, carbsPer100g: 30, fatPer100g: 9 },
  { name: 'Hot dog, with bun', caloriesPer100g: 260, proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 16 },
  { name: 'Sausage, cooked', caloriesPer100g: 301, proteinPer100g: 15, carbsPer100g: 2, fatPer100g: 26 },
  { name: 'Salad, green with vegetables', caloriesPer100g: 22, proteinPer100g: 1.4, carbsPer100g: 4, fatPer100g: 0.2 },
  { name: 'Sushi, salmon roll', caloriesPer100g: 150, proteinPer100g: 6, carbsPer100g: 25, fatPer100g: 3 },
  { name: 'Cereal, dry', caloriesPer100g: 379, proteinPer100g: 7, carbsPer100g: 84, fatPer100g: 2.5 },
  { name: 'Pancakes', caloriesPer100g: 227, proteinPer100g: 6, carbsPer100g: 28, fatPer100g: 9.7 },
  { name: 'Waffles', caloriesPer100g: 291, proteinPer100g: 7.9, carbsPer100g: 33, fatPer100g: 14.5 },
  { name: 'Bagel, plain', caloriesPer100g: 257, proteinPer100g: 10, carbsPer100g: 50, fatPer100g: 1.5 },
  { name: 'Muffin, blueberry', caloriesPer100g: 340, proteinPer100g: 5, carbsPer100g: 51, fatPer100g: 13 },
  { name: 'Donut, glazed', caloriesPer100g: 452, proteinPer100g: 5, carbsPer100g: 51, fatPer100g: 25 },
  { name: 'Croissant', caloriesPer100g: 406, proteinPer100g: 8.2, carbsPer100g: 45, fatPer100g: 21 },
  { name: 'Granola bar', caloriesPer100g: 471, proteinPer100g: 10, carbsPer100g: 64, fatPer100g: 20 },
  { name: 'Protein shake, whey', caloriesPer100g: 400, proteinPer100g: 80, carbsPer100g: 8, fatPer100g: 5 },
  { name: 'Smoothie, fruit', caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 14, fatPer100g: 0.3 },
  { name: 'Hummus', caloriesPer100g: 166, proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 9.6 },
  { name: 'Guacamole', caloriesPer100g: 150, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 13.5 },
  { name: 'Salsa', caloriesPer100g: 36, proteinPer100g: 1.6, carbsPer100g: 7.5, fatPer100g: 0.2 },
  { name: 'Tortilla, flour', caloriesPer100g: 312, proteinPer100g: 8.2, carbsPer100g: 51, fatPer100g: 7.5 },
  { name: 'Ground turkey, cooked', caloriesPer100g: 189, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 8.3 },
  { name: 'Tilapia, cooked', caloriesPer100g: 128, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 2.7 },
  { name: 'Cod, cooked', caloriesPer100g: 105, proteinPer100g: 23, carbsPer100g: 0, fatPer100g: 0.9 },
  { name: 'Honey', caloriesPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82, fatPer100g: 0 },
  { name: 'Ketchup', caloriesPer100g: 101, proteinPer100g: 1.2, carbsPer100g: 26, fatPer100g: 0.1 },
  { name: 'Mayonnaise', caloriesPer100g: 680, proteinPer100g: 1, carbsPer100g: 0.6, fatPer100g: 75 },

  // Additional proteins
  { name: 'Chicken drumstick, cooked', caloriesPer100g: 172, proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 8 },
  { name: 'Chicken wings, cooked', caloriesPer100g: 203, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 8.1 },
  { name: 'Duck, roasted', caloriesPer100g: 337, proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 28 },
  { name: 'Lamb, cooked', caloriesPer100g: 258, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 17 },
  { name: 'Veal, cooked', caloriesPer100g: 172, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 6.5 },
  { name: 'Bison, cooked', caloriesPer100g: 146, proteinPer100g: 28, carbsPer100g: 0, fatPer100g: 2.4 },
  { name: 'Ham, cooked', caloriesPer100g: 145, proteinPer100g: 21, carbsPer100g: 1.5, fatPer100g: 5.5 },
  { name: 'Pepperoni', caloriesPer100g: 494, proteinPer100g: 22, carbsPer100g: 2, fatPer100g: 44 },
  { name: 'Salami', caloriesPer100g: 336, proteinPer100g: 20, carbsPer100g: 2, fatPer100g: 27 },
  { name: 'Prosciutto', caloriesPer100g: 195, proteinPer100g: 28, carbsPer100g: 0.3, fatPer100g: 8.5 },
  { name: 'Crab, cooked', caloriesPer100g: 97, proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 1.5 },
  { name: 'Lobster, cooked', caloriesPer100g: 89, proteinPer100g: 19, carbsPer100g: 0.5, fatPer100g: 0.9 },
  { name: 'Scallops, cooked', caloriesPer100g: 111, proteinPer100g: 21, carbsPer100g: 5, fatPer100g: 0.8 },
  { name: 'Mussels, cooked', caloriesPer100g: 172, proteinPer100g: 24, carbsPer100g: 7.4, fatPer100g: 4.5 },
  { name: 'Oysters, raw', caloriesPer100g: 68, proteinPer100g: 7, carbsPer100g: 3.9, fatPer100g: 2.5 },
  { name: 'Clams, cooked', caloriesPer100g: 148, proteinPer100g: 25.5, carbsPer100g: 5, fatPer100g: 2 },
  { name: 'Catfish, cooked', caloriesPer100g: 105, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 3 },
  { name: 'Halibut, cooked', caloriesPer100g: 111, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 2.3 },
  { name: 'Mahi mahi, cooked', caloriesPer100g: 109, proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 0.9 },
  { name: 'Trout, cooked', caloriesPer100g: 148, proteinPer100g: 21, carbsPer100g: 0, fatPer100g: 6.6 },
  { name: 'Sardines, canned', caloriesPer100g: 208, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 11.5 },
  { name: 'Anchovies', caloriesPer100g: 210, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 9.7 },
  { name: 'Tuna, canned in oil', caloriesPer100g: 198, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 8.2 },
  { name: 'Tempeh', caloriesPer100g: 193, proteinPer100g: 19, carbsPer100g: 9.4, fatPer100g: 11 },
  { name: 'Seitan', caloriesPer100g: 370, proteinPer100g: 75, carbsPer100g: 14, fatPer100g: 1.9 },
  { name: 'Edamame, cooked', caloriesPer100g: 121, proteinPer100g: 12, carbsPer100g: 10, fatPer100g: 5 },
  { name: 'Black-eyed peas, cooked', caloriesPer100g: 116, proteinPer100g: 7.7, carbsPer100g: 21, fatPer100g: 0.5 },
  { name: 'Kidney beans, cooked', caloriesPer100g: 127, proteinPer100g: 8.7, carbsPer100g: 23, fatPer100g: 0.5 },
  { name: 'Pinto beans, cooked', caloriesPer100g: 143, proteinPer100g: 9, carbsPer100g: 26, fatPer100g: 0.7 },
  { name: 'Split peas, cooked', caloriesPer100g: 118, proteinPer100g: 8.3, carbsPer100g: 21, fatPer100g: 0.4 },
  { name: 'Soybeans, cooked', caloriesPer100g: 173, proteinPer100g: 18, carbsPer100g: 10, fatPer100g: 9 },

  // Grains & starches
  { name: 'Barley, cooked', caloriesPer100g: 123, proteinPer100g: 2.3, carbsPer100g: 28, fatPer100g: 0.4 },
  { name: 'Bulgur, cooked', caloriesPer100g: 83, proteinPer100g: 3.1, carbsPer100g: 19, fatPer100g: 0.2 },
  { name: 'Couscous, cooked', caloriesPer100g: 112, proteinPer100g: 3.8, carbsPer100g: 23, fatPer100g: 0.2 },
  { name: 'Farro, cooked', caloriesPer100g: 127, proteinPer100g: 5, carbsPer100g: 26, fatPer100g: 1 },
  { name: 'Millet, cooked', caloriesPer100g: 119, proteinPer100g: 3.5, carbsPer100g: 23, fatPer100g: 1 },
  { name: 'Buckwheat, cooked', caloriesPer100g: 92, proteinPer100g: 3.4, carbsPer100g: 20, fatPer100g: 0.6 },
  { name: 'Wild rice, cooked', caloriesPer100g: 101, proteinPer100g: 4, carbsPer100g: 21, fatPer100g: 0.3 },
  { name: 'Basmati rice, cooked', caloriesPer100g: 121, proteinPer100g: 2.7, carbsPer100g: 25, fatPer100g: 0.4 },
  { name: 'Grits, cooked', caloriesPer100g: 60, proteinPer100g: 1.4, carbsPer100g: 13, fatPer100g: 0.2 },
  { name: 'Polenta, cooked', caloriesPer100g: 70, proteinPer100g: 1.6, carbsPer100g: 15, fatPer100g: 0.5 },
  { name: 'Rye bread', caloriesPer100g: 259, proteinPer100g: 8.5, carbsPer100g: 48, fatPer100g: 3.3 },
  { name: 'Sourdough bread', caloriesPer100g: 289, proteinPer100g: 11.5, carbsPer100g: 56, fatPer100g: 1.5 },
  { name: 'Pita bread', caloriesPer100g: 275, proteinPer100g: 9, carbsPer100g: 56, fatPer100g: 1.2 },
  { name: 'Naan bread', caloriesPer100g: 310, proteinPer100g: 9, carbsPer100g: 50, fatPer100g: 8 },
  { name: 'English muffin', caloriesPer100g: 225, proteinPer100g: 8.2, carbsPer100g: 44, fatPer100g: 1.8 },
  { name: 'Corn tortilla', caloriesPer100g: 218, proteinPer100g: 5.7, carbsPer100g: 45, fatPer100g: 2.8 },
  { name: 'Rice cakes', caloriesPer100g: 387, proteinPer100g: 8, carbsPer100g: 82, fatPer100g: 2.8 },
  { name: 'Crackers, saltine', caloriesPer100g: 421, proteinPer100g: 9, carbsPer100g: 74, fatPer100g: 10.5 },

  // Vegetables
  { name: 'Cauliflower, cooked', caloriesPer100g: 23, proteinPer100g: 1.8, carbsPer100g: 4.1, fatPer100g: 0.5 },
  { name: 'Zucchini, cooked', caloriesPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatPer100g: 0.3 },
  { name: 'Bell pepper, raw', caloriesPer100g: 31, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.3 },
  { name: 'Onion, raw', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1 },
  { name: 'Garlic', caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatPer100g: 0.5 },
  { name: 'Mushrooms, cooked', caloriesPer100g: 28, proteinPer100g: 2.5, carbsPer100g: 4.3, fatPer100g: 0.5 },
  { name: 'Asparagus, cooked', caloriesPer100g: 22, proteinPer100g: 2.4, carbsPer100g: 4.1, fatPer100g: 0.2 },
  { name: 'Green beans, cooked', caloriesPer100g: 35, proteinPer100g: 1.9, carbsPer100g: 8, fatPer100g: 0.3 },
  { name: 'Peas, cooked', caloriesPer100g: 84, proteinPer100g: 5.4, carbsPer100g: 15, fatPer100g: 0.4 },
  { name: 'Cabbage, raw', caloriesPer100g: 25, proteinPer100g: 1.3, carbsPer100g: 5.8, fatPer100g: 0.1 },
  { name: 'Kale, raw', caloriesPer100g: 49, proteinPer100g: 4.3, carbsPer100g: 8.8, fatPer100g: 0.9 },
  { name: 'Lettuce, romaine', caloriesPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.3, fatPer100g: 0.3 },
  { name: 'Celery, raw', caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3, fatPer100g: 0.2 },
  { name: 'Beets, cooked', caloriesPer100g: 44, proteinPer100g: 1.7, carbsPer100g: 10, fatPer100g: 0.2 },
  { name: 'Radish, raw', caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3.4, fatPer100g: 0.1 },
  { name: 'Brussels sprouts, cooked', caloriesPer100g: 36, proteinPer100g: 2.6, carbsPer100g: 7.1, fatPer100g: 0.5 },
  { name: 'Eggplant, cooked', caloriesPer100g: 33, proteinPer100g: 0.8, carbsPer100g: 8.1, fatPer100g: 0.2 },
  { name: 'Butternut squash, cooked', caloriesPer100g: 40, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.1 },
  { name: 'Pumpkin, cooked', caloriesPer100g: 20, proteinPer100g: 0.7, carbsPer100g: 5, fatPer100g: 0.1 },
  { name: 'Artichoke, cooked', caloriesPer100g: 47, proteinPer100g: 3.3, carbsPer100g: 10.5, fatPer100g: 0.2 },
  { name: 'Okra, cooked', caloriesPer100g: 33, proteinPer100g: 2, carbsPer100g: 7.5, fatPer100g: 0.2 },

  // Fruits
  { name: 'Grapes', caloriesPer100g: 69, proteinPer100g: 0.7, carbsPer100g: 18, fatPer100g: 0.2 },
  { name: 'Pineapple', caloriesPer100g: 50, proteinPer100g: 0.5, carbsPer100g: 13, fatPer100g: 0.1 },
  { name: 'Mango', caloriesPer100g: 60, proteinPer100g: 0.8, carbsPer100g: 15, fatPer100g: 0.4 },
  { name: 'Watermelon', caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 7.6, fatPer100g: 0.2 },
  { name: 'Cantaloupe', caloriesPer100g: 34, proteinPer100g: 0.8, carbsPer100g: 8, fatPer100g: 0.2 },
  { name: 'Kiwi', caloriesPer100g: 61, proteinPer100g: 1.1, carbsPer100g: 15, fatPer100g: 0.5 },
  { name: 'Peach', caloriesPer100g: 39, proteinPer100g: 0.9, carbsPer100g: 9.5, fatPer100g: 0.3 },
  { name: 'Pear', caloriesPer100g: 57, proteinPer100g: 0.4, carbsPer100g: 15, fatPer100g: 0.1 },
  { name: 'Plum', caloriesPer100g: 46, proteinPer100g: 0.7, carbsPer100g: 11, fatPer100g: 0.3 },
  { name: 'Cherries', caloriesPer100g: 63, proteinPer100g: 1.1, carbsPer100g: 16, fatPer100g: 0.2 },
  { name: 'Pomegranate', caloriesPer100g: 83, proteinPer100g: 1.7, carbsPer100g: 19, fatPer100g: 1.2 },
  { name: 'Grapefruit', caloriesPer100g: 42, proteinPer100g: 0.8, carbsPer100g: 11, fatPer100g: 0.1 },
  { name: 'Dates', caloriesPer100g: 282, proteinPer100g: 2.5, carbsPer100g: 75, fatPer100g: 0.4 },
  { name: 'Raisins', caloriesPer100g: 299, proteinPer100g: 3.1, carbsPer100g: 79, fatPer100g: 0.5 },
  { name: 'Coconut, raw', caloriesPer100g: 354, proteinPer100g: 3.3, carbsPer100g: 15, fatPer100g: 33 },

  // Dairy & alternatives
  { name: 'Almond milk, unsweetened', caloriesPer100g: 15, proteinPer100g: 0.6, carbsPer100g: 0.6, fatPer100g: 1.2 },
  { name: 'Soy milk', caloriesPer100g: 33, proteinPer100g: 3.3, carbsPer100g: 1.8, fatPer100g: 1.8 },
  { name: 'Oat milk', caloriesPer100g: 47, proteinPer100g: 1, carbsPer100g: 7.5, fatPer100g: 1.5 },
  { name: 'Coconut milk', caloriesPer100g: 230, proteinPer100g: 2.3, carbsPer100g: 5.5, fatPer100g: 24 },
  { name: 'Parmesan cheese', caloriesPer100g: 431, proteinPer100g: 38, carbsPer100g: 4.1, fatPer100g: 29 },
  { name: 'Feta cheese', caloriesPer100g: 264, proteinPer100g: 14, carbsPer100g: 4.1, fatPer100g: 21 },
  { name: 'Swiss cheese', caloriesPer100g: 380, proteinPer100g: 27, carbsPer100g: 5.4, fatPer100g: 28 },
  { name: 'Cream cheese', caloriesPer100g: 342, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 34 },
  { name: 'Sour cream', caloriesPer100g: 193, proteinPer100g: 2.4, carbsPer100g: 4.6, fatPer100g: 19 },
  { name: 'Heavy cream', caloriesPer100g: 340, proteinPer100g: 2.1, carbsPer100g: 2.8, fatPer100g: 36 },
  { name: 'Ricotta cheese', caloriesPer100g: 174, proteinPer100g: 11, carbsPer100g: 3, fatPer100g: 13 },

  // Nuts, seeds & fats
  { name: 'Cashews', caloriesPer100g: 553, proteinPer100g: 18, carbsPer100g: 30, fatPer100g: 44 },
  { name: 'Pistachios', caloriesPer100g: 560, proteinPer100g: 20, carbsPer100g: 28, fatPer100g: 45 },
  { name: 'Pecans', caloriesPer100g: 691, proteinPer100g: 9.2, carbsPer100g: 14, fatPer100g: 72 },
  { name: 'Sunflower seeds', caloriesPer100g: 584, proteinPer100g: 21, carbsPer100g: 20, fatPer100g: 51 },
  { name: 'Chia seeds', caloriesPer100g: 486, proteinPer100g: 17, carbsPer100g: 42, fatPer100g: 31 },
  { name: 'Flaxseed', caloriesPer100g: 534, proteinPer100g: 18, carbsPer100g: 29, fatPer100g: 42 },
  { name: 'Pumpkin seeds', caloriesPer100g: 559, proteinPer100g: 30, carbsPer100g: 11, fatPer100g: 49 },
  { name: 'Tahini', caloriesPer100g: 595, proteinPer100g: 17, carbsPer100g: 21, fatPer100g: 54 },
  { name: 'Coconut oil', caloriesPer100g: 862, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { name: 'Canola oil', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { name: 'Almond butter', caloriesPer100g: 614, proteinPer100g: 21, carbsPer100g: 19, fatPer100g: 56 },

  // Snacks, sweets & baked goods
  { name: 'Tortilla chips', caloriesPer100g: 489, proteinPer100g: 7, carbsPer100g: 63, fatPer100g: 24 },
  { name: 'Potato chips', caloriesPer100g: 536, proteinPer100g: 6.6, carbsPer100g: 53, fatPer100g: 35 },
  { name: 'Pretzels', caloriesPer100g: 380, proteinPer100g: 10, carbsPer100g: 79, fatPer100g: 2.6 },
  { name: 'Trail mix', caloriesPer100g: 462, proteinPer100g: 14, carbsPer100g: 45, fatPer100g: 29 },
  { name: 'Milk chocolate', caloriesPer100g: 535, proteinPer100g: 7.7, carbsPer100g: 59, fatPer100g: 30 },
  { name: 'Cake, chocolate', caloriesPer100g: 371, proteinPer100g: 5, carbsPer100g: 51, fatPer100g: 17 },
  { name: 'Cookies, chocolate chip', caloriesPer100g: 488, proteinPer100g: 5.5, carbsPer100g: 64, fatPer100g: 24 },
  { name: 'Brownie', caloriesPer100g: 405, proteinPer100g: 5, carbsPer100g: 58, fatPer100g: 18 },
  { name: 'Apple pie', caloriesPer100g: 237, proteinPer100g: 2, carbsPer100g: 34, fatPer100g: 11 },
  { name: 'Jelly/jam', caloriesPer100g: 250, proteinPer100g: 0.4, carbsPer100g: 65, fatPer100g: 0.1 },
  { name: 'Marshmallows', caloriesPer100g: 318, proteinPer100g: 1.8, carbsPer100g: 81, fatPer100g: 0.2 },
  { name: 'Maple syrup', caloriesPer100g: 260, proteinPer100g: 0, carbsPer100g: 67, fatPer100g: 0.1 },

  // Beverages
  { name: 'Apple juice', caloriesPer100g: 46, proteinPer100g: 0.1, carbsPer100g: 11.3, fatPer100g: 0.1 },
  { name: 'Cranberry juice', caloriesPer100g: 46, proteinPer100g: 0.4, carbsPer100g: 12, fatPer100g: 0.1 },
  { name: 'Lemonade', caloriesPer100g: 40, proteinPer100g: 0.1, carbsPer100g: 10.4, fatPer100g: 0 },
  { name: 'Sports drink', caloriesPer100g: 24, proteinPer100g: 0, carbsPer100g: 6, fatPer100g: 0 },
  { name: 'Energy drink', caloriesPer100g: 45, proteinPer100g: 0, carbsPer100g: 11, fatPer100g: 0 },
  { name: 'Wine, red', caloriesPer100g: 85, proteinPer100g: 0.1, carbsPer100g: 2.6, fatPer100g: 0 },
  { name: 'Wine, white', caloriesPer100g: 82, proteinPer100g: 0.1, carbsPer100g: 2.6, fatPer100g: 0 },
  { name: 'Vodka', caloriesPer100g: 231, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Whiskey', caloriesPer100g: 250, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Beer, regular lager', caloriesPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 3.6, fatPer100g: 0 },
  { name: 'Beer, IPA', caloriesPer100g: 63, proteinPer100g: 0.5, carbsPer100g: 5.5, fatPer100g: 0 },
  { name: 'Kombucha', caloriesPer100g: 25, proteinPer100g: 0, carbsPer100g: 6, fatPer100g: 0 },
  { name: 'Iced tea, sweetened', caloriesPer100g: 33, proteinPer100g: 0, carbsPer100g: 8.5, fatPer100g: 0 },
  { name: 'Green tea, unsweetened', caloriesPer100g: 1, proteinPer100g: 0, carbsPer100g: 0.2, fatPer100g: 0 },
  { name: 'Hot chocolate', caloriesPer100g: 76, proteinPer100g: 3.1, carbsPer100g: 13, fatPer100g: 1.7 },

  // Prepared dishes
  { name: 'Fried rice', caloriesPer100g: 163, proteinPer100g: 4.5, carbsPer100g: 22, fatPer100g: 6.5 },
  { name: 'Stir fry, vegetable', caloriesPer100g: 65, proteinPer100g: 2.5, carbsPer100g: 9, fatPer100g: 2.5 },
  { name: 'Curry, chicken', caloriesPer100g: 150, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 9 },
  { name: 'Chili, beef', caloriesPer100g: 130, proteinPer100g: 9, carbsPer100g: 11, fatPer100g: 5.5 },
  { name: 'Mac and cheese', caloriesPer100g: 164, proteinPer100g: 6.4, carbsPer100g: 20, fatPer100g: 6.5 },
  { name: 'Lasagna', caloriesPer100g: 135, proteinPer100g: 8, carbsPer100g: 12, fatPer100g: 6 },
  { name: 'Spaghetti with meat sauce', caloriesPer100g: 130, proteinPer100g: 6.5, carbsPer100g: 16, fatPer100g: 4.5 },
  { name: 'Tacos, beef', caloriesPer100g: 210, proteinPer100g: 11, carbsPer100g: 16, fatPer100g: 12 },
  { name: 'Burrito, bean and cheese', caloriesPer100g: 200, proteinPer100g: 8, carbsPer100g: 27, fatPer100g: 7 },
  { name: 'Quesadilla, cheese', caloriesPer100g: 290, proteinPer100g: 12, carbsPer100g: 28, fatPer100g: 15 },
  { name: 'Fried chicken', caloriesPer100g: 260, proteinPer100g: 20, carbsPer100g: 9, fatPer100g: 16 },
  { name: 'Chicken nuggets', caloriesPer100g: 296, proteinPer100g: 15, carbsPer100g: 17, fatPer100g: 19 },
  { name: 'Fish sticks', caloriesPer100g: 235, proteinPer100g: 12, carbsPer100g: 20, fatPer100g: 12 },
  { name: 'Meatballs', caloriesPer100g: 210, proteinPer100g: 14, carbsPer100g: 8, fatPer100g: 14 },
  { name: 'Meatloaf', caloriesPer100g: 197, proteinPer100g: 15, carbsPer100g: 6, fatPer100g: 12.5 },
  { name: "Shepherd's pie", caloriesPer100g: 120, proteinPer100g: 7, carbsPer100g: 11, fatPer100g: 5.5 },
  { name: 'Pot pie, chicken', caloriesPer100g: 210, proteinPer100g: 7, carbsPer100g: 20, fatPer100g: 12 },
  { name: 'Omelette, cheese', caloriesPer100g: 197, proteinPer100g: 13.5, carbsPer100g: 1.5, fatPer100g: 15 },
  { name: 'French toast', caloriesPer100g: 229, proteinPer100g: 7.7, carbsPer100g: 28, fatPer100g: 9.5 },
  { name: 'Cinnamon roll', caloriesPer100g: 383, proteinPer100g: 5.5, carbsPer100g: 53, fatPer100g: 16 },
  { name: 'Bacon, turkey', caloriesPer100g: 250, proteinPer100g: 22, carbsPer100g: 2, fatPer100g: 17 },
  { name: 'Falafel', caloriesPer100g: 333, proteinPer100g: 13, carbsPer100g: 32, fatPer100g: 18 },
  { name: 'Gyro, lamb', caloriesPer100g: 220, proteinPer100g: 15, carbsPer100g: 15, fatPer100g: 11 },
  { name: 'Pad thai', caloriesPer100g: 155, proteinPer100g: 6, carbsPer100g: 20, fatPer100g: 6 },
  { name: 'Fried egg', caloriesPer100g: 196, proteinPer100g: 14, carbsPer100g: 0.8, fatPer100g: 15 },
  { name: 'Egg salad', caloriesPer100g: 240, proteinPer100g: 9, carbsPer100g: 2, fatPer100g: 22 },
  { name: 'Chicken salad', caloriesPer100g: 190, proteinPer100g: 14, carbsPer100g: 3, fatPer100g: 13.5 },
  { name: 'Tuna salad', caloriesPer100g: 187, proteinPer100g: 16, carbsPer100g: 2.5, fatPer100g: 12.5 },
  { name: 'Caesar salad with dressing', caloriesPer100g: 130, proteinPer100g: 4, carbsPer100g: 5, fatPer100g: 11 },

  // Alcohol & cocktails (kcal per 100g/100mL of the finished drink)
  { name: 'Margarita', caloriesPer100g: 150, proteinPer100g: 0, carbsPer100g: 12, fatPer100g: 0 },
  { name: 'Martini', caloriesPer100g: 150, proteinPer100g: 0, carbsPer100g: 0.5, fatPer100g: 0 },
  { name: 'Mojito', caloriesPer100g: 90, proteinPer100g: 0, carbsPer100g: 8, fatPer100g: 0 },
  { name: 'Old fashioned', caloriesPer100g: 180, proteinPer100g: 0, carbsPer100g: 6, fatPer100g: 0 },
  { name: 'Moscow mule', caloriesPer100g: 95, proteinPer100g: 0, carbsPer100g: 9, fatPer100g: 0 },
  { name: 'Pina colada', caloriesPer100g: 140, proteinPer100g: 0.5, carbsPer100g: 18, fatPer100g: 3 },
  { name: 'Daiquiri', caloriesPer100g: 130, proteinPer100g: 0, carbsPer100g: 14, fatPer100g: 0 },
  { name: 'Whiskey sour', caloriesPer100g: 130, proteinPer100g: 0.2, carbsPer100g: 10, fatPer100g: 0 },
  { name: 'Cosmopolitan', caloriesPer100g: 140, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0 },
  { name: 'Mimosa', caloriesPer100g: 70, proteinPer100g: 0.2, carbsPer100g: 5, fatPer100g: 0 },
  { name: 'Bloody mary', caloriesPer100g: 55, proteinPer100g: 0.5, carbsPer100g: 4, fatPer100g: 0 },
  { name: 'Long island iced tea', caloriesPer100g: 170, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0 },
  { name: 'Rum and coke', caloriesPer100g: 110, proteinPer100g: 0, carbsPer100g: 10, fatPer100g: 0 },
  { name: 'Gin and tonic', caloriesPer100g: 90, proteinPer100g: 0, carbsPer100g: 7, fatPer100g: 0 },
  { name: 'Screwdriver', caloriesPer100g: 95, proteinPer100g: 0.4, carbsPer100g: 9, fatPer100g: 0 },
  { name: 'Champagne', caloriesPer100g: 76, proteinPer100g: 0.1, carbsPer100g: 1.5, fatPer100g: 0 },
  { name: 'Prosecco', caloriesPer100g: 74, proteinPer100g: 0.1, carbsPer100g: 1.7, fatPer100g: 0 },
  { name: 'Sake', caloriesPer100g: 134, proteinPer100g: 0.5, carbsPer100g: 5, fatPer100g: 0 },
  { name: 'Rose wine', caloriesPer100g: 83, proteinPer100g: 0.1, carbsPer100g: 2.6, fatPer100g: 0 },
  { name: 'Sangria', caloriesPer100g: 89, proteinPer100g: 0.1, carbsPer100g: 8, fatPer100g: 0 },
  { name: 'Rum', caloriesPer100g: 231, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Gin', caloriesPer100g: 263, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Bourbon', caloriesPer100g: 250, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Tequila', caloriesPer100g: 231, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Cognac', caloriesPer100g: 250, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Hard seltzer', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 2, fatPer100g: 0 },
  { name: 'Hard cider', caloriesPer100g: 47, proteinPer100g: 0, carbsPer100g: 5.3, fatPer100g: 0 },

  // Asian cuisine
  { name: 'California roll', caloriesPer100g: 129, proteinPer100g: 4.6, carbsPer100g: 20, fatPer100g: 3.1 },
  { name: 'Spicy tuna roll', caloriesPer100g: 145, proteinPer100g: 7, carbsPer100g: 18, fatPer100g: 4.5 },
  { name: 'Sashimi, salmon', caloriesPer100g: 146, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 7 },
  { name: 'Nigiri, tuna', caloriesPer100g: 130, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.5 },
  { name: 'Miso soup', caloriesPer100g: 40, proteinPer100g: 2.5, carbsPer100g: 4, fatPer100g: 1.5 },
  { name: 'Pho, beef', caloriesPer100g: 60, proteinPer100g: 4.5, carbsPer100g: 8, fatPer100g: 1 },
  { name: 'Banh mi', caloriesPer100g: 220, proteinPer100g: 10, carbsPer100g: 28, fatPer100g: 7.5 },
  { name: 'Spring rolls, fresh', caloriesPer100g: 90, proteinPer100g: 4, carbsPer100g: 15, fatPer100g: 1.5 },
  { name: 'Egg rolls, fried', caloriesPer100g: 240, proteinPer100g: 6, carbsPer100g: 25, fatPer100g: 13 },
  { name: 'Potstickers', caloriesPer100g: 210, proteinPer100g: 7, carbsPer100g: 24, fatPer100g: 9 },
  { name: "General Tso's chicken", caloriesPer100g: 220, proteinPer100g: 12, carbsPer100g: 20, fatPer100g: 11 },
  { name: 'Orange chicken', caloriesPer100g: 235, proteinPer100g: 11, carbsPer100g: 26, fatPer100g: 10 },
  { name: 'Kung pao chicken', caloriesPer100g: 180, proteinPer100g: 14, carbsPer100g: 10, fatPer100g: 10 },
  { name: 'Chow mein', caloriesPer100g: 145, proteinPer100g: 5, carbsPer100g: 20, fatPer100g: 5 },
  { name: 'Lo mein', caloriesPer100g: 150, proteinPer100g: 5, carbsPer100g: 22, fatPer100g: 5 },
  { name: 'Pad see ew', caloriesPer100g: 160, proteinPer100g: 6, carbsPer100g: 21, fatPer100g: 6 },
  { name: 'Green curry, chicken', caloriesPer100g: 130, proteinPer100g: 8, carbsPer100g: 6, fatPer100g: 9 },
  { name: 'Red curry, chicken', caloriesPer100g: 135, proteinPer100g: 8, carbsPer100g: 7, fatPer100g: 9.5 },
  { name: 'Tom yum soup', caloriesPer100g: 35, proteinPer100g: 3, carbsPer100g: 3, fatPer100g: 1 },
  { name: 'Bibimbap', caloriesPer100g: 140, proteinPer100g: 6, carbsPer100g: 20, fatPer100g: 4 },
  { name: 'Bulgogi', caloriesPer100g: 190, proteinPer100g: 18, carbsPer100g: 8, fatPer100g: 9.5 },
  { name: 'Kimchi', caloriesPer100g: 15, proteinPer100g: 1.1, carbsPer100g: 2.4, fatPer100g: 0.5 },
  { name: 'Korean fried chicken', caloriesPer100g: 280, proteinPer100g: 18, carbsPer100g: 15, fatPer100g: 17 },
  { name: 'Japchae', caloriesPer100g: 130, proteinPer100g: 2.5, carbsPer100g: 22, fatPer100g: 3.5 },
  { name: 'Ramen bowl with broth', caloriesPer100g: 60, proteinPer100g: 3, carbsPer100g: 8, fatPer100g: 1.8 },
  { name: 'Udon noodles, cooked', caloriesPer100g: 127, proteinPer100g: 3.3, carbsPer100g: 27, fatPer100g: 0.3 },
  { name: 'Soba noodles, cooked', caloriesPer100g: 99, proteinPer100g: 5.1, carbsPer100g: 21, fatPer100g: 0.1 },
  { name: 'Tempura shrimp', caloriesPer100g: 240, proteinPer100g: 11, carbsPer100g: 20, fatPer100g: 13 },
  { name: 'Teriyaki chicken', caloriesPer100g: 175, proteinPer100g: 20, carbsPer100g: 10, fatPer100g: 5.5 },
  { name: 'Chicken katsu', caloriesPer100g: 250, proteinPer100g: 16, carbsPer100g: 16, fatPer100g: 13.5 },
  { name: 'Gyoza', caloriesPer100g: 200, proteinPer100g: 7, carbsPer100g: 22, fatPer100g: 9 },
  { name: 'Mochi', caloriesPer100g: 200, proteinPer100g: 2.5, carbsPer100g: 45, fatPer100g: 1.5 },
  { name: 'Seaweed salad', caloriesPer100g: 45, proteinPer100g: 1.2, carbsPer100g: 5, fatPer100g: 2.5 },
  { name: 'Bubble tea', caloriesPer100g: 65, proteinPer100g: 0.3, carbsPer100g: 16, fatPer100g: 0.3 },

  // Indian cuisine
  { name: 'Butter chicken', caloriesPer100g: 165, proteinPer100g: 11, carbsPer100g: 6, fatPer100g: 11 },
  { name: 'Chicken tikka masala', caloriesPer100g: 160, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 10 },
  { name: 'Samosa', caloriesPer100g: 260, proteinPer100g: 5, carbsPer100g: 28, fatPer100g: 15 },
  { name: 'Chicken biryani', caloriesPer100g: 160, proteinPer100g: 8, carbsPer100g: 20, fatPer100g: 5.5 },
  { name: 'Dal, lentil curry', caloriesPer100g: 105, proteinPer100g: 6, carbsPer100g: 15, fatPer100g: 2.5 },
  { name: 'Palak paneer', caloriesPer100g: 140, proteinPer100g: 7, carbsPer100g: 7, fatPer100g: 10 },
  { name: 'Tandoori chicken', caloriesPer100g: 150, proteinPer100g: 22, carbsPer100g: 2, fatPer100g: 6 },
  { name: 'Chana masala', caloriesPer100g: 130, proteinPer100g: 6, carbsPer100g: 20, fatPer100g: 3 },
  { name: 'Raita', caloriesPer100g: 65, proteinPer100g: 3, carbsPer100g: 5, fatPer100g: 3.5 },
  { name: 'Mango lassi', caloriesPer100g: 95, proteinPer100g: 2.5, carbsPer100g: 17, fatPer100g: 1.8 },

  // Middle Eastern & Mediterranean
  { name: 'Shawarma, chicken', caloriesPer100g: 200, proteinPer100g: 18, carbsPer100g: 10, fatPer100g: 10 },
  { name: 'Kebab, beef', caloriesPer100g: 215, proteinPer100g: 20, carbsPer100g: 3, fatPer100g: 14 },
  { name: 'Tabbouleh', caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 11, fatPer100g: 4.5 },
  { name: 'Baba ganoush', caloriesPer100g: 110, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 8 },
  { name: 'Baklava', caloriesPer100g: 430, proteinPer100g: 6, carbsPer100g: 46, fatPer100g: 26 },
  { name: 'Tzatziki', caloriesPer100g: 75, proteinPer100g: 3.5, carbsPer100g: 3.5, fatPer100g: 5.5 },
  { name: 'Dolma, stuffed grape leaves', caloriesPer100g: 140, proteinPer100g: 2.5, carbsPer100g: 18, fatPer100g: 7 },

  // Latin American
  { name: 'Tamale', caloriesPer100g: 190, proteinPer100g: 5, carbsPer100g: 22, fatPer100g: 9 },
  { name: 'Enchilada, cheese', caloriesPer100g: 190, proteinPer100g: 8, carbsPer100g: 18, fatPer100g: 10 },
  { name: 'Chile relleno', caloriesPer100g: 210, proteinPer100g: 8, carbsPer100g: 12, fatPer100g: 15 },
  { name: 'Elote, Mexican street corn', caloriesPer100g: 160, proteinPer100g: 4, carbsPer100g: 18, fatPer100g: 8 },
  { name: 'Churro', caloriesPer100g: 420, proteinPer100g: 5, carbsPer100g: 48, fatPer100g: 23 },
  { name: 'Flan', caloriesPer100g: 150, proteinPer100g: 4, carbsPer100g: 24, fatPer100g: 4 },
  { name: 'Empanada, beef', caloriesPer100g: 260, proteinPer100g: 9, carbsPer100g: 24, fatPer100g: 14 },

  // Desserts
  { name: 'Tiramisu', caloriesPer100g: 290, proteinPer100g: 5, carbsPer100g: 29, fatPer100g: 17 },
  { name: 'Cheesecake', caloriesPer100g: 321, proteinPer100g: 5.5, carbsPer100g: 26, fatPer100g: 23 },
  { name: 'Creme brulee', caloriesPer100g: 300, proteinPer100g: 4, carbsPer100g: 24, fatPer100g: 21 },
  { name: 'Chocolate pudding', caloriesPer100g: 150, proteinPer100g: 3, carbsPer100g: 25, fatPer100g: 4 },
  { name: 'Gelato', caloriesPer100g: 180, proteinPer100g: 3.5, carbsPer100g: 24, fatPer100g: 8 },
  { name: 'Sorbet', caloriesPer100g: 130, proteinPer100g: 0.2, carbsPer100g: 32, fatPer100g: 0.1 },
  { name: 'Macaron', caloriesPer100g: 400, proteinPer100g: 6, carbsPer100g: 55, fatPer100g: 18 },
  { name: 'Eclair', caloriesPer100g: 300, proteinPer100g: 5, carbsPer100g: 30, fatPer100g: 18 },
  { name: 'Cannoli', caloriesPer100g: 335, proteinPer100g: 7, carbsPer100g: 35, fatPer100g: 18 },
  { name: 'Pumpkin pie', caloriesPer100g: 225, proteinPer100g: 4, carbsPer100g: 30, fatPer100g: 10 },
  { name: 'Pecan pie', caloriesPer100g: 400, proteinPer100g: 4.5, carbsPer100g: 55, fatPer100g: 20 },
  { name: 'Fudge', caloriesPer100g: 420, proteinPer100g: 2, carbsPer100g: 70, fatPer100g: 15 },
  { name: 'Caramel', caloriesPer100g: 380, proteinPer100g: 2.5, carbsPer100g: 77, fatPer100g: 8 },

  // Seasonings, spices & sauces (per 100g reference, typically eaten in small quantities)
  { name: 'Cinnamon, ground', caloriesPer100g: 247, proteinPer100g: 4, carbsPer100g: 81, fatPer100g: 1.2 },
  { name: 'Cumin, ground', caloriesPer100g: 375, proteinPer100g: 18, carbsPer100g: 44, fatPer100g: 22 },
  { name: 'Paprika', caloriesPer100g: 282, proteinPer100g: 14, carbsPer100g: 54, fatPer100g: 13 },
  { name: 'Garlic powder', caloriesPer100g: 331, proteinPer100g: 17, carbsPer100g: 73, fatPer100g: 0.7 },
  { name: 'Chili powder', caloriesPer100g: 282, proteinPer100g: 13, carbsPer100g: 50, fatPer100g: 14 },
  { name: 'Oregano, dried', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 69, fatPer100g: 4.3 },
  { name: 'Turmeric, ground', caloriesPer100g: 312, proteinPer100g: 9.7, carbsPer100g: 67, fatPer100g: 3.3 },
  { name: 'Ginger, fresh', caloriesPer100g: 80, proteinPer100g: 1.8, carbsPer100g: 18, fatPer100g: 0.8 },
  { name: 'Soy sauce', caloriesPer100g: 53, proteinPer100g: 8, carbsPer100g: 4.9, fatPer100g: 0.6 },
  { name: 'Sriracha', caloriesPer100g: 93, proteinPer100g: 1.9, carbsPer100g: 19, fatPer100g: 0.9 },
  { name: 'Hot sauce', caloriesPer100g: 12, proteinPer100g: 0.5, carbsPer100g: 2, fatPer100g: 0.4 },
  { name: 'BBQ sauce', caloriesPer100g: 172, proteinPer100g: 0.6, carbsPer100g: 41, fatPer100g: 0.5 },
  { name: 'Ranch dressing', caloriesPer100g: 430, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 45 },
  { name: 'Italian dressing', caloriesPer100g: 260, proteinPer100g: 0.3, carbsPer100g: 8, fatPer100g: 25 },
  { name: 'Balsamic vinegar', caloriesPer100g: 88, proteinPer100g: 0.5, carbsPer100g: 17, fatPer100g: 0 },
  { name: 'Worcestershire sauce', caloriesPer100g: 78, proteinPer100g: 0, carbsPer100g: 19, fatPer100g: 0 },

  // Exotic / other fruits & foods
  { name: 'Dragon fruit', caloriesPer100g: 60, proteinPer100g: 1.2, carbsPer100g: 13, fatPer100g: 0.4 },
  { name: 'Lychee', caloriesPer100g: 66, proteinPer100g: 0.8, carbsPer100g: 17, fatPer100g: 0.4 },
  { name: 'Durian', caloriesPer100g: 147, proteinPer100g: 1.5, carbsPer100g: 27, fatPer100g: 5.3 },
  { name: 'Jackfruit', caloriesPer100g: 95, proteinPer100g: 1.7, carbsPer100g: 23, fatPer100g: 0.6 },
  { name: 'Star fruit', caloriesPer100g: 31, proteinPer100g: 1, carbsPer100g: 6.7, fatPer100g: 0.3 },
  { name: 'Passion fruit', caloriesPer100g: 97, proteinPer100g: 2.2, carbsPer100g: 23, fatPer100g: 0.7 },
  { name: 'Plantain, fried', caloriesPer100g: 240, proteinPer100g: 1.3, carbsPer100g: 32, fatPer100g: 12 },
  { name: 'Taro, cooked', caloriesPer100g: 112, proteinPer100g: 0.5, carbsPer100g: 27, fatPer100g: 0.1 },
  { name: 'Bone broth', caloriesPer100g: 15, proteinPer100g: 2.5, carbsPer100g: 0.5, fatPer100g: 0.5 },
  { name: 'Protein bar', caloriesPer100g: 380, proteinPer100g: 30, carbsPer100g: 40, fatPer100g: 12 },

  // Coffee & tea drinks
  { name: 'Latte', caloriesPer100g: 42, proteinPer100g: 2.2, carbsPer100g: 4, fatPer100g: 1.6 },
  { name: 'Cappuccino', caloriesPer100g: 35, proteinPer100g: 1.9, carbsPer100g: 3.4, fatPer100g: 1.3 },
  { name: 'Espresso', caloriesPer100g: 2, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0.2 },
  { name: 'Cold brew coffee', caloriesPer100g: 2, proteinPer100g: 0.3, carbsPer100g: 0, fatPer100g: 0 },
  { name: 'Chai latte', caloriesPer100g: 50, proteinPer100g: 1.8, carbsPer100g: 8, fatPer100g: 1.3 },
  { name: 'Matcha latte', caloriesPer100g: 45, proteinPer100g: 2, carbsPer100g: 6, fatPer100g: 1.5 },
  { name: 'Frappuccino', caloriesPer100g: 90, proteinPer100g: 1.5, carbsPer100g: 16, fatPer100g: 2.5 },
];

export function searchFoodDatabase(query: string, limit = 8): FoodDatabaseEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q)).slice(0, limit);
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    // Fold accented letters to their base form first (e.g. "piña" -> "pina", "jalapeño" ->
    // "jalapeno") -- without this, the next line's strip would instead shatter them into
    // meaningless single-letter fragments ("pi" + "a"), breaking matching for both database
    // entries and real user input that includes the accent.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    // crude singularization so "thighs"/"eggs" match "thigh"/"egg" in the database
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
}

/**
 * Fuzzy word-overlap match used by the free-text meal parser, so casual phrasing like
 * "chicken thighs" or "eggs" still finds "Chicken thigh, cooked" / "Egg, whole, cooked"
 * without requiring an exact name match. Ranks candidates by how much of the *query* they
 * account for first (so a short query like "rice" isn't penalized against a longer, more
 * descriptive database name), then prefers the entry with the fewest unrelated extra words.
 */
export function findBestFoodDatabaseMatch(query: string): FoodDatabaseEntry | undefined {
  const queryWords = [...new Set(normalizeWords(query))];
  if (queryWords.length === 0) return undefined;

  let best: FoodDatabaseEntry | undefined;
  let bestCoverage = 0;
  let bestExtraWords = Infinity;

  for (const food of FOOD_DATABASE) {
    const nameWords = normalizeWords(food.name);
    const nameWordSet = new Set(nameWords);
    const overlap = queryWords.filter((w) => nameWordSet.has(w)).length;
    if (overlap === 0) continue;

    const coverage = overlap / queryWords.length;
    const extraWords = nameWords.length - overlap;
    const better = coverage > bestCoverage || (coverage === bestCoverage && extraWords < bestExtraWords);
    if (better) {
      best = food;
      bestCoverage = coverage;
      bestExtraWords = extraWords;
    }
  }

  return bestCoverage >= 0.5 ? best : undefined;
}

export function scaleFoodEntry(entry: FoodDatabaseEntry, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(entry.caloriesPer100g * factor),
    proteinG: Math.round(entry.proteinPer100g * factor * 10) / 10,
    carbsG: Math.round(entry.carbsPer100g * factor * 10) / 10,
    fatG: Math.round(entry.fatPer100g * factor * 10) / 10,
  };
}
