import React, { useState, useEffect } from 'react';
import { ControlPanel } from './ControlPanel';
import { TradingPairs } from './TradingPairs';
import { SignalAnalysis } from './SignalAnalysis';
import { TradingStats } from './TradingStats';
import { AlertPanel } from './AlertPanel';
import { QuotexConnection } from './QuotexConnection';
import { useTradingContext } from '../contexts/TradingContext';

export const TradingDashboard: React.FC = () => {
  const { isMonitoring } = useTradingContext();
  
  return (
    <div className="space-y-6">
      {/* QuotexApi Connection */}
      <QuotexConnection />

      {/* Control Panel */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <ControlPanel />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingStats />
        </div>
        <div>
          <AlertPanel />
        </div>
      </div>

      {/* Signal Analysis */}
      {isMonitoring && (
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
          <SignalAnalysis />
        </div>
      )}

      {/* Trading Pairs */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <TradingPairs />
      </div>
    </div>
  );
};