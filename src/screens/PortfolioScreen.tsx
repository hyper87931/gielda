import React from 'react';
import { Asset, Position, Transaction, AssetId } from '../types';

interface PortfolioScreenProps {
  assets: Record<string, Asset>;
  positions: Record<string, Position>;
  transactions: Transaction[];
  fiatBalance: number;
  totalPortfolioValue: number;
  cryptoValuation: number;
  totalPnL: { pnlUsd: number; pnlPercent: number };
  onResetAccount: () => void;
  onSelectAsset: (id: AssetId) => void;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  assets,
  positions,
  transactions,
  fiatBalance,
  totalPortfolioValue,
  cryptoValuation,
  totalPnL,
  onResetAccount,
  onSelectAsset,
}) => {
  const activePositionsKeys = Object.keys(positions).filter((k) => positions[k].amount > 0.000001);

  return (
    <div className="space-y-6">
      <div className="bg-cardBg border border-borderCol rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CAŁKOWITE SALDO PORTFELA</div>
          <div className="text-4xl font-extrabold text-white">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm font-semibold">
            <span className="text-gray-400">Gotówka (Fiat): <span className="text-white font-bold">${fiatBalance.toFixed(2)}</span></span>
            <span className="text-gray-400">Krypto: <span className="text-white font-bold">${cryptoValuation.toFixed(2)}</span></span>
            <span className="text-gray-400">PnL: <span className={`font-bold ${totalPnL.pnlUsd >= 0 ? 'text-success' : 'text-danger'}`}>{totalPnL.pnlUsd >= 0 ? '+' : ''}${totalPnL.pnlUsd.toFixed(2)} ({totalPnL.pnlPercent >= 0 ? '+' : ''}{totalPnL.pnlPercent.toFixed(2)}%)</span></span>
          </div>
        </div>
        <button
          onClick={onResetAccount}
          className="bg-danger/25 hover:bg-danger/35 text-danger border border-danger/40 px-4 py-2.5 rounded-xl font-bold text-sm transition"
        >
          Resetuj Konto
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Twoje Otwarte Pozycje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePositionsKeys.length === 0 ? (
            <div className="col-span-2 bg-cardBg border border-borderCol rounded-2xl p-8 text-center text-gray-400">
              Nie posiadasz aktualnie żadnych pozycji kryptowalutowych. Przejdź do zakładki Handel.
            </div>
          ) : (
            activePositionsKeys.map((k) => {
              const pos = positions[k];
              const asset = assets[k];
              if (!asset) return null;

              const curVal = pos.amount * asset.price;
              const cost = pos.amount * pos.avgPrice;
              const pnlUsd = curVal - cost;
              const pnlPct = cost > 0 ? (pnlUsd / cost) * 100 : 0;
              const isProfit = pnlUsd >= 0;
              const precision = asset.price < 1 ? 4 : 2;

              return (
                <div key={k} className="bg-cardBg border border-borderCol rounded-2xl p-6 space-y-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-lg">{asset.name} ({asset.id})</h4>
                      <div className="text-sm text-gray-400 mt-0.5 font-semibold">{pos.amount.toFixed(4)} {asset.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold">${curVal.toFixed(2)}</div>
                      <div className={`text-xs font-bold mt-0.5 ${isProfit ? 'text-success' : 'text-danger'}`}>
                        {isProfit ? '+' : ''}${pnlUsd.toFixed(2)} ({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-borderCol flex justify-between items-center text-xs">
                    <span className="text-gray-400">Śr. cena: <span className="text-white font-bold">${pos.avgPrice.toFixed(precision)}</span></span>
                    <span className="text-gray-400">Aktualna: <span className="text-white font-bold">${asset.price.toFixed(precision)}</span></span>
                    <button
                      onClick={() => onSelectAsset(asset.id)}
                      className="bg-primary hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold transition"
                    >
                      Handluj
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-4 pt-6">
        <h3 className="font-bold text-lg">Historia Transakcji</h3>
        <div className="bg-cardBg border border-borderCol rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-borderCol text-xs text-gray-400 bg-cardSec/40">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Typ</th>
                <th className="py-3 px-6">Aktywo</th>
                <th className="py-3 px-6">Ilość</th>
                <th className="py-3 px-6">Cena</th>
                <th className="py-3 px-6 text-right">Razem USD</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">Brak przeprowadzonych transakcji.</td></tr>
              ) : (
                transactions.slice(0, 15).map((tx) => (
                  <tr key={tx.id} className="border-b border-borderCol hover:bg-cardSec/30 transition">
                    <td className="py-3 px-6 text-gray-400">{tx.date}</td>
                    <td className={`py-3 px-6 font-extrabold ${tx.type === 'BUY' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'BUY' ? 'KUPNO' : 'SPRZEDAŻ'}
                    </td>
                    <td className="py-3 px-6 font-bold">{tx.assetId}</td>
                    <td className="py-3 px-6 font-semibold">{tx.amount.toFixed(4)} {tx.assetId}</td>
                    <td className="py-3 px-6 font-semibold">${tx.price.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right font-bold">${tx.totalUsd.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
