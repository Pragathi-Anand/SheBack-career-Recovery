import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Order, UserProfile, FilterState, Coupon, ProductColor, Address } from '../types';
import { PRODUCTS, VALID_COUPONS } from '../data/products';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  activeTab: string;
  selectedProductId: string | null;
  quickViewProduct: Product | null;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  appliedCoupon: Coupon | null;
  orders: Order[];
  user: UserProfile;
  filters: FilterState;
  toasts: Toast[];
  
  // Actions
  navigateTo: (tab: string, productId?: string) => void;
  addToCart: (product: Product, color?: ProductColor, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, colorName: string, size: string) => void;
  updateCartQuantity: (productId: string, colorName: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (address: Address, paymentMethod: Order['paymentMethod']) => Order;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  gender: 'All',
  size: 'All',
  color: 'All',
  minPrice: 0,
  maxPrice: 10000,
  rating: 0,
  onSaleOnly: false,
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: ''
};

const initialUser: UserProfile = {
  name: 'Ananya Sharma',
  email: 'ananya.s@example.com',
  phone: '+91 98765 43210',
  memberStatus: 'VÉRA VIP Circle',
  savedAddresses: [
    {
      fullName: 'Ananya Sharma',
      email: 'ananya.s@example.com',
      phone: '+91 98765 43210',
      street: 'Flat 402, Royale Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    }
  ]
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vera_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vera_wishlist');
      return saved ? JSON.parse(saved) : ['vera-001', 'vera-009', 'vera-013'];
    } catch {
      return ['vera-001', 'vera-009', 'vera-013'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vera_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      {
        id: 'VERA-98231',
        date: '2026-09-15',
        items: [
          {
            product: PRODUCTS[0],
            selectedColor: PRODUCTS[0].colors[0],
            selectedSize: 'M',
            quantity: 1
          },
          {
            product: PRODUCTS[12],
            selectedColor: PRODUCTS[12].colors[0],
            selectedSize: 'One Size',
            quantity: 1
          }
        ],
        subtotal: 4998,
        discount: 499,
        shipping: 0,
        total: 4499,
        address: initialUser.savedAddresses[0],
        paymentMethod: 'UPI',
        status: 'Delivered',
        trackingNumber: 'VR-TRACK-99120',
        estimatedDelivery: '18 Sep 2026'
      }
    ];
  });

  const getRouteFromPath = (path: string) => {
    const cleanPath = path.toLowerCase();
    if (cleanPath === '/women') return { tab: 'women', productId: null, gender: 'Women' as const };
    if (cleanPath === '/men') return { tab: 'men', productId: null, gender: 'Men' as const };
    if (cleanPath === '/new-arrivals') return { tab: 'catalog', productId: null, sortBy: 'newest' as const };
    if (cleanPath === '/sale') return { tab: 'sale', productId: null };
    if (cleanPath === '/cart') return { tab: 'cart', productId: null };
    if (cleanPath === '/wishlist') return { tab: 'wishlist', productId: null };
    if (cleanPath === '/checkout') return { tab: 'checkout', productId: null };
    if (cleanPath === '/about') return { tab: 'about', productId: null };
    if (cleanPath === '/contact') return { tab: 'contact', productId: null };
    if (cleanPath.startsWith('/product/')) {
      const parts = path.split('/product/');
      const id = parts[1]?.split('/')[0] || null;
      return { tab: 'product-detail', productId: id };
    }
    return { tab: 'home', productId: null };
  };

  const getPathFromRoute = (tab: string, productId?: string | null) => {
    if (tab === 'women') return '/women';
    if (tab === 'men') return '/men';
    if (tab === 'new-arrivals') return '/new-arrivals';
    if (tab === 'sale') return '/sale';
    if (tab === 'cart') return '/cart';
    if (tab === 'wishlist') return '/wishlist';
    if (tab === 'checkout') return '/checkout';
    if (tab === 'about') return '/about';
    if (tab === 'contact') return '/contact';
    if (tab === 'product-detail' && productId) return `/product/${productId}`;
    if (tab === 'catalog' || tab === 'collections') return '/catalog';
    return '/';
  };

  const initialRoute = getRouteFromPath(typeof window !== 'undefined' ? window.location.pathname : '/');

  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('vera_user');
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const [filters, setFilters] = useState<FilterState>(() => {
    const base = { ...defaultFilters };
    if (initialRoute.gender) base.gender = initialRoute.gender;
    if (initialRoute.sortBy) base.sortBy = initialRoute.sortBy;
    return base;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromPath(window.location.pathname);
      setActiveTab(route.tab);
      if (route.productId) setSelectedProductId(route.productId);
      if (route.gender) setFilters((prev) => ({ ...prev, gender: route.gender }));
      if (route.sortBy) setFilters((prev) => ({ ...prev, sortBy: route.sortBy }));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem('vera_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vera_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('vera_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vera_user', JSON.stringify(user));
  }, [user]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (tab: string, productId?: string) => {
    setActiveTab(tab);
    if (productId) {
      setSelectedProductId(productId);
    }
    const newPath = getPathFromRoute(tab, productId || (tab === 'product-detail' ? selectedProductId : null));
    if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
      window.history.pushState({ tab, productId }, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    product: Product,
    color?: ProductColor,
    size?: string,
    quantity: number = 1
  ) => {
    const chosenColor = color || product.colors[0];
    const chosenSize = size || product.sizes[0];

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === chosenColor.name &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            quantity
          }
        ];
      }
    });

    addToast(`Added "${product.name}" to your bag`, 'success');
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, colorName: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor.name === colorName &&
            item.selectedSize === size
          )
      )
    );
    addToast('Item removed from shopping bag', 'info');
  };

  const updateCartQuantity = (
    productId: string,
    colorName: string,
    size: string,
    qty: number
  ) => {
    if (qty <= 0) {
      removeFromCart(productId, colorName, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor.name === colorName &&
          item.selectedSize === size
        ) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addToast(`Removed "${product?.name || 'Item'}" from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(`Saved "${product?.name || 'Item'}" to wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const applyCoupon = (code: string) => {
    const found = VALID_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Coupon requires minimum order of ₹${found.minOrderAmount}`
      };
    }

    setAppliedCoupon(found);
    addToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed', 'info');
  };

  const placeOrder = (address: Address, paymentMethod: Order['paymentMethod']): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountPercent) {
        discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      } else if (appliedCoupon.flatDiscount) {
        discount = appliedCoupon.flatDiscount;
      }
    }

    const shipping = subtotal >= 999 ? 0 : 99;
    const total = Math.max(0, subtotal - discount + shipping);

    const newOrder: Order = {
      id: `VERA-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      address,
      paymentMethod,
      status: 'Processing',
      trackingNumber: `VR-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-IN',
        { day: 'numeric', month: 'short', year: 'numeric' }
      )
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
    addToast('Profile updated successfully', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        activeTab,
        selectedProductId,
        quickViewProduct,
        isCartDrawerOpen,
        isSearchOpen,
        appliedCoupon,
        orders,
        user,
        filters,
        toasts,
        navigateTo,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        openQuickView,
        closeQuickView,
        setIsCartDrawerOpen,
        setIsSearchOpen,
        applyCoupon,
        removeCoupon,
        placeOrder,
        setFilter,
        resetFilters,
        addToast,
        removeToast,
        updateUserProfile
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
