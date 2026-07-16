import React, { useState, useEffect } from 'react';
import { 
  X, Search, Clock, MapPin, Phone, User, 
  ShoppingBag, Clipboard, Check, RefreshCw, 
  CheckCircle2, ChevronRight, AlertTriangle, 
  Truck, ChefHat, CheckSquare, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  sizeLabel?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  distance: number;
  deliveryCharge: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'ready_for_pickup' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export default function TrackOrderModal({ isOpen, onClose, initialOrderId = '' }: TrackOrderModalProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoRefreshSec, setAutoRefreshSec] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      fetchOrder(initialOrderId);
    } else {
      setOrderId('');
      setOrder(null);
      setError('');
    }
  }, [initialOrderId, isOpen]);

  // Status auto-refresh polling when an order is loaded and modal is open
  useEffect(() => {
    if (!order || !isOpen || order.status === 'delivered' || order.status === 'cancelled') return;

    const timer = setInterval(() => {
      refreshOrderStatus();
    }, 15000);

    return () => clearInterval(timer);
  }, [order, isOpen]);

  // Count down for visual feedback
  useEffect(() => {
    if (!order || !isOpen || order.status === 'delivered' || order.status === 'cancelled') return;

    const interval = setInterval(() => {
      setAutoRefreshSec((prev) => {
        if (prev <= 1) {
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order, isOpen]);

  const fetchOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const formattedId = searchId.trim().toUpperCase();
      const res = await fetch(`/api/orders/${formattedId}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Order not found.');
      }
      const data = await res.json();
      setOrder(data);
      setAutoRefreshSec(15);
    } catch (err: any) {
      console.error('Track order error:', err);
      setOrder(null);
      setError(err.message || 'Failed to locate order. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrderStatus = async () => {
    if (!order) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setAutoRefreshSec(15);
      }
    } catch (err) {
      console.error('Error refreshing order status:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId);
  };

  const copyTrackingLink = () => {
    if (!order) return;
    const link = `${window.location.origin}/#track-${order.orderId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get current status stage index
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery':
      case 'ready_for_pickup': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Awaiting Kitchen Confirmation', icon: Clipboard },
    { label: 'Confirmed', desc: 'Accepted by Staff', icon: CheckSquare },
    { label: 'Preparing', desc: 'Freshly Cooking Food', icon: ChefHat },
    { 
      label: order?.orderType === 'pickup' ? 'Ready' : 'Out for Delivery', 
      desc: order?.orderType === 'pickup' ? 'Ready at counter' : 'Rider is on the way', 
      icon: Truck 
    },
    { label: 'Completed', desc: 'Delicious Meal Delivered!', icon: CheckCircle2 }
  ];

  const currentStep = order ? getStatusStep(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 md:inset-x-auto top-[5%] md:left-1/2 md:-translate-x-1/2 w-full max-w-2xl bg-[#111215] border border-gold/25 rounded-3xl shadow-2xl z-[120] max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex items-center justify-between bg-[#171512]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold/10 border border-gold/30 text-gold">
                  <CompassIcon className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wider text-white uppercase font-bold">Track Your Order</h3>
                  <p className="font-sans text-[10px] text-cream/50 uppercase tracking-widest">Real-Time Kitchen Updates</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/5 text-cream/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
              
              {/* Tracker Form Search Bar */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/40" />
                    <input
                      type="text"
                      required
                      placeholder="Enter Order ID (e.g. VB-1001)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full bg-[#171512] border border-gold/10 hover:border-gold/30 focus:border-gold focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-[#F3E9D2] placeholder-cream/20 transition-all font-mono uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer bg-gradient-to-r from-[#C5A85C] to-gold hover:opacity-95 text-black font-semibold text-xs tracking-wider uppercase px-6 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span>{loading ? 'Searching' : 'Track'}</span>
                  </button>
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-400 font-sans text-xs mt-2.5 flex items-center gap-1.5 bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.p>
                )}
              </form>

              {/* Order State Display */}
              {order ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="p-5 rounded-2xl bg-[#171512] border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Sparkles className="w-24 h-24 text-gold" />
                    </div>

                    <div className="z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gold font-bold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          Order {order.orderId}
                        </span>
                        <span className={`text-[10px] uppercase font-sans font-black tracking-widest px-2 py-0.5 rounded ${
                          isCancelled ? 'bg-red/20 text-red border border-red/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {order.status === 'pending' && 'Awaiting Confirmation'}
                          {order.status === 'confirmed' && 'Confirmed & Accepted'}
                          {order.status === 'preparing' && 'Preparing Food'}
                          {order.status === 'out_for_delivery' && 'Out for Delivery'}
                          {order.status === 'ready_for_pickup' && 'Ready for Pickup'}
                          {order.status === 'delivered' && 'Delivered'}
                          {order.status === 'cancelled' && 'Cancelled'}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-cream/60 mt-2">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5 z-10 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyTrackingLink}
                          className="flex items-center gap-1 text-[10px] text-cream/60 hover:text-gold border border-white/5 hover:border-gold/30 bg-white/5 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Clipboard className="w-3 h-3" />}
                          <span>{copied ? 'Copied Link' : 'Share Link'}</span>
                        </button>
                        <button
                          onClick={refreshOrderStatus}
                          disabled={isRefreshing}
                          className="flex items-center gap-1 text-[10px] text-cream/60 hover:text-gold border border-white/5 hover:border-gold/30 bg-white/5 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-gold' : ''}`} />
                          <span>Refresh</span>
                        </button>
                      </div>
                      
                      {!isCancelled && order.status !== 'delivered' && (
                        <p className="font-sans text-[9px] text-cream/40 italic flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Auto-refreshing status in {autoRefreshSec}s</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cancelled Banner */}
                  {isCancelled && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-xl bg-red/10 border border-red/20 flex gap-3 text-red-400 text-xs items-center leading-relaxed"
                    >
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red" />
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-wider mb-0.5">Order Cancelled</h4>
                        <p className="text-cream/70">This order was cancelled. Please feel free to text Muhammad Haris on WhatsApp at 0307 655 3100 if you have any questions or to place a new order!</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Interactive Status Timeline */}
                  {!isCancelled && (
                    <div className="p-6 rounded-2xl bg-[#171512] border border-gold/10 space-y-6">
                      <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold">Delivery / Pickup Progress</h4>
                      
                      {/* Timeline Steps */}
                      <div className="space-y-4">
                        {steps.map((step, idx) => {
                          const IconComp = step.icon;
                          const isCompleted = currentStep >= idx;
                          const isCurrent = currentStep === idx;

                          return (
                            <div key={idx} className="flex gap-4 items-start relative">
                              {/* Connective Line */}
                              {idx < steps.length - 1 && (
                                <div className={`absolute left-4 top-8 bottom-0 w-[2px] -translate-x-1/2 z-0 ${
                                  currentStep > idx ? 'bg-gold' : 'bg-white/5'
                                }`} />
                              )}

                              {/* Progress Bullet indicator */}
                              <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                                isCompleted 
                                  ? 'bg-gold border-gold text-black shadow-[0_0_12px_rgba(255,193,7,0.3)]' 
                                  : 'bg-[#111215] border-white/10 text-cream/30'
                              } ${isCurrent ? 'animate-bounce scale-110' : ''}`}>
                                <IconComp className="w-3.5 h-3.5" />
                              </div>

                              {/* Description Details */}
                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex justify-between items-center">
                                  <h5 className={`font-sans text-xs font-bold uppercase tracking-wider ${
                                    isCompleted ? 'text-white' : 'text-cream/30'
                                  }`}>
                                    {step.label}
                                  </h5>
                                  {isCompleted && (
                                    <span className="text-[10px] text-gold font-semibold uppercase tracking-wider flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3 h-3 text-gold" />
                                      <span>Done</span>
                                    </span>
                                  )}
                                </div>
                                <p className={`font-sans text-[11px] mt-0.5 ${
                                  isCompleted ? 'text-cream/60' : 'text-cream/20'
                                }`}>
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer & Location Details (Bento boxes) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer details */}
                    <div className="p-4 rounded-2xl bg-[#171512] border border-gold/10 space-y-3">
                      <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Customer Profile</span>
                      </h4>
                      <div className="space-y-2 font-sans text-xs">
                        <div className="flex justify-between">
                          <span className="text-cream/50">Name:</span>
                          <span className="text-white font-bold">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Contact:</span>
                          <span className="text-white font-semibold font-mono">{order.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cream/50">Order Type:</span>
                          <span className="text-gold uppercase font-bold text-[10px] tracking-wide">
                            {order.orderType === 'delivery' ? '🚗 Delivery' : '🥡 Self-Pickup'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery address details */}
                    <div className="p-4 rounded-2xl bg-[#171512] border border-gold/10 space-y-3">
                      <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Address / Distance</span>
                      </h4>
                      <div className="space-y-2 font-sans text-xs">
                        <div className="flex justify-between items-start">
                          <span className="text-cream/50 flex-shrink-0">Destination:</span>
                          <span className="text-white font-semibold text-right leading-relaxed truncate max-w-[150px]" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </span>
                        </div>
                        {order.orderType === 'delivery' && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-cream/50">Distance:</span>
                              <span className="text-white font-semibold font-mono">{order.distance} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-cream/50">Delivery Charge:</span>
                              <span className="text-gold font-bold font-mono">Rs. {order.deliveryCharge}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Summary list */}
                  <div className="p-5 rounded-2xl bg-[#171512] border border-gold/10 space-y-4">
                    <h4 className="font-display text-xs tracking-widest text-gold uppercase font-bold flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Items Ordered ({order.items.reduce((acc, it) => acc + it.quantity, 0)})</span>
                    </h4>

                    <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gold/10">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-black/20 border border-white/5">
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate uppercase tracking-wide">
                              {it.name}
                            </span>
                            {it.sizeLabel && (
                              <span className="inline-block px-1 py-0.5 rounded bg-gold/10 text-gold text-[8px] font-bold uppercase mt-0.5">
                                {it.sizeLabel}
                              </span>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 pl-3">
                            <span className="text-cream/50 font-mono text-[11px] mr-3">
                              {it.quantity} x Rs. {it.price}
                            </span>
                            <span className="font-bold text-white font-mono">
                              Rs. {it.quantity * it.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-[1px] w-full bg-white/5 pt-1" />

                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[9px] text-cream/40 uppercase font-bold tracking-widest block">Grand Total Paid/Payable</span>
                        <span className="font-display text-xl text-gold font-black font-mono">Rs. {order.total}</span>
                      </div>
                      <span className="text-[10px] text-cream/40 uppercase font-mono italic">
                        Via Cash on Delivery
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="p-4 rounded-full bg-[#171512] border border-gold/10 text-cream/20 mb-4 animate-pulse">
                    <Clock className="w-12 h-12" />
                  </div>
                  <h4 className="font-display text-base text-cream/80 tracking-wide">Ready to Track</h4>
                  <p className="font-sans text-xs text-cream/40 max-w-[320px] mt-2">
                    Enter your unique Vee Bite Order ID above to view cooking progress and real-time courier dispatch status!
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Simple internal icon proxy to prevent import error
function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
