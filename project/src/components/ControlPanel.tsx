import React, { useState } from 'react';
import { Play, Square, Settings, Target, TrendingUp } from 'lucide-react';
import { useTradingContext } from '../contexts/TradingContext';

export const ControlPanel: React.FC = () => {
  const { 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    selectedTimeframe, 
    setSelectedTimeframe,
    selectedMarket,
    setSelectedMarket,
    riskLevel,
    setRiskLevel
  } = useTradingContext();

  const timeframes = [
    { value: '1m', label: '1 Minute', seconds: 60 },
    { value: '5m', label: '5 Minutes', seconds: 300 },
    { value: '15m', label: '15 Minutes', seconds: 900 },
    { value: '30m', label: '30 Minutes', seconds: 1800 },
    { value: '1h', label: '1 Hour', seconds: 3600 },
    { value: '4h', label: '4 Hours', seconds: 14400 },
    { value: '1d', label: '1 Day', seconds: 86400 }
  ];

  const markets = [
    { value: 'forex', label: 'Forex', icon: '💱' },
    { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { value: 'stocks', label: 'Stocks', icon: '📈' },
    { value: 'commodities', label: 'Commodities', icon: '🥇' }
  ];

  const riskLevels = [
    { value: 'conservative', label: 'Conservative', color: 'green', confidence: 85 },
    { value: 'balanced', label: 'Balanced', color: 'blue', confidence: 75 },
    { value: 'aggressive', label: 'Aggressive', color: 'red', confidence: 65 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Trading Control Panel</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isMonitoring 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMonitoring ? (
              <>
                <Square className="h-5 w-5" />
                <span>Stop Monitoring</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Monitoring</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Selection */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-slate-300 font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>Market</span>
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            disabled={isMonitoring}
          >
            {markets.map((market) => (
              <option key={market.value} value={market.value}>
                {market.icon} {market.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Selection */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-slate-300 font-medium">
            <Settings className="h-4 w-4" />
            <span>Timeframe</span>
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            disabled={isMonitoring}
          >
            {timeframes.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-slate-300 font-medium">
            <Target className="h-4 w-4" />
            <span>Risk Level</span>
          </label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            disabled={isMonitoring}
          >
            {riskLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} ({level.confidence}% min confidence)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
          isMonitoring 
            ? 'border-green-500 bg-green-500/10 text-green-400' 
            : 'border-slate-600 bg-slate-700/50 text-slate-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="font-medium">
            {isMonitoring ? 'System Active - Monitoring Markets' : 'System Standby'}
          </span>
        </div>
      </div>
    </div>
  );
};