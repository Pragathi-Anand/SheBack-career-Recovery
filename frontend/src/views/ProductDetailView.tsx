import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import {
  Star,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  MessageSquarePlus
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    addToast
  } = useShop();

  const product =
    products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('material');

  // Customer Reviews state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'Priya Verma',
      rating: 5,
      date: '24 Sep 2026',
      comment: 'The drape and quality of this piece exceeded my expectations! Wore it to an evening gala in South Mumbai and received countless compliments.',
      likes: 14,
      verified: true
    },
    {
      id: 2,
      author: 'Rohan Mehta',
      rating: 5,
      date: '18 Sep 2026',
      comment: 'Heavyweight organic cotton fabric that holds its structured fit perfectly even after multiple washes. True to size.',
      likes: 9,
      verified: true
    },
    {
      id: 3,
      author: 'Kavya Nair',
      rating: 4,
      date: '10 Sep 2026',
      comment: 'Super elegant and fast delivery. Was delivered within 2 days to Bengaluru.',
      likes: 5,
      verified: true
    }
  ]);

  const wishlisted = isWishlisted(product.id);
  const chosenColor = product.colors[selectedColorIndex] || product.colors[0];
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const recommendedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, chosenColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, chosenColor, selectedSize, quantity);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    const newRev = {
      id: Date.now(),
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment,
      likes: 0,
      verified: true
    };
    setReviewsList([newRev, ...reviewsList]);
    addToast('Thank you! Your review has been published.', 'success');
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition ${
                  selectedImageIndex === idx
                    ? 'border-black scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Primary View */}
          <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#F5F2EC] shadow-sm border border-[#E5E0D8]">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3.5 py-1 bg-rose-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Buying Info (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A7B69]">
                {product.category}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-brand font-bold text-black mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-black">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">
                Color Options: <span className="text-gray-500 font-normal">{chosenColor.name}</span>
              </label>
              <div className="flex gap-2.5">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${
                      selectedColorIndex === idx
                        ? 'border-black scale-110 shadow-sm'
                        : 'border-gray-200 hover:scale-105'
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

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black">
                  Select Size
                </label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-gray-500 underline hover:text-black transition"
                >
                  Size Guide & Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white text-black border-[#E5E0D8] hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-black">Quantity:</label>
              <div className="flex items-center border border-[#E5E0D8] rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-gray-600 hover:text-black font-semibold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-gray-600 hover:text-black font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock — Ready for immediate dispatch</span>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-2xl border transition ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-[#E5E0D8] text-gray-700 hover:border-black'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 border-2 border-black text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
              >
                <span>BUY IT NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Accordion Tabs for Material, Fit, Care, Shipping */}
          <div className="border-t border-[#E5E0D8] pt-6 space-y-3">
            {[
              { id: 'material', title: 'Fabric & Composition', content: product.material },
              { id: 'fit', title: 'Fit & Silhouette', content: product.fit },
              { id: 'features', title: 'Key Features', content: product.features.join(' • ') },
              { id: 'care', title: 'Care Instructions', content: product.careInstructions }
            ].map((tab) => (
              <div key={tab.id} className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === tab.id ? null : tab.id)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black py-1 text-left"
                >
                  <span>{tab.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      activeAccordion === tab.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === tab.id && (
                  <p className="text-xs text-gray-600 leading-relaxed mt-2 animate-fade-in font-light">
                    {tab.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Delivery & Security Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[10px] text-gray-500 font-semibold border-t border-gray-100">
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-gray-700 mb-1" />
              <span>Free Delivery Above ₹999</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-gray-700 mb-1" />
              <span>7 Days Exchange</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-gray-700 mb-1" />
              <span>100% Quality Checked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E5E0D8] pb-8">
          <div>
            <h2 className="text-2xl font-serif-brand font-bold text-black">
              Customer Reviews & Feedback
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-lg text-black">{product.rating} out of 5</span>
              <span className="text-xs text-gray-400">({reviewsList.length} verified ratings)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-gray-600">98% of buyers recommend this product</span>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-amber-600" />
            <span>Write a Product Review</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Full Name"
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              required
              className="bg-white border border-[#E5E0D8] rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Rating:</span>
              <div className="flex text-amber-500 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className={`w-5 h-5 ${star <= newReviewRating ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <textarea
            placeholder="Describe your fit experience, fabric texture, or styling recommendations..."
            rows={3}
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            required
            className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
          />

          <button
            type="submit"
            className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-black">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400">{rev.date}</span>
              </div>

              <div className="flex text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-gray-700 leading-relaxed font-light">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* YOU MAY ALSO LIKE Recommendations */}
      <section>
        <div className="text-center max-w-md mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
            CURATED FOR YOU
          </span>
          <h2 className="text-3xl font-serif-brand font-bold text-black mt-1">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </div>
  );
};
