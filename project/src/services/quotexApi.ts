/**
 * QuotexApi Service - Real API Integration
 * Connects to Python backend for real trading signals
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface QuotexSignal {
  asset: string;
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  current_price: number;
  indicators: {
    rsi: number;
    macd: number;
    macd_signal: number;
    sma_20: number;
    ema_20: number;
    bb_upper: number;
    bb_lower: number;
    support: number;
    resistance: number;
  };
  timestamp: string;
  timeframe: number;
}

export interface ConnectionStatus {
  connected: boolean;
  balance?: number;
  message: string;
}

export interface AccountInfo {
  balance: number;
  profile: any;
  connected: boolean;
}

class QuotexApiService {
  private static instance: QuotexApiService;
  
  public static getInstance(): QuotexApiService {
    if (!QuotexApiService.instance) {
      QuotexApiService.instance = new QuotexApiService();
    }
    return QuotexApiService.instance;
  }

  async connectToQuotex(email: string, password: string): Promise<ConnectionStatus> {
    try {
      const response = await axios.post(`${API_BASE_URL}/connect`, {
        email,
        password
      });
      return response.data;
    } catch (error: any) {
      console.error('Connection error:', error);
      return {
        connected: false,
        message: error.response?.data?.error || 'Connection failed'
      };
    }
  }

  async getConnectionStatus(): Promise<ConnectionStatus> {
    try {
      const response = await axios.get(`${API_BASE_URL}/status`);
      return response.data;
    } catch (error: any) {
      console.error('Status check error:', error);
      return {
        connected: false,
        message: 'Unable to check status'
      };
    }
  }

  async getRealSignal(asset: string, timeframe: number = 60): Promise<QuotexSignal | { error: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/signal/${asset}`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error: any) {
      console.error('Signal error:', error);
      return {
        error: error.response?.data?.error || 'Failed to get signal'
      };
    }
  }

  async getAvailableAssets(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/assets`);
      return response.data.assets || [];
    } catch (error: any) {
      console.error('Assets error:', error);
      return [];
    }
  }

  async getAccountInfo(): Promise<AccountInfo | { error: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/account`);
      return response.data;
    } catch (error: any) {
      console.error('Account info error:', error);
      return {
        error: error.response?.data?.error || 'Failed to get account info'
      };
    }
  }

  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await axios.get('http://localhost:5000/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const quotexApiService = QuotexApiService.getInstance();