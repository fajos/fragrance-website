import React from 'react';
import { formatNaira, formatDate } from '../utils/formatters';
import { 
  CheckCircle2, Sparkles, Printer, MessageSquare, 
  Package, Truck, ArrowRight, X, Clock 
} from 'lucide-react';

export default function OrderConfirmationModal({ order, onClose, onTrackOrder }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappReceiptText = encodeURIComponent(
    `Hello Thermronnie Scent! I just placed an order:\n\n*Order ID:* ${order.id}\n*Customer:* ${order.customer.name}\n*Total:* ${formatNaira(order.total)}\n*Delivery Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state}\n\nPlease confirm receipt and dispatch schedule.`
  );
  const whatsappUrl = `https://wa.me/2348162810945?text=${whatsappReceiptText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#12151c] border border-[#2b3547] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#172418] via-[#1b3320] to-[#172418] border-b border-emerald-700/40 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Your authentic fragrance order has been received and is being prepared for dispatch.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Order Details & Tracking Bar */}
          <div className="p-4 rounded-2xl bg-[#181d26] border border-[#273142] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-gray-400">Order ID:</div>
              <div className="text-base font-bold text-[#d4af37] font-mono">{order.id}</div>
            </div>
            <div>
              <div className="text-gray-400">Date:</div>
              <div className="text-white font-medium">{formatDate(order.createdAt)}</div>
            </div>
            <div>
              <div className="text-gray-400">Tracking Code:</div>
              <div className="text-emerald-400 font-mono font-semibold">{order.trackingNumber}</div>
            </div>
            <div>
              <div className="text-gray-400">Payment:</div>
              <div className="text-white font-medium capitalize">{order.paymentMethod} ({order.paymentStatus})</div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-4 rounded-2xl bg-[#161a22] border border-[#232b3a] space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>Delivery Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
              <div>
                <span className="text-gray-500">Recipient:</span> <strong className="text-white">{order.customer.name}</strong>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> <strong className="text-white">{order.customer.phone}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Destination:</span> <strong className="text-white">{order.customer.address}, {order.customer.city}, {order.customer.state}</strong>
              </div>
            </div>
          </div>

          {/* Ordered Fragrances List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Ordered Fragrances ({order.items.length})
            </h4>

            <div className="space-y-2 divide-y divide-[#202735]">
              {order.items.map(item => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 shrink-0" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=100&q=80'; }}
                    />
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-gray-400 text-[11px]">Qty: {item.quantity} • {item.volume}</div>
                    </div>
                  </div>
                  <div className="font-bold text-amber-300">
                    {formatNaira(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="pt-3 border-t border-[#232b3a] space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatNaira(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#232b3a]">
                <span>Total Paid</span>
                <span className="text-amber-300 font-serif text-base">{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#202735]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#1b2b20] hover:bg-[#233a2a] border border-emerald-600/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Confirm on WhatsApp</span>
            </a>

            <button
              onClick={() => onTrackOrder(order.id)}
              className="py-2.5 px-4 rounded-xl bg-[#232b38] hover:bg-[#2c3747] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-[#3b475c]"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Track Live Delivery</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handlePrint}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:bg-[#f3e5ab] transition-all"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
