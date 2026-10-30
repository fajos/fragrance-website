import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Code-split routes for maximum storefront performance
const StorefrontPage = lazy(() => import('./pages/StorefrontPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      <span className="font-serif text-xs tracking-widest text-[#d4af37] uppercase">Loading Fragrances...</span>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. Customer Storefront Route */}
        <Route path="/" element={<StorefrontPage />} />

        {/* 2. Dedicated Secured Admin Portal Route */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
