import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Truck,
  ExternalLink
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { user, orders, navigateTo, updateUserProfile } = useShop();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'notifications'
  >('orders');

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Banner Header */}
      <div className="bg-[#111111] text-[#FAF9F6] border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-black flex items-center justify-center font-serif-brand font-bold text-2xl shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif-brand font-bold text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {user.memberStatus}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-3 bg-white text-black hover:bg-amber-300 rounded-full text-xs font-bold uppercase tracking-widest transition"
        >
          Explore Collection
        </button>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-3xl p-4 space-y-1 shadow-sm h-fit">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
            { id: 'profile', label: 'Profile Information', icon: User },
            { id: 'wishlist', label: 'Wishlist Shortcuts', icon: Heart },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'payments', label: 'Payment Methods', icon: CreditCard },
            { id: 'notifications', label: 'Notification Preferences', icon: Bell }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'wishlist') {
                  navigateTo('wishlist');
                } else {
                  setActiveTab(item.id as any);
                }
              }}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === item.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-700 hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === item.id ? 'bg-amber-400 text-black' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </div>
            </button>
          ))}

          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 p-3.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition pt-4 border-t border-gray-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Content Area (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D8]">
                <h3 className="text-xl font-serif-brand font-bold text-black">Order History ({orders.length})</h3>
                <span className="text-xs text-gray-500">Real-time parcel tracking</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">No orders placed yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl p-5 space-y-4">
                      {/* Order Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8] text-xs">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
                          <span className="font-bold text-black text-sm">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                          <span className="font-semibold text-gray-800">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Amount</span>
                          <span className="font-bold text-black">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-12 h-14 object-cover rounded-lg border"
                              />
                              <div>
                                <h5 className="font-semibold text-black">{item.product.name}</h5>
                                <span className="text-[10px] text-gray-500">
                                  Color: {item.selectedColor.name} | Size: {item.selectedSize} | Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-black">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <span>Waybill: <strong>{order.trackingNumber}</strong></span>
                        </div>

                        <button
                          onClick={() => navigateTo('catalog')}
                          className="px-4 py-2 border border-black text-black rounded-xl text-[11px] font-bold uppercase hover:bg-black hover:text-white transition flex items-center gap-1"
                        >
                          <span>Re-Order Items</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="pb-4 border-b border-[#E5E0D8]">
                <h3 className="text-xl font-serif-brand font-bold text-black">Edit Personal Profile</h3>
                <p className="text-xs text-gray-500 mt-1">Update your account information and contact details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* TAB: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#E5E0D8]">
                <h3 className="text-xl font-serif-brand font-bold text-black">Saved Shipping Addresses</h3>
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase">
                  + Add Address
                </button>
              </div>

              {user.savedAddresses.map((addr, i) => (
                <div key={i} className="p-4 bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-black">
                    <span>{addr.fullName} (Default Address)</span>
                    <span className="text-amber-700 font-normal">Primary</span>
                  </div>
                  <p className="text-gray-600">{addr.street}</p>
                  <p className="text-gray-600">{addr.city}, {addr.state} – {addr.pincode}</p>
                  <p className="text-gray-500 pt-1">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#E5E0D8]">
                <h3 className="text-xl font-serif-brand font-bold text-black">Saved Payment Methods</h3>
              </div>
              <div className="p-4 bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-black" />
                  <div>
                    <span className="font-bold text-black block">Axis Bank UPI ID</span>
                    <span className="text-gray-500">user@okaxis</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">Verified</span>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 text-xs">
              <div className="pb-4 border-b border-[#E5E0D8]">
                <h3 className="text-xl font-serif-brand font-bold text-black">Notification Settings</h3>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl cursor-pointer">
                  <span className="font-semibold text-black">Order SMS & Tracking Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                </label>
                <label className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl cursor-pointer">
                  <span className="font-semibold text-black">Exclusive Sale & Collection Drops</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
