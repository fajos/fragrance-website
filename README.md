# Thermronnie Scent - Modern Luxury E-Commerce Platform

A high-performance, luxury e-commerce web application inspired by and reverse-engineered from [fragrances.com.ng](https://fragrances.com.ng/) — Nigeria's premier online perfume retailer.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Key Features & Nigerian Localization

1. **Seeded Authentic Catalog (116+ Real Perfumes):**
   - Extracted directly from live categories on `fragrances.com.ng`:
     - **Niche Exclusives:** Creed Aventus, Tom Ford Lost Cherry, Maison Crivelli Musc Nurasana, Memo Paris.
     - **Designer Fragrances:** Dior Sauvage, Lancôme Trésor, Jean Paul Gaultier Le Beau, Hermès Twilly, MontBlanc Explorer.
     - **Arabian & Oriental Oud:** Lattafa, Ard Al Zaafaran, Ahmed Al Maghribi, Arabiyat Prestige, Fa Paris.
     - **Budget-Friendly Luxury:** Perfumes under ₦50,000 (Atralia, Zuofon, AMD, etc.).
   - Full olfactory notes pyramid (Top, Heart, Base notes), longevity ratings, and concentration badges (EDP, EDT, Extrait de Parfum, Cologne).

2. **Geo-Tiered Nigerian Shipping Engine (All 36 States + FCT):**
   - Authentic delivery rate matrix extracted from `https://fragrances.com.ng/delivery-information/`:
     - **Lagos:** ₦2,500 (Same-Day / 24h Express)
     - **Abuja (FCT):** ₦2,500 (1 - 2 Business Days)
     - **South-West & South-East:** ₦6,000 (2 - 3 Days)
     - **South-South & North-Central:** ₦6,500 - ₦7,500 (2 - 4 Days)
     - **Far North (Borno, Adamawa, Gombe, Jigawa, etc.):** ₦9,000 (3 - 5 Days)
   - **Free Shipping Incentive:** Interactive progress bar toward the ₦150,000 threshold for free nationwide delivery.

3. **Omnichannel Ordering (Web + Direct WhatsApp Desk):**
   - **1-Click WhatsApp Ordering:** Direct integration with WhatsApp (+234 816 281 0945) with pre-filled message including product name, SKU, and price in ₦.
   - **Streamlined Single-Page Checkout:**
     - Contact details & Nigerian phone formatting.
     - State-based automatic delivery fee calculator.
     - Payment Gateways:
       1. **Paystack / Debit Card** (Visa, Mastercard, Verve).
       2. **Direct Bank Transfer** (Guaranty Trust Bank corporate account simulation with reference code).
       3. **Cash on Delivery (COD)** (Enabled for Lagos & Abuja).

4. **Order Confirmation & Live Order Tracking:**
   - Instant order generation with printable receipt and confetti celebration.
   - Interactive live delivery status tracker (`/track`):
     - `Order Verified` ➔ `Processing in Lagos Hub` ➔ `In Transit with GIG / DHL` ➔ `Out for Delivery` ➔ `Delivered`.

5. **Dedicated Secured Admin & Inventory Management Route (`/admin`):**
   - **Route Isolation:** The Admin workspace is completely removed from the public storefront and isolated under the dedicated `/admin` route with PIN authorization (Default PIN: `1234`).
   - **Full Inventory Control:**
     - **Add New Fragrance:** Title, brand, price in ₦, volume, concentration, scent family, top/heart/base notes, stock count, image URL, and description.
     - **Edit Existing Perfume:** Edit pricing, description, scent pyramid, or title.
     - **Interactive Stock Stepper:** Increase/decrease stock count with 1 click `[-] 10 [+]`.
     - **Live Stock Toggles:** Instant toggle between In Stock, Low Stock, and Out of Stock.
     - **Delete & Catalog Reset:** Remove discontinued items or reset to default authentic catalog.
     - **Real-Time Storefront Sync:** All inventory changes immediately sync to the customer storefront via `InventoryContext` and `localStorage`.
   - **Customer Orders Fulfillment:** Live status transition (Processing ➔ Shipped ➔ Out for Delivery ➔ Delivered) and customer delivery addresses.

6. **Customer Service & Policies:**
   - Interactive modal of all 36 state shipping rates with zone filters.
   - 5-Day return policy and authenticity guarantee.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Installation
```bash
cd "C:\Users\saintsbuilder\Documents\Projects\fragrance-website"
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
- Customer Storefront: [http://localhost:5173/](http://localhost:5173/)
- Admin & Inventory Portal: [http://localhost:5173/admin](http://localhost:5173/admin) *(Default PIN: `1234`)*

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
fragrance-website/
├── src/
│   ├── pages/
│   │   ├── StorefrontPage.jsx         # Public customer storefront
│   │   └── AdminPage.jsx              # Dedicated PIN-secured admin & inventory system
│   ├── components/
│   │   ├── Header.jsx                 # Public customer header (search, categories, cart)
│   │   ├── HeroBanner.jsx             # Luxury hero showcase with trust pillars
│   │   ├── ProductCard.jsx            # Perfume card with quick buy & WhatsApp direct order
│   │   ├── ProductDetailModal.jsx     # Olfactory notes pyramid, specs, quantity
│   │   ├── CartDrawer.jsx             # Slide-over cart, free shipping bar, state rate estimator
│   │   ├── CheckoutModal.jsx          # Single-page checkout (Paystack, Bank Transfer, COD)
│   │   ├── OrderConfirmationModal.jsx # Printable receipt with tracking code
│   │   ├── OrderTrackingModal.jsx     # Live shipment timeline tracker
│   │   ├── ShippingRatesModal.jsx     # 36 states interactive delivery table
│   │   ├── ToastContainer.jsx         # Non-blocking feedback notifications
│   │   └── Footer.jsx                 # Newsletter, contacts, policies, discreet staff link
│   ├── context/
│   │   ├── InventoryContext.jsx       # Dynamic inventory (Add, Edit, Delete, Stock, Storage)
│   │   └── CartContext.jsx            # Cart, wishlist, orders, shipping rates & storage
│   ├── data/
│   │   ├── products.js                # 116+ authentic scraped fragrances
│   │   └── shippingRates.js           # 36 Nigerian states shipping table
│   ├── utils/
│   │   └── formatters.js              # Currency (₦ NGN) and date utilities
│   ├── App.jsx                        # Client-side router (/ and /admin)
│   ├── index.css                      # Tailwind v4 configuration and custom scrollbars
│   └── main.jsx                       # Entry point with BrowserRouter & Providers
├── index.html                         # Cormorant Garamond & Plus Jakarta Sans typography
├── vite.config.js                     # Vite + Tailwind v4 + React configuration
├── package.json
└── README.md
```

---

## 💡 Promotion & Test Coupons

- `WELCOME10`: 10% discount on order subtotal.
- `FRAGVIP`: ₦15,000 flat discount for VIP orders.
