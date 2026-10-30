import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';
import { SHIPPING_RATES } from '../data/shippingRates';
import { 
  X, ShoppingBag, Trash2, ArrowRight, Truck, Tag, 
  Sparkles, Check, AlertCircle 
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingFee, 
    total, 
    discountAmount, 
    isFreeShipping, 
    freeShippingProgress, 
    amountNeededForFreeShipping, 
    selectedState, 
    setSelectedState, 
    coupon, 
    applyCoupon, 
    removeCoupon, 
    setActiveModal 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError('Invalid code. Try WELCOME10 or FRAGVIP');
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12151b] border-l border-[#242c3b] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#212734] flex items-center justify-between bg-[#151922]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-serif text-lg font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#202735] text-amber-300">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#202735] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#191e29] p-3.5 border-b border-[#242c3b]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-gray-200">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                {isFreeShipping ? (
                  <strong className="text-emerald-400">🎉 Congratulations! You have FREE Nationwide Delivery!</strong>
                ) : (
                  <span>Add <strong className="text-amber-300">{formatNaira(amountNeededForFreeShipping)}</strong> more for FREE delivery</span>
                )}
              </span>
              <span className="text-xs font-bold text-amber-300">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#0e1117] h-2 rounded-full overflow-hidden border border-[#2a3445]">
              <div 
                className="bg-gradient-to-r from-[#d4af37] to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#1e2432]">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1b202a] flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-200">Your Cart is Empty</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Explore our collection of 116+ authentic designer & niche perfumes and discover your signature scent.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black text-xs font-bold hover:bg-[#f3e5ab] transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-[#0b0d12] p-2 flex items-center justify-center shrink-0 border border-[#232b3a]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-[#b09e7c] uppercase font-semibold truncate">
                      {item.brand} • {item.volume}
                    </div>
                    <div className="text-xs font-semibold text-white truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">
                      {formatNaira(item.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-[#1c222c] border border-[#2c3749] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-gray-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      {formatNaira(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Delivery & Order Calculations (when cart is not empty) */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#151922] border-t border-[#232b3a] space-y-4">
              
              {/* State Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Delivery Destination</span>
                  <span className="text-amber-400 text-[10px] font-normal">
                    {isFreeShipping ? 'FREE' : formatNaira(selectedState.fee)}
                  </span>
                </label>
                <select
                  value={selectedState.state}
                  onChange={(e) => {
                    const st = SHIPPING_RATES.find(s => s.state === e.target.value);
                    if (st) setSelectedState(st);
                  }}
                  className="w-full bg-[#1c222c] text-xs text-white p-2.5 rounded-xl border border-[#2f394a] focus:border-[#d4af37] focus:outline-none"
                >
                  {SHIPPING_RATES.map(st => (
                    <option key={st.state} value={st.state}>
                      {st.state} ({st.zone}) — {formatNaira(st.fee)} ({st.deliveryTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{coupon.code}</strong> applied (-{formatNaira(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-400 hover:text-rose-300 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#1c222c] text-xs text-white px-3 py-2 rounded-xl border border-[#2f394a] focus:border-[#d4af37] focus:outline-none uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#252e3d] hover:bg-[#d4af37] hover:text-black text-gray-200 text-xs font-semibold rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <div className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-[#232b3a]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatNaira(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery ({selectedState.state})</span>
                  <span className="font-semibold text-white">
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatNaira(shippingFee)
                    )}
                  </span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatNaira(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#232b3a]">
                  <span>Total</span>
                  <span className="text-amber-300 font-serif text-lg">{formatNaira(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveModal('checkout');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e2c158] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
