import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, PhoneCall, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

const logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbYaJA1wzgtlc9OBGWTaqFdKHdbg1mAacC4JsotaplWjEJG-pKqxN_XEw&s=10";

export default function Header() {
  const { cartCount, setIsOpen: setIsOpenCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'Deals', href: '#deals' },
    { name: 'Contact', href: '#contact' },
    { name: 'Our Story', href: '#our-story' },
  ];

  const handleWhatsAppRedirect = () => {
    const whatsappUrl = 'https://wa.me/923076553100?text=Hello%20Vee%20Bite!%20I%20want%20to%20place%20a%20delicious%20order.';
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <header
        id="main-sticky-header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 pt-4 pb-2"
      >
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? 'bg-[#171512]/95 backdrop-blur-md border-gold/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
            : 'bg-[#171512]/75 backdrop-blur-md border-gold/25'
        }`}>
          {/* Logo Brand */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-[#171512] overflow-hidden transition-colors duration-300 group-hover:border-gold shadow-[0_0_10px_rgba(255,193,7,0.15)]">
              <img
                src={logo}
                alt="Vee Bite Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-[0.1em] text-white leading-none">
                VEE <span className="text-gold">BITE</span>
              </span>
              <span className="font-sans text-[8px] tracking-[0.25em] text-gold-dark uppercase font-semibold">
                Eat Good, Feel Good
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-sans text-xs tracking-widest text-[#F3E9D2] hover:text-gold uppercase transition-colors duration-300 font-medium relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Order Now Button & Cart */}
          <div className="flex items-center">
            {/* Desktop Cart Button */}
            <button
              onClick={() => setIsOpenCart(true)}
              className="hidden md:flex relative items-center gap-2 rounded-full border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 px-4 py-2.5 transition-all cursor-pointer mr-3"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="font-sans text-xs uppercase tracking-widest font-semibold">Basket</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red text-white text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden md:flex items-center">
              <button
                onClick={handleWhatsAppRedirect}
                className="flex items-center gap-2 rounded-full border border-gold bg-gold/10 hover:bg-gold hover:text-[#0A0A0A] text-gold font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(255,193,7,0.1)] hover:shadow-[0_0_25px_rgba(255,193,7,0.3)] active:scale-95 cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Order Now</span>
              </button>
            </div>

            {/* Mobile Cart Trigger */}
            <button
              onClick={() => setIsOpenCart(true)}
              className="relative p-2.5 rounded-lg border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 transition-all cursor-pointer mr-2 md:hidden flex items-center justify-center h-10 w-10"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-white text-[9px] font-black">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center text-gold md:hidden h-10 w-10 border border-gold/20 rounded-lg bg-gold/5 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            className="fixed inset-0 z-30 flex flex-col bg-[#0A0A0Ae0] backdrop-blur-xl pt-24 px-6 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-display text-4xl text-[#F3E9D2] hover:text-gold tracking-widest uppercase transition-colors duration-300"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  handleWhatsAppRedirect();
                }}
                className="flex items-center justify-center gap-3 rounded-full bg-gold hover:bg-gold-dark text-[#0A0A0A] font-sans text-sm uppercase tracking-widest py-4 mt-8 transition-all font-bold shadow-[0_0_20px_rgba(255,193,7,0.2)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call & Order Now</span>
              </motion.button>
            </div>

            <div className="mt-auto mb-10 text-center text-[10px] font-mono tracking-widest text-gold-dark/60">
              VEE BITE • GUJRANWALA • 0307 655 3100
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
