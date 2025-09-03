#!/usr/bin/env python3
"""
Python API Server for QuotexApi Integration
Provides REST endpoints for the frontend to get real trading signals
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
import threading
import json
from quotex_api import initialize_quotex_api, get_real_trading_signal, quotex_bot
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global variables
is_api_connected = False
connection_status = {"connected": False, "message": "Not connected"}

@app.route('/api/connect', methods=['POST'])
def connect_quotex():
    """Connect to QuotexApi with credentials"""
    global is_api_connected, connection_status
    
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        # Run async connection in thread
        def connect_async():
            global is_api_connected, connection_status
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                success = loop.run_until_complete(initialize_quotex_api(email, password))
                if success:
                    is_api_connected = True
                    connection_status = {"connected": True, "message": "Connected successfully"}
                else:
                    connection_status = {"connected": False, "message": "Failed to connect"}
            except Exception as e:
                connection_status = {"connected": False, "message": f"Connection error: {str(e)}"}
            finally:
                loop.close()
        
        thread = threading.Thread(target=connect_async)
        thread.start()
        thread.join(timeout=30)  # 30 second timeout
        
        return jsonify(connection_status)
        
    except Exception as e:
        logger.error(f"Connect endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_connection_status():
    """Get current connection status"""
    global quotex_bot, connection_status
    
    if quotex_bot and quotex_bot.is_connected:
        return jsonify({
            "connected": True,
            "balance": quotex_bot.balance,
            "message": "Connected and ready"
        })
    else:
        return jsonify(connection_status)

@app.route('/api/signal/<asset>', methods=['GET'])
def get_signal(asset):
    """Get real trading signal for specific asset"""
    global quotex_bot
    
    if not quotex_bot or not quotex_bot.is_connected:
        return jsonify({"error": "QuotexApi not connected"}), 400
    
    try:
        timeframe = request.args.get('timeframe', 60, type=int)
        
        # Run async signal generation
        def get_signal_async():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                signal = loop.run_until_complete(get_real_trading_signal(asset, timeframe))
                return signal
            finally:
                loop.close()
        
        signal_data = get_signal_async()
        return jsonify(signal_data)
        
    except Exception as e:
        logger.error(f"Signal endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/assets', methods=['GET'])
def get_available_assets():
    """Get list of available trading assets"""
    global quotex_bot
    
    if not quotex_bot or not quotex_bot.is_connected:
        return jsonify({"error": "QuotexApi not connected"}), 400
    
    try:
        def get_assets_async():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                assets = loop.run_until_complete(quotex_bot.get_available_assets())
                return assets
            finally:
                loop.close()
        
        assets = get_assets_async()
        return jsonify({"assets": assets})
        
    except Exception as e:
        logger.error(f"Assets endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/account', methods=['GET'])
def get_account_info():
    """Get account information"""
    global quotex_bot
    
    if not quotex_bot or not quotex_bot.is_connected:
        return jsonify({"error": "QuotexApi not connected"}), 400
    
    try:
        def get_account_async():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                account_info = loop.run_until_complete(quotex_bot.get_account_info())
                return account_info
            finally:
                loop.close()
        
        account_data = get_account_async()
        return jsonify(account_data)
        
    except Exception as e:
        logger.error(f"Account endpoint error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print("Starting QuotexApi Python Backend Server...")
    print("Make sure you have installed the QuotexApi library:")
    print("git clone https://github.com/ahsanaligaminnn/QuotexApi")
    print("pip install -r QuotexApi/requirements.txt")
    
    app.run(host='0.0.0.0', port=5000, debug=True)