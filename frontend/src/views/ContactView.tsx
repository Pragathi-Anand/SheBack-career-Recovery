import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    addToast('Thank you! Our concierge support team will respond within 24 hours.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'What is the estimated delivery timeframe across India?',
      a: 'Express orders to metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) are delivered within 2–3 business days. Tier 2 and Tier 3 cities receive delivery within 4–5 business days.'
    },
    {
      q: 'How do I initiate a size exchange or return?',
      a: 'You can initiate doorstep pickup within 7 days of delivery via your Account Dashboard under "My Orders", or by emailing support@verafashion.com with your order ID.'
    },
    {
      q: 'Are custom alterations or hem fittings available?',
      a: 'Yes, we offer complimentary length hem adjustment for trousers and blazers at our Mumbai flagship store. Contact concierge support prior to dispatch.'
    },
    {
      q: 'Which payment options are supported?',
      a: 'We accept BHIM UPI (GPay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and Cash on Delivery.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-[#8A7B69]">
          WE ARE HERE TO ASSIST YOU
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif-brand font-bold text-black uppercase">
          Client Concierge & Contact
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-light">
          Have a query about sizing, order status, or fabric care? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-serif-brand font-bold text-black mb-4">Send Us a Direct Message</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Sharma"
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
                placeholder="ananya@example.com"
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2">Message or Inquiry</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us how we can help you..."
              className="w-full bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-md"
          >
            <span>SEND CONCIERGE MESSAGE</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Info Box & Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111111] text-white border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-2xl font-serif-brand font-bold">Studio Headquarters</h3>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">VÉRA Fashion House</strong>
                  <span>Suite 501, Royale Palladium, Turner Road, Bandra West, Mumbai, Maharashtra 400050</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="text-white block">Customer Support</strong>
                  <span>support@verafashion.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="text-white block">Helpline Concierge</strong>
                  <span>+91 1800 209 8372 (Toll Free)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="text-white block">Business Hours</strong>
                  <span>Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-2xl font-serif-brand font-bold text-black">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-[#E5E0D8] rounded-2xl p-4 bg-[#FAF9F6]">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-xs font-bold uppercase text-black text-left"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-gray-600 leading-relaxed mt-3 pt-3 border-t border-gray-200 font-light">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
