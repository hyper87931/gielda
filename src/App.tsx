import React, { useState, useEffect } from 'react';
import { Asset, Position, Transaction, ToastMessage, AssetId } from './types';
import { Navbar } from './components/Navbar';
import { CustomToast } from './components/CustomToast';
import { AuthScreen } from './screens/AuthScreen';
import { MarketsScreen } from './screens/MarketsScreen';
import { TradeScreen } from './screens/TradeScreen';
import { PortfolioScreen } from './screens/PortfolioScreen';

const INITIAL_ASSETS: Record<AssetId, Asset> = {
  BTC: { id: 'BTC', name: 'Bitcoin', symbol: 'BTC/USD', price: 64250.0, prevPrice: 64250.0, open24h: 63100.0, history: [63800, 63950, 64100, 64050, 64200, 64150, 64300, 64250] },
  ETH: { id: 'ETH', name: 'Ethereum', symbol: 'ETH/USD', price: 3450.0, prevPrice: 3450.0, open24h: 3520.0, history: [3500, 3490, 3485, 3460, 3470, 3455, 3440, 3450] },
  SOL: { id: 'SOL', name: 'Solana', symbol: 'SOL/USD', price: 148.5, prevPrice: 148.5, open24h: 142.0, history: [143, 144.5, 145, 146.2, 147, 146.8, 148, 148.5] },
  ADA: { id: 'ADA', name: 'Cardano', symbol: 'ADA/USD', price: 0.452, prevPrice: 0.452, open24h: 0.46, history: [0.46, 0.458, 0.455, 0.456, 0.453, 0.451, 0.45, 0.452] },
  DOT: { id: 'DOT', name: 'Polkadot', symbol: 'DOT/USD', price: 7.25, prevPrice: 7.25, open24h: 7.1, history: [7.12, 7.15, 7.18, 7.2, 7.22, 7.19, 7.23, 7.25] },
  XRP: { id: 'XRP', name: 'Ripple', symbol: 'XRP/USD', price: 0.58, prevPrice: 0.58, open24h: 0.56, history: [0.55, 0.56, 0.57, 0.565, 0.575, 0.58] }
};

export default function App() {
  const [user, setUser] = useState<{ name: string; isAuthenticated: boolean }>(() => {
    const saved = localStorage.getItem('novax_user');
    return saved ? JSON.parse(saved) : { name: '', isAuthenticated: false };
  });

  const [fiatBalance, setFiatBalance] = useState<number>(() => {
    const saved = localStorage.getItem('novax_fiat');
    return saved !== null ? parseFloat(saved) : 10000.0;
  });

  const [assets, setAssets] = useState<Record<AssetId, Asset>>(() => {
    const saved = localStorage.getItem('novax_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const saved = localStorage.getItem('novax_positions');
    return saved ? JSON.parse(saved) : {};
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('novax_tx');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTab, setCurrentTab] = useState<'markets' | 'trade' | 'portfolio'>('markets');
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>('BTC');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('novax_user', JSON.stringify(user));
    localStorage.setItem('novax_fiat', fiatBalance.toString());
    localStorage.setItem('novax_positions', JSON.stringify(positions));
    localStorage.setItem('novax_tx', JSON.stringify(transactions));
    localStorage.setItem('novax_assets', JSON.stringify(assets));
  }, [user, fiatBalance, positions, transactions, assets]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Market Engine
  useEffect(() => {
    if (!user.isAuthenticated) return;
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        const next = { ...prevAssets };
        Object.keys(next).forEach((key) => {
          const k = key as AssetId;
          const asset = next[k];
          const prev = asset.price;
          const volatility = 0.012;
          const factor = (Math.random() - 0.495) * 2 * volatility;
          const newPrice = Math.max(0.0001, prev * (1 + factor));
          const precision = newPrice < 1 ? 4 : 2;
          const roundedPrice = Number(newPrice.toFixed(precision));

          const newHistory = [...asset.history, roundedPrice];
          if (newHistory.length > 30) newHistory.shift();

          next[k] = {
            ...asset,
            prevPrice: prev,
            price: roundedPrice,
            history: newHistory,
          };
        });
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [user.isAuthenticated]);

  const handleLogin = (nameInput: string) => {
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      showToast('Wpisz poprawne imię lub nick (min. 2 znaki).', 'error');
      return;
    }
    setUser({ name: trimmed, isAuthenticated: true });
    showToast(`Witaj ${trimmed}! Przyznano $10,000 na start.`, 'info');
  };

  const handleLogout = () => {
    if (confirm('Czy na pewno chcesz wylogować i zresetować aplikację?')) {
      localStorage.clear();
      setUser({ name: '', isAuthenticated: false });
      setFiatBalance(10000.0);
      setPositions({});
      setTransactions([]);
      setAssets(INITIAL_ASSETS);
    }
  };

  const handleResetAccount = () => {
    if (confirm('Czy na pewno chcesz zresetować portfel do stanu początkowego?')) {
      setFiatBalance(10000.0);
      setPositions({});
      setTransactions([]);
      showToast('Konto zostało zresetowane.', 'info');
    }
  };

  const getCryptoValuation = () => {
    let total = 0;
    Object.keys(positions).forEach((k) => {
      const pos = positions[k];
      const asset = assets[k as AssetId];
      if (pos && asset && pos.amount > 0.000001) {
        total += pos.amount * asset.price;
      }
    });
    return total;
  };

  const totalPortfolioValue = fiatBalance + getCryptoValuation();

  const getTotalPnL = () => {
    let totalPnlUsd = 0;
    let totalCost = 0;
    Object.keys(positions).forEach((k) => {
      const pos = positions[k];
      const asset = assets[k as AssetId];
      if (pos && asset && pos.amount > 0.000001) {
        const curVal = pos.amount * asset.price;
        const costVal = pos.amount * pos.avgPrice;
        totalPnlUsd += curVal - costVal;
        totalCost += costVal;
      }
    });
    const pnlPercent = totalCost > 0 ? (totalPnlUsd / totalCost) * 100 : 0;
    return { pnlUsd: totalPnlUsd, pnlPercent };
  };

  const handleExecuteOrder = (assetId: AssetId, side: 'BUY' | 'SELL', rawVal: number, mode: 'USD' | 'CRYPTO') => {
    if (rawVal <= 0) {
      showToast('Wprowadź prawidłową kwotę.', 'error');
      return;
    }

    const asset = assets[assetId];
    const cryptoAmount = mode === 'USD' ? rawVal / asset.price : rawVal;
    const usdTotal = mode === 'USD' ? rawVal : rawVal * asset.price;

    if (side === 'BUY') {
      if (usdTotal > fiatBalance + 0.0001) {
        showToast('Niewystarczające środki USD w portfelu!', 'error');
        return;
      }
      setFiatBalance((prev) => prev - usdTotal);
      setPositions((prev) => {
        const currentPos = prev[assetId] || { amount: 0, avgPrice: 0 };
        const prevCost = currentPos.amount * currentPos.avgPrice;
        const newAmount = currentPos.amount + cryptoAmount;
        const newAvgPrice = newAmount > 0 ? (prevCost + usdTotal) / newAmount : 0;
        return {
          ...prev,
          [assetId]: { amount: newAmount, avgPrice: newAvgPrice },
        };
      });
      showToast(`Kupiono ${cryptoAmount.toFixed(4)} ${assetId} za $${usdTotal.toFixed(2)}`, 'success');
    } else {
      const currentPos = positions[assetId];
      if (!currentPos || currentPos.amount + 0.000001 < cryptoAmount) {
        showToast(`Nie posiadasz wystarczającej ilości ${assetId}!`, 'error');
        return;
      }
      setFiatBalance((prev) => prev + usdTotal);
      setPositions((prev) => {
        const updated = { ...prev };
        const remaining = updated[assetId].amount - cryptoAmount;
        if (remaining <= 0.00001) {
          delete updated[assetId]; // Całkowite usunięcie pozycji po sprzedaży
        } else {
          updated[assetId] = { ...updated[assetId], amount: remaining };
        }
        return updated;
      });
      showToast(`Sprzedano ${cryptoAmount.toFixed(4)} ${assetId} za $${usdTotal.toFixed(2)}`, 'success');
    }

    setTransactions((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        type: side,
        assetId: assetId,
        amount: cryptoAmount,
        price: asset.price,
        totalUsd: usdTotal,
      },
      ...prev,
    ]);
  };

  if (!user.isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white">
      <CustomToast toasts={toasts} />
      <Navbar
        username={user.name}
        totalValue={totalPortfolioValue}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {currentTab === 'markets' && (
          <MarketsScreen
            assets={assets}
            positions={positions}
            fiatBalance={fiatBalance}
            totalPortfolioValue={totalPortfolioValue}
            cryptoValuation={getCryptoValuation()}
            totalPnL={getTotalPnL()}
            onSelectAsset={(id) => { setSelectedAssetId(id as AssetId); setCurrentTab('trade'); }}
          />
        )}

        {currentTab === 'trade' && (
          <TradeScreen
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            fiatBalance={fiatBalance}
            positions={positions}
            onExecuteOrder={handleExecuteOrder}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioScreen
            assets={assets}
            positions={positions}
            transactions={transactions}
            fiatBalance={fiatBalance}
            totalPortfolioValue={totalPortfolioValue}
            cryptoValuation={getCryptoValuation()}
            totalPnL={getTotalPnL()}
            onResetAccount={handleResetAccount}
            onSelectAsset={(id) => { setSelectedAssetId(id); setCurrentTab('trade'); }}
          />
        )}
      </main>
    </div>
  );
}
