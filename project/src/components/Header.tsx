import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const animationTimer = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(animationTimer);
    };
  }, []);

  const gradientColors = [
    'from-blue-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-pink-500 to-red-600'
  ];

  return (
    <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full bg-gradient-to-r ${gradientColors[animationState]} transition-all duration-1000 transform rotate-0 hover:rotate-180`}>
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${gradientColors[animationState]} bg-clip-text text-transparent transition-all duration-1000`}>
                AFA TRADING PRO
              </h1>
              <p className="text-slate-400 text-sm">Advanced QuotexApi Integration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <Activity className="h-5 w-5 text-green-400 animate-pulse" />
              <span className="font-mono text-sm">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-700/50 px-3 py-2 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};