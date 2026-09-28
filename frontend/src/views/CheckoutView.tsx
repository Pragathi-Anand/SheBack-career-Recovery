import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import type { Order, Address } from '../types';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, user, placeOrder, navigateTo, appliedCoupon } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Contact
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  // Step 2: Address
  const [street, setStreet] = useState(user.savedAddresses[0]?.street || 'Flat 402, Royale Heights, Bandra West');
  const [city, setCity] = useState(user.savedAddresses[0]?.city || 'Mumbai');
  const [state, setState] = useState(user.savedAddresses[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user.savedAddresses[0]?.pincode || '400050');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8912 3456 7890');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('421');

  // Step 4: Placed Order Result
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    else if (appliedCoupon.flatDiscount) discount = appliedCoupon.flatDiscount;
  }
  const shipping = subtotal >= 999 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleAutoFillAddress = () => {
    setFullName('Ananya Sharma');
    setEmail('ananya.s@example.com');
    setPhone('+91 98765 43210');
    setStreet('Plot 12, Indiranagar 100 Feet Road');
    setCity('Bengaluru');
    setState('Karnataka');
    setPincode('560038');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = {
      fullName,
      email,
      phone,
      street,
      city,
      state,
      pincode
    };

    const order = placeOrder(address, paymentMethod);
    setConfirmedOrder(order);
    setStep(4);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif-brand font-bold text-black">No Items to Checkout</h2>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-6 px-8 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Stepper Header */}
      {step !== 4 && (
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-xl mx-auto text-xs">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition ${
                    step === s.num
                      ? 'bg-black text-white shadow-sm'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`font-semibold uppercase ${step === s.num ? 'text-black' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {s.num < 3 && <div className="w-8 sm:w-16 h-0.5 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: CONTACT INFO */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-serif-brand font-bold text-black">Step 1 — Contact Information</h2>
            <p className="text-xs text-gray-500 mt-1">Order status updates & receipt will be sent to this email.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Phone Number (for Courier SMS)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigateTo('cart')}
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center gap-2"
            >
              <span>Continue to Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: DELIVERY ADDRESS */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif-brand font-bold text-black">Step 2 — Shipping Address</h2>
              <p className="text-xs text-gray-500 mt-1">Please enter your complete doorstep delivery address.</p>
            </div>
            <button
              type="button"
              onClick={handleAutoFillAddress}
              className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition"
            >
              ✨ Auto-Fill Sample Address
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">House / Flat No, Street, Landmark</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Contact</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: PAYMENT METHOD */}
      {step === 3 && (
        <form onSubmit={handleCompleteOrder} className="bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-serif-brand font-bold text-black">Step 3 — Select Payment Method</h2>
            <p className="text-xs text-gray-500 mt-1">All transactions are 256-bit SSL encrypted & 100% safe.</p>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'UPI', label: 'UPI / QR', icon: QrCode },
              { id: 'Credit/Debit Card', label: 'Card', icon: CreditCard },
              { id: 'Net Banking', label: 'NetBanking', icon: Building2 },
              { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote }
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id as any)}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === pm.id
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-[#E5E0D8] bg-[#FAF9F6] text-gray-700 hover:border-black'
                }`}
              >
                <pm.icon className="w-5 h-5" />
                <span className="text-xs font-bold">{pm.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Payment Fields */}
          <div className="p-6 bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl space-y-4">
            {paymentMethod === 'UPI' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-black uppercase">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Instant UPI Transfer (GPay / PhonePe / Paytm / BHIM)</span>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'Credit/Debit Card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs font-mono text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Net Banking' && (
              <div className="text-xs text-gray-700">
                Popular Banks: <strong>HDFC Bank, ICICI Bank, SBI, Axis Bank</strong>. You will be redirected to bank gateway.
              </div>
            )}

            {paymentMethod === 'Cash on Delivery' && (
              <div className="text-xs text-gray-700">
                Cash on Delivery requires ₹50 verification fee. Pay cash directly to delivery partner upon doorstep receipt.
              </div>
            )}
          </div>

          {/* Amount breakdown */}
          <div className="flex justify-between items-center text-sm font-bold text-black p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <span>Total Payable Amount:</span>
            <span className="text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Delivery</span>
            </button>
            <button
              type="submit"
              className="px-10 py-4 bg-[#111111] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center gap-2 shadow-xl"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PAY & PLACE ORDER</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: ORDER CONFIRMATION SCREEN */}
      {step === 4 && confirmedOrder && (
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-16 text-center space-y-8 animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-widest border border-emerald-200">
              Payment Confirmed
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif-brand font-bold text-black mt-3">
              ORDER PLACED SUCCESSFULLY
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Thank you for choosing VÉRA. Your order confirmation has been emailed to <strong className="text-black">{confirmedOrder.address.email}</strong>.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="max-w-xl mx-auto bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D8]">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">Order Reference</span>
                <span className="font-bold text-base text-black">{confirmedOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">Estimated Delivery</span>
                <span className="font-bold text-xs text-emerald-700">{confirmedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-black block">Items Summary</span>
              {confirmedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover rounded" />
                    <div>
                      <h5 className="font-semibold text-black">{item.product.name}</h5>
                      <span className="text-[10px] text-gray-500">Qty: {item.quantity} | Size: {item.selectedSize}</span>
                    </div>
                  </div>
                  <span className="font-bold text-black">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E0D8] flex justify-between text-xs font-bold text-black">
              <span>Total Amount Paid ({confirmedOrder.paymentMethod}):</span>
              <span className="text-sm">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigateTo('account')}
              className="px-8 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
            >
              TRACK ORDER IN MY ACCOUNT
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-8 py-3.5 border border-black text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
