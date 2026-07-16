import { DEALS } from '../types';
import { Tag, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function Deals() {
  const { addToCart } = useCart();

  const getTagStyles = (tag: string) => {
    switch (tag) {
      case 'Family':
        return 'bg-red/20 text-red-400 border-red/30';
      case 'Solo':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Combo':
        return 'bg-gold/20 text-gold border-gold/30';
      case 'Special':
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <section
      id="deals"
      className="relative w-full py-20 bg-[#190C0E] border-t border-b border-gold/10 px-6 overflow-hidden"
    >
      {/* Decorative Gold Rings */}
      <div className="absolute right-1/4 top-1/3 w-80 h-80 rounded-full border border-gold/5 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl tracking-wider text-white uppercase">
            MONEY SAVING <span className="text-gold">DEALS</span>
          </h2>
        </div>

        {/* Deals Ticket Grid: Responsive Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DEALS.map((deal, idx) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx % 2 * 0.1 }}
              className="flex flex-col sm:flex-row rounded-3xl bg-[#171512] border border-gold/20 overflow-hidden shadow-2xl hover:border-gold/45 transition-all duration-300 relative group min-h-[220px]"
            >
              {/* Left Column: Dedicated Crystal-Clear Image Container (No overlays/masks) */}
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-black/40">
                {deal.image ? (
                  <img
                    src={deal.image}
                    alt={deal.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gold/5">
                    <Tag className="h-10 w-10 text-gold/30" />
                  </div>
                )}
                
                {/* Brand Tag absolute positioned */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`font-sans text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full border font-bold shadow-lg bg-black/80 backdrop-blur-md ${getTagStyles(deal.tag)}`}>
                    {deal.tag}
                  </span>
                </div>
              </div>

              {/* Dashed ticket separator line */}
              <div className="hidden sm:block w-px border-l-2 border-dashed border-gold/20 my-6 relative shrink-0">
                {/* Punch out holes */}
                <div className="absolute -top-6 -left-1.5 h-3 w-3 rounded-full bg-[#190C0E]"></div>
                <div className="absolute -bottom-6 -left-1.5 h-3 w-3 rounded-full bg-[#190C0E]"></div>
              </div>

              {/* Right Column: Content and Claims */}
              <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-display text-2xl tracking-wider text-white group-hover:text-gold transition-colors duration-300">
                      {deal.name}
                    </h3>
                    {deal.badge && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-sans font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/5 px-2.5 py-1 rounded">
                        <Sparkles className="h-2.5 w-2.5" />
                        {deal.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Sans-serif Typography description instead of Serifs */}
                  <p className="font-sans text-sm text-white/95 leading-relaxed mt-3 font-semibold">
                    {deal.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-sans text-[8px] tracking-widest text-gold-dark uppercase font-bold">
                      Combo Price
                    </span>
                    <span className="font-mono text-lg md:text-xl font-black text-gold tracking-tight mt-1">
                      {typeof deal.price === 'number' ? `Rs. ${deal.price}` : deal.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(deal, 'deal', typeof deal.price === 'number' ? deal.price : parseInt(String(deal.price).replace(/\D/g, ''), 10))}
                    className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans text-[10px] uppercase tracking-widest px-4.5 py-2.5 transition-all duration-300 font-bold shadow-md cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Add to Basket</span>
                    <ShoppingBag className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
