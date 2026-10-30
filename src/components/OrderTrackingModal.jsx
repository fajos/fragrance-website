import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira, formatDate } from '../utils/formatters';
import { 
  X, Search, Package, CheckCircle2, Clock, Truck, 
  MapPin, ShieldCheck, AlertCircle, MessageSquare 
} from 'lucide-react';

export default function OrderTrackingModal({ initialOrderId, onClose }) {
  const { orders } = useCart();
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [foundOrder, setFoundOrder] = useState(() => {
    if (initialOrderId) {
      return orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = orders.find(
      o => o.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
           o.customer.phone.includes(searchQuery.trim()) ||
           o.trackingNumber.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (match) {
      setFoundOrder(match);
      setSearchError('');
    } else {
      setSearchError(`No order found matching "${searchQuery}". Please check your order ID or phone number.`);
    }
  };

  const steps = [
    { title: 'Order Verified', desc: 'Payment verified & order recorded' },
    { title: 'Processing', desc: 'Carefully packaged at Lagos fulfillment hub' },
    { title: 'In Transit', desc: 'Dispatched via GIG Logistics / Express Courier' },
    { title: 'Out for Delivery', desc: 'Rider en route to delivery destination' },
    { title: 'Delivered', desc: 'Package received & signed by customer' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#12151c] border border-[#2b3547] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#161a23] border-b border-[#232b3a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-bold flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Track Order Delivery</h2>
              <p className="text-[11px] text-gray-400">Live dispatch updates across all 36 Nigerian states</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#202735] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. FRAG-2026-84920) or Phone number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181d26] text-xs text-white pl-10 pr-4 py-3 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-all"
            >
              Track
            </button>
          </form>

          {searchError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {foundOrder ? (
            <div className="space-y-6">
              
              {/* Order Info Card */}
              <div className="p-4 rounded-2xl bg-[#181d26] border border-[#252d3b] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-gray-400">Tracking Code:</div>
                  <div className="text-sm font-bold text-[#d4af37] font-mono">{foundOrder.trackingNumber}</div>
                </div>
                <div>
                  <div className="text-gray-400">Status:</div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    {foundOrder.status}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Destination:</div>
                  <div className="text-white font-medium">{foundOrder.customer.city}, {foundOrder.customer.state}</div>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="p-5 rounded-2xl bg-[#0e1117] border border-[#202634] space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Shipment Progress
                </div>

                <div className="space-y-5">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="flex items-start gap-4 relative">
                        {/* Connecting Line */}
                        {idx < steps.length - 1 && (
                          <div 
                            className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                              idx < currentStep ? 'bg-[#d4af37]' : 'bg-[#222834]'
                            }`}
                          />
                        )}

                        {/* Icon Node */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          isDone 
                            ? 'bg-[#d4af37] text-black shadow-lg shadow-amber-950/40' 
                            : 'bg-[#181d26] text-gray-500 border border-[#293242]'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <div className={`text-xs font-bold ${isCurrent ? 'text-amber-300' : isDone ? 'text-white' : 'text-gray-500'}`}>
                            {step.title}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this order */}
              <div className="p-4 rounded-2xl bg-[#161a22] border border-[#232b3a] space-y-2 text-xs">
                <div className="text-gray-400 font-medium">Fragrances in Package:</div>
                <div className="space-y-1">
                  {foundOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between text-white">
                      <span>{item.quantity}x {item.name} ({item.volume})</span>
                      <span className="text-amber-300 font-semibold">{formatNaira(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="flex items-center justify-between text-xs text-gray-400 p-2">
                <span>Need delivery help?</span>
                <a
                  href={`https://wa.me/2348162810945?text=Hello,%20I%20have%20an%20inquiry%20regarding%20Order%20${foundOrder.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Dispatch Support</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-xs">
              Enter your Order ID (from your confirmation receipt or SMS) to view live progress.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
