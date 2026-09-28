import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Send,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Camera
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, addToast, setFilter } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast('Thank you for subscribing! Check your email for 10% OFF code.', 'success');
    setNewsletterEmail('');
  };

  const handleShopLink = (gender: string) => {
    setFilter('gender', gender);
    navigateTo('catalog');
  };

  return (
    <footer className="bg-[#111111] text-[#FAF9F6] pt-16 pb-8 border-t border-[#222222]">
      {/* Brand Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <Truck className="w-6 h-6 text-amber-400 mb-2" />
          <h5 className="font-semibold text-xs uppercase tracking-wider text-white">Free Express Shipping</h5>
          <p className="text-[11px] text-gray-400 mt-1">On all orders above ₹999 across India</p>
        </div>
        <div className="flex flex-col items-center">
          <RotateCcw className="w-6 h-6 text-amber-400 mb-2" />
          <h5 className="font-semibold text-xs uppercase tracking-wider text-white">7-Day Easy Returns</h5>
          <p className="text-[11px] text-gray-400 mt-1">Hassle-free doorstep pickup & exchange</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
          <h5 className="font-semibold text-xs uppercase tracking-wider text-white">100% Quality Assurance</h5>
          <p className="text-[11px] text-gray-400 mt-1">Ethically sourced premium fabrics</p>
        </div>
        <div className="flex flex-col items-center">
          <CreditCard className="w-6 h-6 text-amber-400 mb-2" />
          <h5 className="font-semibold text-xs uppercase tracking-wider text-white">Secure Payments</h5>
          <p className="text-[11px] text-gray-400 mt-1">UPI, Cards, Net Banking & COD available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="font-serif-brand font-bold text-3xl tracking-widest text-white uppercase">
                VÉRA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Contemporary fashion label built around effortless style, quality craftsmanship, and everyday confidence.
            </p>

            <div className="pt-4">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-2">
                GET 10% OFF YOUR FIRST ORDER
              </h5>
              <p className="text-[11px] text-gray-400 mb-3">
                Subscribe to receive private preview access, seasonal edits, and exclusive discounts.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-white text-black hover:bg-amber-400 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
                >
                  <span>SUBSCRIBE</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 1: SHOP */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              SHOP
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => handleShopLink('women')} className="hover:text-white transition">
                  Women
                </button>
              </li>
              <li>
                <button onClick={() => handleShopLink('men')} className="hover:text-white transition">
                  Men
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-white transition">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-white transition">
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sale')} className="text-rose-400 hover:text-rose-300 font-semibold transition">
                  Sale (Up to 50% Off)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              HELP
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('catalog')} className="hover:text-white transition">
                  Size Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT & LEGAL */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              ABOUT & LEGAL
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-400 mb-6">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition">
                  About VÉRA
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition">
                  Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition">
                  Terms & Conditions
                </button>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400 transition"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400 transition font-bold text-xs"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#youtube"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-400 transition font-bold text-xs"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <p>© 2026 VÉRA Official. All Rights Reserved. Crafted for fashion enthusiasts.</p>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-gray-400 font-bold">BHIM UPI</span>
          <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-gray-400 font-bold">VISA</span>
          <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-gray-400 font-bold">MASTERCARD</span>
          <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-gray-400 font-bold">RUPAY</span>
        </div>
      </div>
    </footer>
  );
};
