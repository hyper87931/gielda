import React, { useState } from 'react';
import { Asset, Position, AssetId } from '../types';
import { MiniChart } from '../components/MiniChart';
import { OrderBook } from '../components/OrderBook';

interface TradeScreenProps {
  assets: Record<string, Asset>;
  selectedAssetId: AssetId;
  onSelectAsset: (id: AssetId) => void;
  fiatBalance: number;
  positions: Record<string, Position>;
  onExecuteOrder: (assetId: AssetId, side: 'BUY' | 'SELL', amount: number, mode: 'USD' | 'CRYPTO') => void;
}

export const TradeScreen: React.FC<TradeScreenProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  fiatBalance,
  positions,
  onExecuteOrder,
}) => {
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [inputMode, setInputMode] = useState<'USD' | 'CRYPTO'>('USD');
  const [tradeAmount, setTradeAmount] = useState('');

  const activeAsset = assets[selectedAssetId];
  const activePosition = positions[selectedAssetId]?.amount || 0;
  const precision = activeAsset.price < 1 ? 4 : 2;
  const isPositive = activeAsset.price >= activeAsset.open24h;
  const change = (((activeAsset.price - activeAsset.open24h) / activeAsset.open24h) * 100).toFixed(2);

  const numericInput = parseFloat(tradeAmount) || 0;
  const calculatedCrypto = inputMode === 'USD' ? numericInput / activeAsset.price : numericInput;
  const calculatedUsd = inputMode === 'USD' ? numericInput : numericInput * activeAsset.price;

  const handlePercentage = (pct: number) => {
    if (orderSide === 'BUY') {
      const targetUsd = fiatBalance * pct;
      setTradeAmount(inputMode === 'USD' ? targetUsd.toFixed(2) : (targetUsd / activeAsset.price).toFixed(4));
    } else {
      const targetCrypto = activePosition * pct;
      setTradeAmount(inputMode === 'CRYPTO' ? targetCrypto.toFixed(4) : (targetCrypto * activeAsset.price).toFixed(2));
    }
  };

  const handleSubmit = () => {
    onExecuteOrder(selectedAssetId, orderSide, parseFloat(tradeAmount) || 0, inputMode);
    setTradeAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {Object.values(assets).map((asset) => (
          <button
            key={asset.id}
            onClick={() => { onSelectAsset(asset.id); setTradeAmount(''); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition border ${
              asset.id === selectedAssetId
                ? 'bg-primary border-primary text-white'
                : 'bg-cardBg border-borderCol text-gray-400 hover:text-white'
            }`}
          >
            {asset.id}/USD
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cardBg border border-borderCol rounded-2xl p-6 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">{activeAsset.name} ({activeAsset.id})</div>
              <div className="text-3xl font-extrabold">
                ${activeAsset.price.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })}
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-bold text-sm ${isPositive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
              {isPositive ? '+' : ''}{change}%
            </div>
          </div>

          <MiniChart asset={activeAsset} />
          <OrderBook asset={activeAsset} />
        </div>

        {/* Trade Form Card */}
        <div className="bg-cardBg border border-borderCol rounded-2xl p-6 h-fit space-y-6">
          <div className="flex bg-cardSec p-1 rounded-xl">
            <button
              onClick={() => { setOrderSide('BUY'); setTradeAmount(''); }}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition ${orderSide === 'BUY' ? 'bg-success text-white' : 'text-gray-400 hover:text-white'}`}
            >
              KUP
            </button>
            <button
              onClick={() => { setOrderSide('SELL'); setTradeAmount(''); }}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition ${orderSide === 'SELL' ? 'bg-danger text-white' : 'text-gray-400 hover:text-white'}`}
            >
              SPRZEDAJ
            </button>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">{orderSide === 'BUY' ? 'Dostępne USD:' : `Dostępne ${activeAsset.id}:`}</span>
            <span className="font-bold text-white">{orderSide === 'BUY' ? `$${fiatBalance.toFixed(2)}` : `${activePosition.toFixed(4)} ${activeAsset.id}`}</span>
          </div>

          <div className="flex justify-between items-center text-xs bg-cardSec p-3 rounded-xl border border-borderCol">
            <span className="text-gray-300 font-medium">Wpisujesz w:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setInputMode('USD'); setTradeAmount(''); }}
                className={`px-2.5 py-1 rounded font-bold ${inputMode === 'USD' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                USD ($)
              </button>
              <button
                onClick={() => { setInputMode('CRYPTO'); setTradeAmount(''); }}
                className={`px-2.5 py-1 rounded font-bold ${inputMode === 'CRYPTO' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                Krypto
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase">
              {inputMode === 'USD' ? 'Kwota w USD' : `Ilość ${activeAsset.id}`}
            </label>
            <div className="relative">
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-cardSec border border-borderCol rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary"
              />
              <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-bold">
                {inputMode === 'USD' ? 'USD' : activeAsset.id}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0.25, 0.50, 0.75, 1.00].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentage(pct)}
                className="bg-cardSec hover:bg-borderCol py-1.5 rounded-lg text-xs font-bold text-gray-300"
              >
                {pct * 100}%
              </button>
            ))}
          </div>

          <div className="bg-cardSec/50 p-4 rounded-xl border border-borderCol space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Szacowana ilość:</span>
              <span className="text-white font-bold">{calculatedCrypto.toFixed(4)} {activeAsset.id}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Wartość transakcji:</span>
              <span className="text-white font-bold">${calculatedUsd.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full hover:opacity-90 transition text-white font-extrabold py-3.5 rounded-xl shadow-lg ${orderSide === 'BUY' ? 'bg-success' : 'bg-danger'}`}
          >
            {orderSide === 'BUY' ? `Kup ${activeAsset.id}` : `Sprzedaj ${activeAsset.id}`}
          </button>
        </div>
      </div>
    </div>
  );
};
