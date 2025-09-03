import React, { createContext, useContext, useState, useCallback } from 'react';

interface TradingContextType {
  isMonitoring: boolean;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
  riskLevel: string;
  setRiskLevel: (level: string) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [selectedMarket, setSelectedMarket] = useState('forex');
  const [riskLevel, setRiskLevel] = useState('balanced');

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const value: TradingContextType = {
    isMonitoring,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedMarket,
    setSelectedMarket,
    riskLevel,
    setRiskLevel,
    startMonitoring,
    stopMonitoring
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};