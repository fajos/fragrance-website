import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import OrderTrackingModal from '../components/OrderTrackingModal';
import ShippingRatesModal from '../components/ShippingRatesModal';
import ToastContainer from '../components/ToastContainer';
import Footer from '../components/Footer';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, Sparkles, 
  RotateCcw, Check, Heart, Search, X 
} from 'lucide-react';

export default function StorefrontPage() {
  const { products } = useInventory();
  const { 
    activeModal, 
    setActiveModal, 
    quickViewProduct, 
    setQuickViewProduct, 
    wishlist 
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced faceted filters
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedConcentration, setSelectedConcentration] = useState('All');
  const [priceRange, setPriceRange] = useState('All'); // 'All', 'under50k', '50k-150k', '150k-350k', 'above350k'
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Confirmed order state for receipt modal
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Distinct Brands list for filter dropdown
  const uniqueBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort();
    return ['All', ...brands];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Category Filter
      if (selectedCategory === 'Wishlist') {
        if (!wishlist.includes(item.id)) return false;
      } else if (selectedCategory === 'Men') {
        if (item.gender !== 'Men') return false;
      } else if (selectedCategory === 'Women') {
        if (item.gender !== 'Women') return false;
      } else if (selectedCategory === 'Unisex') {
        if (item.gender !== 'Unisex') return false;
      } else if (selectedCategory === 'Niche') {
        if (!item.isNiche) return false;
      } else if (selectedCategory === 'Arabian') {
        const isArabian = /oud|amber|oriental|saffron|zaafaran|maghribi|arabiyat|ashes/i.test(item.name);
        if (!isArabian) return false;
      } else if (selectedCategory === 'Under50k') {
        if (item.price > 50000) return false;
      } else if (selectedCategory === 'Bestseller') {
        if (!item.isBestseller) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesFamily = item.family ? item.family.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesBrand && !matchesFamily) return false;
      }

      // 3. Brand Filter
      if (selectedBrand !== 'All' && item.brand !== selectedBrand) {
        return false;
      }

      // 4. Concentration Filter
      if (selectedConcentration !== 'All') {
        if (!item.concentration.toLowerCase().includes(selectedConcentration.toLowerCase())) {
          return false;
        }
      }

      // 5. Price Range Filter
      if (priceRange === 'under50k' && item.price > 50000) return false;
      if (priceRange === '50k-150k' && (item.price < 50000 || item.price > 150000)) return false;
      if (priceRange === '150k-350k' && (item.price < 150000 || item.price > 350000)) return false;
      if (priceRange === 'above350k' && item.price < 350000) return false;

      // 6. Stock Filter
      if (inStockOnly && !item.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.id - b.id; // featured default
    });
  }, [products, selectedCategory, searchQuery, selectedBrand, selectedConcentration, priceRange, inStockOnly, sortBy, wishlist]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedBrand('All');
    setSelectedConcentration('All');
    setPriceRange('All');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    searchQuery !== '' || 
    selectedBrand !== 'All' || 
    selectedConcentration !== 'All' || 
    priceRange !== 'All' || 
    inStockOnly;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e12] text-gray-200">
      
      {/* Top Header */}
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQuickView={setQuickViewProduct}
        allProducts={products}
      />

      {/* Hero Showcase (shown when not searching or browsing specific subcategory) */}
      {selectedCategory === 'All' && !searchQuery && (
        <HeroBanner onSelectCategory={setSelectedCategory} />
      )}

      {/* Main Catalog View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#202634]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {selectedCategory === 'Wishlist' ? 'Your Saved Wishlist' :
                 selectedCategory === 'Men' ? "Men's Luxury Perfumes" :
                 selectedCategory === 'Women' ? "Women's Designer Scents" :
                 selectedCategory === 'Unisex' ? 'Unisex Signature Fragrances' :
                 selectedCategory === 'Niche' ? 'Exclusive Niche Extraits & Parfums' :
                 selectedCategory === 'Arabian' ? 'Arabian Oud & Oriental Fragrances' :
                 selectedCategory === 'Under50k' ? 'Budget Friendly Perfumes Under ₦50k' :
                 selectedCategory === 'Bestseller' ? 'Best Selling Scents in Nigeria' :
                 'All Authentic Fragrances'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1b222f] text-amber-300 font-semibold border border-[#2b3547]">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Guaranteed 100% genuine original designer and niche bottles with Lagos same-day and nationwide dispatch.
            </p>
          </div>

          {/* Sorting and Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-[#171c26] border border-[#2c3749] text-gray-200 text-xs font-semibold flex items-center gap-2 hover:bg-[#202735]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#171c26] border border-[#2c3749] rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
              >
                <option value="featured" className="bg-[#171c26]">Featured</option>
                <option value="price-low" className="bg-[#171c26]">Price: Low to High</option>
                <option value="price-high" className="bg-[#171c26]">Price: High to Low</option>
                <option value="rating" className="bg-[#171c26]">Highest Rated</option>
                <option value="name" className="bg-[#171c26]">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Filter Chips / Subheader */}
        <div className={`mt-6 p-4 rounded-2xl bg-[#12161f] border border-[#232b3a] space-y-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Brand Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Fragrance Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#181d26] text-white p-2 rounded-xl border border-[#2b3547] focus:border-[#d4af37] focus:outline-none"
              >
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
                ))}
              </select>
            </div>

            {/* Concentration Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Concentration
              </label>
              <select
                value={selectedConcentration}
                onChange={(e) => setSelectedConcentration(e.target.value)}
                className="w-full bg-[#181d26] text-white p-2 rounded-xl border border-[#2b3547] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="All">All Concentrations</option>
                <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                <option value="Extrait">Extrait de Parfum</option>
                <option value="Cologne">Eau de Cologne</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-[#181d26] text-white p-2 rounded-xl border border-[#2b3547] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="All">Any Price</option>
                <option value="under50k">Under ₦50,000</option>
                <option value="50k-150k">₦50,000 - ₦150,000</option>
                <option value="150k-350k">₦150,000 - ₦350,000</option>
                <option value="above350k">Above ₦350,000 (Luxury/Niche)</option>
              </select>
            </div>

            {/* Stock Toggle & Reset */}
            <div className="flex items-end justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#181d26] rounded-xl border border-[#2b3547] flex-1">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#d4af37] focus:ring-[#d4af37] bg-[#12161f]"
                />
                <span className="text-[11px] text-gray-200">In Stock Only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 bg-[#252d3c] hover:bg-rose-950 hover:text-rose-300 text-gray-300 rounded-xl transition-all flex items-center gap-1.5 text-xs"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs border-t border-[#1f2635]">
              <span className="text-gray-400 text-[11px]">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-[#1f2635] text-amber-300 flex items-center gap-1.5">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-[#1f2635] text-amber-300 flex items-center gap-1.5">
                  Brand: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('All')} />
                </span>
              )}
              {priceRange !== 'All' && (
                <span className="px-2.5 py-1 rounded-full bg-[#1f2635] text-amber-300 flex items-center gap-1.5">
                  Price: {priceRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-[#1f2635] text-amber-300 flex items-center gap-1.5">
                  Keyword: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#12151c] border border-[#232b3a] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1a212e] flex items-center justify-center mx-auto text-gray-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">No Fragrances Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                We couldn't find any perfumes matching your exact criteria. Try loosening your filters or searching for popular brands like Creed, Dior, Tom Ford, or Lattafa.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-all shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer onSelectCategory={setSelectedCategory} />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Checkout Modal */}
      {activeModal === 'checkout' && (
        <CheckoutModal
          onClose={() => setActiveModal(null)}
          onOrderSuccess={(order) => {
            setActiveModal(null);
            setConfirmedOrder(order);
          }}
        />
      )}

      {/* Order Confirmation Receipt Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onTrackOrder={(orderId) => {
            setConfirmedOrder(null);
            setTrackingOrderId(orderId);
            setActiveModal('tracking');
          }}
        />
      )}

      {/* Order Tracking Modal */}
      {activeModal === 'tracking' && (
        <OrderTrackingModal
          initialOrderId={trackingOrderId}
          onClose={() => {
            setActiveModal(null);
            setTrackingOrderId(null);
          }}
        />
      )}

      {/* Shipping Rates Table Modal */}
      {activeModal === 'rates' && (
        <ShippingRatesModal onClose={() => setActiveModal(null)} />
      )}

      {/* Live Toast Notifications */}
      <ToastContainer />

    </div>
  );
}
