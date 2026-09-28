import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    navigateTo,
    cart,
    wishlist,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setFilter
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', tab: 'home' },
    { name: 'Women', tab: 'catalog', genderFilter: 'women' },
    { name: 'Men', tab: 'catalog', genderFilter: 'men' },
    { name: 'New Arrivals', tab: 'catalog', categoryFilter: 'New Arrivals' },
    { name: 'Trending', tab: 'catalog', categoryFilter: 'Trending' },
    { name: 'Collections', tab: 'catalog' },
    { name: 'Sale', tab: 'sale', badge: 'UP TO 50%' }
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (link.genderFilter) {
      setFilter('gender', link.genderFilter);
    } else {
      setFilter('gender', 'All');
    }
    navigateTo(link.tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* Announcement Bar */}
      <div className="bg-[#111111] text-[#FAF9F6] text-[11px] font-semibold py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2 border-b border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE <strong className="text-amber-300">VERA10</strong> FOR 10% OFF</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse hidden sm:inline-block" />
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F6]/90 backdrop-blur-md shadow-sm border-b border-[#E5E0D8] py-3.5'
            : 'bg-[#FAF9F6] border-b border-[#E5E0D8]/60 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-black hover:text-gray-600 transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="p-1 text-black hover:text-gray-600 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" onClick={() => setIsSearchOpen(true)} />
            </button>
          </div>

          {/* Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer group flex items-center gap-1"
          >
            <span className="font-serif-brand font-bold text-2xl sm:text-3xl tracking-widest text-[#111111] uppercase group-hover:opacity-80 transition">
              VÉRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link)}
                className={`text-xs font-semibold uppercase tracking-wider transition relative py-1 ${
                  activeTab === link.tab && link.name !== 'Sale'
                    ? 'text-black font-bold'
                    : link.name === 'Sale'
                    ? 'text-rose-700 font-bold'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-rose-700 text-white font-bold">
                    {link.badge}
                  </span>
                )}
                {activeTab === link.tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full animate-fade-in" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Search (Desktop) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E0D8] hover:border-black text-xs text-gray-500 hover:text-black transition bg-white"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search fashion...</span>
            </button>

            {/* Account */}
            <button
              onClick={() => navigateTo('account')}
              className={`p-2 rounded-full transition ${
                activeTab === 'account'
                  ? 'bg-black text-white'
                  : 'text-gray-800 hover:bg-black/5 hover:text-black'
              }`}
              title="Account Dashboard"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              className={`p-2 rounded-full transition relative ${
                activeTab === 'wishlist'
                  ? 'bg-black text-white'
                  : 'text-gray-800 hover:bg-black/5 hover:text-black'
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Icon */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 rounded-full bg-black text-white hover:bg-neutral-800 transition relative flex items-center justify-center shadow-xs"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center border border-black">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-sm bg-[#FAF9F6] h-full flex flex-col shadow-2xl p-6 border-r border-[#E5E0D8] animate-slide-right">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-1">
                <span className="font-serif-brand font-bold text-2xl tracking-widest text-black">
                  VÉRA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-black transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-black/5 text-left text-sm font-semibold uppercase tracking-wider text-black transition"
                >
                  <span className={link.name === 'Sale' ? 'text-rose-700 font-bold' : ''}>
                    {link.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-700 text-white font-bold">
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}

              <div className="pt-6 border-t border-[#E5E0D8] space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('about');
                  }}
                  className="w-full text-left p-3 text-xs uppercase font-semibold text-gray-600 hover:text-black"
                >
                  About VÉRA
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('contact');
                  }}
                  className="w-full text-left p-3 text-xs uppercase font-semibold text-gray-600 hover:text-black"
                >
                  Help & Contact
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E0D8]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('account');
                }}
                className="w-full py-3 bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
