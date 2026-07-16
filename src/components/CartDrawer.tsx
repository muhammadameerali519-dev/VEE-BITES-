import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, MessageSquare, 
  MapPin, User, Phone, Copy, Check, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [distance, setDistance] = useState<number | string>(2);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [isPlacing, setIsPlacing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Calculate delivery charge: Rs. 60 base up to 2km, Rs. 30 per km afterwards
  const distanceNum = Number(distance) || 0;
  const deliveryCharge = orderType === 'delivery' && distanceNum > 0
    ? (distanceNum <= 2 ? 60 : 60 + Math.ceil((distanceNum - 2) * 30))
    : 0;

  const totalWithDelivery = cartTotal + deliveryCharge;

  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerName.trim()) {
      alert('Please enter your name to register your order.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter your phone number to register your order.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    setIsPlacing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sizeLabel: item.sizeLabel || ""
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'Self-Pickup from Restaurant',
        distance: orderType === 'delivery' ? distanceNum : 0,
        deliveryCharge: orderType === 'delivery' ? deliveryCharge : 0,
        total: orderType === 'delivery' ? totalWithDelivery : cartTotal,
        orderType
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        throw new Error('Failed to register order on server.');
      }

      const data = await res.json();
      const serverOrder = data.order;
      setCreatedOrder(serverOrder);

      // Track analytics click
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkout_whatsapp' })
      }).catch(err => console.error(err));

      // Compose WhatsApp message
      let message = `*VEE BITE ORDER DETAILS*\n`;
      message += `------------------------------------\n`;
      message += `*Order ID:* ${serverOrder.orderId}\n`;
      message += `*Type:* ${orderType === 'delivery' ? '🚗 Delivery' : '🥡 Self-Pickup'}\n`;
      message += `*Customer:* ${serverOrder.customerName}\n`;
      message += `*Phone:* ${serverOrder.customerPhone}\n`;
      message += `------------------------------------\n`;

      cartItems.forEach((item, index) => {
        const sizeStr = item.sizeLabel ? ` (${item.sizeLabel})` : '';
        message += `*${index + 1}. ${item.name}${sizeStr}*\n`;
        message += `   Qty: ${item.quantity} x Rs. ${item.price} = *Rs. ${item.quantity * item.price}*\n`;
      });

      message += `------------------------------------\n`;
      message += `*Subtotal:* Rs. ${cartTotal}\n`;
      if (orderType === 'delivery') {
        message += `*Delivery Distance:* ${distanceNum} km\n`;
        message += `*Delivery Charges:* Rs. ${deliveryCharge}\n`;
        message += `*Delivery Address:* ${serverOrder.deliveryAddress}\n`;
      }
      message += `------------------------------------\n`;
      message += `*Total Bill:* *Rs. ${orderType === 'delivery' ? totalWithDelivery : cartTotal}*\n\n`;
      message += `Track live status here: ${window.location.origin}/#track-${serverOrder.orderId}\n\n`;
      message += `Please confirm my order. Thank you!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/923076553100?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Clear the basket
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Order tracking registration failed, but you can still contact Muhammad Haris on WhatsApp at 0307 655 3100 to place your order directly!');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-[#12110F] border-l border-gold/15 shadow-2xl z-50 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              {createdOrder ? (
                <div className="flex items-center gap-2.5">
                  <div className="relative p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white tracking-wider uppercase font-bold">Order Received!</h3>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="relative p-2 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                    <ShoppingBag className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-white text-[9px] font-bold">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white tracking-wider uppercase">Your Basket</h3>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  setCreatedOrder(null);
                }}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-cream/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Items Area or Success Area */}
            {createdOrder ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-center text-center">
                <motion.div 
                  className="p-6 rounded-3xl bg-[#1D1B18] border border-emerald-500/20 shadow-2xl relative overflow-hidden"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-base text-white tracking-wider uppercase font-bold mb-2">Order Confirmed!</h4>
                  <p className="font-sans text-[11px] text-cream/60 leading-relaxed mb-6">
                    Your order was successfully registered on our tracking server and you have been redirected to WhatsApp to send the kitchen confirmation details!
                  </p>

                  <div className="p-4 rounded-2xl bg-black/40 border border-gold/10 space-y-3 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cream/50 uppercase tracking-wider font-mono text-[9px]">Trackable Order ID:</span>
                      <span className="font-mono text-gold font-bold text-xs bg-gold/5 border border-gold/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {createdOrder.orderId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cream/50 uppercase tracking-wider font-mono text-[9px]">Total Amount:</span>
                      <span className="font-mono text-white font-bold">
                        Rs. {createdOrder.total}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cream/50 uppercase tracking-wider font-mono text-[9px]">Order Type:</span>
                      <span className="font-sans text-gold font-semibold uppercase text-[9px]">
                        {createdOrder.orderType === 'delivery' ? '🚗 Delivery' : '🥡 Self-Pickup'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {/* Copy Link button */}
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/#track-${createdOrder.orderId}`;
                        navigator.clipboard.writeText(link);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full py-2.5 rounded-xl border border-gold/30 hover:bg-gold/5 text-gold text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied Tracking Link' : 'Copy Tracking Link'}</span>
                    </button>

                    {/* Track Live button */}
                    <button
                      onClick={() => {
                        window.location.hash = `#track-${createdOrder.orderId}`;
                        setIsOpen(false);
                        setCreatedOrder(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A85C] to-gold hover:opacity-95 text-black text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-gold/5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Track Order Live</span>
                    </button>
                  </div>
                </motion.div>

                <button
                  onClick={() => {
                    setCreatedOrder(null);
                    setIsOpen(false);
                  }}
                  className="text-[10px] text-cream/40 hover:text-white uppercase tracking-widest transition-colors font-mono"
                >
                  Close Panel
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="p-4 rounded-full bg-white/5 border border-white/5 text-cream/20 mb-4">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                    <h4 className="font-display text-lg text-cream/80 tracking-wide">Basket is Empty</h4>
                    <p className="font-sans text-xs text-cream/40 max-w-[240px] mt-2">
                      Add delicious burgers, pizzas, wraps or savors to start your order!
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 px-5 py-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 font-sans text-[10px] uppercase tracking-widest transition-all font-bold cursor-pointer"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-2xl bg-[#1D1B18] border border-gold/10 hover:border-gold/20 transition-all"
                      >
                        {/* Item Image or Placeholder */}
                        <div className="h-16 w-16 rounded-xl bg-black/40 border border-gold/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-gold/50" />
                          )}
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-sans text-xs font-bold text-white truncate uppercase tracking-wider">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-cream/30 hover:text-red transition-colors p-0.5 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            {item.sizeLabel && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-gold/10 text-gold font-sans text-[9px] font-bold uppercase tracking-wider">
                                {item.sizeLabel}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg border border-white/5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-md text-cream/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-mono text-xs font-bold text-white px-1.5 min-w-[16px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-md text-cream/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Price Display */}
                            <span className="font-mono text-sm font-black text-gold">
                              Rs. {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Customer Information & Order Type Options */}
                    <div className="pt-6 border-t border-gold/10 space-y-4">
                      <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold">1. Order Options</h4>
                      
                      {/* Order Type Toggle Switch */}
                      <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            orderType === 'delivery'
                              ? 'bg-gold text-black shadow-md shadow-gold/5'
                              : 'text-cream/50 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>🚗</span>
                          <span>Delivery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            orderType === 'pickup'
                              ? 'bg-gold text-black shadow-md shadow-gold/5'
                              : 'text-cream/50 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>🥡</span>
                          <span>Self-Pickup</span>
                        </button>
                      </div>

                      <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold pt-2">2. Contact Profile</h4>
                      
                      {/* Profile inputs */}
                      <div className="space-y-3">
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/50" />
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your Name (e.g., Ali Ahmed)"
                            className="w-full bg-black/40 border border-gold/10 focus:border-gold rounded-xl pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-cream/20 focus:outline-none transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold/50" />
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="WhatsApp Contact (e.g., 0300 1234567)"
                            className="w-full bg-black/40 border border-gold/10 focus:border-gold rounded-xl pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder-cream/20 focus:outline-none transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Delivery calculator - only shown for Delivery */}
                      {orderType === 'delivery' && (
                        <div className="p-4 rounded-2xl bg-black/40 border border-gold/10 space-y-3.5 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-gold">
                              <MapPin className="h-4 w-4" />
                              <span className="font-sans text-xs font-bold uppercase tracking-wider">
                                Delivery Calculator
                              </span>
                            </div>
                            <span className="font-sans text-[8px] text-cream/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              Vee Bite Delivery
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="font-sans text-[9px] text-cream/60 uppercase tracking-widest font-bold">
                                Delivery Distance (KM)
                              </label>
                              <span className="font-mono text-xs font-bold text-gold">
                                {distanceNum} km
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={distance}
                                onChange={(e) => setDistance(parseFloat(e.target.value))}
                                className="flex-1 accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2 py-1 rounded-lg w-[72px] justify-center">
                                <input
                                  type="number"
                                  min="0.1"
                                  max="100"
                                  step="0.1"
                                  value={distance}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setDistance(val === '' ? '' : parseFloat(val));
                                  }}
                                  className="w-10 bg-transparent text-white font-mono text-[11px] font-bold text-center focus:outline-none"
                                />
                                <span className="font-sans text-[8px] text-cream/40 font-bold uppercase">KM</span>
                              </div>
                            </div>
                            <p className="font-sans text-[8px] text-cream/40 italic">
                              Rate: Rs. 60 (up to 2 km) + Rs. 30 per additional km
                            </p>
                          </div>

                          <div className="h-[1px] w-full bg-white/5" />

                          <div className="space-y-1.5">
                            <label className="block font-sans text-[9px] text-cream/60 uppercase tracking-widest font-bold">
                              Delivery Address
                            </label>
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Street, House/Flat Number, Block, Phase"
                              className="w-full bg-[#12110F]/90 border border-white/5 rounded-xl px-3 py-2 font-sans text-xs text-white placeholder-cream/20 focus:outline-none focus:border-gold/30 transition-all"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Footer Summary (Sticky at bottom) */}
            {cartItems.length > 0 && !createdOrder && (
              <div className="p-6 border-t border-gold/10 bg-[#171512] space-y-4">
                {/* Subtotals & Grand Total */}
                <div className="space-y-2">
                  <div className="flex justify-between font-sans text-xs text-cream/65">
                    <span>Subtotal</span>
                    <span className="font-mono">Rs. {cartTotal}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between font-sans text-xs text-cream/65">
                      <span>Delivery Fee ({distanceNum} km)</span>
                      <span className="font-mono text-gold">Rs. {deliveryCharge}</span>
                    </div>
                  )}
                  <div className="h-[1px] w-full bg-white/5 my-1" />
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-sans text-[9px] text-gold-dark uppercase font-bold tracking-widest block">
                        Total Payable
                      </span>
                      <span className="font-display text-2xl text-gold font-black font-mono">
                        Rs. {orderType === 'delivery' ? totalWithDelivery : cartTotal}
                      </span>
                    </div>
                    <button
                      onClick={clearCart}
                      className="text-[9px] uppercase font-sans tracking-wider text-cream/40 hover:text-red transition-all cursor-pointer border border-white/5 hover:border-red/20 px-2.5 py-1.5 rounded-lg"
                    >
                      Clear Basket
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  disabled={isPlacing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold hover:bg-gold-dark text-[#0A0A0A] font-sans text-xs uppercase tracking-widest py-3.5 transition-all duration-300 font-bold shadow-lg hover:shadow-gold/15 cursor-pointer hover:scale-[1.01]"
                >
                  {isPlacing ? (
                    <span className="h-4 w-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  <span>{isPlacing ? 'Registering Order...' : 'Send Order via WhatsApp'}</span>
                </button>

                <p className="font-sans text-[9px] text-center text-cream/40 leading-relaxed">
                  Your order will be registered on our tracking server and sent to our kitchen via WhatsApp for instant confirmation.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
