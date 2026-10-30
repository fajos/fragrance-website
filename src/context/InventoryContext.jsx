import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  // Load products from localStorage or fall back to PRODUCTS
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('fragrances_inventory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load inventory from storage:', e);
    }
    return PRODUCTS;
  });

  // Sync products changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fragrances_inventory', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save inventory to storage:', e);
    }
  }, [products]);

  // 1. Add New Product
  const addProduct = (productData) => {
    const id = Date.now();
    const sku = productData.sku || `FRAG-${Math.floor(1000 + Math.random() * 9000)}`;
    const numPrice = parseInt(productData.price, 10) || 45000;
    const origPrice = productData.originalPrice ? parseInt(productData.originalPrice, 10) : null;
    const stockCount = parseInt(productData.stockCount, 10) || 10;

    const newProduct = {
      id,
      sku,
      name: productData.name.trim(),
      brand: productData.brand.trim() || 'Designer',
      price: numPrice,
      originalPrice: origPrice,
      formattedPrice: `₦${numPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      image: productData.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
      category: productData.category || 'All Perfumes',
      gender: productData.gender || 'Unisex',
      concentration: productData.concentration || 'Eau de Parfum (EDP)',
      volume: productData.volume || '100ml',
      inStock: stockCount > 0,
      stockCount: stockCount,
      rating: 4.8,
      reviewsCount: 1,
      family: productData.family || 'Woody & Aromatic',
      notes: {
        top: Array.isArray(productData.topNotes) ? productData.topNotes : (productData.topNotes ? productData.topNotes.split(',').map(s => s.trim()) : ['Bergamot', 'Citrus']),
        heart: Array.isArray(productData.heartNotes) ? productData.heartNotes : (productData.heartNotes ? productData.heartNotes.split(',').map(s => s.trim()) : ['Rose', 'Patchouli']),
        base: Array.isArray(productData.baseNotes) ? productData.baseNotes : (productData.baseNotes ? productData.baseNotes.split(',').map(s => s.trim()) : ['Amber', 'Cedarwood'])
      },
      description: productData.description || `Exquisite authentic fragrance by ${productData.brand || 'House of Perfume'}. Guaranteed 100% genuine original bottle with fast Lagos and nationwide dispatch.`,
      isNiche: numPrice >= 200000 || /creed|tom ford|crivelli|memo/i.test(productData.brand),
      isBudget: numPrice <= 50000,
      isBestseller: Boolean(productData.isBestseller),
      isNewArrival: true,
      isFeatured: Boolean(productData.isFeatured)
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  // 2. Update Product
  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const numPrice = updatedFields.price !== undefined ? parseInt(updatedFields.price, 10) : p.price;
        const stockCount = updatedFields.stockCount !== undefined ? parseInt(updatedFields.stockCount, 10) : p.stockCount;
        
        return {
          ...p,
          ...updatedFields,
          price: numPrice,
          formattedPrice: `₦${numPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
          stockCount,
          inStock: stockCount > 0 && (updatedFields.inStock !== undefined ? updatedFields.inStock : true),
          notes: {
            top: updatedFields.topNotes ? (Array.isArray(updatedFields.topNotes) ? updatedFields.topNotes : updatedFields.topNotes.split(',').map(s => s.trim())) : p.notes.top,
            heart: updatedFields.heartNotes ? (Array.isArray(updatedFields.heartNotes) ? updatedFields.heartNotes : updatedFields.heartNotes.split(',').map(s => s.trim())) : p.notes.heart,
            base: updatedFields.baseNotes ? (Array.isArray(updatedFields.baseNotes) ? updatedFields.baseNotes : updatedFields.baseNotes.split(',').map(s => s.trim())) : p.notes.base,
          }
        };
      }
      return p;
    }));
  };

  // 3. Delete Product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 4. Quick Stock Quantity Stepper
  const updateStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newCount = Math.max(0, p.stockCount + delta);
        return {
          ...p,
          stockCount: newCount,
          inStock: newCount > 0
        };
      }
      return p;
    }));
  };

  // 5. Toggle inStock
  const toggleStockStatus = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.inStock;
        return {
          ...p,
          inStock: newStatus,
          stockCount: newStatus && p.stockCount === 0 ? 5 : p.stockCount
        };
      }
      return p;
    }));
  };

  // 6. Reset Catalog to Default
  const resetToDefaultCatalog = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('fragrances_inventory');
  };

  return (
    <InventoryContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      toggleStockStatus,
      resetToDefaultCatalog
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
