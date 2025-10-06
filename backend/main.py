from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio
import json
import redis
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Dog, Collar, SensorData, Intervention, User
from schemas import (
    DogCreate, DogResponse, CollarCreate, CollarResponse,
    SensorDataCreate, SensorDataResponse, InterventionResponse,
    UserCreate, UserResponse, LoginRequest, Token
)
from services import (
    DogService, CollarService, SensorDataService, 
    InterventionService, AuthService, MLService
)
from websocket_manager import ConnectionManager

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IoT Dog Collar Monitoring System",
    description="Comprehensive monitoring system for Indian street dogs with ML-powered aggression prediction",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=6379, db=0)

# WebSocket manager
manager = ConnectionManager()

# Security
security = HTTPBearer()

# Services
dog_service = DogService()
collar_service = CollarService()
sensor_service = SensorDataService()
intervention_service = InterventionService()
auth_service = AuthService()
ml_service = MLService()

@app.get("/")
async def root():
    return {"message": "IoT Dog Collar Monitoring System API", "version": "1.0.0"}

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return await auth_service.create_user(db, user_data)

@app.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    return await auth_service.authenticate_user(db, login_data)

# Dog management endpoints
@app.post("/dogs", response_model=DogResponse)
async def create_dog(dog_data: DogCreate, db: Session = Depends(get_db)):
    return await dog_service.create_dog(db, dog_data)

@app.get("/dogs", response_model=List[DogResponse])
async def get_dogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return await dog_service.get_dogs(db, skip=skip, limit=limit)

@app.get("/dogs/{dog_id}", response_model=DogResponse)
async def get_dog(dog_id: str, db: Session = Depends(get_db)):
    dog = await dog_service.get_dog(db, dog_id)
    if not dog:
        raise HTTPException(status_code=404, detail="Dog not found")
    return dog

@app.put("/dogs/{dog_id}", response_model=DogResponse)
async def update_dog(dog_id: str, dog_data: DogCreate, db: Session = Depends(get_db)):
    return await dog_service.update_dog(db, dog_id, dog_data)

@app.delete("/dogs/{dog_id}")
async def delete_dog(dog_id: str, db: Session = Depends(get_db)):
    await dog_service.delete_dog(db, dog_id)
    return {"message": "Dog deleted successfully"}

# Collar management endpoints
@app.post("/collars", response_model=CollarResponse)
async def create_collar(collar_data: CollarCreate, db: Session = Depends(get_db)):
    return await collar_service.create_collar(db, collar_data)

@app.get("/collars", response_model=List[CollarResponse])
async def get_collars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return await collar_service.get_collars(db, skip=skip, limit=limit)

@app.get("/collars/{collar_id}", response_model=CollarResponse)
async def get_collar(collar_id: str, db: Session = Depends(get_db)):
    collar = await collar_service.get_collar(db, collar_id)
    if not collar:
        raise HTTPException(status_code=404, detail="Collar not found")
    return collar

# Sensor data endpoints
@app.post("/sensor-data", response_model=SensorDataResponse)
async def create_sensor_data(sensor_data: SensorDataCreate, db: Session = Depends(get_db)):
    # Get ML prediction
    prediction = await ml_service.predict_aggression(sensor_data)
    
    # Create sensor data record
    sensor_record = await sensor_service.create_sensor_data(db, sensor_data)
    
    # Create intervention if needed
    if prediction["intervention"] != "LOW":
        intervention_data = {
            "dog_id": sensor_data.dog_id,
            "collar_id": sensor_data.collar_id,
            "intervention_type": prediction["intervention"],
            "ultrasonic_frequency": prediction["ultrasonic_frequency"],
            "duration_seconds": prediction["duration_seconds"],
            "aggression_level": prediction["aggression_level"],
            "confidence": prediction["probability"]
        }
        await intervention_service.create_intervention(db, intervention_data)
    
    # Store in Redis for real-time updates
    await redis_client.setex(
        f"dog:{sensor_data.dog_id}:latest",
        300,  # 5 minutes TTL
        json.dumps({
            **sensor_data.dict(),
            **prediction,
            "timestamp": datetime.utcnow().isoformat()
        })
    )
    
    return SensorDataResponse(**sensor_record.dict(), **prediction)

@app.get("/sensor-data/{dog_id}", response_model=List[SensorDataResponse])
async def get_sensor_data(
    dog_id: str, 
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    return await sensor_service.get_sensor_data_by_dog(
        db, dog_id, start_time, end_time, limit
    )

@app.get("/sensor-data/latest/{dog_id}")
async def get_latest_sensor_data(dog_id: str):
    data = await redis_client.get(f"dog:{dog_id}:latest")
    if not data:
        raise HTTPException(status_code=404, detail="No recent data found")
    return json.loads(data)

# Analytics endpoints
@app.get("/analytics/aggression-trends/{dog_id}")
async def get_aggression_trends(
    dog_id: str,
    days: int = 7,
    db: Session = Depends(get_db)
):
    return await sensor_service.get_aggression_trends(db, dog_id, days)

@app.get("/analytics/health-metrics/{dog_id}")
async def get_health_metrics(
    dog_id: str,
    days: int = 7,
    db: Session = Depends(get_db)
):
    return await sensor_service.get_health_metrics(db, dog_id, days)

@app.get("/analytics/dashboard")
async def get_dashboard_data(db: Session = Depends(get_db)):
    return await sensor_service.get_dashboard_analytics(db)

# Intervention endpoints
@app.get("/interventions", response_model=List[InterventionResponse])
async def get_interventions(
    dog_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return await intervention_service.get_interventions(db, dog_id, skip, limit)

@app.post("/interventions/{intervention_id}/acknowledge")
async def acknowledge_intervention(
    intervention_id: str,
    db: Session = Depends(get_db)
):
    return await intervention_service.acknowledge_intervention(db, intervention_id)

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and send periodic updates
            await asyncio.sleep(1)
            # Send any pending updates
            await manager.send_personal_message("ping", websocket)
    except WebSocketDisconnect:
        manager.disconnect(client_id)

# Background task for real-time data processing
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(process_real_time_data())

async def process_real_time_data():
    while True:
        try:
            # Process any queued sensor data
            # This would typically involve checking Redis queues
            # and processing ML predictions
            await asyncio.sleep(1)
        except Exception as e:
            print(f"Error in real-time processing: {e}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
