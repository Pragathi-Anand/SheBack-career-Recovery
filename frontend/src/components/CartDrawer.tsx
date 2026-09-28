import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success?: boolean; text?: string }>({});

  if (!isCartDrawerOpen) return null;

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
  const freeShippingDiff = freeShippingThreshold - subtotal;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F6] w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#E5E0D8] animate-slide-right">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h3 className="font-serif-brand font-bold text-xl text-black">Your Shopping Bag</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-black text-white font-semibold">
              {cart.reduce((a, c) => a + c.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#F5F2EC] px-5 py-3 border-b border-[#E5E0D8] text-xs">
          {freeShippingDiff > 0 ? (
            <p className="text-gray-700">
              Add <span className="font-bold text-black">₹{freeShippingDiff.toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold text-emerald-700">FREE SHIPPING</span>!
            </p>
          ) : (
            <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
              <span>🎉 Congratulations! You unlocked FREE Shipping!</span>
            </p>
          )}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-black">Your bag is empty</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Explore our new arrivals and define your signature wardrobe today.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('catalog');
                }}
                className="mt-6 px-6 py-3 bg-black text-white rounded-full text-xs uppercase font-semibold tracking-widest hover:bg-neutral-800 transition"
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}-${index}`}
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#E5E0D8] shadow-sm"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-sm text-black line-clamp-1">
                        {item.product.name}
                      </h5>
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedColor.name,
                            item.selectedSize
                          )
                        }
                        className="text-gray-400 hover:text-rose-600 transition p-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                      <span>•</span>
                      <span>Size: <strong className="text-black">{item.selectedSize}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E5E0D8] rounded-lg bg-gray-50">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedColor.name,
                            item.selectedSize,
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-black">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedColor.name,
                            item.selectedSize,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-black">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E5E0D8] bg-white space-y-4">
            {/* Coupon Box */}
            <div>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. VERA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl py-2 pl-9 pr-3 text-xs text-black uppercase focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-xl text-xs font-semibold uppercase hover:bg-neutral-800 transition"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span>({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponMsg.text && !appliedCoupon && (
                <p className={`text-[11px] mt-1 ${couponMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('cart');
                }}
                className="w-full py-3.5 border border-black text-black rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black/5 transition"
              >
                View Full Bag
              </button>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('checkout');
                }}
                className="w-full py-3.5 bg-black text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
