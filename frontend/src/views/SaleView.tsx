import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Flame, Tag } from 'lucide-react';

export const SaleView: React.FC = () => {
  const { products } = useShop();

  const saleProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Sale Hero Banner */}
      <div className="relative bg-[#111111] text-[#FAF9F6] border border-neutral-800 rounded-3xl p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-900/30 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-700 text-white text-xs font-bold uppercase tracking-widest shadow-md">
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>SEASON END PRIVILEGE SALE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif-brand font-bold tracking-tight uppercase leading-none">
            UP TO 50% OFF
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-md mx-auto leading-relaxed">
            Exclusive markdown prices on handcrafted linen shirts, tailored blazers, cargo trousers & genuine leather footwear.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            <span>Use Coupon Code VERA10 at checkout for EXTRA 10% OFF</span>
          </div>
        </div>
      </div>

      {/* Sale Grid Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D8]">
        <div>
          <h2 className="text-2xl font-serif-brand font-bold text-black">Discounted Steals</h2>
          <p className="text-xs text-gray-500">Showing {saleProducts.length} items on sale</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {saleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
