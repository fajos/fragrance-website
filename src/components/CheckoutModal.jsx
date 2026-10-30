import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira, generateOrderId } from '../utils/formatters';
import { SHIPPING_RATES } from '../data/shippingRates';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle2, ShieldCheck, CreditCard, Landmark, Truck, 
  Lock, ArrowRight, Sparkles, AlertCircle, Copy, Check
} from 'lucide-react';

export default function CheckoutModal({ onClose, onOrderSuccess }) {
  const { 
    cart, 
    subtotal, 
    shippingFee, 
    total, 
    discountAmount, 
    selectedState, 
    setSelectedState, 
    isFreeShipping,
    coupon, 
    createOrder 
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'paystack' // 'paystack', 'transfer', 'cod'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCodAllowed = selectedState.codAvailable;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('0123456789');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setErrorMsg('Please fill in all required customer and delivery fields.');
      return;
    }

    if (formData.paymentMethod === 'cod' && !isCodAllowed) {
      setErrorMsg(`Cash on Delivery is currently only available for Lagos and Abuja. Please select Paystack or Bank Transfer for ${selectedState.state}.`);
      return;
    }

    setIsProcessing(true);

    // Simulate payment / gateway latency
    setTimeout(() => {
      setIsProcessing(false);

      const orderId = generateOrderId();
      const newOrder = createOrder({
        id: orderId,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          state: selectedState.state,
          city: formData.city,
          address: formData.address,
          notes: formData.notes
        },
        paymentMethod: formData.paymentMethod
      });

      // Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      onOrderSuccess(newOrder);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#12151c] border border-[#2b3547] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#161a23] border-b border-[#232b3a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-bold flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Secure Checkout</h2>
              <p className="text-[11px] text-gray-400">256-bit encrypted checkout • Nigeria wide delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#202735] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Grid */}
        <form onSubmit={handleSubmitOrder} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          
          {/* Left Form: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Contact Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black text-[11px] font-extrabold flex items-center justify-center">1</span>
                <span>Contact Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Babatunde Adeyemi"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 0802 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="space-y-3 pt-4 border-t border-[#202735]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black text-[11px] font-extrabold flex items-center justify-center">2</span>
                <span>Delivery Address in Nigeria</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">State *</label>
                  <select
                    value={selectedState.state}
                    onChange={(e) => {
                      const st = SHIPPING_RATES.find(s => s.state === e.target.value);
                      if (st) {
                        setSelectedState(st);
                        if (!st.codAvailable && formData.paymentMethod === 'cod') {
                          setFormData(prev => ({ ...prev, paymentMethod: 'paystack' }));
                        }
                      }
                    }}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none"
                  >
                    {SHIPPING_RATES.map(st => (
                      <option key={st.state} value={st.state}>
                        {st.state} — {formatNaira(st.fee)} ({st.deliveryTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">City / Town / LGA *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Lekki Phase 1 / Ikeja"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Street Address *</label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    placeholder="House number, Street name, Landmark..."
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#181d26] text-xs text-white p-3 rounded-xl border border-[#2b3445] focus:border-[#d4af37] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-3 pt-4 border-t border-[#202735]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black text-[11px] font-extrabold flex items-center justify-center">3</span>
                <span>Payment Method</span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Paystack / Card */}
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'paystack'
                    ? 'bg-[#1b222f] border-[#d4af37]'
                    : 'bg-[#141820] border-[#252d3a] hover:bg-[#181d26]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={formData.paymentMethod === 'paystack'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#d4af37]" />
                        <span>Paystack / Debit Card (Visa, Mastercard, Verve)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Pay instantly and safely via card, bank transfer, USSD or Apple Pay through Paystack.
                    </p>
                  </div>
                </label>

                {/* 2. Direct Bank Transfer */}
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'transfer'
                    ? 'bg-[#1b222f] border-[#d4af37]'
                    : 'bg-[#141820] border-[#252d3a] hover:bg-[#181d26]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-400" />
                        <span>Direct Nigerian Bank Transfer</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Transfer directly to our corporate bank account with instant verification.
                    </p>

                    {formData.paymentMethod === 'transfer' && (
                      <div className="mt-3 p-3 rounded-xl bg-[#0c0e12] border border-[#283244] space-y-2 text-xs">
                        <div className="text-gray-400">Bank: <strong className="text-white">Guaranty Trust Bank (GTBank)</strong></div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Account Number: <strong className="text-amber-300 font-mono text-sm">0123456789</strong></span>
                          <button
                            type="button"
                            onClick={handleCopyAccount}
                            className="px-2 py-1 rounded-md bg-[#1f2633] text-gray-200 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            {copiedBank ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="text-gray-400">Account Name: <strong className="text-white">THERMRONNIE SCENT NIG LTD</strong></div>
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cash on Delivery */}
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                  !isCodAllowed
                    ? 'opacity-50 cursor-not-allowed bg-[#141820] border-[#222834]'
                    : formData.paymentMethod === 'cod'
                    ? 'bg-[#1b222f] border-[#d4af37] cursor-pointer'
                    : 'bg-[#141820] border-[#252d3a] hover:bg-[#181d26] cursor-pointer'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    disabled={!isCodAllowed}
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mt-1 text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <span>Pay on Delivery (Lagos & Abuja Only)</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {isCodAllowed
                        ? 'Pay via cash or POS upon physical inspection and handover.'
                        : `Not available for ${selectedState.state}. Available only in Lagos & Abuja.`}
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary: Order Items & Total */}
          <div className="lg:col-span-5 bg-[#161a23] p-5 rounded-2xl border border-[#252d3a] flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-white pb-2 border-b border-[#232b3a]">
                Order Items ({cart.length})
              </h3>

              <div className="max-h-48 overflow-y-auto space-y-3 pr-1 divide-y divide-[#202735]">
                {cart.map(item => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 shrink-0" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=100&q=80'; }}
                      />
                      <div className="truncate">
                        <div className="text-white font-medium truncate">{item.name}</div>
                        <div className="text-gray-400 text-[10px]">Qty: {item.quantity} • {item.volume}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-amber-300 shrink-0 ml-2">
                      {formatNaira(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-gray-300 pt-3 border-t border-[#232b3a]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({selectedState.state})</span>
                  <span className="font-semibold text-white">
                    {isFreeShipping ? <span className="text-emerald-400">FREE</span> : formatNaira(shippingFee)}
                  </span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatNaira(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#252d3a]">
                  <span>Total Amount</span>
                  <span className="text-amber-300 font-serif text-lg">{formatNaira(total)}</span>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e6c764] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order • {formatNaira(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Orders backed by 5-day return policy & genuine guarantee</span>
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}
