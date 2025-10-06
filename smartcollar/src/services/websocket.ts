import { io, Socket } from 'socket.io-client';
import { WebSocketMessage, SensorUpdateMessage, InterventionAlertMessage, HealthAlertMessage } from '@/types';

class WebSocketService {
  private socket: Socket | null = null;
  private clientId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('ws://localhost:8000', {
          transports: ['websocket'],
          query: {
            client_id: this.clientId
          }
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected:', this.socket?.id);
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.handleDisconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Subscribe to dog-specific updates
  subscribeToDog(dogId: string): void {
    if (this.socket) {
      this.socket.emit('subscribe_dog', { dog_id: dogId });
    }
  }

  // Unsubscribe from dog-specific updates
  unsubscribeFromDog(dogId: string): void {
    if (this.socket) {
      this.socket.emit('unsubscribe_dog', { dog_id: dogId });
    }
  }

  // Listen for sensor updates
  onSensorUpdate(callback: (message: SensorUpdateMessage) => void): void {
    if (this.socket) {
      this.socket.on('sensor_update', callback);
    }
  }

  // Listen for intervention alerts
  onInterventionAlert(callback: (message: InterventionAlertMessage) => void): void {
    if (this.socket) {
      this.socket.on('intervention_alert', callback);
    }
  }

  // Listen for health alerts
  onHealthAlert(callback: (message: HealthAlertMessage) => void): void {
    if (this.socket) {
      this.socket.on('health_alert', callback);
    }
  }

  // Listen for general messages
  onMessage(callback: (message: WebSocketMessage) => void): void {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  // Remove specific listeners
  offSensorUpdate(callback: (message: SensorUpdateMessage) => void): void {
    if (this.socket) {
      this.socket.off('sensor_update', callback);
    }
  }

  offInterventionAlert(callback: (message: InterventionAlertMessage) => void): void {
    if (this.socket) {
      this.socket.off('intervention_alert', callback);
    }
  }

  offHealthAlert(callback: (message: HealthAlertMessage) => void): void {
    if (this.socket) {
      this.socket.off('health_alert', callback);
    }
  }

  offMessage(callback: (message: WebSocketMessage) => void): void {
    if (this.socket) {
      this.socket.off('message', callback);
    }
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get client ID
  getClientId(): string {
    return this.clientId;
  }

  // Send custom message
  sendMessage(type: string, data: any): void {
    if (this.socket) {
      this.socket.emit(type, data);
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
