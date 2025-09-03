import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, WifiOff } from 'lucide-react';
import { useTradingContext } from '../contexts/TradingContext';
import { useQuotexApi } from '../hooks/useQuotexApi';
import { QuotexSignal } from '../services/quotexApi';

interface TradingPair {
  symbol: string;
  name: string;
  flag: string;
  price: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL' | 'LOADING' | 'ERROR';
  confidence: number;
  change24h: number;
  lastUpdate: Date;
  indicators?: {
    rsi: number;
    macd: number;
    sma_20: number;
    ema_20: number;
    support: number;
    resistance: number;
  };
}

export const TradingPairs: React.FC = () => {
  const { isMonitoring, selectedMarket, selectedTimeframe } = useTradingContext();
  const { getRealSignal, isConnected, serverOnline } = useQuotexApi();
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(false);

  // Convert timeframe string to seconds
  const getTimeframeSeconds = (timeframe: string): number => {
    const timeframeMap: { [key: string]: number } = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '30m': 1800,
      '1h': 3600,
      '4h': 14400,
      '1d': 86400
    };
    return timeframeMap[timeframe] || 900;
  };

  const marketPairs = {
    forex: [
      { symbol: 'EURUSD', name: 'EUR/USD', flag: '🇪🇺🇺🇸' },
      { symbol: 'GBPUSD', name: 'GBP/USD', flag: '🇬🇧🇺🇸' },
      { symbol: 'USDJPY', name: 'USD/JPY', flag: '🇺🇸🇯🇵' },
      { symbol: 'AUDUSD', name: 'AUD/USD', flag: '🇦🇺🇺🇸' },
      { symbol: 'USDCAD', name: 'USD/CAD', flag: '🇺🇸🇨🇦' },
      { symbol: 'USDCHF', name: 'USD/CHF', flag: '🇺🇸🇨🇭' },
      { symbol: 'NZDUSD', name: 'NZD/USD', flag: '🇳🇿🇺🇸' }
    ],
    crypto: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', flag: '₿' },
      { symbol: 'ETHUSDT', name: 'Ethereum', flag: 'Ξ' },
      { symbol: 'LTCUSDT', name: 'Litecoin', flag: 'Ł' },
      { symbol: 'XRPUSDT', name: 'Ripple', flag: '🅇' },
      { symbol: 'BNBUSDT', name: 'Binance Coin', flag: '🟡' }
    ],
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc', flag: '🍎' },
      { symbol: 'GOOGL', name: 'Google', flag: '🔍' },
      { symbol: 'MSFT', name: 'Microsoft', flag: '🪟' },
      { symbol: 'TSLA', name: 'Tesla', flag: '🚗' },
      { symbol: 'AMZN', name: 'Amazon', flag: '📦' }
    ],
    commodities: [
      { symbol: 'GOLD', name: 'Gold', flag: '🥇' },
      { symbol: 'SILVER', name: 'Silver', flag: '🥈' },
      { symbol: 'OIL', name: 'Crude Oil', flag: '🛢️' },
      { symbol: 'COPPER', name: 'Copper', flag: '🟫' }
    ]
  };

  useEffect(() => {
    const currentPairs = marketPairs[selectedMarket as keyof typeof marketPairs] || [];
    
    const initialPairs: TradingPair[] = currentPairs.map(pair => ({
      ...pair,
      price: 0,
      signal: 'LOADING',
      confidence: 0,
      change24h: 0,
      lastUpdate: new Date()
    }));

    setPairs(initialPairs);
  }, [selectedMarket]);

  useEffect(() => {
    if (!isMonitoring || !isConnected || !serverOnline) return;

    const updateSignals = async () => {
      setLoading(true);
      const timeframeSeconds = getTimeframeSeconds(selectedTimeframe);
      
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        
        setTimeout(async () => {
          try {
            const signalResult = await getRealSignal(pair.symbol, timeframeSeconds);
            
            if ('error' in signalResult) {
              setPairs(prevPairs => 
                prevPairs.map(p => 
                  p.symbol === pair.symbol 
                    ? { ...p, signal: 'ERROR', confidence: 0, lastUpdate: new Date() }
                    : p
                )
              );
            } else {
              const signal = signalResult as QuotexSignal;
              setPairs(prevPairs => 
                prevPairs.map(p => 
                  p.symbol === pair.symbol 
                    ? { 
                        ...p, 
                        signal: signal.direction,
                        confidence: signal.confidence,
                        price: signal.current_price,
                        lastUpdate: new Date(),
                        indicators: {
                          rsi: signal.indicators.rsi,
                          macd: signal.indicators.macd,
                          sma_20: signal.indicators.sma_20,
                          ema_20: signal.indicators.ema_20,
                          support: signal.indicators.support,
                          resistance: signal.indicators.resistance
                        }
                      }
                    : p
                )
              );
            }
          } catch (error) {
            console.error(`Error getting signal for ${pair.symbol}:`, error);
            setPairs(prevPairs => 
              prevPairs.map(p => 
                p.symbol === pair.symbol 
                  ? { ...p, signal: 'ERROR', confidence: 0, lastUpdate: new Date() }
                  : p
              )
            );
          }
        }, i * 3000); // Stagger updates by 3 seconds each
      }
      
      setTimeout(() => setLoading(false), pairs.length * 3000);
    };

    updateSignals();
    const interval = setInterval(updateSignals, 120000); // Update every 2 minutes for real API

    return () => clearInterval(interval);
  }, [isMonitoring, pairs.length, selectedTimeframe, getRealSignal, isConnected, serverOnline]);

  if (!serverOnline) {
    return (
      <div className="text-center py-12">
        <WifiOff className="h-16 w-16 mx-auto mb-4 text-red-400" />
        <h3 className="text-xl font-bold text-red-400 mb-2">Python Server Required</h3>
        <p className="text-slate-400">Start the Python backend to get real QuotexApi signals</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
        <h3 className="text-xl font-bold text-yellow-400 mb-2">QuotexApi Connection Required</h3>
        <p className="text-slate-400">Connect to Quotex to receive real trading signals</p>
      </div>
    );
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'SELL': return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'LOADING': return <Activity className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'ERROR': return <Activity className="h-5 w-5 text-red-400" />;
      default: return <Minus className="h-5 w-5 text-slate-400" />;
    }
  };

  const getSignalColor = (signal: string, confidence: number) => {
    if (!isMonitoring || !isConnected) return 'border-slate-600 bg-slate-700/30';
    
    switch (signal) {
      case 'BUY': 
        return confidence >= 80 ? 'border-green-400 bg-green-500/20' : 'border-green-500 bg-green-500/10';
      case 'SELL': 
        return confidence >= 80 ? 'border-red-400 bg-red-500/20' : 'border-red-500 bg-red-500/10';
      case 'LOADING': 
        return 'border-blue-500 bg-blue-500/10 animate-pulse';
      case 'ERROR':
        return 'border-red-600 bg-red-600/10';
      default: 
        return 'border-slate-600 bg-slate-700/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Activity className="h-8 w-8 text-blue-400" />
          <span>Real Trading Signals - {selectedMarket.toUpperCase()}</span>
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected && serverOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-sm text-slate-400">
            {isConnected && serverOnline ? 'QuotexApi Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pairs.map((pair) => (
          <div
            key={pair.symbol}
            className={`relative p-4 rounded-lg border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-lg ${getSignalColor(pair.signal, pair.confidence)}`}
          >
            {/* Signal Strength Indicator */}
            {pair.signal !== 'NEUTRAL' && pair.signal !== 'LOADING' && pair.signal !== 'ERROR' && pair.confidence > 0 && (
              <div className="absolute top-2 right-2">
                <div className={`w-2 h-2 rounded-full ${pair.confidence >= 80 ? 'bg-yellow-400 animate-pulse' : 'bg-slate-500'}`} />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{pair.flag}</span>
                  <div>
                    <div className="font-bold text-white">{pair.symbol}</div>
                    <div className="text-xs text-slate-400">{pair.name}</div>
                  </div>
                </div>
                {getSignalIcon(pair.signal)}
              </div>

              <div className="space-y-2">
                {pair.price > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Price</span>
                    <span className="font-mono text-white">{pair.price.toFixed(6)}</span>
                  </div>
                )}

                {pair.signal !== 'LOADING' && pair.signal !== 'NEUTRAL' && pair.signal !== 'ERROR' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Signal</span>
                      <span className={`font-bold ${pair.signal === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.signal}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Confidence</span>
                      <span className="font-bold text-yellow-400">{pair.confidence}%</span>
                    </div>
                    
                    {pair.indicators && (
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>RSI: {pair.indicators.rsi.toFixed(1)}</div>
                        <div>MACD: {pair.indicators.macd.toFixed(4)}</div>
                      </div>
                    )}
                  </>
                )}

                {pair.signal === 'ERROR' && (
                  <div className="text-center text-red-400 text-sm">
                    Signal Error
                  </div>
                )}

                {/* Confidence Bar */}
                {pair.confidence > 0 && (
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        pair.confidence >= 80 ? 'bg-gradient-to-r from-yellow-400 to-green-400' :
                        pair.confidence >= 60 ? 'bg-gradient-to-r from-blue-400 to-yellow-400' :
                        'bg-gradient-to-r from-red-400 to-blue-400'
                      }`}
                      style={{ width: `${pair.confidence}%` }}
                    />
                  </div>
                )}
              </div>

              {pair.lastUpdate && (
                <div className="text-xs text-slate-500 text-center">
                  Last: {pair.lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};