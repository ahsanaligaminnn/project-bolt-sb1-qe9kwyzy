import { useState, useEffect, useCallback } from 'react';
import { quotexApiService, QuotexSignal, ConnectionStatus } from '../services/quotexApi';


interface QuotexApiHook {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  balance: number;
  getRealSignal: (asset: string, timeframe: number) => Promise<QuotexSignal | { error: string }>;
  connectToQuotex: (email: string, password: string) => Promise<boolean>;
  disconnect: () => void;
  availableAssets: string[];
  serverOnline: boolean;
}


export const useQuotexApi = (): QuotexApiHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Not connected'
  });
  const [balance, setBalance] = useState(0);
  const [availableAssets, setAvailableAssets] = useState<string[]>([]);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    // Check if Python server is running
    const checkServer = async () => {
      const isOnline = await quotexApiService.checkServerHealth();
      setServerOnline(isOnline);
      
      if (isOnline) {
        // Check connection status
        const status = await quotexApiService.getConnectionStatus();
        setConnectionStatus(status);
        setIsConnected(status.connected);
        if (status.balance) {
          setBalance(status.balance);
        }
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getRealSignal = useCallback(async (asset: string, timeframe: number): Promise<QuotexSignal | { error: string }> => {
    if (!isConnected) {
      return { error: 'QuotexApi not connected' };
    }
    
    try {
      const signal = await quotexApiService.getRealSignal(asset, timeframe);
      return signal;
    } catch (error: any) {
      return { error: error.message || 'Failed to get signal' };
    }
  }, [isConnected]);

  const connectToQuotex = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await quotexApiService.connectToQuotex(email, password);
      setConnectionStatus(result);
      setIsConnected(result.connected);
      
      if (result.connected && result.balance) {
        setBalance(result.balance);
        
        // Load available assets
        const assets = await quotexApiService.getAvailableAssets();
        setAvailableAssets(assets);
      }
      
      return result.connected;
    } catch (error: any) {
      console.error('Connect error:', error);
      setConnectionStatus({
        connected: false,
        message: error.message || 'Connection failed'
      });
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setConnectionStatus({ connected: false, message: 'Disconnected' });
    setBalance(0);
    setAvailableAssets([]);
  }, []);

  return {
    isConnected,
    connectionStatus,
    balance,
    getRealSignal,
    connectToQuotex,
    disconnect,
    availableAssets,
    serverOnline
  };
};