import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const handleClick = () => {
    const whatsappUrl = 'https://wa.me/923076553100?text=Hello%20Vee%20Bite!%20I%20visited%20your%20website%20and%20want%20to%20order%20some%20fresh%20food.';
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center justify-center">
      {/* Outer pulsing ring */}
      <div className="absolute h-16 w-16 rounded-full bg-emerald-500/25 animate-ping pointer-events-none"></div>
      
      <button
        onClick={handleClick}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer active:scale-90"
        aria-label="Direct WhatsApp Order"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
