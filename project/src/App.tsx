import React, { useState, useEffect, useCallback } from 'react';
import { TradingDashboard } from './components/TradingDashboard';
import { AlertProvider } from './contexts/AlertContext';
import { TradingProvider } from './contexts/TradingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AlertProvider>
        <TradingProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">
              <TradingDashboard />
            </main>
            <Footer />
          </div>
        </TradingProvider>
      </AlertProvider>
    </div>
  );
}

export default App;