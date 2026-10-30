import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { formatNaira, formatDate } from '../utils/formatters';
import { SHIPPING_RATES } from '../data/shippingRates';
import { 
  Plus, Edit, Trash2, Search, ArrowLeft, ShieldCheck, 
  Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle2, X, Lock, Key, RefreshCw, Eye, Sparkles, SlidersHorizontal 
} from 'lucide-react';

export default function AdminPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock, 
    toggleStockStatus, 
    resetToDefaultCatalog 
  } = useInventory();

  const { orders, updateOrderStatus, addToast } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('fragrances_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Tab: 'inventory', 'orders', 'analytics', 'shipping'
  const [activeTab, setActiveTab] = useState('inventory');

  // Inventory Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all'); // 'all', 'inStock', 'lowStock', 'outOfStock'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Modals for Adding / Editing Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Authentication Handler (Default PIN: 1234 or perfume2026)
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.toLowerCase() === 'perfume2026' || pinInput.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('fragrances_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid access key. Use default PIN: 1234');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fragrances_admin_auth');
  };

  // Inventory Filtering Logic
  const filteredInventory = products.filter(item => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchSku = item.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSku) return false;
    }

    // Stock Filter
    if (selectedStockFilter === 'inStock' && (!item.inStock || item.stockCount === 0)) return false;
    if (selectedStockFilter === 'lowStock' && (item.stockCount > 5 || item.stockCount === 0)) return false;
    if (selectedStockFilter === 'outOfStock' && (item.inStock && item.stockCount > 0)) return false;

    // Category Filter
    if (selectedCategoryFilter !== 'all') {
      if (selectedCategoryFilter === 'Niche' && !item.isNiche) return false;
      if (selectedCategoryFilter === 'Men' && item.gender !== 'Men') return false;
      if (selectedCategoryFilter === 'Women' && item.gender !== 'Women') return false;
      if (selectedCategoryFilter === 'Under50k' && item.price > 50000) return false;
    }

    return true;
  });

  // Inventory Stats
  const totalItemsCount = products.length;
  const inStockCount = products.filter(p => p.inStock && p.stockCount > 0).length;
  const lowStockCount = products.filter(p => p.stockCount > 0 && p.stockCount <= 5).length;
  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount === 0).length;

  // Financial Stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalOrders = orders.length;

  // 1. PIN LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090b0e] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#12151c] border border-[#263042] rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8c6906] flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
            <Lock className="w-8 h-8 text-black" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white">Thermronnie Scent Administration</h1>
            <p className="text-xs text-gray-400 mt-1">
              Restricted portal for managing fragrances catalog, stock, and orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Admin Access Key (PIN: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-[#181d26] text-sm text-center tracking-widest text-white px-4 py-3 rounded-xl border border-[#2d374a] focus:border-[#d4af37] focus:outline-none"
                  autoFocus
                />
                <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
              {pinError && (
                <div className="text-xs text-rose-400 mt-2 font-medium">{pinError}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="pt-4 border-t border-[#1e2533] flex items-center justify-between text-xs text-gray-500">
            <span>Default PIN: <strong className="text-amber-400">1234</strong></span>
            <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN PORTAL
  return (
    <div className="min-h-screen bg-[#0c0e12] text-gray-200 flex flex-col">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#12151c]/95 backdrop-blur-md border-b border-[#212735] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b212c] hover:bg-[#252e3d] text-gray-300 hover:text-white text-xs font-semibold border border-[#2c3749] transition-all"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to Storefront</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-serif font-bold text-lg flex items-center justify-center">
                T
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wider">
                  THERMRONNIE <span className="text-[#d4af37]">SCENT</span>
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  Admin Workspace
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset catalog to the authentic 116 seeded perfumes from Thermronnie Scent? Any custom edits will be reverted.')) {
                  resetToDefaultCatalog();
                  addToast('Inventory reset to authentic default catalog');
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a202b] hover:bg-[#222b3a] text-gray-400 hover:text-gray-200 text-xs border border-[#2a3445] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default Catalog</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs font-semibold transition-all"
            >
              Lock / Exit
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Top Summary Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#232b3a] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Total Fragrances</div>
              <div className="text-2xl font-bold text-white font-serif mt-1">{totalItemsCount}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{inStockCount} active in stock</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1b222e] flex items-center justify-center text-[#d4af37]">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#232b3a] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Total Revenue</div>
              <div className="text-2xl font-bold text-amber-300 font-serif mt-1">{formatNaira(totalRevenue)}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">{totalOrders} orders recorded</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1b222e] flex items-center justify-center text-amber-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#232b3a] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Low Stock Alert</div>
              <div className="text-2xl font-bold text-amber-400 font-serif mt-1">{lowStockCount}</div>
              <div className="text-[10px] text-amber-300 mt-0.5">Under 5 bottles remaining</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#232b3a] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Out of Stock</div>
              <div className="text-2xl font-bold text-rose-400 font-serif mt-1">{outOfStockCount}</div>
              <div className="text-[10px] text-rose-300 mt-0.5">Need warehouse restock</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-950/40 flex items-center justify-center text-rose-400">
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[#212735] pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-amber-950/30'
                : 'text-gray-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Fragrance Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-amber-950/30'
                : 'text-gray-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-[#d4af37] text-black shadow-lg shadow-amber-950/30'
                : 'text-gray-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>36 States Delivery Matrix</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: INVENTORY MANAGEMENT                                  */}
        {/* ============================================================ */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Action Bar: Search, Filters, Add Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#131720] p-4 rounded-2xl border border-[#232b3a]">
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Search by perfume name, brand, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#181d26] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                </div>

                {/* Stock Filter */}
                <select
                  value={selectedStockFilter}
                  onChange={(e) => setSelectedStockFilter(e.target.value)}
                  className="bg-[#181d26] text-xs text-white py-2 px-3 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="inStock">In Stock</option>
                  <option value="lowStock">Low Stock (≤ 5)</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#181d26] text-xs text-white py-2 px-3 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Niche">Niche Exclusives</option>
                  <option value="Men">Men's Perfumes</option>
                  <option value="Women">Women's Perfumes</option>
                  <option value="Under50k">Under ₦50k</option>
                </select>
              </div>

              {/* Add New Fragrance CTA */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fragrance</span>
              </button>

            </div>

            {/* Inventory Table */}
            <div className="border border-[#232b3a] rounded-2xl overflow-hidden bg-[#131720]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181d26] text-gray-300 uppercase tracking-wider text-[10px] border-b border-[#242d3c]">
                    <tr>
                      <th className="py-3 px-4">Fragrance & SKU</th>
                      <th className="py-3 px-4">Brand & Category</th>
                      <th className="py-3 px-4">Price (NGN)</th>
                      <th className="py-3 px-4">Stock Count</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2533] text-gray-300">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          No fragrances found matching your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-[#181d26]/60 transition-colors">
                          
                          {/* Item Info */}
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 shrink-0 border border-[#232b3a]"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=100&q=80'; }}
                            />
                            <div className="min-w-0 max-w-xs">
                              <div className="font-semibold text-white truncate" title={item.name}>
                                {item.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                SKU: {item.sku} • {item.volume} • {item.concentration}
                              </div>
                            </div>
                          </td>

                          {/* Brand & Category */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-amber-300">{item.brand}</div>
                            <div className="text-[11px] text-gray-400">{item.gender} • {item.family}</div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white font-serif text-sm">
                              {item.formattedPrice}
                            </div>
                            {item.originalPrice && (
                              <div className="text-[10px] text-gray-500 line-through">
                                {formatNaira(item.originalPrice)}
                              </div>
                            )}
                          </td>

                          {/* Stock Stepper */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateStock(item.id, -1)}
                                className="w-6 h-6 rounded bg-[#1f2633] hover:bg-[#2c3647] text-gray-300 hover:text-white flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold min-w-[2.5rem] text-center ${
                                item.stockCount === 0 ? 'bg-rose-950 text-rose-400' :
                                item.stockCount <= 5 ? 'bg-amber-950 text-amber-300' :
                                'bg-[#181d26] text-white'
                              }`}>
                                {item.stockCount}
                              </span>
                              <button
                                onClick={() => updateStock(item.id, 1)}
                                className="w-6 h-6 rounded bg-[#1f2633] hover:bg-[#2c3647] text-gray-300 hover:text-white flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Status Toggle Badge */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleStockStatus(item.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                item.inStock && item.stockCount > 5
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/60'
                                  : item.inStock && item.stockCount <= 5
                                  ? 'bg-amber-950 text-amber-300 border-amber-800/40 hover:bg-amber-900/60'
                                  : 'bg-rose-950 text-rose-400 border-rose-800/40 hover:bg-rose-900/60'
                              }`}
                              title="Click to toggle stock status"
                            >
                              {item.inStock && item.stockCount > 5 ? 'In Stock' :
                               item.inStock && item.stockCount <= 5 ? 'Low Stock' :
                               'Out of Stock'}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(item)}
                                className="p-1.5 rounded-lg bg-[#1e2533] hover:bg-[#2a3447] text-gray-300 hover:text-white transition-all"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${item.name}" from the inventory?`)) {
                                    deleteProduct(item.id);
                                    addToast(`Deleted "${item.name}"`, 'info');
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-all"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 flex items-center justify-between px-2">
              <span>Showing {filteredInventory.length} of {products.length} fragrances</span>
              <span>All inventory edits immediately sync to the customer storefront</span>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CUSTOMER ORDERS                                       */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="border border-[#232b3a] rounded-2xl overflow-hidden bg-[#131720]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181d26] text-gray-300 uppercase tracking-wider text-[10px] border-b border-[#242d3c]">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Delivery Location</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2533] text-gray-300">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500">
                          No customer orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-[#181d26]/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-amber-300 font-mono">{order.id}</div>
                            <div className="text-[10px] text-gray-500">{formatDate(order.createdAt)}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{order.customer.name}</div>
                            <div className="text-[11px] text-gray-400">{order.customer.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div>{order.customer.city}</div>
                            <div className="text-[11px] text-gray-400">{order.customer.state}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {formatNaira(order.total)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-[#181d26] text-xs text-amber-300 font-medium py-1 px-2.5 rounded-lg border border-[#2b3547] focus:outline-none focus:border-[#d4af37]"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: 36 STATES SHIPPING MATRIX                             */}
        {/* ============================================================ */}
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <div className="border border-[#232b3a] rounded-2xl overflow-hidden bg-[#131720]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181d26] text-gray-300 uppercase tracking-wider text-[10px] border-b border-[#242d3c]">
                    <tr>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Geopolitical Zone</th>
                      <th className="py-3 px-4">Standard Delivery Rate</th>
                      <th className="py-3 px-4">Transit Time</th>
                      <th className="py-3 px-4">Pay on Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2533] text-gray-300">
                    {SHIPPING_RATES.map(rate => (
                      <tr key={rate.state} className="hover:bg-[#181d26]/60">
                        <td className="py-3 px-4 font-semibold text-white">{rate.state}</td>
                        <td className="py-3 px-4 text-gray-400">{rate.zone}</td>
                        <td className="py-3 px-4 font-bold text-amber-300">{formatNaira(rate.fee)}</td>
                        <td className="py-3 px-4 text-gray-300">{rate.deliveryTime}</td>
                        <td className="py-3 px-4">
                          {rate.codAvailable ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                            </span>
                          ) : (
                            <span className="text-gray-500">Prepaid only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* MODAL: ADD NEW PRODUCT                                       */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <ProductFormModal
          title="Add New Fragrance to Inventory"
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(newProductData) => {
            const created = addProduct(newProductData);
            addToast(`Successfully added "${created.name}" to inventory!`);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT PRODUCT                                          */}
      {/* ============================================================ */}
      {editingProduct && (
        <ProductFormModal
          title={`Edit Fragrance: ${editingProduct.name}`}
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(updatedFields) => {
            updateProduct(editingProduct.id, updatedFields);
            addToast(`Updated "${editingProduct.name}"!`);
            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
}

// Subcomponent: Add / Edit Product Form Modal
function ProductFormModal({ title, initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand: initialData?.brand || 'Dior',
    price: initialData?.price || 49999,
    originalPrice: initialData?.originalPrice || '',
    stockCount: initialData?.stockCount !== undefined ? initialData.stockCount : 10,
    concentration: initialData?.concentration || 'Eau de Parfum (EDP)',
    volume: initialData?.volume || '100ml',
    gender: initialData?.gender || 'Unisex',
    family: initialData?.family || 'Woody & Aromatic',
    topNotes: initialData?.notes?.top?.join(', ') || 'Bergamot, Pink Pepper',
    heartNotes: initialData?.notes?.heart?.join(', ') || 'Lavender, Patchouli',
    baseNotes: initialData?.notes?.base?.join(', ') || 'Cedarwood, Ambergris',
    image: initialData?.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
    description: initialData?.description || '',
    isFeatured: Boolean(initialData?.isFeatured),
    isBestseller: Boolean(initialData?.isBestseller)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Please provide at least a perfume title and price.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#12151c] border border-[#2b3547] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-[#161a23] border-b border-[#232b3a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#202735]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Fragrance Title *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Creed Aventus Absolu 100ml"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Brand / Fragrance House *
              </label>
              <input
                type="text"
                name="brand"
                required
                placeholder="e.g. Creed, Tom Ford, Dior, Lattafa"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Price in Nigerian Naira (₦) *
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="e.g. 85000"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Regular / Compare Price (₦)
              </label>
              <input
                type="number"
                name="originalPrice"
                placeholder="Optional strike-through price"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Warehouse Stock Count *
              </label>
              <input
                type="number"
                name="stockCount"
                required
                min="0"
                value={formData.stockCount}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Concentration
              </label>
              <select
                name="concentration"
                value={formData.concentration}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                <option value="Extrait De Parfum">Extrait De Parfum</option>
                <option value="Pure Parfum">Pure Parfum</option>
                <option value="Eau de Cologne">Eau de Cologne</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Volume
              </label>
              <input
                type="text"
                name="volume"
                placeholder="e.g. 100ml, 50ml, 125ml"
                value={formData.volume}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Target Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Scent Family
              </label>
              <input
                type="text"
                name="family"
                placeholder="e.g. Amber & Oriental Oud, Woody & Fresh"
                value={formData.family}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Top Notes (comma-separated)
              </label>
              <input
                type="text"
                name="topNotes"
                value={formData.topNotes}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Heart Notes (comma-separated)
              </label>
              <input
                type="text"
                name="heartNotes"
                value={formData.heartNotes}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Base Notes (comma-separated)
              </label>
              <input
                type="text"
                name="baseNotes"
                value={formData.baseNotes}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#181d26] text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                />
                <span className="text-gray-300">Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleChange}
                  className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                />
                <span className="text-gray-300">Mark as Best Seller</span>
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-[#232b3a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1b212c] text-gray-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f3e5ab] transition-all shadow-md"
            >
              Save Fragrance
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
