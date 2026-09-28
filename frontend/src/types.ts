export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Women\'s Fashion' | 'Men\'s Fashion' | 'Footwear' | 'Accessories';
  gender: 'women' | 'men' | 'unisex';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  material: string;
  fit: string;
  features: string[];
  careInstructions: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderAmount?: number;
  description: string;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash on Delivery';
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberStatus: string;
  savedAddresses: Address[];
}

export interface FilterState {
  category: string;
  gender: string;
  size: string;
  color: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  onSaleOnly: boolean;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery: string;
}
