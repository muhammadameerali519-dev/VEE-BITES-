import { useState } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import Menu from './components/Menu';
import Deals from './components/Deals';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { motion } from 'motion/react';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <CartProvider>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : (
        <motion.div
          id="veebite-app-root"
          className="relative min-h-screen bg-[#0A0A0A] text-[#F3E9D2] overflow-x-hidden selection:bg-gold selection:text-black font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Sticky Header Nav */}
          <Header />

          {/* Hero segment */}
          <Hero />

          {/* Menu segment */}
          <Menu />

          {/* Deals segment */}
          <Deals />

          {/* Contact segment */}
          <Contact />

          {/* Our Story section */}
          <OurStory />

          {/* Footer segment */}
          <Footer />

          {/* Floating UI Elements */}
          <WhatsAppButton />
          <CartDrawer />
        </motion.div>
      )}
    </CartProvider>
  );
}
