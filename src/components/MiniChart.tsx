import React from 'react';
import { Asset } from '../types';

interface MiniChartProps {
  asset: Asset;
}

export const MiniChart: React.FC<MiniChartProps> = ({ asset }) => {
  const data = asset.history;
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const isPositive = asset.price >= asset.open24h;
  const color = isPositive ? '#089981' : '#F23645';

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 600;
    const y = 250 - ((val - min) / range) * 220 - 15;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="bg-cardBg border border-borderCol rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-sm">Wykres Cenowy w Czasie Rzeczywistym</span>
        <span className="text-xs text-gray-400">Ostatnie ticki</span>
      </div>
      <div className="w-full h-64 relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 250" preserveAspectRatio="none">
          <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        </svg>
      </div>
    </div>
  );
};
