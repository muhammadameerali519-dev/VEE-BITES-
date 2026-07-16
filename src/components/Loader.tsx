import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbYaJA1wzgtlc9OBGWTaqFdKHdbg1mAacC4JsotaplWjEJG-pKqxN_XEw&s=10";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade-out transition to complete
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loader-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] text-[#F3E9D2]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Logo animation */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative mb-6">
              {/* Outer Golden Glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold to-gold-dark opacity-35 blur-xl animate-pulse"></div>
              {/* Core logo circle */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold bg-[#171512] overflow-hidden shadow-[0_0_20px_rgba(255,193,7,0.2)]">
                <img
                  src={logo}
                  alt="Vee Bite Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Brand Title */}
            <h1 className="font-display text-5xl tracking-[0.25em] text-white">
              VEE <span className="text-gold">BITE</span>
            </h1>
            <p className="font-serif mt-2 text-sm italic tracking-widest text-gold-dark">
              Eat Good, Feel Good
            </p>
          </motion.div>

          {/* Loader bar */}
          <div className="mt-12 w-64 md:w-80">
            <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] tracking-widest text-gold/60 uppercase">
              <span>Authentic Pakistani Taste</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
