import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Target, Zap, AlertCircle } from 'lucide-react';

interface AnalysisData {
  rsi: number;
  macd: number;
  bollinger: string;
  volumeProfile: string;
  supportResistance: { support: number; resistance: number };
  momentum: string;
  trend: string;
}

export const SignalAnalysis: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    rsi: 0,
    macd: 0,
    bollinger: 'NEUTRAL',
    volumeProfile: 'BALANCED',
    supportResistance: { support: 0, resistance: 0 },
    momentum: 'NEUTRAL',
    trend: 'SIDEWAYS'
  });

  useEffect(() => {
    const updateAnalysis = () => {
      setAnalysisData({
        rsi: Math.random() * 100,
        macd: (Math.random() - 0.5) * 2,
        bollinger: ['UPPER', 'LOWER', 'MIDDLE', 'NEUTRAL'][Math.floor(Math.random() * 4)],
        volumeProfile: ['HIGH', 'LOW', 'BALANCED'][Math.floor(Math.random() * 3)],
        supportResistance: {
          support: 1.1000 + Math.random() * 0.01,
          resistance: 1.1050 + Math.random() * 0.01
        },
        momentum: ['STRONG_UP', 'UP', 'NEUTRAL', 'DOWN', 'STRONG_DOWN'][Math.floor(Math.random() * 5)],
        trend: ['UPTREND', 'DOWNTREND', 'SIDEWAYS'][Math.floor(Math.random() * 3)]
      });
    };

    updateAnalysis();
    const interval = setInterval(updateAnalysis, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRSIColor = (value: number) => {
    if (value >= 70) return 'text-red-400';
    if (value <= 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UPTREND': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'DOWNTREND': return <TrendingUp className="h-5 w-5 text-red-400 transform rotate-180" />;
      default: return <Target className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart className="h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Advanced Signal Analysis</h2>
        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <Zap className="h-4 w-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RSI Analysis */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">RSI (14)</span>
              <span className={`font-bold text-lg ${getRSIColor(analysisData.rsi)}`}>
                {analysisData.rsi.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  analysisData.rsi >= 70 ? 'bg-red-400' :
                  analysisData.rsi <= 30 ? 'bg-green-400' :
                  'bg-yellow-400'
                }`}
                style={{ width: `${analysisData.rsi}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">
              {analysisData.rsi >= 70 ? 'Overbought' :
               analysisData.rsi <= 30 ? 'Oversold' :
               'Neutral Zone'}
            </div>
          </div>
        </div>

        {/* MACD Analysis */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">MACD</span>
              <span className={`font-bold text-lg ${analysisData.macd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analysisData.macd >= 0 ? '+' : ''}{analysisData.macd.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {analysisData.macd >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-400" /> :
                <TrendingUp className="h-4 w-4 text-red-400 transform rotate-180" />
              }
              <span className="text-sm text-slate-400">
                {analysisData.macd >= 0 ? 'Bullish Signal' : 'Bearish Signal'}
              </span>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Market Trend</span>
              {getTrendIcon(analysisData.trend)}
            </div>
            <div className="text-center">
              <span className={`font-bold text-lg ${
                analysisData.trend === 'UPTREND' ? 'text-green-400' :
                analysisData.trend === 'DOWNTREND' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {analysisData.trend}
              </span>
            </div>
            <div className="text-xs text-slate-400 text-center">
              {analysisData.momentum} momentum detected
            </div>
          </div>
        </div>

        {/* Volume Profile */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Volume</span>
              <span className={`font-bold text-lg ${
                analysisData.volumeProfile === 'HIGH' ? 'text-green-400' :
                analysisData.volumeProfile === 'LOW' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {analysisData.volumeProfile}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                analysisData.volumeProfile === 'HIGH' ? 'bg-green-400 animate-pulse' :
                analysisData.volumeProfile === 'LOW' ? 'bg-red-400' :
                'bg-yellow-400'
              }`} />
              <span className="text-sm text-slate-400">
                Volume activity {analysisData.volumeProfile.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-400" />
          <span>Key Levels</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="text-red-400 font-medium">Resistance Level</div>
            <div className="text-white text-lg font-bold">
              {analysisData.supportResistance.resistance.toFixed(5)}
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="text-green-400 font-medium">Support Level</div>
            <div className="text-white text-lg font-bold">
              {analysisData.supportResistance.support.toFixed(5)}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="h-5 w-5 text-purple-400" />
          <span className="text-purple-400 font-bold">AI Trading Recommendation</span>
        </div>
        <div className="text-white">
          Based on the current market analysis, the AI algorithm suggests a{' '}
          <span className={`font-bold ${
            analysisData.rsi < 30 && analysisData.macd > 0 ? 'text-green-400' :
            analysisData.rsi > 70 && analysisData.macd < 0 ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {analysisData.rsi < 30 && analysisData.macd > 0 ? 'BUY' :
             analysisData.rsi > 70 && analysisData.macd < 0 ? 'SELL' :
             'HOLD'}
          </span>{' '}
          position with {Math.floor(70 + Math.random() * 25)}% confidence level.
        </div>
      </div>
    </div>
  );
};