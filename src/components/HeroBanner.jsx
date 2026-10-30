import React from 'react';
import { Sparkles, ShieldCheck, Truck, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onSelectCategory }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#11141a] via-[#0d0f14] to-[#0c0e12] border-b border-[#222834]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#aa820a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#201a0f] border border-[#523e1c] text-[#d4af37] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE PREMIER ONLINE PERFUMERY IN NIGERIA</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Awaken Your Senses With <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa820a]">Extraordinary</span> Scents
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Explore over 116+ authentic designer, niche, and Arabian fragrances. From timeless icons like <span className="text-amber-300 font-medium">Creed Aventus</span> and <span className="text-amber-300 font-medium">Dior Sauvage</span> to luxury oud extraits delivered safely to your doorstep anywhere in Nigeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onSelectCategory('Niche')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-bold text-sm shadow-lg shadow-amber-950/50 hover:shadow-amber-700/40 transition-all flex items-center gap-2 group"
              >
                <span>Shop Niche Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectCategory('Under50k')}
                className="px-6 py-3 rounded-full bg-[#181d26] hover:bg-[#232b38] border border-[#343e52] text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                <span>Perfumes Under ₦50k</span>
              </button>

              <a
                href="https://wa.me/2348162810945?text=Hello,%20I%20want%20to%20order%20a%20fragrance"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-[#1b2b20] hover:bg-[#223829] border border-emerald-600/50 text-emerald-300 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Delivery Alert Banner */}
            <div className="p-3.5 rounded-2xl bg-[#141820]/80 border border-[#232b3a] flex items-center gap-3 text-xs text-gray-300 max-w-xl mx-auto lg:mx-0">
              <Truck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white font-semibold">Lagos & Abuja Express Delivery:</strong> Orders placed before 1:00 PM are dispatched same-day. Nationwide transit across all 36 states via GIG Logistics & DHL.
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl p-6 bg-gradient-to-b from-[#1b202a] to-[#12161f] border border-[#303a4c] shadow-2xl">
              
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-[#d4af37] text-black text-xs font-extrabold uppercase tracking-wider shadow-md">
                Featured Icon
              </div>

              <div className="h-64 sm:h-72 w-full flex items-center justify-center p-4 overflow-hidden rounded-2xl bg-[#090b0e]/70 border border-[#202735]">
                <img
                  src="https://fragrances.com.ng/media/catalog/product/cache/0daeb07bb1d294c1f281fab47369d56a/c/r/creed_aventus_cologne_100ml_perfume_for_men.jpg"
                  alt="Creed Aventus Eau de Cologne 100ml"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    House of Creed • Niche
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    In Stock in Lagos
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-bold text-white">
                  Creed Aventus Eau de Cologne 100ml
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2">
                  Top notes of pink pepper, ginger & mandarin orange; heart notes of patchouli, vetiver & pineapple; drydown of birch, musk & styrax.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase">Nigeria Price</div>
                    <div className="text-xl font-bold text-amber-300">₦609,999.00</div>
                  </div>
                  <button
                    onClick={() => onSelectCategory('Niche')}
                    className="px-4 py-2 rounded-xl bg-[#232b38] hover:bg-[#d4af37] hover:text-black text-white text-xs font-semibold transition-all border border-[#3b475c]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Value Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#202735]">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#12161e]/60 border border-[#202633]">
            <ShieldCheck className="w-6 h-6 text-[#d4af37] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">100% Genuine Guaranteed</div>
              <div className="text-[11px] text-gray-400">Authentic perfume batch verified</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#12161e]/60 border border-[#202633]">
            <Truck className="w-6 h-6 text-[#d4af37] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Nationwide Shipping</div>
              <div className="text-[11px] text-gray-400">All 36 States + Abuja delivery</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#12161e]/60 border border-[#202633]">
            <Clock className="w-6 h-6 text-[#d4af37] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Same-Day Dispatch</div>
              <div className="text-[11px] text-gray-400">Lagos & Abuja express service</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#12161e]/60 border border-[#202633]">
            <MessageSquare className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Dedicated WhatsApp</div>
              <div className="text-[11px] text-gray-400">+234 816 281 0945 active support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
