import React from 'react';
import { TrendingUp, LineChart, Repeat, Wallet, LogOut } from 'lucide-react';

interface NavbarProps {
  username: string;
  totalValue: number;
  currentTab: 'markets' | 'trade' | 'portfolio';
  onTabChange: (tab: 'markets' | 'trade' | 'portfolio') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ username, totalValue, currentTab, onTabChange, onLogout }) => {
  return (
    <header className="bg-cardBg border-b border-borderCol px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-wide">NovaX</span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('markets')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              currentTab === 'markets' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LineChart className="w-4 h-4" /> Rynki
          </button>
          <button
            onClick={() => onTabChange('trade')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              currentTab === 'trade' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" /> Handel
          </button>
          <button
            onClick={() => onTabChange('portfolio')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              currentTab === 'portfolio' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> Portfel
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-cardSec px-3 py-1.5 rounded-xl border border-borderCol">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span className="text-xs font-bold text-success">LIVE</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">{username}</div>
          <div className="text-sm font-bold text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <button onClick={onLogout} title="Wyloguj / Reset" className="text-gray-400 hover:text-danger transition p-2">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
