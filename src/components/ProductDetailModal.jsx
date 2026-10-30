import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';
import { 
  X, ShoppingBag, Heart, MessageSquare, Star, ShieldCheck, 
  Truck, CheckCircle2, Sparkles, Droplets, Wind, Clock
} from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const whatsappText = encodeURIComponent(
    `Hello Thermronnie Scent!\nI would like to order:\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Quantity:* ${quantity}\n*Price:* ${formatNaira(product.price * quantity)}\n\nPlease provide payment information and delivery schedule.`
  );
  const whatsappUrl = `https://wa.me/2348162810945?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#13161d] border border-[#2c3647] rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1b202a]/80 text-gray-400 hover:text-white hover:bg-[#252c3a] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image & Badges */}
          <div className="relative bg-[#0b0d11] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#222834]">
            
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {product.isNiche && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#d4af37] text-black uppercase tracking-wider">
                  Niche Fragrance
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#1a212e] text-[#d4af37] border border-[#d4af37]/30">
                SKU: {product.sku}
              </span>
            </div>

            <div className="w-full h-72 sm:h-80 flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> 100% Genuine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Truck className="w-4 h-4" /> Lagos Same-Day Eligible
              </span>
            </div>
          </div>

          {/* Right: Perfume Attributes & Commerce */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs text-[#b8a683] font-semibold uppercase tracking-wider">
                <span>{product.brand}</span>
                <span>{product.gender} Perfume</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-200">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                  {formatNaira(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatNaira(product.originalPrice)}
                  </div>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-medium">
                  {product.stockCount} in stock
                </span>
              </div>

              {/* Volume & Concentration badges */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#1b212c] border border-[#2c3749] text-gray-200">
                  <span className="text-gray-400">Concentration:</span> <strong className="text-white">{product.concentration}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#1b212c] border border-[#2c3749] text-gray-200">
                  <span className="text-gray-400">Volume:</span> <strong className="text-white">{product.volume}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#1b212c] border border-[#2c3749] text-gray-200">
                  <span className="text-gray-400">Family:</span> <strong className="text-white">{product.family}</strong>
                </div>
              </div>

              {/* Olfactory Notes Pyramid */}
              <div className="mt-5 p-4 rounded-2xl bg-[#0e1117] border border-[#212734] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Olfactory Scent Pyramid</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Top Notes: </span>
                    <span className="text-gray-200">{product.notes.top.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Heart Notes: </span>
                    <span className="text-gray-200">{product.notes.heart.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Base Notes: </span>
                    <span className="text-gray-200">{product.notes.base.join(', ')}</span>
                  </div>
                </div>

                {/* Scent Performance metrics */}
                <div className="pt-2 border-t border-[#1b202a] grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Longevity: <strong>10 - 14 Hours</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sillage: <strong>Heavy & Magnetic</strong></span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions: Quantity, Cart, WhatsApp */}
            <div className="pt-4 border-t border-[#222834] space-y-3">
              
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center bg-[#1b212c] border border-[#2c3749] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-400 hover:text-white hover:bg-[#252e3d] text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-400 hover:text-white hover:bg-[#252e3d] text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {quantity > 1 ? `(${quantity})` : ''} to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                      : 'bg-[#1b212c] border-[#2c3749] text-gray-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#16271c] hover:bg-[#1e3827] border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Instant Order on WhatsApp (+234 816 281 0945)</span>
              </a>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
