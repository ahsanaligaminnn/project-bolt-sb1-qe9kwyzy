import React, { useState } from 'react';
import { Wifi, WifiOff, Key, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useQuotexApi } from '../hooks/useQuotexApi';

export const QuotexConnection: React.FC = () => {
  const { 
    isConnected, 
    connectionStatus, 
    balance, 
    connectToQuotex, 
    disconnect, 
    serverOnline 
  } = useQuotexApi();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(!isConnected);

  const handleConnect = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsConnecting(true);
    try {
      const success = await connectToQuotex(email, password);
      if (success) {
        setShowCredentials(false);
        setPassword(''); // Clear password for security
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowCredentials(true);
    setEmail('');
    setPassword('');
  };

  if (!serverOnline) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <WifiOff className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-bold text-red-400">Python Server Offline</h3>
        </div>
        <div className="space-y-3 text-red-300">
          <p>The Python backend server is not running. To get real signals:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Install QuotexApi: <code className="bg-slate-800 px-2 py-1 rounded">git clone https://github.com/ahsanaligaminnn/QuotexApi</code></li>
            <li>Install requirements: <code className="bg-slate-800 px-2 py-1 rounded">pip install -r requirements.txt</code></li>
            <li>Start server: <code className="bg-slate-800 px-2 py-1 rounded">python api_server.py</code></li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <Wifi className="h-6 w-6 text-green-400" />
          ) : (
            <WifiOff className="h-6 w-6 text-red-400" />
          )}
          <h3 className="text-lg font-bold text-white">QuotexApi Connection</h3>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isConnected ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">Connected Successfully</span>
            </div>
            <div className="text-white">
              <p><strong>Status:</strong> {connectionStatus.message}</p>
              <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {showCredentials ? 'Hide' : 'Show'} Connection Details
            </button>
            
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Connection Required</span>
            </div>
            <p className="text-slate-300 text-sm">
              Enter your Quotex credentials to connect and receive real trading signals
            </p>
          </div>
        </div>
      )}

      {showCredentials && (
        <div className="space-y-4 mt-6 pt-6 border-t border-slate-700">
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-slate-300 mb-2">
                <User className="h-4 w-4" />
                <span>Quotex Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Quotex email"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                disabled={isConnecting || isConnected}
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-slate-300 mb-2">
                <Key className="h-4 w-4" />
                <span>Quotex Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Quotex password"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                disabled={isConnecting || isConnected}
              />
            </div>
          </div>

          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={isConnecting || !email || !password}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isConnecting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Connecting to Quotex...</span>
                </>
              ) : (
                <>
                  <Wifi className="h-5 w-5" />
                  <span>Connect to Quotex</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {connectionStatus.message && !isConnected && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{connectionStatus.message}</p>
        </div>
      )}
    </div>
  );
};