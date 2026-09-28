import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Sparkles, Camera, Award, ShieldCheck, RefreshCw } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, navigateTo, setFilter } = useShop();
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'women' | 'men' | 'Trending'>('All');

  const handleCategoryClick = (categoryName: string, genderName?: string) => {
    if (genderName) {
      setFilter('gender', genderName);
      setFilter('category', 'All');
    } else {
      setFilter('category', categoryName);
      setFilter('gender', 'All');
    }
    navigateTo('catalog');
  };

  const newArrivalsList = products.filter((product) => {
    if (activeTabFilter === 'All') return true;
    if (activeTabFilter === 'Trending') return product.isTrending;
    return product.gender === activeTabFilter;
  }).slice(0, 8);

  const categoryCards = [
    {
      title: "Women's Fashion",
      subtitle: 'Effortless Dresses, Co-ords & Tailored Linen',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      action: () => handleCategoryClick('Women\'s Fashion', 'women')
    },
    {
      title: "Men's Fashion",
      subtitle: 'Relaxed Shirts, Heavyweight Tees & Cargo Pants',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      action: () => handleCategoryClick('Men\'s Fashion', 'men')
    },
    {
      title: 'Footwear',
      subtitle: 'Platform Sneakers, Chelsea Boots & Loafers',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      action: () => handleCategoryClick('Footwear')
    },
    {
      title: 'Accessories',
      subtitle: 'Handcrafted Leather Totes, Sunglasses & Jewelry',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      action: () => handleCategoryClick('Accessories')
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HOMEPAGE HERO SECTION */}
      <section className="relative w-full h-[85vh] min-h-[580px] max-h-[850px] overflow-hidden bg-[#111111] flex items-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="VÉRA Fashion Editorial Model"
            className="w-full h-full object-cover object-top opacity-85 hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white animate-fade-in">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTUMN / WINTER 2026 COLLECTION</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif-brand font-bold tracking-tight leading-[1.05] uppercase">
              DEFINE YOUR <br />
              <span className="italic font-normal text-amber-200">STYLE</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-md">
              Contemporary fashion designed for the way you live. Minimalist silhouettes crafted from 100% organic European linens and heavyweight combed cottons.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  setFilter('gender', 'women');
                  navigateTo('catalog');
                }}
                className="px-8 py-4 bg-white text-black hover:bg-amber-300 font-semibold text-xs uppercase tracking-widest rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                SHOP WOMEN
              </button>
              <button
                onClick={() => {
                  setFilter('gender', 'men');
                  navigateTo('catalog');
                }}
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-semibold text-xs uppercase tracking-widest rounded-full transition hover:-translate-y-0.5"
              >
                SHOP MEN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND HIGHLIGHTS / TRUST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F5F2EC] rounded-xl text-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">Luxury Craftsmanship</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Egyptian cotton & Italian leathers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F5F2EC] rounded-xl text-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">100% Authentic</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Designed & tested in studio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F5F2EC] rounded-xl text-black">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">7-Day Free Pickup</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Hassle-free size exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F5F2EC] rounded-xl text-black">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-black">VÉRA Privilege</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Earn reward points on orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES (4 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
            CURATED SELECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-black mt-1">
            Featured Categories
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat, idx) => (
            <div
              key={idx}
              onClick={cat.action}
              className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition duration-500 bg-[#F5F2EC]"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-2xl font-serif-brand font-bold tracking-wide">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1 mb-4 line-clamp-2 font-light">
                  {cat.subtitle}
                </p>

                <button className="w-full py-3 bg-white/90 backdrop-blur-md text-black group-hover:bg-white font-semibold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 group-hover:shadow-md">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS (8 Products Grid with Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
              FRESH DROP 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold text-black mt-1">
              NEW ARRIVALS
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Items', key: 'All' },
              { label: 'Women', key: 'women' },
              { label: 'Men', key: 'men' },
              { label: 'Trending', key: 'Trending' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTabFilter(tab.key as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  activeTabFilter === tab.key
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-[#E5E0D8] hover:border-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of 8 Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivalsList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigateTo('catalog')}
            className="px-10 py-4 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest rounded-full transition shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <span>EXPLORE FULL CATALOG ({products.length} ITEMS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. EDITORIAL LOOKBOOK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[450px]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80"
              alt="Editorial Banner"
              className="w-full h-full object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
              LIMITED EDITION
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif-brand font-bold leading-tight">
              THE AUTUMN LINEN EDIT
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Breathable, handcrafted co-ords and relaxed blazers engineered for transitional climates. Lightweight luxury that moves with you.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('catalog')}
                className="px-8 py-3.5 bg-white text-black hover:bg-amber-300 font-bold text-xs uppercase tracking-widest rounded-full transition shadow-lg"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block text-right">
            <span className="text-6xl font-serif-brand font-bold text-amber-200/30 block">
              VÉRA 2026
            </span>
            <p className="text-xs uppercase tracking-widest text-amber-300 mt-2 font-semibold">
              Crafted in Mumbai • Shipped Worldwide
            </p>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM & SOCIAL PROOF GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Camera className="w-4 h-4" />
            <span>@vera.official</span>
          </div>
          <h2 className="text-3xl font-serif-brand font-bold text-black">
            As Styled By You
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Tag <strong className="text-black">#VERAStyle</strong> on Instagram to be featured on our official gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
          ].map((imgUrl, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer">
              <img
                src={imgUrl}
                alt="Instagram Customer Look"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                <Camera className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
