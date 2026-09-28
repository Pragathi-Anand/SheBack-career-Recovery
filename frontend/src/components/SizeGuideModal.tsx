import React from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const isFootwear = category === 'Footwear';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-2xl p-6 max-w-2xl w-full relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition text-black/70 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#8A7B69]">Measurement Standards</span>
          <h3 className="text-2xl font-serif-brand font-bold text-[#111111] mt-1">
            {isFootwear ? 'Footwear Size Guide' : 'Apparel Size Chart'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            All measurements are listed in inches unless specified. For relaxed fits, choose your standard size.
          </p>
        </div>

        {!isFootwear ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5E0D8] text-xs font-semibold text-gray-600 uppercase tracking-wider bg-[#F5F2EC]">
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest / Bust</th>
                  <th className="p-3">Waist</th>
                  <th className="p-3">Hip</th>
                  <th className="p-3">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-gray-700">
                <tr>
                  <td className="p-3 font-semibold text-black">XS</td>
                  <td className="p-3">32" – 34"</td>
                  <td className="p-3">25" – 27"</td>
                  <td className="p-3">34" – 36"</td>
                  <td className="p-3">15.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">S</td>
                  <td className="p-3">35" – 37"</td>
                  <td className="p-3">28" – 30"</td>
                  <td className="p-3">37" – 39"</td>
                  <td className="p-3">16.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">M</td>
                  <td className="p-3">38" – 40"</td>
                  <td className="p-3">31" – 33"</td>
                  <td className="p-3">40" – 42"</td>
                  <td className="p-3">17.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">L</td>
                  <td className="p-3">41" – 43"</td>
                  <td className="p-3">34" – 36"</td>
                  <td className="p-3">43" – 45"</td>
                  <td className="p-3">18.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">XL</td>
                  <td className="p-3">44" – 46"</td>
                  <td className="p-3">37" – 39"</td>
                  <td className="p-3">46" – 48"</td>
                  <td className="p-3">19.5"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">XXL</td>
                  <td className="p-3">47" – 49"</td>
                  <td className="p-3">40" – 42"</td>
                  <td className="p-3">49" – 51"</td>
                  <td className="p-3">20.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5E0D8] text-xs font-semibold text-gray-600 uppercase tracking-wider bg-[#F5F2EC]">
                  <th className="p-3">UK / India</th>
                  <th className="p-3">US Size</th>
                  <th className="p-3">EU Size</th>
                  <th className="p-3">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-gray-700">
                <tr>
                  <td className="p-3 font-semibold text-black">UK 6</td>
                  <td className="p-3">US 7</td>
                  <td className="p-3">EU 40</td>
                  <td className="p-3">25.0 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">UK 7</td>
                  <td className="p-3">US 8</td>
                  <td className="p-3">EU 41</td>
                  <td className="p-3">25.8 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">UK 8</td>
                  <td className="p-3">US 9</td>
                  <td className="p-3">EU 42</td>
                  <td className="p-3">26.5 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">UK 9</td>
                  <td className="p-3">US 10</td>
                  <td className="p-3">EU 43</td>
                  <td className="p-3">27.3 cm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-black">UK 10</td>
                  <td className="p-3">US 11</td>
                  <td className="p-3">EU 44</td>
                  <td className="p-3">28.0 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 rounded-xl bg-[#F5F2EC] border border-[#E5E0D8] text-xs text-gray-600 leading-relaxed">
          <p className="font-semibold text-black mb-1">How to Measure:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest/bust keeping the tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping tape comfortably loose.</li>
            <li><strong>Hips:</strong> Stand with feet together and measure around fullest point of your hips.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
