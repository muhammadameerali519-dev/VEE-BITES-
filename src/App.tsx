import { useState, useEffect } from 'react';
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
import AdminPortal from './components/AdminPortal';
import TrackOrderModal from './components/TrackOrderModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');

  useEffect(() => {
    // Detect Hash routing for admin portal and order tracking
    const handleHashCheck = () => {
      const hash = window.location.hash;
      setShowAdmin(hash === '#admin');
      
      if (hash === '#track') {
        setShowTrack(true);
        setTrackOrderId('');
      } else if (hash.startsWith('#track-')) {
        setShowTrack(true);
        setTrackOrderId(hash.replace('#track-', ''));
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);

    // Track visitor sessions
    const trackVisitorSession = async () => {
      try {
        if (!sessionStorage.getItem('veebite_visited')) {
          await fetch('/api/analytics/visit', { method: 'POST' });
          sessionStorage.setItem('veebite_visited', 'true');
        }
      } catch (err) {
        console.error('Visitor logging failed:', err);
      }
    };
    trackVisitorSession();

    return () => {
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

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
          {showAdmin ? (
            <AdminPortal onClose={() => {
              window.location.hash = '';
              setShowAdmin(false);
            }} />
          ) : (
            <>
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
              <TrackOrderModal isOpen={showTrack} onClose={() => { setShowTrack(false); if (window.location.hash.startsWith('#track')) { window.location.hash = ''; } }} initialOrderId={trackOrderId} />
            </>
          )}
        </motion.div>
      )}
    </CartProvider>
  );
}
