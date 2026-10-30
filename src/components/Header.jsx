import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/formatters';
import { 
  Search, ShoppingBag, Heart, Menu, X, Phone, MessageSquare, 
  Truck, ShieldCheck, Sparkles, ChevronDown, Compass, Package, UserCheck
} from 'lucide-react';

export default function Header({ 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery,
  onOpenQuickView,
  allProducts
}) {
  const { 
    cartCount, 
    subtotal, 
    wishlist, 
    setIsCartOpen, 
    setActiveModal 
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // Suggestions for autocomplete
  const searchSuggestions = searchQuery.trim().length > 1
    ? allProducts
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'All', label: 'All Perfumes' },
    { id: 'Men', label: "Men's Perfumes" },
    { id: 'Women', label: "Women's Perfumes" },
    { id: 'Unisex', label: 'Unisex Scents' },
    { id: 'Niche', label: 'Niche Exclusives' },
    { id: 'Arabian', label: 'Arabian & Oud' },
    { id: 'Under50k', label: 'Under ₦50,000' },
    { id: 'Bestseller', label: 'Best Sellers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e12]/95 backdrop-blur-md border-b border-[#222834]">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#17140e] via-[#241c0f] to-[#17140e] border-b border-[#3d321c]/50 text-xs text-[#e4ce9e] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              100% Authentic Designer & Niche Fragrances
            </span>
            <span className="hidden sm:inline-block text-[#6f5e3e]">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Free Delivery on orders above ₦150,000
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a 
              href="https://wa.me/2348162810945?text=Hello%20Thermronnie%20Scent,%20I%20would%20like%20to%20inquire%20about%20a%20perfume" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: +234 816 281 0945</span>
            </a>
            <span className="text-[#6f5e3e]">|</span>
            <button 
              onClick={() => setActiveModal('tracking')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <span className="text-[#6f5e3e]">|</span>
            <button 
              onClick={() => setActiveModal('rates')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping Rates</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCategory('All')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#5a4305] flex items-center justify-center shadow-lg shadow-amber-950/40 border border-amber-400/30">
              <span className="font-serif text-2xl font-bold text-black tracking-wider">T</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">
                  THERMRONNIE <span className="text-[#d4af37]">SCENT</span>
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-[#a8997a] uppercase font-semibold">
                Nigeria's Premier Perfume House
              </p>
            </div>
          </div>

          {/* Search Bar with Instant Autocomplete */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search over 116+ perfumes, brands, notes (Creed, Sauvage, Oud...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#151921] text-gray-200 placeholder-gray-500 text-sm pl-11 pr-10 py-2.5 rounded-full border border-[#2b3342] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#151921] border border-[#2e3747] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-[#222938]">
                <div className="p-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-[#0f1217]">
                  Matching Fragrances ({searchSuggestions.length})
                </div>
                {searchSuggestions.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onOpenQuickView(item);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#1f2533] cursor-pointer transition-colors"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-10 h-10 object-contain bg-white/5 rounded-lg p-1 shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=150&q=80'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-100 truncate">{item.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{item.brand}</span>
                        <span>•</span>
                        <span>{item.volume}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-amber-400">
                      {item.formattedPrice}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions: Hotline, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick WhatsApp Support */}
            <a
              href="https://wa.me/2348162810945"
              target="_blank"
              rel="noreferrer"
              className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1b2b20] border border-emerald-600/40 text-emerald-300 text-xs font-semibold hover:bg-[#203627] transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Order via WhatsApp</span>
            </a>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (wishlist.length === 0) {
                  alert('Your wishlist is empty. Click the heart icon on any perfume to save it!');
                } else {
                  setSelectedCategory('Wishlist');
                }
              }}
              className="relative p-2.5 rounded-full text-gray-300 hover:text-rose-400 hover:bg-[#1a1f29] transition-colors"
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#1c222c] hover:bg-[#252d3a] border border-[#2f394a] text-gray-100 transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-5 h-5 rounded-full bg-[#d4af37] text-black text-[11px] font-extrabold flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">My Cart</div>
                <div className="text-xs font-bold text-amber-300">
                  {subtotal > 0 ? formatNaira(subtotal) : '₦0'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search perfumes, brands (Creed, Sauvage...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151921] text-gray-200 placeholder-gray-500 text-sm pl-10 pr-4 py-2 rounded-xl border border-[#2b3342] focus:border-[#d4af37] focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION MENU */}
      <nav className="hidden lg:block bg-[#11141a] border-t border-[#1f2532]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#d4af37] text-black shadow-md shadow-amber-900/30'
                        : 'text-gray-300 hover:text-white hover:bg-[#1a1f29]'
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#11141a] border-b border-[#222834] px-4 py-4 space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Perfume Categories
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 text-xs text-left font-medium rounded-lg ${
                  selectedCategory === cat.id ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#181d26] text-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#222834] flex flex-col gap-2 text-xs">
            <button 
              onClick={() => { setActiveModal('tracking'); setIsMobileMenuOpen(false); }}
              className="p-2.5 bg-[#181d26] text-left rounded-lg text-amber-300 flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Track My Order
            </button>
            <button 
              onClick={() => { setActiveModal('rates'); setIsMobileMenuOpen(false); }}
              className="p-2.5 bg-[#181d26] text-left rounded-lg text-gray-200 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" /> Nationwide Shipping Rates
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
