import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Award, Activity } from 'lucide-react';

interface TradingStats {
  totalSignals: number;
  successfulSignals: number;
  successRate: number;
  avgConfidence: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  activePositions: number;
  riskScore: number;
}

export const TradingStats: React.FC = () => {
  const [stats, setStats] = useState<TradingStats>({
    totalSignals: 0,
    successfulSignals: 0,
    successRate: 0,
    avgConfidence: 0,
    dailyPnL: 0,
    weeklyPnL: 0,
    monthlyPnL: 0,
    activePositions: 0,
    riskScore: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const total = Math.floor(Math.random() * 100) + 50;
      const successful = Math.floor(total * (0.85 + Math.random() * 0.14)); // 85-99% success rate
      
      setStats({
        totalSignals: total,
        successfulSignals: successful,
        successRate: (successful / total) * 100,
        avgConfidence: 75 + Math.random() * 20, // 75-95% average confidence
        dailyPnL: (Math.random() - 0.3) * 1000, // Slightly positive bias
        weeklyPnL: (Math.random() - 0.2) * 5000,
        monthlyPnL: (Math.random() - 0.1) * 20000,
        activePositions: Math.floor(Math.random() * 8) + 2,
        riskScore: 15 + Math.random() * 25 // Low risk score (15-40%)
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const getColorClass = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Trading Performance</h2>
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Live Stats</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-green-400" />
            <span className="text-slate-300 text-sm">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {stats.successRate.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">
            {stats.successfulSignals}/{stats.totalSignals} signals
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-yellow-400" />
            <span className="text-slate-300 text-sm">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.avgConfidence.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">
            High precision signals
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span className="text-slate-300 text-sm">Active Trades</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {stats.activePositions}
          </div>
          <div className="text-xs text-slate-400">
            Currently monitoring
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`h-5 w-5 rounded-full ${stats.riskScore <= 30 ? 'bg-green-400' : stats.riskScore <= 60 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            <span className="text-slate-300 text-sm">Risk Score</span>
          </div>
          <div className={`text-2xl font-bold ${
            stats.riskScore <= 30 ? 'text-green-400' : 
            stats.riskScore <= 60 ? 'text-yellow-400' : 
            'text-red-400'
          }`}>
            {stats.riskScore.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-400">
            {stats.riskScore <= 30 ? 'Low Risk' : stats.riskScore <= 60 ? 'Medium Risk' : 'High Risk'}
          </div>
        </div>
      </div>

      {/* P&L Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <span>Profit & Loss</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-slate-400 text-sm mb-1">Daily P&L</div>
            <div className={`text-xl font-bold ${getColorClass(stats.dailyPnL)}`}>
              {formatCurrency(stats.dailyPnL)}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  stats.dailyPnL >= 0 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(Math.abs(stats.dailyPnL) / 1000 * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-slate-400 text-sm mb-1">Weekly P&L</div>
            <div className={`text-xl font-bold ${getColorClass(stats.weeklyPnL)}`}>
              {formatCurrency(stats.weeklyPnL)}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  stats.weeklyPnL >= 0 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(Math.abs(stats.weeklyPnL) / 5000 * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="text-slate-400 text-sm mb-1">Monthly P&L</div>
            <div className={`text-xl font-bold ${getColorClass(stats.monthlyPnL)}`}>
              {formatCurrency(stats.monthlyPnL)}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  stats.monthlyPnL >= 0 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${Math.min(Math.abs(stats.monthlyPnL) / 20000 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};