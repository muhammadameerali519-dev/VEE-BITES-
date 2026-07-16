import { useState, useEffect, useRef } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS, MenuItem } from '../types';
import { ShoppingCart, Check, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{ [itemId: string]: string }>({});
  const [activeCategory, setActiveCategory] = useState('regular-pizza');
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch dynamic menu from API on mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error('Menu dynamic API load failed, using local seed fallback:', err);
      }
    };
    fetchMenuData();
  }, []);

  // Track add to cart actions
  const handleAddToCart = async (item: MenuItem, type: string, price: number, sizeLabel: string) => {
    // Add to cart state
    addToCart(item, type, price, sizeLabel);
    
    // Log conversion metric in database
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cart_add' })
      });
    } catch (e) {
      console.error('Failed to log cart click conversion:', e);
    }
  };

  // Initialize selected sizes for multiple-priced items
  const getSelectedPriceAndSize = (item: MenuItem) => {
    if (typeof item.price === 'number') {
      return { price: item.price, sizeLabel: '' };
    }
    const sizes = Object.keys(item.price);
    const selectedSize = selectedSizes[item.id] || sizes[0];
    return {
      price: item.price[selectedSize],
      sizeLabel: selectedSize,
    };
  };

  const handleSizeChange = (itemId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  // Smooth scroll to target category section
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`menu-category-${categoryId}`);
    if (element) {
      const offset = 150; // sticky header + horizontal nav offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Monitor scroll position to update active category
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const topEntry = visibleEntries.reduce((prev, current) => {
          return Math.abs(current.boundingClientRect.top - 150) < Math.abs(prev.boundingClientRect.top - 150)
            ? current
            : prev;
        });

        const categoryId = topEntry.target.id.replace('menu-category-', '');
        setActiveCategory(categoryId);
      }
    };

    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.2, 0.5, 1.0],
    });

    MENU_CATEGORIES.forEach((category) => {
      const el = document.getElementById(`menu-category-${category.id}`);
      if (el && observer.current) {
        observer.current.observe(el);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <section id="menu" className="relative w-full py-20 bg-[#121110] px-4 md:px-6">
      {/* Decorative Blur */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-gold/5 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="font-display text-4xl md:text-6xl tracking-wider text-white uppercase">
            <span className="text-gold">MENU</span>
          </h2>
        </div>

        {/* Unified Sticky Horizontal Categories Bar (All Screens, KFC Style) */}
        <div className="sticky top-[80px] md:top-[86px] z-30 -mx-4 px-4 py-3.5 bg-[#121110]/95 backdrop-blur-md border-b border-gold/15 overflow-x-auto flex gap-2 scrollbar-none mb-10 shadow-lg">
          <div className="mx-auto flex gap-2.5 max-w-7xl w-full justify-start md:justify-center">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`font-sans text-[10px] md:text-xs uppercase tracking-widest px-4.5 py-2 rounded-xl transition-all duration-300 font-bold cursor-pointer flex-shrink-0 border ${
                  activeCategory === category.id
                    ? 'bg-gold border-gold text-[#0A0A0A] shadow-md scale-[1.02]'
                    : 'text-white/80 border-white/5 bg-[#171512] hover:text-white hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Menu Grid spanning full width */}
        <div className="w-full space-y-16">
          {MENU_CATEGORIES.map((category) => {
            const categoryItems = items.filter((item) => item.category === category.id);
            
            if (categoryItems.length === 0) return null;

            return (
              <div
                key={category.id}
                id={`menu-category-${category.id}`}
                className="scroll-mt-36 border-b border-white/5 pb-16 last:border-0 last:pb-0"
              >
                {/* Category Section Title Banner */}
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-display text-2xl md:text-3xl tracking-wider text-white uppercase">
                    {category.name}
                  </h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/30 to-transparent"></div>
                  <span className="font-mono text-xs text-gold-dark font-bold bg-gold/5 border border-gold/15 px-3 py-1 rounded-full uppercase tracking-wider">
                    {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Products Grid inside Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categoryItems.map((item) => {
                    const isMultiPrice = typeof item.price !== 'number';
                    const { price, sizeLabel } = getSelectedPriceAndSize(item);

                    return (
                      <div
                        key={item.id}
                        className="group relative flex flex-col rounded-3xl bg-[#171512] border border-gold/20 overflow-hidden shadow-2xl hover:border-gold/45 transition-all duration-300 h-full"
                      >
                        {/* Card Image Wrapper */}
                        {item.image ? (
                          <div className={`relative h-56 w-full overflow-hidden ${['burger-double-tender', 'burger-chicken'].includes(item.id) ? 'bg-white p-4' : 'bg-black/40'}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.03] ${['burger-double-tender', 'burger-chicken'].includes(item.id) ? 'object-contain' : 'object-cover filter brightness-95'}`}
                            />
                            {!['burger-double-tender', 'burger-chicken'].includes(item.id) && (
                              <div className="absolute inset-0 bg-gradient-to-t from-[#171512] via-transparent to-transparent"></div>
                            )}

                            {/* Badge */}
                            {item.badge && (
                              <span className="absolute top-4 left-4 flex items-center gap-1 rounded-md bg-red text-white text-[9px] font-sans uppercase font-black tracking-widest px-2.5 py-1 shadow-lg">
                                <Flame className="h-3 w-3 animate-pulse" />
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ) : (
                          /* Elegant placeholder/badge container if no image is present */
                          <div className="px-6 pt-6 flex items-center justify-between">
                            {item.badge ? (
                              <span className="flex items-center gap-1 rounded-md bg-red text-white text-[9px] font-sans uppercase font-black tracking-widest px-2.5 py-1 shadow-lg">
                                <Flame className="h-3 w-3 animate-pulse" />
                                {item.badge}
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-sans tracking-widest text-gold font-black bg-gold/10 px-2 py-1 rounded">
                                Premium Extra
                              </span>
                            )}
                          </div>
                        )}

                        {/* Bento content layout */}
                        <div className={`flex-1 flex flex-col p-6 justify-between ${item.image ? 'pt-3' : 'pt-4'}`}>
                          <div>
                            {/* Name & Desc */}
                            <h3 className="font-display text-2xl tracking-wider text-white group-hover:text-gold transition-colors duration-300">
                              {item.name}
                            </h3>

                            {/* Multi-size selectors */}
                            {isMultiPrice && (
                              <div className="mt-4 mb-2">
                                <span className="font-sans text-[9px] tracking-widest text-gold uppercase font-bold block mb-2">
                                  {item.category === 'cold-drinks' ? 'Select Bottle Size:' : 'Select Pizza Size:'}
                                </span>
                                <div className="flex gap-2">
                                  {Object.keys(item.price as { [key: string]: number }).map((size) => (
                                    <button
                                      key={size}
                                      onClick={() => handleSizeChange(item.id, size)}
                                      className={`flex-1 flex items-center justify-center gap-1 font-sans text-[9px] tracking-wider uppercase py-1.5 rounded-lg border transition-all cursor-pointer ${
                                        sizeLabel === size
                                          ? 'bg-gold/15 text-gold border-gold/50 font-black'
                                          : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10'
                                      }`}
                                    >
                                      {sizeLabel === size && <Check className="h-2.5 w-2.5" />}
                                      <span>{item.category === 'cold-drinks' ? size : size.split(' ')[0]}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bottom row styled as a miniature grid block */}
                          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="font-sans text-[8px] tracking-widest text-gold-dark uppercase font-bold">
                                Price
                              </span>
                              <span className="font-mono text-lg font-black text-gold tracking-tight mt-0.5">
                                Rs. {price}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddToCart(item, 'menu', price, sizeLabel)}
                              className="flex items-center gap-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans text-[10px] uppercase tracking-widest px-4 py-2.5 transition-all duration-300 font-bold shadow-md cursor-pointer hover:scale-[1.02]"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              <span>Add To Basket</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
