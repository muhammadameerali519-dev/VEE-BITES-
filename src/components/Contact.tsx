import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCall = () => {
    window.open('tel:+923076553100');
  };

  const handleWhatsAppChat = () => {
    window.open('https://wa.me/923076553100?text=Hello%20Vee%20Bite!%20I%20have%20a%20question%20regarding%20the%20menu%20or%20locations.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full py-24 bg-[#111215] px-6 overflow-hidden">
      {/* Decorative Light Ring */}
      <div className="absolute left-1/4 bottom-1/4 w-[400px] h-[400px] bg-gold/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-sans text-xs tracking-[0.4em] text-gold uppercase font-bold mb-2">Visit or Call Us</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wider text-white">
            GET IN <span className="text-gold">TOUCH</span>
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-gold to-transparent mt-4"></div>
        </div>

        {/* Bento Grid layout for Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block: Contact Info Bento Box (lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col justify-between p-8 rounded-3xl bg-[#171512] border border-gold/20 shadow-2xl relative"
          >
            <div className="space-y-8">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/25 text-gold shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg tracking-wider text-white">Our Location</h4>
                  <p className="font-sans text-sm text-cream/70 leading-relaxed mt-1">
                    Near Rizwan Book Depot, Main Market, Model Town, Gujranwala, Pakistan.
                  </p>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/25 text-gold shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg tracking-wider text-white">Operating Hours</h4>
                  <p className="font-sans text-sm text-cream/70 leading-relaxed mt-1">
                    Daily: 12:00 PM to 2:00 AM (Midnight)
                  </p>
                  <p className="font-sans text-[10px] text-gold uppercase font-bold tracking-widest mt-1">
                    Ready for late-night cravings!
                  </p>
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/25 text-gold shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-lg tracking-wider text-white">Direct Phone Call</h4>
                  <p className="font-sans text-sm text-cream/70 leading-relaxed mt-1">
                    +92 307 655 3100
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Action blocks within bento box */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-6 border-t border-white/5">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 rounded-xl border border-gold/40 hover:bg-gold hover:text-[#0A0A0A] text-gold font-sans text-[10px] uppercase tracking-widest py-3.5 transition-all duration-300 font-bold cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Kitchen</span>
              </button>

              <button
                onClick={handleWhatsAppChat}
                className="flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-dark text-[#0A0A0A] font-sans text-[10px] uppercase tracking-widest py-3.5 transition-all duration-300 font-bold shadow-lg cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Chat</span>
              </button>
            </div>
          </motion.div>

          {/* Middle Block: Interactive Contact Form (lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4 p-8 rounded-3xl bg-[#171512] border border-gold/20 shadow-2xl relative flex flex-col justify-between"
          >
            <div>
              <h3 className="font-display text-xl tracking-wider text-white mb-2">Send us a Message</h3>
              <p className="font-sans text-xs text-cream/60 mb-6">Got questions, custom events, or feedback? Drop Muhammad Haris a line!</p>

              {success ? (
                <motion.div 
                  className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-400" />
                  <h4 className="font-display text-base text-white font-bold mb-1">Inquiry Sent Successfully!</h4>
                  <p className="font-sans text-xs text-cream/70 leading-relaxed">
                    Thank you for writing. Muhammad Haris and staff will view your submission in the admin dashboard inbox and contact you shortly!
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-xs text-gold border border-gold/35 hover:bg-gold hover:text-black font-semibold px-4 py-1.5 rounded-full transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-cream/60 font-mono mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ali Ahmed"
                      className="w-full bg-[#111215] border border-gold/10 hover:border-gold/30 focus:border-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-[#F3E9D2] placeholder-cream/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-cream/60 font-mono mb-1">Phone Number</label>
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0300 1234567"
                        className="w-full bg-[#111215] border border-gold/10 hover:border-gold/30 focus:border-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-[#F3E9D2] placeholder-cream/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-cream/60 font-mono mb-1">Email (Optional)</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ali@gmail.com"
                        className="w-full bg-[#111215] border border-gold/10 hover:border-gold/30 focus:border-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-[#F3E9D2] placeholder-cream/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-cream/60 font-mono mb-1">Your Message</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your feedback, questions, or reservations details..."
                      className="w-full bg-[#111215] border border-gold/10 hover:border-gold/30 focus:border-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-[#F3E9D2] placeholder-cream/20 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl p-3 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#C5A85C] to-gold hover:opacity-90 active:scale-[0.99] text-black font-semibold uppercase tracking-widest text-[10px] py-3 rounded-xl shadow-lg shadow-gold/5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Block: Embedded Map Bento Box (lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 rounded-3xl overflow-hidden border border-gold/25 bg-[#171512] shadow-2xl relative min-h-[420px]"
          >
            <div className="absolute inset-0 w-full h-full">
              {/* Map IFrame pointing directly to the precise location description */}
              <iframe
                title="Vee Bite Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.291763784196!2d74.1956557!3d32.1693452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f2982d5555555%3A0x2db4df4df4e286bb!2sModel%20Town%2C%20Gujranwala%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1714545232958!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '420px', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
