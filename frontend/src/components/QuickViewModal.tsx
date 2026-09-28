import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, Heart, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo
  } = useShop();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const wishlisted = isWishlisted(product.id);
  const chosenColor = product.colors[selectedColorIndex] || product.colors[0];
  const chosenSize = selectedSize || product.sizes[0];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, chosenColor, chosenSize, quantity);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(product, chosenColor, chosenSize, quantity);
    closeQuickView();
    navigateTo('checkout');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
        <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-black hover:text-white transition shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Gallery */}
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center bg-[#F5F2EC] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm bg-white">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-rose-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto w-full justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-black scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Info */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
                  {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-serif-brand font-bold text-black mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-black">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {product.description}
              </p>

              {/* Color selection */}
              <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                  Color: <span className="text-gray-500 font-normal">{chosenColor.name}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                        selectedColorIndex === idx ? 'border-black scale-110 shadow-sm' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColorIndex === idx && (
                        <Check className={`w-4 h-4 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">
                    Select Size
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-gray-500 underline hover:text-black transition"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                        chosenSize === sz
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-[#E5E0D8] hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-black">Quantity:</label>
                <div className="flex items-center border border-[#E5E0D8] rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:text-black transition"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:text-black transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#E5E0D8]">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-[#E5E0D8] text-gray-700 hover:border-black hover:text-black'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 border-2 border-black text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </>
  );
};
