export type AssetId = 'BTC' | 'ETH' | 'SOL' | 'ADA' | 'DOT' | 'XRP';

export interface Asset {
  id: AssetId;
  name: string;
  symbol: string;
  price: number;
  prevPrice: number;
  open24h: number;
  history: number[];
}

export interface Position {
  amount: number;
  avgPrice: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL';
  assetId: AssetId;
  amount: number;
  price: number;
  totalUsd: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
