import streetChickenBurger from './assets/images/street_chicken_burger_1783052462658.jpg';
import cleanChickenBurger from './assets/images/clean_chicken_burger_1783910911535.jpg';
import doubleTenderBurger from './assets/images/double_tender_burger_1784008786459.jpg';
import chickenChapliBurger from './assets/images/chicken_chapli_burger_1783908686509.jpg';
import tortillaWrap from './assets/images/tortilla_wrap_grilled_1783197346232.jpg';
import parathaRoll from './assets/images/paratha_roll_1783197039900.jpg';
import chickenShawarma from './assets/images/chicken_shawarma_1783197056152.jpg';
import zingerParathaRoll from './assets/images/zinger_paratha_roll_1783197175607.jpg';
import openShawarma from './assets/images/open_shawarma_1783197194996.jpg';
import zingerShawarma from './assets/images/zinger_shawarma_1783197821883.jpg';
import mozzarellaCheeseSticks from './assets/images/mozzarella_cheese_sticks_1783198034408.jpg';
import loadedFries from './assets/images/loaded_fries_1783198651694.jpg';
import pizzaFries from './assets/images/pizza_fries_1783198671845.jpg';
import gourmetPizza from './assets/images/gourmet_pizza_1783192643518.jpg';
import chapliDeal from './assets/images/chapli_deal_1783840550687.jpg';
import specialDealOne from './assets/images/special_deal_one_1783840794076.jpg';
import specialDealTwo from './assets/images/special_deal_two_combo_1784010743208.jpg';
import specialDealThree from './assets/images/special_deal_three_combo_1784010489095.jpg';
import specialDealFour from './assets/images/special_deal_four_1783841147853.jpg';
import specialDealSix from './assets/images/special_deal_six_shami_1784010061425.jpg';
import specialDealSeven from './assets/images/special_deal_seven_1783841496800.jpg';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | { [key: string]: number }; // Single price or sizes e.g. { Small: 500, Medium: 850, Large: 1400 }
  image?: string;
  badge?: string;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number | string;
  tag: 'Family' | 'Solo' | 'Combo' | 'Special';
  badge?: string;
  image?: string;
}

export const MENU_CATEGORIES = [
  { id: 'regular-pizza', name: 'Regular Pizza' },
  { id: 'special-pizza', name: 'Special Vee Bite Pizza' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'chicken', name: 'Chicken' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'fries', name: 'Fries' },
  { id: 'cheese-sticks', name: 'Cheese Sticks' },
  { id: 'extras', name: 'Extras' },
  { id: 'cold-drinks', name: 'Cold Drinks' },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- Regular Pizza (S 8" / M 10" / L 14") ---
  {
    id: 'pizza-tikka',
    name: 'Chicken Tikka Pizza',
    description: 'Traditional tikka-spiced chicken, fresh onions, cheese pull mozzarella, and rich signature tomato base.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOwjDBS0gMStSOHINwQJ-nJSWrNIEHVQT29FfS3gQ8MyRYnEAwVlsBgPYF&s=10',
    badge: 'Best Seller',
  },
  {
    id: 'pizza-fajita',
    name: 'Chicken Fajita Pizza',
    description: 'Sautéed bell peppers, sweet onions, savory fajita-style chicken breast, and melted mozzarella blend.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://greenvalley.pk/cdn/shop/files/pizza-chicken-fajita_9f9b8488-4732-4396-ac52-b3699a87651e.webp?v=1739451209',
  },
  {
    id: 'pizza-spicy',
    name: 'Chicken Hot & Spicy Pizza',
    description: 'Fierce green chilies, spicy seasoned chicken chunks, jalapeños, and hot chili flakes under bubbly hot cheese.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97WJto7RTGYzebMtNNpxMX5IUfX2Nh4lMvogMfnEjgkZt-_vqUxR0Y9Y&s=10',
    badge: 'Spicy',
  },
  {
    id: 'pizza-creamy-melt',
    name: 'Chicken Creamy Melt Pizza',
    description: 'Succulent chicken breast layered with premium liquid cheese sauce, signature cream sauce, and bell peppers.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://g-cdn.blinkco.io/ordering-system/55720/dish_image/1720640434.jpg',
  },
  {
    id: 'pizza-cheese-lover',
    name: 'Chicken Cheese Lover Pizza',
    description: 'Double cheese decker loaded with heavy layers of premium mozzarella, sharp cheddar, and seasoned white chicken.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://cdn.mafrservices.com/sys-master-root/hcb/h5d/47674706165790/18787_main.jpg?im=Resize=376',
  },
  {
    id: 'pizza-vegi',
    name: 'Chicken Vegi Lover Pizza',
    description: 'A colorful garden pizza with juicy bell peppers, mushrooms, sweet corn, black olives, onions, and chicken strips.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPUgV2ht3nbNU2yGSN42GQNW3opN8jRIIGxb0ry_Mz0nvMQn4YXbdhAM&s=10',
  },
  {
    id: 'pizza-supreme',
    name: 'Chicken Supreme Pizza',
    description: 'The ultimate combo: chicken cubes, smoked chicken pepperoni slices, mushrooms, olives, peppers, onions, and extra cheese.',
    category: 'regular-pizza',
    price: { 'Small 8"': 500, 'Medium 10"': 850, 'Large 14"': 1400 },
    image: 'https://static.tossdown.com/images/93f1dd31-edd7-450a-9165-90d175674e80.webp',
    badge: 'Popular',
  },

  // --- Special Vee Bite Pizza (S / M / L) ---
  {
    id: 'pizza-special-creamy',
    name: 'Chicken Creamy Pizza',
    description: 'Velvety smooth, premium rich garlic white-sauce base, golden-brown chicken chunks, and topped with mild cheddar cheese.',
    category: 'special-pizza',
    price: { 'Small 8"': 600, 'Medium 10"': 1000, 'Large 14"': 1550 },
    image: 'https://pizza100.pk/wp-content/uploads/2026/02/Supreme-Creamy-Pizza2.jpg',
    badge: 'Signature',
  },
  {
    id: 'pizza-malai-boti',
    name: 'Chicken Malai Boti Pizza',
    description: 'Authentic Pakistani tender Malai Boti tikka pieces, creamy base sauce, green onion garnish, and double-baked cheese crust.',
    category: 'special-pizza',
    price: { 'Small 8"': 600, 'Medium 10"': 1000, 'Large 14"': 1550 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd6mO-YsWyAFqCIxbTR_B56Bc2TKZtKawuISnlmndPJw&s=10',
    badge: 'Pakistani Special',
  },
  {
    id: 'pizza-kababish',
    name: 'Chicken Kababish Pizza',
    description: 'Charcoal grilled spicy seekh kabab slices, smoky BBQ drizzle, onions, and rich mozzarella cheese base.',
    category: 'special-pizza',
    price: { 'Small 8"': 600, 'Medium 10"': 1000, 'Large 14"': 1550 },
    image: 'https://assets.indolj.io/upload/1699019597-Kababish.jpg',
  },
  {
    id: 'pizza-special-veebite',
    name: 'Chicken Vee Bite Special Pizza',
    description: 'The crowning jewel: double stuffed crust pizza with a border of cheese, topped with premium secret sauces, special spice mix, and supreme chicken toppings.',
    category: 'special-pizza',
    price: { 'Small 8"': 600, 'Medium 10"': 1000, 'Large 14"': 1550 },
    image: 'https://pizzabites.com.pk/cdn/shop/files/store_01JV6W3H5Q1J2WJGNTN7BDE16W_assets_1747360596761-pizza10copy_524fc7e2-d3b8-403b-b95f-9d5496e2fa2d.jpg?v=1772980122&width=533',
    badge: 'Luxury Chef Craft',
  },

  // --- Burgers ---
  {
    id: 'burger-patty',
    name: 'Patty Burger',
    description: 'Perfectly seasoned golden chicken patty, creamy light mayo, fresh crisp lettuce inside a toasted brioche bun.',
    category: 'burgers',
    price: 250,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo-h5SzhKb6ZDor1Q9K667DmtPWHHynS0j3iA7D2T9DuOQyxmDaFU085Q&s=10',
  },
  {
    id: 'burger-regular-zinger',
    name: 'Regular Zinger Burger',
    description: 'Crispy fried golden chicken breast fillet, fresh shredded lettuce, signature mayonnaise on toasted sesame bun.',
    category: 'burgers',
    price: 300,
    image: 'https://rkpizza.com/wp-content/uploads/2025/08/zinger.webp',
  },
  {
    id: 'burger-chapli',
    name: 'Crispy Cheese Patty Burger',
    description: 'Crispy-fried outer chicken patty stuffed with melting stretchy cheese cores, fresh green leaf lettuce, and premium burger sauce.',
    category: 'burgers',
    price: 350,
    image: 'https://thumbs.dreamstime.com/b/closeup-showcases-mouthwatering-cheeseburger-stacked-high-fresh-ingredients-featuring-juicy-beef-patty-melted-cheese-crisp-379412307.jpg',
    badge: 'Pakistani Classic',
  },
  {
    id: 'burger-zinger',
    name: 'Zinger Burger',
    description: 'Ultra-crispy hand-breaded zinger fillet, premium spicy sauces, and fresh garden vegetables.',
    category: 'burgers',
    price: 350,
    image: 'https://rkpizza.com/wp-content/uploads/2025/08/zinger.webp',
    badge: 'Most Popular',
  },
  {
    id: 'burger-zinger-cheese',
    name: 'Zinger Burger With Cheese',
    description: 'Classic zinger burger loaded with a rich melting slice of premium American cheddar cheese.',
    category: 'burgers',
    price: 400,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCYmuOZebYNorW1JrFzp-2VB5n0bk4OxXzdnmQxROSo-lRlppdyo6BQM&s=10',
  },
  {
    id: 'burger-mighty-zinger',
    name: 'Mighty Zinger Burger',
    description: 'Double crispy giant zinger breast fillets, double melting cheddar cheese slices, crisp lettuce, and dynamic spicy mayo cascade.',
    category: 'burgers',
    price: 600,
    image: 'https://static.tossdown.com/images/d3360ae1-bc13-4b00-9909-99a0ddf78a9d.webp',
    badge: 'Mighty King Size',
  },
  {
    id: 'burger-crispy-cheese-patty',
    name: 'Chicken Chapli Burger',
    description: 'Authentically spiced, pan-fried chicken chapli patty infused with coriander, mint, green chilies, and fresh tomatoes, served in a soft bun.',
    category: 'burgers',
    price: 320,
    image: 'https://www.chefadora.com/_next/image?url=https%3A%2F%2Fchefadora-production.s3.ap-southeast-2.amazonaws.com%2Fmedium_Chapli_kebab_burger_1892ac5f68f_base_9ab5865a71.jpg&w=640&q=75',
  },
  {
    id: 'burger-crispy-tender',
    name: 'Crispy Tender Burger',
    description: 'Glazed crispy-battered chicken tender tenders, honey mustard splash, fresh onions, on soft warm brioche bun.',
    category: 'burgers',
    price: 450,
    image: 'https://images.ctfassets.net/crbk84xktnsl/6FgZSnoqkmb0ZVLcaMdm1/e6ef145fdb0acead4afa8ebe467e0122/Double_Tender_Burger.png',
  },
  {
    id: 'burger-double-tender',
    name: 'Double Tender Burger',
    description: 'Double stacked extra-crispy fried chicken tenders, fresh leaf lettuce, ripe tomato slice, and dripping creamy garlic mayonnaise in a toasted sesame bun.',
    category: 'burgers',
    price: 650,
    image: 'https://png.pngtree.com/png-clipart/20241101/original/pngtree-crispy-cheesy-chicken-patty-burger-on-transparent-background-png-image_16578920.png',
  },

  {
    id: 'burger-chicken',
    name: 'Chicken Burger',
    description: 'Soft home-style grilled chicken breast patty, crisp shredded lettuce, ripe sliced tomato, and creamy burger mayo.',
    category: 'burgers',
    price: 320,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgnxD9m-KgBmagJOg5GCJKtWVhhYSu8KfAxhjYYnOYJQyWSib-txLIaI8p&s=10',
  },
  {
    id: 'burger-double-anda',
    name: 'Double Anda Burger',
    description: 'Locally loved pan-toasted street style burger with two fluffy whisked eggs, a spiced lentil-chicken patty, onions, and sweet chutney.',
    category: 'burgers',
    price: 220,
    image: 'https://mrkhanfoodpoint.com/wp-content/uploads/2025/04/Anda-Shami-Burger.webp',
    badge: 'Street Delight',
  },
  {
    id: 'burger-shami',
    name: 'Shami Burger',
    description: 'The golden legacy: authentic Pakistani tender beef-and-chana-dal shami kebab patty, fried egg, onions, and spiced mint yogurt raita.',
    category: 'burgers',
    price: 180,
    image: 'https://graficsea.com/wp-content/uploads/2021/12/Pakistani-Burger-.png',
    badge: 'Haris Favorite',
  },

  // --- Chicken ---
  {
    id: 'chicken-nuggets',
    name: 'Crispy Nuggets (10 pcs)',
    description: 'Ten premium tender-fried chicken breast nuggets, coated in golden-puffed crumbs. Served with sweet chili dip.',
    category: 'chicken',
    price: 490,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdRUU55RGHM3gnovjAXzWIQv1EipLqrhJWPTq-_C61A&s',
  },
  {
    id: 'chicken-strips',
    name: 'Chicken Strips (5 pcs)',
    description: 'Five hot, hand-breaded juicy tenders, loaded with a crispy wave seasoning. Serves with special garlic sauce.',
    category: 'chicken',
    price: 550,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    badge: 'Extra Crispy',
  },

  // --- Wraps ---
  {
    id: 'wrap-tortilla',
    name: 'Tortilla Wrap',
    description: 'Golden fried crispy chicken tenders rolled inside a toasted tortilla with fresh lettuce, cheddar cheese, and signature wrap sauce.',
    category: 'wraps',
    price: { 'Regular 10"': 450, 'Jumbo 12"': 650 },
    image: tortillaWrap,
  },
  {
    id: 'wrap-paratha-roll',
    name: 'Chicken Paratha Roll',
    description: 'Sizzling Pakistani paratha flatbread wrapped around flame-grilled barbecue chicken pieces and sliced red onions.',
    category: 'wraps',
    price: 320,
    image: parathaRoll,
    badge: 'Desi Crave',
  },
  {
    id: 'wrap-zinger-paratha',
    name: 'Zinger Paratha Roll',
    description: 'Crisp layered paratha containing deep fried zinger chicken slices, spicy garlic mayo, and sweet ring onions.',
    category: 'wraps',
    price: 350,
    image: zingerParathaRoll,
    badge: 'Popular Fusion',
  },
  {
    id: 'wrap-shawarma',
    name: 'Chicken Shawarma',
    description: 'Shaved slow-cooked chicken, pickled cucumber planks, Lebanese tahini garlic toum, rolled inside warm arabic pita.',
    category: 'wraps',
    price: 300,
    image: 'https://whatsgabycooking.com/wp-content/uploads/Chicken-Shawarma-Stuffed-Pita-Pockets.jpg',
  },
  {
    id: 'wrap-zinger-shawarma',
    name: 'Zinger Shawarma',
    description: 'Crispy crunchy zinger strips chopped, folded into standard pita bread with mild white sauce and mixed pickle slices.',
    category: 'wraps',
    price: 320,
    image: 'https://images.deliveryhero.io/image/talabat/MenuItems/A0E11BBBD3CF2D1D4BC00C0BC9BE5C4D',
  },
  {
    id: 'wrap-open-shawarma',
    name: 'Open Shawarma Plate',
    description: 'Deconstructed Arabic platter: massive portion of shawarma chicken, sliced pitas, salad, pickled chilis, garlic toum, and chili paste.',
    category: 'wraps',
    price: 500,
    image: 'https://i.ytimg.com/vi/xz3DCx3yxAc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAMM-yiA0Afn1JZwXaOISUL1Ee9fg',
  },

  // --- Fries ---
  {
    id: 'fries-medium',
    name: 'Medium Fries',
    description: 'Classic lightly salted crisped-up potato fries.',
    category: 'fries',
    price: 160,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fries-family',
    name: 'Family Fries',
    description: 'Huge sharing box of crispy golden potatoes.',
    category: 'fries',
    price: 250,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fries-loaded',
    name: 'Loaded Fries',
    description: 'A massive box of golden fries topped with crispy chicken pieces, melted cheddar cheese, sliced jalapeños, and secret sauce cascades.',
    category: 'fries',
    price: 550,
    image: loadedFries,
    badge: 'Best Seller',
  },
  {
    id: 'fries-pizza',
    name: 'Pizza Fries',
    description: 'Potato chips baked like a deep dish pizza: layered in red pizza sauce, diced grilled chicken, black olives, bell peppers, and heavy mozzarella cheese pull.',
    category: 'fries',
    price: 650,
    image: pizzaFries,
    badge: 'Cheese Pull King',
  },
  {
    id: 'fries-sauce-s',
    name: 'Fries With Sauce (Small)',
    description: 'Crisp fries with a splash of our signature garlic mayo sauce.',
    category: 'fries',
    price: 150,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fries-sauce-l',
    name: 'Fries With Sauce (Large)',
    description: 'Sharing portion of potato fries heavily drizzled in signature sauces.',
    category: 'fries',
    price: 300,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
  },

  // --- Cheese Sticks ---
  {
    id: 'cheese-sticks-s',
    name: 'Cheese Sticks (Small)',
    description: 'Tender baked cheesy sticks coated in garlic butter and parsley crust, with a gooey melting center.',
    category: 'cheese-sticks',
    price: 700,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfVHPyYbOi3_6ZHmBMyyk87uRz1DPY-51lyKlvV4Vi-w&s=10',
  },
  {
    id: 'cheese-sticks-m',
    name: 'Cheese Sticks (Medium)',
    description: 'Medium batch of premium cheese pull sticks, baked to perfect golden crust.',
    category: 'cheese-sticks',
    price: 1000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfVHPyYbOi3_6ZHmBMyyk87uRz1DPY-51lyKlvV4Vi-w&s=10',
    badge: 'Elite Pull',
  },

  // --- Extras ---
  {
    id: 'extra-cheese-add',
    name: 'Cheese Add On (Burgers/Wraps)',
    description: 'An extra slice of melting premium cheddar cheese to top any burger or paratha roll.',
    category: 'extras',
    price: 70,
  },
  {
    id: 'extra-sauce-filling',
    name: 'White Sauce Filling',
    description: 'Our secret signature garlic creamy white sauce, perfect for dipping.',
    category: 'extras',
    price: 50,
  },
  {
    id: 'extra-meat-cheese-s',
    name: 'Extra Meat & Cheese (Small Pizza)',
    description: 'Double your pizza pleasure with extra chicken chunk portions and dual-layered mozzarella.',
    category: 'extras',
    price: 110,
  },
  {
    id: 'extra-meat-cheese-l',
    name: 'Extra Meat & Cheese (Large Pizza)',
    description: 'Giant dual layer chicken toppings and double gooey pizza cheese cover.',
    category: 'extras',
    price: 230,
  },
  {
    id: 'extra-toppings',
    name: 'Extra Toppings',
    description: 'Add fresh olives, jalapeños, mushrooms, sweet corns, or bell peppers to your dish.',
    category: 'extras',
    price: 80,
  },
  // --- Cold Drinks ---
  {
    id: 'drink-coca-cola',
    name: 'Coca Cola',
    description: 'Chilled, bubbly, and classic refreshing Coca-Cola soft drink.',
    category: 'cold-drinks',
    price: { '350ml': 90, '500ml': 130, '1 Litre': 180, '1.5 Litre': 220 },
    image: 'https://lahorebasket.com/cdn/shop/files/coca-cola-bottle-1-ltr-975111.jpg?v=1737617212',
    badge: 'Chilled',
  },
  {
    id: 'drink-sprite',
    name: 'Sprite',
    description: 'Crisp, clear, and instantly refreshing lemon-lime sparkling drink.',
    category: 'cold-drinks',
    price: { '350ml': 90, '500ml': 130, '1 Litre': 180, '1.5 Litre': 220 },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsnEwYWt7x_agrJxGT_-PU9A3lvQICp2cxvDhOA709rDFEIF3W4bG5HZq2&s=10',
    badge: 'Chilled',
  },
  {
    id: 'drink-fanta',
    name: 'Fanta',
    description: 'Bright, bubbly, and fruity orange flavored carbonated soda.',
    category: 'cold-drinks',
    price: { '350ml': 90, '500ml': 130, '1 Litre': 180, '1.5 Litre': 220 },
    image: 'https://cdn.mafrservices.com/sys-master-root/hbd/ha5/9332616298526/519798_main.jpg',
    badge: 'Chilled',
  }
];

export const DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Deal 1',
    description: '2 Small Pizzas + 1 Liter Soft Drink.',
    price: 1100,
    tag: 'Combo',
    badge: 'Budget Value',
    image: 'https://pizzadesert.businesswala.pk/assets/uploads/f167bc31c50463b8f56847727b9aae14.png',
  },
  {
    id: 'deal-2',
    name: 'Deal 2',
    description: '1 Large Pizza + 2 Crispy Zinger Burgers + 1 Liter Soft Drink.',
    price: 2200,
    tag: 'Family',
    badge: 'Best Family Choice',
    image: 'https://pizzabank.pk/admin-panel/laravel_code/storage/app/public/menuitems/5RfBTEVqhImQQTNDATevaSqzLBKqI93dJ5BQu231.png',
  },
  {
    id: 'deal-3',
    name: 'Deal 3',
    description: '2 Medium Pizzas + 1 Liter Soft Drink.',
    price: 1700,
    tag: 'Combo',
    badge: 'Popular Deal',
    image: 'https://pizzadesert.businesswala.pk/assets/uploads/f167bc31c50463b8f56847727b9aae14.png',
  },
  {
    id: 'deal-4',
    name: 'Deal 4',
    description: '2 Large Pizzas + 1.5 Liter Soft Drink.',
    price: 2700,
    tag: 'Family',
    badge: 'Mega Saver',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpRZlicafOYDv09dDMr37o2Ph6Yq58RPiarQgy9ii-Bwn0e6j8gkU2MVS6&s=10',
  },
  {
    id: 'deal-student',
    name: 'Student Deal',
    description: '1 Crispy Patty Burger + 1 Crispy Fries.',
    price: 300,
    tag: 'Solo',
    badge: 'For Students',
    image: 'https://static.tossdown.com/images/35b31c7e-b391-4937-a4fc-7c5c1504b9ba.webp',
  },
  {
    id: 'deal-zinger',
    name: 'Zinger Deal',
    description: '2 Crispy Zinger Burgers.',
    price: 650,
    tag: 'Combo',
    badge: 'Zinger Mania',
    image: 'https://i.ytimg.com/vi/ddkCI1hAONk/hqdefault.jpg',
  },
  {
    id: 'deal-chapli',
    name: 'Chapli Deal',
    description: '1 Spiced Chapli Burger + 1 Regular Fries + 1 Regular Drink.',
    price: 500,
    tag: 'Special',
    badge: 'Local Crave',
    image: chapliDeal,
  },
  {
    id: 'deal-combo-delight',
    name: 'Combo Delight',
    description: '2 Crispy Zinger Burgers + 4 Golden Nuggets + 2 Regular Soft Drinks.',
    price: 950,
    tag: 'Combo',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkciJHx_y1pV5Y5rzR8yhbS6ai5dQ5AUezp49JZj8jyqfuXVec_Qh3jA&s=10',
  },
  {
    id: 'deal-special-1',
    name: 'Special Deal 1',
    description: '5 Crispy Zinger Burgers + Sharing Fries + 1.5 Liter Soft Drink.',
    price: 2000,
    tag: 'Special',
    badge: 'Grand Feast',
    image: specialDealOne,
  },
  {
    id: 'deal-special-2',
    name: 'Special Deal 2',
    description: '1 Cheese Zinger Burger + regular Fries + 1 Regular Drink.',
    price: 550,
    tag: 'Solo',
    image: specialDealTwo,
  },
  {
    id: 'deal-special-3',
    name: 'Special Deal 3',
    description: '1 Crispy Tender Burger + Crispy Fries + 1 Regular Drink.',
    price: 550,
    tag: 'Solo',
    image: specialDealThree,
  },
  {
    id: 'deal-special-4',
    name: 'Special Deal 4',
    description: '2 Crispy Cheese Patty Burgers + 2 Golden Patty Burgers + 1 Liter Soft Drink.',
    price: 1180,
    tag: 'Combo',
    badge: 'Burger Banquet',
    image: specialDealFour,
  },
  {
    id: 'deal-special-5',
    name: 'Special Deal 5',
    description: '3 Savory Chicken Shawarmas.',
    price: 850,
    tag: 'Combo',
    badge: 'Shawarma Pack',
    image: 'https://kristineskitchenblog.com/wp-content/uploads/2024/07/chicken-shawarma-06-3.jpg',
  },
  {
    id: 'deal-special-6',
    name: 'Special Deal 6',
    description: '2 Heritage Shami Burgers + 2 Regular Drinks + Crispy Fries.',
    price: 550,
    tag: 'Combo',
    badge: 'Desi Classic',
    image: specialDealSix,
  },
  {
    id: 'deal-special-7',
    name: 'Special Deal 7',
    description: '2 Chicken Shawarmas + Portion of Fries + 2 Regular Drinks.',
    price: 800,
    tag: 'Combo',
    image: specialDealSeven,
  },
  {
    id: 'deal-special-8',
    name: 'Special Deal 8',
    description: '3 Hand-Rolled Crispy Paratha Rolls.',
    price: 'Chicken: Rs. 900 / Zinger: Rs. 1000',
    tag: 'Special',
    badge: 'Roll Party',
    image: 'https://i.ytimg.com/vi/KfLj-I9CXkw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDoaQh_-z2xo23reCEbStq-kFx9Cg',
  },
];
