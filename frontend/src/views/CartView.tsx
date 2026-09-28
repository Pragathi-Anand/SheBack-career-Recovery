import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; msg?: string }>({});

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = appliedCoupon.flatDiscount;
    }
  }

  const freeShippingThreshold = 999;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ success: res.success, msg: res.message });
    if (res.success) setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-12 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-serif-brand font-bold text-black">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
            Looks like you haven't added any luxury pieces to your bag yet. Explore our latest arrivals to define your style.
          </p>
          <button
            onClick={() => navigateTo('catalog')}
            className="mt-8 px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition shadow-md"
          >
            EXPLORE CATALOG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A7B69]">
          YOUR SELECTION
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-brand font-bold text-black mt-1">
          Shopping Cart ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free shipping progress bar */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-4 text-xs shadow-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="font-bold text-emerald-700">
                🎉 Your order qualifies for FREE Express Shipping across India!
              </p>
            ) : (
              <p className="text-gray-700">
                Add <strong className="text-black">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more to unlock <strong className="text-emerald-700">FREE SHIPPING</strong>.
              </p>
            )}
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {cart.map((item, idx) => (
            <div
              key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}-${idx}`}
              className="bg-white border border-[#E5E0D8] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-xs hover:border-black transition"
            >
              <div className="flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-28 object-cover rounded-xl shrink-0 cursor-pointer"
                  onClick={() => navigateTo('product-detail', item.product.id)}
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A7B69]">
                    {item.product.category}
                  </span>
                  <h4
                    onClick={() => navigateTo('product-detail', item.product.id)}
                    className="font-bold text-base text-black hover:underline cursor-pointer line-clamp-1"
                  >
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </span>
                    <span>•</span>
                    <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                  </div>
                  <div className="text-xs font-bold text-black pt-1">
                    ₹{item.product.price.toLocaleString('en-IN')} each
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#E5E0D8] rounded-xl bg-[#FAF9F6]">
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.product.id,
                        item.selectedColor.name,
                        item.selectedSize,
                        item.quantity - 1
                      )
                    }
                    className="px-3 py-1.5 text-gray-600 hover:text-black font-bold text-xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-black">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.product.id,
                        item.selectedColor.name,
                        item.selectedSize,
                        item.quantity + 1
                      )
                    }
                    className="px-3 py-1.5 text-gray-600 hover:text-black font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-bold text-base text-black block">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() =>
                      removeFromCart(
                        item.product.id,
                        item.selectedColor.name,
                        item.selectedSize
                      )
                    }
                    className="text-xs text-gray-400 hover:text-rose-600 transition inline-flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif-brand font-bold text-xl text-black">Order Summary</h3>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black block">
                Apply Coupon Code
              </label>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. VERA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl py-2.5 pl-9 pr-3 text-xs text-black uppercase font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase hover:bg-neutral-800 transition"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponFeedback.msg && !appliedCoupon && (
                <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponFeedback.msg}
                </p>
              )}

              {/* Sample coupons tip */}
              <div className="text-[10px] text-gray-500 pt-1">
                Try: <strong className="text-black">VERA10</strong> (10% off) or <strong className="text-black">FIRSTLOOK</strong> (₹300 off)
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST Tax (Included)</span>
                <span>₹{Math.round((grandTotal * 0.05)).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-black pt-3 border-t border-gray-200">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl p-4 text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2 text-black font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>100% Encrypted & Safe Checkout</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Orders placed before 2 PM are dispatched on the same business day with live tracking SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
