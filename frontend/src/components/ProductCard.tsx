import React from 'react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isWishlisted, openQuickView } = useShop();
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
      {/* Image Container with Badges & Actions */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EC] cursor-pointer" onClick={() => navigateTo('product-detail', product.id)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Alternate hover image preview if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternative angle`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-black text-white rounded-full shadow-sm">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-rose-700 text-white rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isTrending && !product.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-amber-500 text-black rounded-full shadow-sm">
              TRENDING
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-md scale-110'
              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600 hover:scale-110 shadow-xs'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2.5 bg-white/95 backdrop-blur-md text-black hover:bg-black hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#8A7B69]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h4
            onClick={() => navigateTo('product-detail', product.id)}
            className="font-semibold text-sm text-[#111111] hover:text-neutral-600 transition cursor-pointer line-clamp-1 mb-2"
          >
            {product.name}
          </h4>

          {/* Color swatches preview */}
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.map((color, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-black/20"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <span className="text-[10px] text-gray-400 font-medium ml-1">
              {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-[#111111]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 transition shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 text-xs font-medium"
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
