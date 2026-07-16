import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, ChevronDown, Utensils, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../types';

export default function Hero() {
  const { addToCart } = useCart();

  const handleExploreMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToBasket = (itemId: string, sizeLabel?: string) => {
    const item = MENU_ITEMS.find((i) => i.id === itemId);
    if (item) {
      let price = 0;
      if (typeof item.price === 'number') {
        price = item.price;
      } else if (sizeLabel && item.price[sizeLabel]) {
        price = item.price[sizeLabel];
      } else {
        const firstSize = Object.keys(item.price)[0];
        price = item.price[firstSize];
      }
      addToCart(item, 'menu', price, sizeLabel);
    }
  };

  const handleOrderSpecialCombo = () => {
    // Adds Deal 2 (Pizza + Burger Combo - Rs. 2200) directly to cart
    const deal = { 
      id: 'deal-2', 
      name: 'Deal 2', 
      image: 'https://pizzabank.pk/admin-panel/laravel_code/storage/app/public/menuitems/5RfBTEVqhImQQTNDATevaSqzLBKqI93dJ5BQu231.png' 
    };
    addToCart(deal, 'deal', 2200);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full bg-[#0A0A0A] pt-28 pb-12 px-4 md:px-8 flex flex-col justify-center overflow-hidden"
    >
      {/* Background Decorative Gold Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gold-dark/5 blur-[150px] pointer-events-none"></div>

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              animation: `float-particle ${Math.random() * 8 + 8}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.7; }
        }
      `}</style>

      {/* Bento Grid Wrapper */}
      <div className="mx-auto max-w-7xl w-full z-10 flex-1 flex flex-col justify-center gap-4">
        
        {/* Main 12-Column Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
          
          {/* Card 1: HERO Brand Block (Spans 8 columns, full height on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-8 bg-[#141210] rounded-3xl border border-gold/20 relative overflow-hidden flex flex-col justify-end p-8 md:p-10 group min-h-[450px] lg:min-h-[520px]"
          >
            {/* Dark elegant gradient overlay for pristine contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
            
            {/* Bright, vibrant high-quality background food image with no dull filters */}
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-1000 group-hover:scale-[1.02]"
            ></div>

            {/* Giant year indicator top right */}
            <div className="absolute top-0 right-0 p-8 z-20 text-right select-none pointer-events-none">
              <span className="font-display text-5xl md:text-7xl font-black italic text-gold opacity-[0.15] tracking-widest">EST. 2023</span>
            </div>

            {/* Sparkles micro-badge */}
            <div className="relative z-20 self-start mb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-gold font-sans text-[10px] uppercase tracking-[0.2em] font-bold">
                <Sparkles className="h-3 w-3" />
                <span>Premium Quality Craft</span>
              </div>
            </div>

            {/* Brand Typography */}
            <div className="relative z-20 space-y-3">
              <h1 className="font-display text-5xl md:text-8xl font-black leading-[0.85] tracking-tight text-white uppercase">
                AUTHENTIC <br />
                PAKISTANI <span className="text-gold">FAST FOOD</span>
              </h1>
              
              <p className="font-sans text-sm md:text-base max-w-lg font-medium text-white leading-relaxed">
                Founded by <span className="text-gold font-bold">Muhammad Haris</span> with a dream of uncompromising quality and passion.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleExploreMenu}
                  className="flex items-center gap-2 rounded-xl bg-gold hover:bg-gold-dark text-[#0A0A0A] font-sans text-xs uppercase tracking-widest px-6 py-3.5 transition-all duration-300 font-bold shadow-[0_0_20px_rgba(255,193,7,0.25)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Explore Menu</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side Stack: Card 2 & Card 3 */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
            
            {/* Card 2: TRENDING NOW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#171512] rounded-3xl border border-gold/30 p-6 flex flex-col justify-between overflow-hidden relative group flex-1"
            >
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                {/* Header Title */}
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                  <span className="w-2 h-2 bg-red rounded-full animate-ping"></span>
                  <span>Trending Now</span>
                </h3>

                {/* List of high-contrast items with real images */}
                <div className="space-y-3">
                  
                  {/* Item 1 - Mighty Zinger */}
                  <div 
                    onClick={() => handleAddToBasket('burger-mighty-zinger')}
                    className="flex items-center justify-between p-2.5 bg-black/45 hover:bg-gold/10 rounded-2xl border border-gold/15 cursor-pointer transition-all hover:translate-x-1 group/item"
                  >
                    <div className="flex items-center min-w-0">
                      <img 
                        src="https://static.tossdown.com/images/d3360ae1-bc13-4b00-9909-99a0ddf78a9d.webp" 
                        alt="Mighty Zinger" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-gold/20 shrink-0 mr-3"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white font-sans tracking-wide block truncate">Mighty Zinger</span>
                        <span className="text-[9px] text-white/70 uppercase tracking-widest mt-0.5 block">Double Crispy Stack</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="font-mono text-gold text-[11px] font-bold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/25">Rs. 600</span>
                      <span className="text-[8px] text-gold uppercase tracking-widest mt-1 font-bold flex items-center gap-1 group-hover/item:text-white">
                        <ShoppingCart className="h-2.5 w-2.5" /> Add
                      </span>
                    </div>
                  </div>

                  {/* Item 2 - Chicken Tikka Pizza */}
                  <div 
                    onClick={() => handleAddToBasket('pizza-tikka', 'Large 14"')}
                    className="flex items-center justify-between p-2.5 bg-black/45 hover:bg-gold/10 rounded-2xl border border-gold/15 cursor-pointer transition-all hover:translate-x-1 group/item"
                  >
                    <div className="flex items-center min-w-0">
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOwjDBS0gMStSOHINwQJ-nJSWrNIEHVQT29FfS3gQ8MyRYnEAwVlsBgPYF&s=10" 
                        alt="Tikka Pizza" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-gold/20 shrink-0 mr-3"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white font-sans tracking-wide block truncate">Tikka Pizza</span>
                        <span className="text-[9px] text-white/70 uppercase tracking-widest mt-0.5 block">Large 14" Cheese Pull</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="font-mono text-gold text-[11px] font-bold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/25">Rs. 1400</span>
                      <span className="text-[8px] text-gold uppercase tracking-widest mt-1 font-bold flex items-center gap-1 group-hover/item:text-white">
                        <ShoppingCart className="h-2.5 w-2.5" /> Add
                      </span>
                    </div>
                  </div>

                  {/* Item 3 - Chicken Malai Boti Pizza */}
                  <div 
                    onClick={() => handleAddToBasket('pizza-malai-boti', 'Medium 10"')}
                    className="flex items-center justify-between p-2.5 bg-black/45 hover:bg-gold/10 rounded-2xl border border-gold/15 cursor-pointer transition-all hover:translate-x-1 group/item"
                  >
                    <div className="flex items-center min-w-0">
                      <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd6mO-YsWyAFqCIxbTR_B56Bc2TKZtKawuISnlmndPJw&s=10" 
                        alt="Malai Boti Pizza" 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-gold/20 shrink-0 mr-3"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white font-sans tracking-wide block truncate">Malai Boti Pizza</span>
                        <span className="text-[9px] text-white/70 uppercase tracking-widest mt-0.5 block">Medium 10" Rich Cream</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span className="font-mono text-gold text-[11px] font-bold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/25">Rs. 1000</span>
                      <span className="text-[8px] text-gold uppercase tracking-widest mt-1 font-bold flex items-center gap-1 group-hover/item:text-white">
                        <ShoppingCart className="h-2.5 w-2.5" /> Add
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <button 
                onClick={handleExploreMenu}
                className="mt-4 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-bold text-white/60 hover:text-gold transition-colors pt-3 border-t border-white/5 cursor-pointer w-full text-center"
              >
                <Utensils className="h-3 w-3 text-gold" />
                <span>Browse Full Food Menu</span>
              </button>
            </motion.div>

            {/* Card 3: SPECIAL COMBO DEAL (Linked to Basket) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={handleOrderSpecialCombo}
              className="bg-[#FFC107] rounded-3xl p-6 text-black flex flex-col justify-between relative overflow-hidden cursor-pointer group shadow-2xl hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Pattern/Watermark */}
              <div className="absolute -right-4 -top-4 w-28 h-28 bg-black/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-1 relative z-10">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-sans font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1 rounded-md">
                  <Tag className="h-2.5 w-2.5" />
                  <span>Special Deal</span>
                </span>
                
                <h3 className="font-display text-4xl font-black uppercase leading-[0.95] mt-4 tracking-tight group-hover:text-black/85 transition-colors">
                  PIZZA + BURGER <br />COMBO
                </h3>
                
                <p className="text-xs font-bold uppercase tracking-wider text-black/75 mt-1">
                  1 Large Pizza + 2 Zinger + 1L Drink
                </p>
              </div>

              <div className="mt-6 flex items-baseline gap-1 relative z-10">
                <span className="text-sm font-bold uppercase tracking-widest text-black/60">Combo Price:</span>
                <span className="text-3xl font-black font-mono tracking-tighter text-black ml-1">Rs. 2200</span>
              </div>

              {/* Action indicators */}
              <div className="absolute bottom-0 right-0 w-24 h-24 flex items-center justify-center border-t border-l border-dashed border-black/20 rounded-tl-3xl bg-black/[0.02]">
                <span className="rotate-45 font-sans font-black text-[10px] tracking-widest uppercase opacity-60 text-black">
                  Add To Basket
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Bounce scroll down button */}
      <motion.div
        className="mx-auto mt-8 flex flex-col items-center gap-1 cursor-pointer"
        onClick={handleExploreMenu}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-dark font-semibold">Scroll to Details</span>
        <ChevronDown className="h-4 w-4 text-gold" />
      </motion.div>
    </section>
  );
}
