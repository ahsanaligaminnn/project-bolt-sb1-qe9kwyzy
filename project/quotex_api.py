#!/usr/bin/env python3
"""
Real QuotexApi Integration Backend
This module provides real trading signals using the QuotexApi library
"""

import asyncio
import json
import time
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import sys
import os

# Add the QuotexApi to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'QuotexApi'))

try:
    from quotexapi.stable_api import Quotex
    from quotexapi.constants import codes_asset
except ImportError as e:
    print(f"QuotexApi library not found: {e}")
    print("Please install QuotexApi from: https://github.com/ahsanaligaminnn/QuotexApi")
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuotexTradingBot:
    def __init__(self, email: str, password: str):
        """Initialize QuotexApi connection"""
        self.email = email
        self.password = password
        self.client = Quotex(email=email, password=password)
        self.is_connected = False
        self.balance = 0
        self.assets = {}
        
    async def connect(self) -> bool:
        """Connect to Quotex platform"""
        try:
            check_connect, reason = await self.client.connect()
            if check_connect:
                self.is_connected = True
                logger.info("Successfully connected to Quotex")
                
                # Get account balance
                self.balance = await self.client.get_balance()
                logger.info(f"Account balance: ${self.balance}")
                
                # Get available assets
                self.assets = await self.client.get_all_asset_info()
                logger.info(f"Loaded {len(self.assets)} trading assets")
                
                return True
            else:
                logger.error(f"Failed to connect: {reason}")
                return False
        except Exception as e:
            logger.error(f"Connection error: {e}")
            return False
    
    async def get_real_signal(self, asset: str, timeframe: int = 60) -> Dict[str, Any]:
        """
        Get real trading signal from QuotexApi
        Returns actual market data and technical analysis
        """
        if not self.is_connected:
            return {"error": "Not connected to Quotex"}
        
        try:
            # Get real candle data
            candles = await self.client.get_candles(asset, timeframe, 100)
            if not candles:
                return {"error": f"No candle data for {asset}"}
            
            # Calculate real technical indicators
            closes = [float(candle['close']) for candle in candles[-50:]]
            highs = [float(candle['max']) for candle in candles[-50:]]
            lows = [float(candle['min']) for candle in candles[-50:]]
            
            # Real RSI calculation
            rsi = self.calculate_rsi(closes)
            
            # Real MACD calculation
            macd_line, macd_signal, macd_histogram = self.calculate_macd(closes)
            
            # Real Moving Averages
            sma_20 = sum(closes[-20:]) / 20
            ema_20 = self.calculate_ema(closes, 20)
            
            # Real Bollinger Bands
            bb_upper, bb_middle, bb_lower = self.calculate_bollinger_bands(closes)
            
            # Real Support and Resistance
            support = min(lows[-20:])
            resistance = max(highs[-20:])
            
            current_price = closes[-1]
            
            # Advanced signal generation based on real data
            signal_strength = 0
            direction = "NEUTRAL"
            
            # RSI signals
            if rsi < 30:
                signal_strength += 25  # Oversold - buy signal
                direction = "BUY"
            elif rsi > 70:
                signal_strength += 25  # Overbought - sell signal
                direction = "SELL"
            
            # MACD signals
            if macd_line > macd_signal and macd_histogram > 0:
                if direction == "BUY" or direction == "NEUTRAL":
                    signal_strength += 20
                    direction = "BUY"
            elif macd_line < macd_signal and macd_histogram < 0:
                if direction == "SELL" or direction == "NEUTRAL":
                    signal_strength += 20
                    direction = "SELL"
            
            # Moving Average signals
            if current_price > ema_20 > sma_20:
                if direction == "BUY" or direction == "NEUTRAL":
                    signal_strength += 15
                    direction = "BUY"
            elif current_price < ema_20 < sma_20:
                if direction == "SELL" or direction == "NEUTRAL":
                    signal_strength += 15
                    direction = "SELL"
            
            # Bollinger Band signals
            if current_price <= bb_lower:
                if direction == "BUY" or direction == "NEUTRAL":
                    signal_strength += 20
                    direction = "BUY"
            elif current_price >= bb_upper:
                if direction == "SELL" or direction == "NEUTRAL":
                    signal_strength += 20
                    direction = "SELL"
            
            # Support/Resistance signals
            if abs(current_price - support) / current_price < 0.001:  # Near support
                if direction == "BUY" or direction == "NEUTRAL":
                    signal_strength += 10
                    direction = "BUY"
            elif abs(current_price - resistance) / current_price < 0.001:  # Near resistance
                if direction == "SELL" or direction == "NEUTRAL":
                    signal_strength += 10
                    direction = "SELL"
            
            # Ensure minimum confidence for signal
            confidence = min(95, max(signal_strength, 50))
            
            # Only return strong signals (confidence > 75)
            if confidence < 75:
                direction = "NEUTRAL"
                confidence = 50
            
            return {
                "asset": asset,
                "direction": direction,
                "confidence": confidence,
                "current_price": current_price,
                "indicators": {
                    "rsi": round(rsi, 2),
                    "macd": round(macd_line, 6),
                    "macd_signal": round(macd_signal, 6),
                    "sma_20": round(sma_20, 6),
                    "ema_20": round(ema_20, 6),
                    "bb_upper": round(bb_upper, 6),
                    "bb_lower": round(bb_lower, 6),
                    "support": round(support, 6),
                    "resistance": round(resistance, 6)
                },
                "timestamp": datetime.now().isoformat(),
                "timeframe": timeframe
            }
            
        except Exception as e:
            logger.error(f"Error getting signal for {asset}: {e}")
            return {"error": str(e)}
    
    def calculate_rsi(self, prices: list, period: int = 14) -> float:
        """Calculate Real RSI from price data"""
        if len(prices) < period + 1:
            return 50.0
        
        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        gains = [delta if delta > 0 else 0 for delta in deltas]
        losses = [-delta if delta < 0 else 0 for delta in deltas]
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100.0
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_macd(self, prices: list, fast: int = 12, slow: int = 26, signal: int = 9):
        """Calculate Real MACD from price data"""
        if len(prices) < slow:
            return 0, 0, 0
        
        ema_fast = self.calculate_ema(prices, fast)
        ema_slow = self.calculate_ema(prices, slow)
        
        macd_line = ema_fast - ema_slow
        
        # Calculate MACD signal line (EMA of MACD line)
        macd_values = []
        for i in range(slow, len(prices)):
            ema_f = self.calculate_ema(prices[:i+1], fast)
            ema_s = self.calculate_ema(prices[:i+1], slow)
            macd_values.append(ema_f - ema_s)
        
        macd_signal = self.calculate_ema(macd_values, signal) if len(macd_values) >= signal else 0
        macd_histogram = macd_line - macd_signal
        
        return macd_line, macd_signal, macd_histogram
    
    def calculate_ema(self, prices: list, period: int) -> float:
        """Calculate Real EMA from price data"""
        if len(prices) < period:
            return sum(prices) / len(prices)
        
        multiplier = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        
        return ema
    
    def calculate_bollinger_bands(self, prices: list, period: int = 20, std_dev: int = 2):
        """Calculate Real Bollinger Bands from price data"""
        if len(prices) < period:
            avg = sum(prices) / len(prices)
            return avg, avg, avg
        
        sma = sum(prices[-period:]) / period
        variance = sum((price - sma) ** 2 for price in prices[-period:]) / period
        std = variance ** 0.5
        
        upper = sma + (std * std_dev)
        lower = sma - (std * std_dev)
        
        return upper, sma, lower
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Get real account information"""
        if not self.is_connected:
            return {"error": "Not connected"}
        
        try:
            balance = await self.client.get_balance()
            profile = await self.client.get_profile()
            
            return {
                "balance": balance,
                "profile": profile,
                "connected": True
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def get_available_assets(self) -> list:
        """Get list of available trading assets"""
        if not self.is_connected:
            return []
        
        try:
            assets = await self.client.get_all_asset_info()
            return list(assets.keys()) if assets else []
        except Exception as e:
            logger.error(f"Error getting assets: {e}")
            return []

# Global bot instance
quotex_bot = None

async def initialize_quotex_api(email: str, password: str) -> bool:
    """Initialize QuotexApi connection"""
    global quotex_bot
    try:
        quotex_bot = QuotexTradingBot(email, password)
        success = await quotex_bot.connect()
        return success
    except Exception as e:
        logger.error(f"Failed to initialize QuotexApi: {e}")
        return False

async def get_real_trading_signal(asset: str, timeframe: int = 60) -> Dict[str, Any]:
    """Get real trading signal from QuotexApi"""
    global quotex_bot
    
    if not quotex_bot or not quotex_bot.is_connected:
        return {"error": "QuotexApi not connected"}
    
    try:
        signal_data = await quotex_bot.get_real_signal(asset, timeframe)
        return signal_data
    except Exception as e:
        logger.error(f"Error getting signal: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Test the QuotexApi integration
    async def test_api():
        email = input("Enter your Quotex email: ")
        password = input("Enter your Quotex password: ")
        
        success = await initialize_quotex_api(email, password)
        if success:
            print("QuotexApi connected successfully!")
            
            # Test getting a signal
            signal = await get_real_trading_signal("EURUSD", 60)
            print(f"Signal: {json.dumps(signal, indent=2)}")
        else:
            print("Failed to connect to QuotexApi")
    
    asyncio.run(test_api())