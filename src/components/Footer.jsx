import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Phone, MessageSquare, Mail, MapPin, ShieldCheck, 
  Truck, Clock, Sparkles, Send, Check 
} from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  const { setActiveModal, addToast } = useCart();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    addToast('Thank you for subscribing! Your ₦5,000 welcome voucher has been sent to your email.');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#090b0e] border-t border-[#1e2430] text-gray-400 text-xs">
      
      {/* 1. Newsletter Ribbon */}
      <div className="bg-gradient-to-r from-[#17140e] via-[#241c0f] to-[#17140e] border-b border-[#3d321c]/40 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[#d4af37] font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fragrance Insider Circle</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Get 10% Off Your First Bottle & VIP Access
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Subscribe to receive private sale invites, new arrival alerts (Creed, Dior, Lattafa), and exclusive decants.
            </p>
          </div>

          <div className="md:col-span-5">
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 bg-[#12161f] text-xs text-white px-4 py-3 rounded-xl border border-[#303c50] focus:border-[#d4af37] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-all flex items-center gap-1.5 shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>{subscribed ? 'Subscribed' : 'Join VIP'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#8d6a06] flex items-center justify-center font-serif font-bold text-black text-lg">
                T
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                THERMRONNIE <span className="text-[#d4af37]">SCENT</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Nigeria's largest premier online perfume destination. Dedicated to awakening senses with guaranteed authentic designer, niche, and Arabian fragrances, scented candles, and luxury gift sets.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Hotline: +234 816 281 0945</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <a href="https://wa.me/2348162810945" target="_blank" rel="noreferrer" className="hover:underline">
                  WhatsApp: +234 816 281 0945
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>support@thermronniescent.ng</span>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Lagos Fulfillment Hub • Dispatches Nationwide Across 36 States</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Fragrance Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('Niche')} className="hover:text-amber-300 transition-colors">
                  Niche Fragrances
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Men')} className="hover:text-amber-300 transition-colors">
                  Men's Designer Perfumes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Women')} className="hover:text-amber-300 transition-colors">
                  Women's Luxury Scents
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Arabian')} className="hover:text-amber-300 transition-colors">
                  Arabian Oud & Extraits
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Under50k')} className="hover:text-amber-300 transition-colors">
                  Perfumes Below ₦50k
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Bestseller')} className="hover:text-amber-300 transition-colors">
                  Top Best Sellers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveModal('rates')} className="hover:text-amber-300 transition-colors text-left">
                  36 States Delivery Rates
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('tracking')} className="hover:text-amber-300 transition-colors text-left">
                  Track Delivery Status
                </button>
              </li>
              <li>
                <span className="block text-gray-300">5-Day Return Guarantee</span>
                <span className="text-[10px] text-gray-500">Unopened / damaged items (notify within 24h)</span>
              </li>
              <li>
                <span className="block text-gray-300">100% Genuine Authenticity</span>
                <span className="text-[10px] text-gray-500">Batch code verified original bottles</span>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-amber-400 transition-colors inline-flex items-center gap-1 text-[11px]">
                  <span>Staff Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Partners & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Secured Payments
            </h4>
            <p className="text-xs text-gray-400">
              We accept Nigerian cards, Paystack instant transfers, USSD, and Cash on Delivery in Lagos & Abuja.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-[#12161f] border border-[#202735] rounded-lg text-center font-bold text-gray-300 text-[11px]">
                Paystack
              </div>
              <div className="p-2 bg-[#12161f] border border-[#202735] rounded-lg text-center font-bold text-gray-300 text-[11px]">
                Mastercard
              </div>
              <div className="p-2 bg-[#12161f] border border-[#202735] rounded-lg text-center font-bold text-gray-300 text-[11px]">
                Visa Card
              </div>
              <div className="p-2 bg-[#12161f] border border-[#202735] rounded-lg text-center font-bold text-gray-300 text-[11px]">
                Verve Card
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Bank-grade 256-bit SSL encrypted</span>
            </div>
          </div>

        </div>

        {/* 3. Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-[#181d26] flex flex-wrap items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Thermronnie Scent. All rights reserved. House of Luxury Scents Nigeria.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Refund Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
