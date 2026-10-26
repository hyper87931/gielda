import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (name: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [usernameInput, setUsernameInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(usernameInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-darkBg">
      <div className="bg-cardBg border border-borderCol rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-cardSec rounded-full flex items-center justify-center mx-auto mb-6 border border-primary text-primary">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">NovaX Exchange</h1>
        <p className="text-gray-400 text-sm mb-6">
          Profesjonalny symulator giełdy kryptowalut w React (podzielony na moduły). Otrzymaj $10,000 na start.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Twoje Imię / Nick</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="np. Satoshi"
              className="w-full bg-cardSec border border-borderCol rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 transition text-white font-bold py-3.5 rounded-xl shadow-lg"
          >
            Otwórz Rachunek Demo
          </button>
        </form>
      </div>
    </div>
  );
};
