import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, ArrowRight, Star } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.gender.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = [
    'Oversized Linen Shirt',
    'Cargo Pants',
    'Chunky Sneakers',
    'Silk Dress',
    'Co-ord Set',
    'Leather Tote'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col animate-fade-in">
      <div className="bg-[#FAF9F6] border-b border-[#E5E0D8] p-6 shadow-xl">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <Search className="w-6 h-6 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search for linen shirts, cargo pants, leather totes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-white border border-[#E5E0D8] rounded-full py-4 pl-14 pr-12 text-lg text-black focus:outline-none focus:border-black shadow-sm transition"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-4 p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-6">
        {query.trim() === '' ? (
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-widest text-[#8A7B69] mb-4">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-white border border-[#E5E0D8] hover:border-black rounded-full text-sm font-medium text-gray-800 transition flex items-center gap-1 hover:scale-105"
                >
                  <span>{term}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>

            <h4 className="text-xs uppercase font-semibold tracking-widest text-[#8A7B69] mb-4">
              Featured Trending Collection
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateTo('product-detail', product.id);
                  }}
                  className="group bg-white rounded-xl p-3 border border-[#E5E0D8] cursor-pointer hover:shadow-md transition"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg mb-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <h5 className="font-semibold text-xs text-black truncate">{product.name}</h5>
                  <p className="text-xs text-gray-500">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs uppercase font-semibold tracking-widest text-[#8A7B69]">
                Search Results ({filteredProducts.length})
              </h4>
              <span className="text-xs text-gray-500">Showing matches for "{query}"</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5E0D8] rounded-2xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-black">No products found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                  Try checking spelling or search with broader terms like "shirt", "pants", or "dress".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('product-detail', product.id);
                    }}
                    className="flex gap-4 p-3 bg-white border border-[#E5E0D8] rounded-xl hover:border-black cursor-pointer transition shadow-sm hover:shadow-md"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A7B69]">
                          {product.category}
                        </span>
                        <h5 className="font-semibold text-sm text-black line-clamp-1">
                          {product.name}
                        </h5>
                        <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-black">
                        <span>₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span className="text-xs font-normal text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
