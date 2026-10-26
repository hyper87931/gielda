import React from 'react';
import { Asset, Position } from '../types';

interface MarketsScreenProps {
  assets: Record<string, Asset>;
  positions: Record<string, Position>;
  fiatBalance: number;
  totalPortfolioValue: number;
  cryptoValuation: number;
  totalPnL: { pnlUsd: number; pnlPercent: number };
  onSelectAsset: (assetId: string) => void;
}

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  assets,
  positions,
  fiatBalance,
  totalPortfolioValue,
  cryptoValuation,
  totalPnL,
  onSelectAsset,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cardBg border border-borderCol rounded-2xl p-6">
          <div className="text-xs font-bold text-gray-400 tracking-wider mb-2">CAŁKOWITA WARTOŚĆ PORTFELA</div>
          <div className="text-3xl font-extrabold text-white">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-borderCol text-sm font-semibold">
            <span className="text-gray-400">Gotówka USD: <span className="text-white">${fiatBalance.toFixed(2)}</span></span>
            <span className="text-gray-400">Krypto: <span className="text-white">${cryptoValuation.toFixed(2)}</span></span>
          </div>
        </div>
        <div className="bg-cardBg border border-borderCol rounded-2xl p-6 md:col-span-2 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">Główny Indeks Rynkowy</h2>
              <p className="text-sm text-gray-400">Symulacja cenowa w czasie rzeczywistym z architekturą komponentów.</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Łączny PnL Portfela</div>
              <div className={`text-lg font-extrabold ${totalPnL.pnlUsd >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalPnL.pnlUsd >= 0 ? '+' : ''}${totalPnL.pnlUsd.toFixed(2)} ({totalPnL.pnlPercent >= 0 ? '+' : ''}{totalPnL.pnlPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cardBg border border-borderCol rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-borderCol flex justify-between items-center">
          <h3 className="font-bold text-lg">Dostępne Kryptowaluty</h3>
          <span className="text-xs text-gray-400">Aktualizacja co 1.5 sekundy</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderCol text-xs text-gray-400 bg-cardSec/40">
                <th className="py-3 px-6">Aktywo</th>
                <th className="py-3 px-6">Cena Rynkowa</th>
                <th className="py-3 px-6">Zmiana 24h</th>
                <th className="py-3 px-6">Twoja Pozycja</th>
                <th className="py-3 px-6">Wartość Pozycji</th>
                <th className="py-3 px-6 text-right">Akcja</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(assets).map((asset) => {
                const isPositive = asset.price >= asset.open24h;
                const change = (((asset.price - asset.open24h) / asset.open24h) * 100).toFixed(2);
                const pos = positions[asset.id];
                const posAmount = pos ? pos.amount : 0;
                const posVal = posAmount * asset.price;
                const precision = asset.price < 1 ? 4 : 2;
                const flashClass = asset.price > asset.prevPrice ? 'flash-green' : asset.price < asset.prevPrice ? 'flash-red' : '';

                return (
                  <tr key={asset.id} className={`border-b border-borderCol hover:bg-cardSec/30 transition ${flashClass}`}>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cardSec flex items-center justify-center font-bold text-primary border border-borderCol">
                        {asset.id[0]}
                      </div>
                      <div>
                        <div className="font-bold">{asset.symbol}</div>
                        <div className="text-xs text-gray-400">{asset.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold">
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}
                    </td>
                    <td className={`py-4 px-6 font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                      {isPositive ? '+' : ''}{change}%
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {posAmount > 0 ? `${posAmount.toFixed(4)} ${asset.id}` : '-'}
                    </td>
                    <td className="py-4 px-6 font-bold">
                      {posVal > 0 ? `$${posVal.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectAsset(asset.id)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        Handluj
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
