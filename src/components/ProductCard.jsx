import React from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';
import { Heart, ShoppingBag, Eye, MessageSquare, Star, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Generate WhatsApp order link with pre-filled message
  const whatsappText = encodeURIComponent(
    `Hello Thermronnie Scent! I want to order this perfume:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Price:* ${product.formattedPrice}\n\nPlease confirm availability and payment details.`
  );
  const whatsappUrl = `https://wa.me/2348162810945?text=${whatsappText}`;

  return (
    <div className="group relative flex flex-col bg-[#141820] hover:bg-[#181d26] rounded-2xl border border-[#232a38] hover:border-[#d4af37]/50 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl hover:shadow-amber-950/20">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {product.isNiche && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-black tracking-wider uppercase shadow">
            Niche
          </span>
        )}
        {product.isBestseller && !product.isNiche && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white tracking-wider uppercase shadow">
            Best Seller
          </span>
        )}
        {product.originalPrice && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white tracking-wider uppercase shadow">
            Special Offer
          </span>
        )}
        {product.isBudget && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-900/80 text-blue-200 border border-blue-700/50 text-[9px] uppercase">
            Under ₦50k
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isWishlisted
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
            : 'bg-[#101318]/70 text-gray-400 hover:text-rose-400 hover:bg-[#101318]'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative h-56 sm:h-64 w-full bg-[#0d0f14] flex items-center justify-center p-4 cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80';
          }}
          loading="lazy"
        />

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none sm:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#181d26] text-white text-xs font-semibold hover:bg-[#d4af37] hover:text-black transition-all flex items-center gap-1.5 shadow-lg border border-[#3b4559]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          {/* Brand & Volume */}
          <div className="flex items-center justify-between text-[11px] text-[#a09074] font-medium tracking-wider uppercase">
            <span>{product.brand}</span>
            <span>{product.volume}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-sm sm:text-base font-semibold text-white group-hover:text-[#f3e5ab] transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Concentration & Family */}
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="truncate">{product.concentration}</span>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-gray-300">{product.rating}</span>
            <span className="text-[10px] text-gray-500">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-2 border-t border-[#222834] space-y-2.5">
          {/* Price display */}
          <div className="flex items-baseline justify-between">
            <div className="text-base sm:text-lg font-bold text-amber-300 font-serif">
              {product.formattedPrice}
            </div>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Buttons: Add to Cart & WhatsApp */}
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="col-span-4 py-2 px-3 rounded-xl bg-[#202735] hover:bg-[#d4af37] text-gray-200 hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-[#2f394d] hover:border-[#d4af37] group/btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37] group-hover/btn:text-black transition-colors" />
              <span>Add to Cart</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 py-2 rounded-xl bg-[#17261d] hover:bg-[#203a29] text-emerald-400 border border-emerald-700/40 hover:border-emerald-500 flex items-center justify-center transition-all"
              title="Order this perfume on WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
