import React, { createContext, useContext, useState, useEffect } from 'react';
import { SHIPPING_RATES } from '../data/shippingRates';

const CartContext = createContext();

const FREE_SHIPPING_THRESHOLD = 150000; // ₦150,000 for free delivery

export function CartProvider({ children }) {
  // 1. Cart Items with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fragrances_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 2. Wishlist with localStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('fragrances_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 3. Orders history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('fragrances_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'FRAG-2026-84920',
          createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
          customer: {
            name: 'Emeka Adeleke',
            email: 'emeka.adeleke@example.com',
            phone: '+234 803 456 7890',
            state: 'Lagos',
            city: 'Lekki Phase 1',
            address: 'Plot 14, Admiralty Way'
          },
          items: [
            {
              id: 1,
              name: 'Arabiyat Prestige Noire Absolu EDP 100ml',
              price: 44999,
              quantity: 1,
              image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_prestige_noire_absolu_edp_100ml.jpeg'
            }
          ],
          subtotal: 44999,
          shippingFee: 2500,
          discount: 0,
          total: 47499,
          paymentMethod: 'paystack',
          paymentStatus: 'Paid',
          status: 'Shipped',
          trackingNumber: 'GIG-LOS-992384'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // 4. Selected Shipping State (Default to Lagos)
  const [selectedState, setSelectedState] = useState(() => {
    return SHIPPING_RATES.find(s => s.state === 'Lagos') || SHIPPING_RATES[0];
  });

  // 5. Applied Coupon
  const [coupon, setCoupon] = useState(null);

  // 6. UI Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'checkout', 'tracking', 'rates', 'admin'
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fragrances_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fragrances_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('fragrances_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prev, {
          id: product.id,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          price: product.price,
          formattedPrice: product.formattedPrice,
          image: product.image,
          volume: product.volume,
          concentration: product.concentration,
          quantity
        }];
      }
    });
    addToast(`Added "${product.name}" to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        addToast('Removed from your wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping logic
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : selectedState.fee);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Coupon handling
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10') {
      const discountVal = Math.round(subtotal * 0.1);
      setCoupon({ code: cleanCode, type: 'percent', value: 10, amount: discountVal });
      addToast('Promo code applied: 10% discount!');
      return { success: true };
    } else if (cleanCode === 'FRAGVIP') {
      const discountVal = 15000;
      setCoupon({ code: cleanCode, type: 'fixed', value: 15000, amount: discountVal });
      addToast('VIP Promo applied: ₦15,000 off!');
      return { success: true };
    } else {
      addToast('Invalid coupon code. Try WELCOME10', 'error');
      return { success: false, message: 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed', 'info');
  };

  const discountAmount = coupon ? (coupon.type === 'percent' ? Math.round(subtotal * 0.1) : coupon.value) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  // Order Placement
  const createOrder = (orderData) => {
    const newOrder = {
      id: orderData.id,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: [...cart],
      subtotal,
      shippingFee,
      discount: discountAmount,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'Pending (Pay on Delivery)' : 'Paid',
      status: 'Processing',
      trackingNumber: `FRAG-NIG-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addToast(`Order ${orderId} updated to ${newStatus}`);
  };

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      orders,
      cartCount,
      subtotal,
      shippingFee,
      total,
      discountAmount,
      isFreeShipping,
      freeShippingProgress,
      amountNeededForFreeShipping,
      FREE_SHIPPING_THRESHOLD,
      selectedState,
      setSelectedState,
      coupon,
      applyCoupon,
      removeCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      isCartOpen,
      setIsCartOpen,
      activeModal,
      setActiveModal,
      quickViewProduct,
      setQuickViewProduct,
      toasts,
      addToast,
      removeToast,
      createOrder,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
