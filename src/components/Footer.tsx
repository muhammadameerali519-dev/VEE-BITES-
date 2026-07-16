import { Facebook, Instagram, MessageCircle, ArrowUp } from 'lucide-react';

const logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbYaJA1wzgtlc9OBGWTaqFdKHdbg1mAacC4JsotaplWjEJG-pKqxN_XEw&s=10";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="relative bg-[#0A0A0A] border-t border-gold/15 py-12 md:py-16 px-6 overflow-hidden">
      {/* Decorative Gold Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Column 1: Brand details */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-[#171512] overflow-hidden">
                <img
                  src={logo}
                  alt="Vee Bite Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-display text-2xl tracking-[0.1em] text-white">
                VEE <span className="text-gold">BITE</span>
              </span>
            </div>
            <p className="font-serif italic text-gold-dark text-sm tracking-wide">
              Eat Good, Feel Good
            </p>
            <p className="font-sans text-xs text-cream/65 leading-relaxed max-w-sm">
              We are Gujranwala's premier fast-food destination. Founded in 2023 by Haris Bin Zahid, 
              bringing a modern culinary twist, dual cheese-stuffed pizzas, mighty zingers, 
              and authentic Pakistani street food straight to your family table.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm tracking-[0.2em] text-white uppercase font-bold">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <a href="#hero" className="font-sans text-xs text-cream/65 hover:text-gold transition-colors duration-200">
                Home
              </a>
              <a href="#menu" className="font-sans text-xs text-cream/65 hover:text-gold transition-colors duration-200">
                Menu Options
              </a>
              <a href="#deals" className="font-sans text-xs text-cream/65 hover:text-gold transition-colors duration-200">
                Combo Deals
              </a>
              <a href="#contact" className="font-sans text-xs text-cream/65 hover:text-gold transition-colors duration-200">
                Contact Address
              </a>
              <a href="#our-story" className="font-sans text-xs text-cream/65 hover:text-gold transition-colors duration-200">
                Our Story
              </a>
            </div>
          </div>

          {/* Column 3: Social & Phone Connect */}
          <div className="space-y-4">
            <h4 className="font-display text-sm tracking-[0.2em] text-white uppercase font-bold">Follow & Call</h4>
            <p className="font-sans text-xs text-cream/65 leading-relaxed">
              Main Market, Model Town, Gujranwala.<br />
              WhatsApp: 0307 655 3100
            </p>

            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white transition-colors duration-300"
                aria-label="Facebook Profile"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white transition-colors duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/923076553100"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-white transition-colors duration-300"
                aria-label="WhatsApp Direct"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyrights and Mandatory Credits */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-sans text-[11px] text-cream/45 tracking-widest uppercase">
              VEE BITE © {new Date().getFullYear()} All Rights Reserved. | <a href="#admin" className="text-gold/60 hover:text-gold transition-colors ml-1.5 font-medium underline-offset-4 hover:underline">Staff Administration</a>
            </p>
            <p className="font-sans text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mt-1">
              Website Created By Fast Target Co. — 0314 8418849
            </p>
          </div>

          <button
            onClick={handleScrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-[#0A0A0A] transition-all duration-300 cursor-pointer shadow-lg active:scale-90"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
