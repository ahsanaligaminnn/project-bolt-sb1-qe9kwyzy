import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 backdrop-blur-lg border-t border-slate-700/50 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-slate-400">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm">© 2025 AFA Trading Pro - Professional Trading Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">
              Trading involves risk. Past performance does not guarantee future results.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};