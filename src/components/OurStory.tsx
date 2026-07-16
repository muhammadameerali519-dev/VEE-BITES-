import { motion } from 'motion/react';
import { Quote, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import gourmetPizza from '../assets/images/gourmet_pizza_1783192643518.jpg';

export default function OurStory() {
  const stats = [
    { icon: Award, label: 'Founded Year', value: '2023', description: 'Established with high dreams' },
    { icon: Heart, label: 'Customer Reviews', value: '5-Star Quality', description: 'Loved by the Gujranwala family' },
    { icon: ShieldCheck, label: 'Standards', value: '100% Halal & Fresh', description: 'Elite ingredients everyday' },
  ];

  return (
    <section
      id="our-story"
      className="relative w-full py-24 bg-[#0F0E0D] border-t border-b border-gold/10 overflow-hidden px-6"
    >
      {/* Subtle brand watermark background */}
      <div className="absolute right-0 bottom-0 opacity-[0.02] translate-x-1/4 translate-y-1/4 pointer-events-none">
        <span className="font-display text-[250px] text-gold font-bold select-none leading-none">VB</span>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-sans text-xs tracking-[0.4em] text-gold uppercase font-bold mb-2">Our Legacy</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wider text-white">
            THE STORY OF <span className="text-gold">VEE BITE</span>
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-gold to-transparent mt-4"></div>
        </div>

        {/* Narrative Container */}
        <div className="max-w-4xl mx-auto">
          {/* The Full Narrative Bento Block */}
          <motion.div
            className="w-full bg-[#141210] border border-gold/20 rounded-3xl p-6 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Pizza Image in the bottom right corner */}
            <div className="absolute right-0 bottom-0 w-64 md:w-80 h-full pointer-events-none select-none z-0 overflow-hidden opacity-30 md:opacity-40">
              <img
                src={gourmetPizza}
                alt="Gourmet Pizza"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter contrast-[1.1] brightness-[0.7] saturate-[0.8]"
              />
              {/* Fade overlays to blend the image seamlessly into the card's background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#141210]/60 to-[#141210]"></div>
            </div>

            {/* Quote Watermark */}
            <Quote className="absolute -top-6 -left-2 h-16 w-16 text-gold/10 pointer-events-none z-0" />

            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="font-sans text-[10px] tracking-widest uppercase text-gold font-bold">Uncompromising Quality</span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl italic font-semibold text-gold leading-snug">
                "Built through dedication, hard work, and struggle to bring premium taste to Gujranwala."
              </h3>

              <div className="space-y-4 font-sans text-cream/80 leading-relaxed text-sm md:text-base tracking-wide">
                <p>
                  Vee Bite was founded in 2023 by <span className="text-gold font-semibold">Haris Bin Zahid</span>. 
                  Built through sheer dedication, relentless hard work, and the struggle to turn a massive vision into a reality, 
                  the dream was simple: to serve premium-quality fast food infused with an <span className="text-gold italic">authentic Pakistani taste</span>.
                </p>
                <p>
                  We believe that dining is not just about eating; it is an emotional experience. 
                  That is why every single pizza cheese-pull, crispy zinger crunch, and hand-rolled wrap is prepared with premium, 
                  farm-fresh local ingredients and cooked with absolute passion by our master chefs.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
              <div className="h-0.5 w-10 bg-gold/30"></div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-cream/45 font-bold">
                ESTABLISHED IN GUJRANWALA, PAKISTAN
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Row: 3 separate Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-4xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#171512] border border-gold/15 hover:border-gold/35 rounded-2xl p-6 flex items-center gap-5 transition-colors duration-300 shadow-xl group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/25 text-gold group-hover:bg-gold/15 transition-colors shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-display text-2xl text-white tracking-widest uppercase block leading-none">{stat.value}</span>
                  <span className="font-sans text-[10px] text-gold uppercase tracking-widest mt-1.5 font-bold block">{stat.label}</span>
                  <span className="font-sans text-xs text-cream/50 mt-0.5 block">{stat.description}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
