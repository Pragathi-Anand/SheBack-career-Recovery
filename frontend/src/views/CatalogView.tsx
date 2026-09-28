import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  X,
  Star,
  Search,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { products, filters, setFilter, resetFilters } = useShop();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter application logic
  const filteredProducts = products.filter((product) => {
    // Search query
    if (
      filters.searchQuery.trim() &&
      !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !product.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Gender
    if (filters.gender !== 'All') {
      if (filters.gender === 'women' && product.gender !== 'women' && product.gender !== 'unisex') return false;
      if (filters.gender === 'men' && product.gender !== 'men' && product.gender !== 'unisex') return false;
    }

    // Category
    if (filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }

    // Size
    if (filters.size !== 'All' && !product.sizes.includes(filters.size)) {
      return false;
    }

    // Color
    if (filters.color !== 'All' && !product.colors.some((c) => c.name === filters.color)) {
      return false;
    }

    // Price
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    // Rating
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }

    // Sale
    if (filters.onSaleOnly && !product.originalPrice) {
      return false;
    }

    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  const categories = ['All', 'Women\'s Fashion', 'Men\'s Fashion', 'Footwear', 'Accessories'];
  const genders = [
    { label: 'All Genders', value: 'All' },
    { label: 'Women', value: 'women' },
    { label: 'Men', value: 'men' }
  ];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
  const colors = [
    { name: 'All', hex: 'transparent' },
    { name: 'Crisp White', hex: '#FFFFFF' },
    { name: 'Jet Black', hex: '#111111' },
    { name: 'Sand Beige', hex: '#D7C4B7' },
    { name: 'Olive Drab', hex: '#556B2F' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Terracotta', hex: '#E2725B' }
  ];

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.gender !== 'All' ||
    filters.size !== 'All' ||
    filters.color !== 'All' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000 ||
    filters.rating > 0 ||
    filters.onSaleOnly ||
    filters.searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner & Title */}
      <div className="bg-[#F5F2EC] border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
          VÉRA ARCHIVE 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-brand font-bold text-black mt-2 uppercase">
          {filters.gender !== 'All' ? `${filters.gender}'S COLLECTION` : filters.category !== 'All' ? filters.category : 'OUR CATALOG'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-2 font-light">
          Explore contemporary tailoring, oversized linen shirts, cargo pants, and handcrafted accessories.
        </p>

        {/* Live Search Bar inside catalog */}
        <div className="max-w-md mx-auto mt-6 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search items by keyword..."
            value={filters.searchQuery}
            onChange={(e) => setFilter('searchQuery', e.target.value)}
            className="w-full bg-white border border-[#E5E0D8] rounded-full py-3 pl-11 pr-10 text-xs text-black focus:outline-none focus:border-black shadow-xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilter('searchQuery', '')}
              className="absolute right-3 top-3 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2 font-bold text-sm text-black">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>FILTER PRODUCTS</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-black mb-3">Gender</h4>
            <div className="space-y-1.5">
              {genders.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setFilter('gender', g.value)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    filters.gender === g.value
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-black mb-3">Category</h4>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter('category', cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    filters.category === cat
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-black mb-3">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFilter('size', sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    filters.size === sz
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-[#E5E0D8] hover:border-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-black mb-3">Color</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setFilter('color', c.name)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                    filters.color === c.name
                      ? 'border-black scale-110 shadow-sm'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex === 'transparent' ? '#FAF9F6' : c.hex }}
                  title={c.name}
                >
                  {c.name === 'All' && <span className="text-[10px] font-bold text-gray-600">ALL</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black mb-2">
              <span>Price Range</span>
              <span className="text-amber-700">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-black mb-2">Customer Rating</h4>
            <div className="space-y-1">
              {[4.5, 4.0, 3.5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setFilter('rating', filters.rating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition ${
                    filters.rating === stars ? 'bg-amber-50 text-amber-900 border border-amber-300' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{stars}★ & above</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sale Only Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => setFilter('onSaleOnly', e.target.checked)}
                className="w-4 h-4 rounded accent-black"
              />
              <span>On Sale Only</span>
            </label>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <div className="flex-1">
          {/* Top Bar: Results Count, Mobile Filter Button & Sorting */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-black text-white rounded-xl text-xs font-semibold uppercase flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <span className="text-xs text-gray-500">
                Showing <strong className="text-black">{sortedProducts.length}</strong> of {products.length} products
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold uppercase">Sort By:</span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilter('sortBy', e.target.value as any)}
                  className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-black focus:outline-none focus:border-black appearance-none cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6 items-center">
              <span className="text-[11px] uppercase font-bold text-gray-400">Active:</span>
              {filters.gender !== 'All' && (
                <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  Gender: {filters.gender}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter('gender', 'All')} />
                </span>
              )}
              {filters.category !== 'All' && (
                <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  Cat: {filters.category}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter('category', 'All')} />
                </span>
              )}
              {filters.size !== 'All' && (
                <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  Size: {filters.size}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter('size', 'All')} />
                </span>
              )}
              {filters.color !== 'All' && (
                <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  Color: {filters.color}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter('color', 'All')} />
                </span>
              )}
              {filters.onSaleOnly && (
                <span className="px-3 py-1 bg-rose-700 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  On Sale
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter('onSaleOnly', false)} />
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid: 3-4 Desktop, 2 Mobile */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-16 text-center">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black">No matching products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2">
                Try widening your price filter or selecting another category/gender.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-3 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-4/5 max-w-xs bg-[#FAF9F6] h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] mb-6">
                <h3 className="font-bold text-sm text-black uppercase">Filter Catalog</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-6 text-xs">
                <div>
                  <h4 className="font-bold uppercase mb-2">Category</h4>
                  <div className="space-y-1">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilter('category', c)}
                        className={`w-full text-left p-2 rounded-lg font-semibold ${
                          filters.category === c ? 'bg-black text-white' : 'text-gray-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold uppercase mb-2">Gender</h4>
                  <div className="flex gap-2">
                    {genders.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setFilter('gender', g.value)}
                        className={`px-3 py-1.5 rounded-lg font-semibold ${
                          filters.gender === g.value ? 'bg-black text-white' : 'border text-gray-700'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 bg-black text-white rounded-xl font-bold uppercase tracking-wider text-xs mt-6"
            >
              Apply Filters ({sortedProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
