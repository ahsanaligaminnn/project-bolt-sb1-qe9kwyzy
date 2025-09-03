import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate incoming alerts
    const generateAlert = () => {
      const alertTypes = [
        {
          type: 'success' as const,
          title: 'Signal Confirmed',
          message: 'EURUSD buy signal with 87% confidence detected'
        },
        {
          type: 'warning' as const,
          title: 'Market Volatility',
          message: 'High volatility detected in crypto markets'
        },
        {
          type: 'info' as const,
          title: 'System Update',
          message: 'QuotexApi connection refreshed successfully'
        }
      ];

      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const newAlert: Alert = {
        id: Date.now().toString(),
        ...randomAlert,
        timestamp: new Date(),
        read: false
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 alerts
      setUnreadCount(prev => prev + 1);
    };

    const interval = setInterval(generateAlert, 15000); // New alert every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    setUnreadCount(prev => {
      const removedAlert = alerts.find(a => a.id === id);
      return removedAlert && !removedAlert.read ? prev - 1 : prev;
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default: return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30';
      case 'warning': return 'border-yellow-500/30';
      default: return 'border-blue-500/30';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-blue-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">Alerts</h2>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No alerts yet</p>
            <p className="text-sm">System is monitoring for signals</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                alert.read ? 'bg-slate-700/30 border-slate-600' : `bg-slate-700/50 ${getAlertBorderColor(alert.type)}`
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${alert.read ? 'text-slate-400' : 'text-white'}`}>
                      {alert.title}
                    </h4>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className={`text-sm mt-1 ${alert.read ? 'text-slate-500' : 'text-slate-300'}`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs transition-colors ml-2"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!alert.read && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};