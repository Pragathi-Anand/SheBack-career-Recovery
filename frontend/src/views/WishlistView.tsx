import React from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingBag, Star } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, navigateTo } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A7B69]">
          SAVED SELECTIONS
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-brand font-bold text-black mt-1">
          My Wishlist ({wishlistedProducts.length} Items)
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-16 text-center shadow-xs">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif-brand font-bold text-black">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
            Save your favorite pieces while browsing by clicking the heart icon on any product card.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="mt-8 px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
          >
            EXPLORE CATALOG
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-[#F5F2EC]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => navigateTo('product-detail', product.id)}
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-rose-600 hover:scale-110 transition"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A7B69] block">
                    {product.category}
                  </span>
                  <h4
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="font-semibold text-sm text-black hover:underline cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="font-bold text-base text-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 bg-black text-white rounded-xl text-xs font-semibold uppercase hover:bg-neutral-800 transition flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
