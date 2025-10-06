import React, { useEffect, useRef, useState } from 'react';
import { websocketService } from '@/services/websocket';
import { 
  WebSocketMessage, 
  SensorUpdateMessage, 
  InterventionAlertMessage, 
  HealthAlertMessage 
} from '@/types';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await websocketService.connect();
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnected(false);
        
        // Retry connection after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      websocketService.disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionError,
    websocketService,
  };
};

export const useSensorUpdates = (dogId: string, onUpdate?: (data: SensorUpdateMessage) => void) => {
  const [latestData, setLatestData] = useState<SensorUpdateMessage | null>(null);

  useEffect(() => {
    if (!dogId) return;

    const handleSensorUpdate = (message: SensorUpdateMessage) => {
      if (message.dog_id === dogId) {
        setLatestData(message);
        onUpdate?.(message);
      }
    };

    websocketService.onSensorUpdate(handleSensorUpdate);
    websocketService.subscribeToDog(dogId);

    return () => {
      websocketService.offSensorUpdate(handleSensorUpdate);
      websocketService.unsubscribeFromDog(dogId);
    };
  }, [dogId, onUpdate]);

  return {
    latestData,
  };
};

export const useInterventionAlerts = (onAlert?: (data: InterventionAlertMessage) => void) => {
  const [alerts, setAlerts] = useState<InterventionAlertMessage[]>([]);

  useEffect(() => {
    const handleInterventionAlert = (message: InterventionAlertMessage) => {
      setAlerts(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 alerts
      onAlert?.(message);
    };

    websocketService.onInterventionAlert(handleInterventionAlert);

    return () => {
      websocketService.offInterventionAlert(handleInterventionAlert);
    };
  }, [onAlert]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    clearAlerts,
  };
};

export const useHealthAlerts = (dogId: string, onAlert?: (data: HealthAlertMessage) => void) => {
  const [alerts, setAlerts] = useState<HealthAlertMessage[]>([]);

  useEffect(() => {
    const handleHealthAlert = (message: HealthAlertMessage) => {
      if (message.dog_id === dogId) {
        setAlerts(prev => [message, ...prev.slice(0, 9)]); // Keep last 10 alerts
        onAlert?.(message);
      }
    };

    websocketService.onHealthAlert(handleHealthAlert);

    return () => {
      websocketService.offHealthAlert(handleHealthAlert);
    };
  }, [dogId, onAlert]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    clearAlerts,
  };
};

export const useRealTimeDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleMessage = (message: WebSocketMessage) => {
      if (message.type === 'ping') {
        setIsConnected(true);
      }
    };

    websocketService.onMessage(handleMessage);

    return () => {
      websocketService.offMessage(handleMessage);
    };
  }, []);

  return {
    dashboardData,
    isConnected,
  };
};
