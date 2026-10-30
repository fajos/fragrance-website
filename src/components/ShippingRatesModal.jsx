import React, { useState } from 'react';
import { SHIPPING_RATES } from '../data/shippingRates';
import { formatNaira } from '../utils/formatters';
import { X, Search, Truck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ShippingRatesModal({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  const zones = ['All', 'South-West', 'South-East', 'South-South', 'North-Central', 'North-West', 'North-East'];

  const filteredRates = SHIPPING_RATES.filter(rate => {
    const matchesSearch = rate.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'All' || rate.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#12151c] border border-[#2b3547] rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#161a23] border-b border-[#232b3a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37] text-black font-bold flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Nationwide Shipping Rates</h2>
              <p className="text-[11px] text-gray-400">Official delivery rates across all 36 Nigerian States + FCT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#202735] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-gradient-to-r from-[#201a0e] via-[#332611] to-[#201a0e] p-3 px-6 border-b border-amber-900/40 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Free Delivery Promotion:</strong> All nationwide orders of <strong>₦150,000 and above</strong> qualify for 100% FREE shipping!</span>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 pb-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-7 relative">
              <input
                type="text"
                placeholder="Search state (e.g. Lagos, Rivers, Abuja, Kano)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#181d26] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Zone Filter */}
            <div className="sm:col-span-5">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-[#181d26] text-xs text-white p-2.5 rounded-xl border border-[#2c3647] focus:border-[#d4af37] focus:outline-none"
              >
                {zones.map(z => (
                  <option key={z} value={z}>{z === 'All' ? 'All Zones (Nigeria)' : `${z} Zone`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 pt-2 max-h-[60vh] overflow-y-auto">
          <div className="border border-[#232b3a] rounded-2xl overflow-hidden bg-[#151922]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c222e] text-gray-300 uppercase tracking-wider text-[10px] border-b border-[#242d3c]">
                <tr>
                  <th className="py-3 px-4">State / Location</th>
                  <th className="py-3 px-4">Geopolitical Zone</th>
                  <th className="py-3 px-4">Shipping Fee</th>
                  <th className="py-3 px-4">Estimated Transit</th>
                  <th className="py-3 px-4">Pay on Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2533] text-gray-300">
                {filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No matching state found for "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((rate) => (
                    <tr key={rate.state} className="hover:bg-[#1c222e]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {rate.state}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {rate.zone}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-300">
                        {formatNaira(rate.fee)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {rate.deliveryTime}
                      </td>
                      <td className="py-3 px-4">
                        {rate.codAvailable ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Available
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Prepaid Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Showing {filteredRates.length} of {SHIPPING_RATES.length} states</span>
            <span className="text-gray-400">Dispatches via GIG Logistics, DHL, and local Lagos express couriers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
