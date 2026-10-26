import React from 'react';
import { Asset } from '../types';

interface OrderBookProps {
  asset: Asset;
}

export const OrderBook: React.FC<OrderBookProps> = ({ asset }) => {
  const precision = asset.price < 1 ? 4 : 2;
  const step = asset.price * 0.001;

  return (
    <div className="bg-cardBg border border-borderCol rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4">Arkusz Zleceń (Order Book)</h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-gray-400 mb-2 flex justify-between"><span>Cena (USD)</span><span>Ilość</span></div>
          <div className="space-y-1">
            {[4, 3, 2, 1].map((i) => {
              const p = (asset.price + step * i).toFixed(precision);
              return (
                <div key={`ask-${i}`} className="flex justify-between">
                  <span className="text-danger font-semibold">${p}</span>
                  <span className="text-gray-300">{(Math.random() * 1.5 + 0.1).toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-gray-400 mb-2 flex justify-between"><span>Cena (USD)</span><span>Ilość</span></div>
          <div className="space-y-1">
            {[1, 2, 3, 4].map((i) => {
              const p = Math.max(0.0001, asset.price - step * i).toFixed(precision);
              return (
                <div key={`bid-${i}`} className="flex justify-between">
                  <span className="text-success font-semibold">${p}</span>
                  <span className="text-gray-300">{(Math.random() * 1.5 + 0.1).toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
