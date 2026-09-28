import React from 'react';
import { useShop } from '../context/ShopContext';
import { Leaf, Award, ShieldCheck } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Brand Story Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
          OUR HERITAGE & VISION
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif-brand font-bold text-black leading-tight uppercase">
          Elegance in Every Stitch
        </h1>
        <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
          “VÉRA is a contemporary fashion label built around effortless style, quality craftsmanship and everyday confidence.”
        </p>
      </div>

      {/* High-res Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
            alt="VÉRA Studio Workshop"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            THE ARCHITECTURE OF SILHOUETTE
          </span>
          <h2 className="text-3xl font-serif-brand font-bold text-black">
            Designed for Modern Living
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Founded in Mumbai with an uncompromising dedication to textile excellence, VÉRA crafts timeless staples that transcend fast fashion trends. Every garment undergoes rigorous fitting sessions in our design studio to ensure optimal drape, breathability, and structural longevity.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="px-8 py-3.5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
            >
              Discover Our Creations
            </button>
          </div>
        </div>
      </div>

      {/* Sustainability Section */}
      <div className="bg-[#111111] text-[#FAF9F6] border border-neutral-800 rounded-3xl p-8 sm:p-16 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Leaf className="w-4 h-4" />
            <span>ETHICAL RESPONSIBILITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-brand font-bold uppercase">
            Sustainably Minded
          </h2>
          <p className="text-xs text-gray-300 font-light leading-relaxed">
            We believe true luxury honors both the craftsperson and the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-sm uppercase text-white">100% Organic Fibers</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We source GOTS-certified organic cotton and French flax linen cultivated without harmful synthetic pesticides.
            </p>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-sm uppercase text-white">Ethical Artisan Wages</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              All studio master tailors receive living wages, medical insurance, and safe, dignified working environments.
            </p>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <Award className="w-6 h-6 text-sky-400" />
            <h4 className="font-bold text-sm uppercase text-white">Zero Plastic Packaging</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every VÉRA parcel arrives in 100% biodegradable cornstarch mailers and FSC-certified recycled cardboard boxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
