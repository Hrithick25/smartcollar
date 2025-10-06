from fastapi import WebSocket
from typing import List, Dict
import json
import asyncio

class ConnectionManager:
    def __init__(self):
        # Store active connections by client_id
        self.active_connections: Dict[str, WebSocket] = {}
        # Store connections by dog_id for targeted updates
        self.dog_connections: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        print(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            # Remove from dog connections
            for dog_id, clients in self.dog_connections.items():
                if client_id in clients:
                    clients.remove(client_id)
            print(f"Client {client_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending personal message: {e}")
    
    async def send_to_client(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception as e:
                print(f"Error sending to client {client_id}: {e}")
                # Remove disconnected client
                self.disconnect(client_id)
    
    async def broadcast_to_all(self, message: dict):
        disconnected_clients = []
        for client_id, connection in self.active_connections.items():
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                print(f"Error broadcasting to client {client_id}: {e}")
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def send_to_dog_subscribers(self, dog_id: str, message: dict):
        if dog_id in self.dog_connections:
            disconnected_clients = []
            for client_id in self.dog_connections[dog_id]:
                if client_id in self.active_connections:
                    try:
                        await self.active_connections[client_id].send_text(json.dumps(message))
                    except Exception as e:
                        print(f"Error sending to dog subscriber {client_id}: {e}")
                        disconnected_clients.append(client_id)
            
            # Clean up disconnected clients
            for client_id in disconnected_clients:
                self.disconnect(client_id)
    
    def subscribe_to_dog(self, client_id: str, dog_id: str):
        if dog_id not in self.dog_connections:
            self.dog_connections[dog_id] = []
        if client_id not in self.dog_connections[dog_id]:
            self.dog_connections[dog_id].append(client_id)
            print(f"Client {client_id} subscribed to dog {dog_id}")
    
    def unsubscribe_from_dog(self, client_id: str, dog_id: str):
        if dog_id in self.dog_connections and client_id in self.dog_connections[dog_id]:
            self.dog_connections[dog_id].remove(client_id)
            print(f"Client {client_id} unsubscribed from dog {dog_id}")
    
    async def send_sensor_update(self, dog_id: str, sensor_data: dict):
        message = {
            "type": "sensor_update",
            "dog_id": dog_id,
            "data": sensor_data,
            "timestamp": sensor_data.get("timestamp")
        }
        await self.send_to_dog_subscribers(dog_id, message)
    
    async def send_intervention_alert(self, dog_id: str, intervention_data: dict):
        message = {
            "type": "intervention_alert",
            "dog_id": dog_id,
            "data": intervention_data,
            "timestamp": intervention_data.get("triggered_at")
        }
        await self.send_to_dog_subscribers(dog_id, message)
        # Also broadcast to all for critical interventions
        if intervention_data.get("intervention_type") in ["HIGH", "CRITICAL"]:
            await self.broadcast_to_all(message)
    
    async def send_health_alert(self, dog_id: str, alert_data: dict):
        message = {
            "type": "health_alert",
            "dog_id": dog_id,
            "data": alert_data,
            "timestamp": alert_data.get("timestamp")
        }
        await self.send_to_dog_subscribers(dog_id, message)
    
    def get_connection_count(self) -> int:
        return len(self.active_connections)
    
    def get_dog_subscriber_count(self, dog_id: str) -> int:
        return len(self.dog_connections.get(dog_id, []))
